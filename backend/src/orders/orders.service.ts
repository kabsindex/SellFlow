import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  OrderStatus,
  PaymentStatus,
  PaymentType,
  ProductStatus,
  ShipmentStatus,
  type Prisma,
} from '@prisma/client';
import { mkdir, writeFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

type PublicOrderInput = {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  notes?: string;
  paymentMethodId?: string;
  deliveryZoneId?: string;
  paymentProofDataUrl?: string;
  paymentProofFileName?: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
};

type PreparedItem = {
  productId: string | null;
  name: string;
  categoryName: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  productStockUpdate?: {
    id: string;
    stock: number;
    status: ProductStatus;
  };
};

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async list(tenantId: string, search?: string) {
    return this.prisma.order.findMany({
      where: {
        tenantId,
        OR: search
          ? [
              { orderNumber: { contains: search } },
              { trackingReference: { contains: search } },
              { customerName: { contains: search } },
              { customerPhone: { contains: search } },
            ]
          : undefined,
      },
      include: {
        customer: true,
        deliveryZone: true,
        paymentMethod: true,
        payment: {
          include: {
            proofs: {
              orderBy: { createdAt: 'desc' },
            },
          },
        },
        shipment: true,
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getById(tenantId: string, orderId: string) {
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        tenantId,
      },
      include: {
        customer: {
          include: {
            tags: true,
            notes: {
              orderBy: { createdAt: 'desc' },
            },
            addresses: {
              orderBy: { createdAt: 'desc' },
            },
          },
        },
        deliveryZone: true,
        paymentMethod: true,
        payment: {
          include: {
            paymentMethod: true,
            proofs: {
              orderBy: { createdAt: 'desc' },
            },
          },
        },
        shipment: {
          include: {
            statusHistory: {
              orderBy: { createdAt: 'desc' },
            },
          },
        },
        items: true,
        statusHistory: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Commande introuvable.');
    }

    return order;
  }

  async history(tenantId: string, orderId: string) {
    await this.getById(tenantId, orderId);

    return this.prisma.orderStatusHistory.findMany({
      where: { orderId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(tenantId: string, dto: CreateOrderDto, actorUserId?: string) {
    return this.createOrderForTenant({
      tenantId,
      customerId: dto.customerId,
      customerName: dto.customerName,
      customerPhone: dto.customerPhone,
      customerAddress: dto.customerAddress,
      notes: dto.notes,
      internalNote: dto.internalNote,
      paymentMethodId: dto.paymentMethodId,
      deliveryZoneId: dto.deliveryZoneId,
      attachmentUrls: dto.attachmentUrls,
      actorUserId,
      items: dto.items,
    });
  }

  async createPublicOrder(storeSlug: string, input: PublicOrderInput) {
    const store = await this.prisma.store.findUnique({
      where: { slug: storeSlug },
    });

    if (!store) {
      throw new NotFoundException('Boutique publique introuvable.');
    }

    return this.createOrderForTenant({
      tenantId: store.tenantId,
      storeId: store.id,
      customerName: input.customerName,
      customerPhone: input.customerPhone,
      customerAddress: input.customerAddress,
      notes: input.notes,
      paymentMethodId: input.paymentMethodId,
      deliveryZoneId: input.deliveryZoneId,
      paymentProofDataUrl: input.paymentProofDataUrl,
      paymentProofFileName: input.paymentProofFileName,
      items: input.items,
    });
  }

  async getPublicTracking(storeSlug: string, trackingReference: string) {
    const store = await this.prisma.store.findUnique({
      where: { slug: storeSlug },
    });

    if (!store) {
      throw new NotFoundException('Boutique publique introuvable.');
    }

    const order = await this.prisma.order.findFirst({
      where: {
        tenantId: store.tenantId,
        trackingReference,
      },
      include: {
        items: true,
        shipment: true,
        statusHistory: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Suivi de commande introuvable.');
    }

    return {
      orderNumber: order.orderNumber,
      trackingReference: order.trackingReference,
      status: order.status,
      shipmentStatus: order.shipment?.status ?? null,
      customerName: order.customerName,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      items: order.items,
      history: order.statusHistory,
    };
  }

  async updateStatus(
    tenantId: string,
    orderId: string,
    dto: UpdateOrderStatusDto,
    actorUserId?: string,
  ) {
    const order = await this.getById(tenantId, orderId);
    const currentAttachments = this.parseAttachmentUrls(order.attachments);
    const nextAttachments = dto.attachmentUrls?.length
      ? [...currentAttachments, ...dto.attachmentUrls]
      : currentAttachments;

    const updated = await this.prisma.$transaction(async (tx) => {
      const nextOrder = await tx.order.update({
        where: { id: orderId },
        data: {
          status: dto.status,
          internalNote:
            dto.internalNote === undefined ? undefined : dto.internalNote,
          attachments:
            nextAttachments.length > 0 ? nextAttachments : undefined,
        },
        include: {
          shipment: true,
        },
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId,
          status: dto.status,
          note: dto.note,
          createdById: actorUserId,
        },
      });

      if (nextOrder.shipment) {
        const shipmentStatus = this.mapOrderStatusToShipmentStatus(dto.status);

        if (shipmentStatus) {
          await tx.shipment.update({
            where: { id: nextOrder.shipment.id },
            data: {
              status: shipmentStatus,
            },
          });

          await tx.shipmentStatusHistory.create({
            data: {
              shipmentId: nextOrder.shipment.id,
              status: shipmentStatus,
              note: dto.note,
            },
          });
        }
      }

      await tx.eventLog.create({
        data: {
          tenantId,
          actorUserId: actorUserId ?? null,
          type: 'ORDER_STATUS_UPDATED',
          entityType: 'order',
          entityId: orderId,
          payload: {
            status: dto.status,
            note: dto.note ?? null,
          },
        },
      });

      return tx.order.findUniqueOrThrow({
        where: { id: orderId },
        include: {
          payment: true,
          shipment: true,
          items: true,
          statusHistory: {
            orderBy: { createdAt: 'desc' },
          },
        },
      });
    });

    const owner = await this.getOwnerUser(tenantId);

    if (owner) {
      await this.notificationsService.createNotification({
        userId: owner.id,
        tenantId,
        type: 'ORDER_STATUS_UPDATED',
        title: 'Statut de commande mis à jour',
        body: `${updated.orderNumber} est maintenant ${dto.status}.`,
        link: `/dashboard?tab=commandes&order=${updated.id}`,
        data: { orderId: updated.id, trackingReference: updated.trackingReference },
      });
    }

    return updated;
  }

  private async createOrderForTenant(input: {
    tenantId: string;
    storeId?: string;
    customerId?: string;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
    notes?: string;
    internalNote?: string;
    paymentMethodId?: string;
    deliveryZoneId?: string;
    attachmentUrls?: string[];
    paymentProofDataUrl?: string;
    paymentProofFileName?: string;
    actorUserId?: string;
    items: Array<{
      productId?: string;
      name?: string;
      quantity: number;
      unitPrice?: number;
    }>;
  }) {
    const store =
      input.storeId !== undefined
        ? await this.prisma.store.findFirst({
            where: {
              id: input.storeId,
              tenantId: input.tenantId,
            },
          })
        : await this.prisma.store.findUnique({
            where: { tenantId: input.tenantId },
          });

    if (!store) {
      throw new NotFoundException('Boutique introuvable.');
    }

    const deliveryZone = input.deliveryZoneId
      ? await this.prisma.deliveryZone.findFirst({
          where: {
            id: input.deliveryZoneId,
            tenantId: input.tenantId,
            isActive: true,
          },
        })
      : null;

    if (input.deliveryZoneId && !deliveryZone) {
      throw new BadRequestException('Zone de livraison introuvable.');
    }

    const paymentMethod = input.paymentMethodId
      ? await this.prisma.paymentMethod.findFirst({
          where: {
            id: input.paymentMethodId,
            tenantId: input.tenantId,
            isActive: true,
          },
        })
      : null;

    if (input.paymentMethodId && !paymentMethod) {
      throw new BadRequestException('Moyen de paiement introuvable.');
    }

    const orderNumber = await this.generateOrderNumber(input.tenantId);
    const trackingReference = await this.generateTrackingReference();
    const deliveryFee = Number(deliveryZone?.price ?? 0);

    const created = await this.prisma.$transaction(async (tx) => {
      const preparedItems = await this.prepareItems(
        tx,
        input.tenantId,
        input.items,
      );

      if (!preparedItems.length) {
        throw new BadRequestException(
          'Ajoute au moins un produit avant de creer une commande.',
        );
      }

      const subtotal = preparedItems.reduce(
        (sum, item) => sum + item.lineTotal,
        0,
      );
      const total = subtotal + deliveryFee;

      const customer = input.customerId
        ? await tx.customer.findFirst({
            where: {
              id: input.customerId,
              tenantId: input.tenantId,
            },
          })
        : await tx.customer.upsert({
            where: {
              tenantId_phone: {
                tenantId: input.tenantId,
                phone: input.customerPhone,
              },
            },
            update: {
              name: input.customerName,
              email: undefined,
            },
            create: {
              tenantId: input.tenantId,
              name: input.customerName,
              phone: input.customerPhone,
            },
          });

      if (!customer) {
        throw new BadRequestException('Client introuvable.');
      }

      await tx.customerAddress.create({
        data: {
          customerId: customer.id,
          label: 'Livraison',
          addressLine: input.customerAddress,
          city: this.extractCity(input.customerAddress),
        },
      });

      for (const item of preparedItems) {
        if (!item.productStockUpdate) {
          continue;
        }

        await tx.product.update({
          where: { id: item.productStockUpdate.id },
          data: {
            stock: item.productStockUpdate.stock,
            status: item.productStockUpdate.status,
          },
        });
      }

      const order = await tx.order.create({
        data: {
          tenantId: input.tenantId,
          storeId: store.id,
          customerId: customer.id,
          paymentMethodId: paymentMethod?.id,
          deliveryZoneId: deliveryZone?.id,
          orderNumber,
          trackingReference,
          status: paymentMethod ? OrderStatus.PAYMENT_PENDING : OrderStatus.NEW,
          subtotal,
          deliveryFee,
          total,
          currency: store.defaultCurrency,
          customerName: input.customerName,
          customerPhone: input.customerPhone,
          customerAddress: input.customerAddress,
          notes: input.notes,
          internalNote: input.internalNote,
          attachments: input.attachmentUrls?.length
            ? input.attachmentUrls
            : undefined,
          items: {
            create: preparedItems.map((item) => ({
              productId: item.productId,
              name: item.name,
              categoryName: item.categoryName,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              lineTotal: item.lineTotal,
            })),
          },
        },
      });

      await tx.orderStatusHistory.create({
        data: {
          orderId: order.id,
          status: order.status,
          note: paymentMethod
            ? 'Commande créée en attente de paiement.'
            : 'Commande creee.',
          createdById: input.actorUserId ?? null,
        },
      });

      let shipmentId: string | null = null;

      if (deliveryZone) {
        const shipment = await tx.shipment.create({
          data: {
            tenantId: input.tenantId,
            orderId: order.id,
            deliveryZoneId: deliveryZone.id,
            trackingReference,
            status: ShipmentStatus.PREPARING,
          },
        });

        shipmentId = shipment.id;

        await tx.shipmentStatusHistory.create({
          data: {
            shipmentId: shipment.id,
            status: ShipmentStatus.PREPARING,
            note: 'Livraison préparée.',
          },
        });
      }

      const payment = paymentMethod
        ? await tx.payment.create({
            data: {
              tenantId: input.tenantId,
              orderId: order.id,
              paymentMethodId: paymentMethod.id,
              type: PaymentType.ORDER,
              amount: total,
              status: PaymentStatus.PENDING,
            },
          })
        : null;

      await tx.customer.update({
        where: { id: customer.id },
        data: {
          totalOrders: {
            increment: 1,
          },
          totalSpent: {
            increment: total,
          },
          lastOrderAt: new Date(),
        },
      });

      const metricDate = this.startOfDay(new Date());

      await tx.dailyMetric.upsert({
        where: {
          tenantId_date: {
            tenantId: input.tenantId,
            date: metricDate,
          },
        },
        update: {
          revenueAmount: {
            increment: total,
          },
          ordersCount: {
            increment: 1,
          },
          pendingPaymentsCount: payment
            ? {
                increment: 1,
              }
            : undefined,
        },
        create: {
          tenantId: input.tenantId,
          date: metricDate,
          revenueAmount: total,
          ordersCount: 1,
          pendingPaymentsCount: payment ? 1 : 0,
        },
      });

      await tx.eventLog.create({
        data: {
          tenantId: input.tenantId,
          actorUserId: input.actorUserId ?? null,
          type: 'ORDER_CREATED',
          entityType: 'order',
          entityId: order.id,
          payload: {
            orderNumber: order.orderNumber,
            trackingReference: order.trackingReference,
            shipmentId,
            paymentId: payment?.id ?? null,
          },
        },
      });

      return {
        orderId: order.id,
        paymentId: payment?.id ?? null,
      };
    });

    if (created.paymentId && input.paymentProofDataUrl) {
      await this.attachPaymentProof(
        input.tenantId,
        created.orderId,
        created.paymentId,
        input.paymentProofDataUrl,
        input.paymentProofFileName,
      );
    }

    const owner = await this.getOwnerUser(input.tenantId);

    if (owner) {
      await this.notificationsService.createNotification({
        userId: owner.id,
        tenantId: input.tenantId,
        type: 'NEW_ORDER',
        title: 'Nouvelle commande',
        body: `Une nouvelle commande ${orderNumber} a été reçue.`,
        link: `/dashboard?tab=commandes&order=${created.orderId}`,
        data: {
          orderId: created.orderId,
          trackingReference,
        },
      });
    }

    return this.getById(input.tenantId, created.orderId);
  }

  private async prepareItems(
    tx: Prisma.TransactionClient,
    tenantId: string,
    items: Array<{
      productId?: string;
      name?: string;
      quantity: number;
      unitPrice?: number;
    }>,
  ) {
    const preparedItems: PreparedItem[] = [];

    for (const item of items) {
      if (item.productId) {
        const product = await tx.product.findFirst({
          where: {
            id: item.productId,
            tenantId,
          },
          include: {
            category: true,
          },
        });

        if (!product) {
          throw new BadRequestException('Produit introuvable dans la commande.');
        }

        if (product.stock < item.quantity) {
          throw new BadRequestException(
            `${product.name} est en rupture de stock pour cette quantite.`,
          );
        }

        const nextStock = product.stock - item.quantity;

        preparedItems.push({
          productId: product.id,
          name: product.name,
          categoryName: product.category?.name ?? null,
          quantity: item.quantity,
          unitPrice: Number(product.price),
          lineTotal: Number(product.price) * item.quantity,
          productStockUpdate: {
            id: product.id,
            stock: nextStock,
            status:
              nextStock === 0 ? ProductStatus.OUT_OF_STOCK : ProductStatus.PUBLISHED,
          },
        });

        continue;
      }

      if (!item.name || item.unitPrice === undefined) {
        throw new BadRequestException(
          'Chaque ligne de commande doit contenir un produit ou un libelle manuel.',
        );
      }

      preparedItems.push({
        productId: null,
        name: item.name,
        categoryName: null,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        lineTotal: item.unitPrice * item.quantity,
      });
    }

    return preparedItems;
  }

  private async attachPaymentProof(
    tenantId: string,
    orderId: string,
    paymentId: string,
    dataUrl: string,
    originalFileName?: string,
  ) {
    const savedFile = await this.savePaymentProofFile(dataUrl, originalFileName);
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });
    const currentAttachments = this.parseAttachmentUrls(order?.attachments);

    await this.prisma.$transaction(async (tx) => {
      await tx.paymentProof.create({
        data: {
          tenantId,
          paymentId,
          fileUrl: savedFile.fileUrl,
          fileName: savedFile.fileName,
          mimeType: savedFile.mimeType,
        },
      });

      await tx.payment.update({
        where: { id: paymentId },
        data: {
          status: PaymentStatus.PROOF_SUBMITTED,
        },
      });

      await tx.order.update({
        where: { id: orderId },
        data: {
          attachments: [...currentAttachments, savedFile.fileUrl],
        },
      });

      await tx.eventLog.create({
        data: {
          tenantId,
          type: 'PAYMENT_PROOF_RECEIVED',
          entityType: 'payment',
          entityId: paymentId,
          payload: {
            orderId,
            fileUrl: savedFile.fileUrl,
          },
        },
      });
    });

    const owner = await this.getOwnerUser(tenantId);

    if (owner) {
      await this.notificationsService.createNotification({
        userId: owner.id,
        tenantId,
        type: 'PAYMENT_PROOF_RECEIVED',
        title: 'Preuve de paiement reçue',
        body: 'Une preuve de paiement a été ajoutée à une commande client.',
        link: `/dashboard?tab=commandes&order=${orderId}`,
        data: {
          orderId,
          paymentId,
        },
      });
    }
  }

  private async savePaymentProofFile(
    dataUrl: string,
    originalFileName?: string,
  ) {
    const matches = dataUrl.match(/^data:(.+);base64,(.+)$/);

    if (!matches) {
      throw new BadRequestException('Format de preuve de paiement invalide.');
    }

    const mimeType = matches[1];
    const base64Payload = matches[2];
    const extensionFromMime = mimeType.split('/')[1]?.replace('jpeg', 'jpg') ?? 'png';
    const extensionFromName = originalFileName ? extname(originalFileName) : '';
    const fileExtension = extensionFromName || `.${extensionFromMime}`;
    const fileName = `${randomUUID()}${fileExtension}`;
    const uploadDir = join(process.cwd(), 'uploads', 'payment-proofs');
    const filePath = join(uploadDir, fileName);

    await mkdir(uploadDir, { recursive: true });
    await writeFile(filePath, Buffer.from(base64Payload, 'base64'));

    return {
      fileUrl: `/uploads/payment-proofs/${fileName}`,
      fileName,
      mimeType,
    };
  }

  private async generateOrderNumber(tenantId: string) {
    const datePart = new Date().toISOString().slice(0, 10).replaceAll('-', '');
    let orderNumber = '';
    let isUnique = false;

    while (!isUnique) {
      const randomPart = Math.floor(1000 + Math.random() * 9000);
      orderNumber = `ORD-${datePart}-${randomPart}`;
      const existing = await this.prisma.order.findFirst({
        where: {
          tenantId,
          orderNumber,
        },
      });
      isUnique = !existing;
    }

    return orderNumber;
  }

  private async generateTrackingReference() {
    let trackingReference = '';
    let isUnique = false;

    while (!isUnique) {
      trackingReference = `TRK-SLF-${Math.floor(
        100000 + Math.random() * 900000,
      )}`;
      const existing = await this.prisma.order.findUnique({
        where: { trackingReference },
      });
      isUnique = !existing;
    }

    return trackingReference;
  }

  private mapOrderStatusToShipmentStatus(status: OrderStatus) {
    if (status === OrderStatus.CONFIRMED || status === OrderStatus.PROCESSING) {
      return ShipmentStatus.PREPARING;
    }

    if (status === OrderStatus.SHIPPED) {
      return ShipmentStatus.SHIPPED;
    }

    if (status === OrderStatus.DELIVERED) {
      return ShipmentStatus.DELIVERED;
    }

    if (status === OrderStatus.CANCELED || status === OrderStatus.OUT_OF_STOCK) {
      return ShipmentStatus.FAILED;
    }

    return null;
  }

  private async getOwnerUser(tenantId: string) {
    return this.prisma.user.findFirst({
      where: {
        tenantId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  private parseAttachmentUrls(value: unknown) {
    if (!Array.isArray(value)) {
      return [];
    }

    return value.filter((item): item is string => typeof item === 'string');
  }

  private extractCity(address: string) {
    return address.split(',')[0]?.trim() || address;
  }

  private startOfDay(value: Date) {
    return new Date(value.getFullYear(), value.getMonth(), value.getDate());
  }
}



