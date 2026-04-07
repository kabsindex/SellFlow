import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { OrdersService } from '../orders/orders.service';
import { WhatsAppService } from '../whatsapp/whatsapp.service';
import { CreatePublicOrderDto } from './dto/create-public-order.dto';

@Injectable()
export class PublicStorefrontService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ordersService: OrdersService,
    private readonly whatsAppService: WhatsAppService,
  ) {}

  async getStore(slug: string) {
    const store = await this.prisma.store.findUnique({
      where: { slug },
      include: {
        theme: true,
        tenant: {
          include: {
            subscriptions: {
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        },
      },
    });

    if (!store) {
      throw new NotFoundException('Boutique publique introuvable.');
    }

    const [paymentMethods, deliveryZones, productsCount, whatsappConnection] = await Promise.all([
      this.prisma.paymentMethod.findMany({
        where: {
          tenantId: store.tenantId,
          isActive: true,
        },
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.deliveryZone.findMany({
        where: {
          tenantId: store.tenantId,
          isActive: true,
        },
        orderBy: { createdAt: 'asc' },
      }),
      this.prisma.product.count({
        where: {
          tenantId: store.tenantId,
          status: {
            in: [ProductStatus.PUBLISHED, ProductStatus.OUT_OF_STOCK],
          },
        },
      }),
      this.whatsAppService.getConnection(store.tenantId),
    ]);

    return {
      store,
      productsCount,
      paymentMethods,
      deliveryZones,
      whatsappConnection,
    };
  }

  async listProducts(slug: string) {
    const store = await this.prisma.store.findUnique({
      where: { slug },
    });

    if (!store) {
      throw new NotFoundException('Boutique publique introuvable.');
    }

    return this.prisma.product.findMany({
      where: {
        tenantId: store.tenantId,
        status: {
          in: [ProductStatus.PUBLISHED, ProductStatus.OUT_OF_STOCK],
        },
      },
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getProduct(slug: string, productSlug: string) {
    const store = await this.prisma.store.findUnique({
      where: { slug },
    });

    if (!store) {
      throw new NotFoundException('Boutique publique introuvable.');
    }

    const product = await this.prisma.product.findFirst({
      where: {
        tenantId: store.tenantId,
        slug: productSlug,
        status: {
          in: [ProductStatus.PUBLISHED, ProductStatus.OUT_OF_STOCK],
        },
      },
      include: {
        category: true,
        images: {
          orderBy: { sortOrder: 'asc' },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Produit introuvable.');
    }

    return product;
  }

  async createOrder(slug: string, dto: CreatePublicOrderDto) {
    const order = await this.ordersService.createPublicOrder(slug, dto);
    const whatsapp = await this.whatsAppService.generateOrderMessage(
      order.tenantId,
      order.id,
      order.customerPhone,
    );

    return {
      order,
      whatsapp,
    };
  }

  async trackOrder(slug: string, trackingReference: string) {
    return this.ordersService.getPublicTracking(slug, trackingReference);
  }
}
