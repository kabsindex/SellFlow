import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MessageTemplateType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { SendOrderMessageDto } from './dto/send-order-message.dto';
import { UpdateWhatsAppConnectionDto } from './dto/update-whatsapp-connection.dto';

@Injectable()
export class WhatsAppService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async getConnection(tenantId: string) {
    const configuredConnection = await this.prisma.whatsAppConnection.findUnique({
      where: { tenantId },
    });

    if (configuredConnection) {
      return configuredConnection;
    }

    const owner = await this.prisma.user.findFirst({
      where: {
        tenantId,
        role: 'OWNER',
      },
      select: {
        name: true,
        whatsappNumber: true,
      },
    });

    if (owner?.whatsappNumber) {
      return {
        tenantId,
        phoneNumber: owner.whatsappNumber,
        displayName: owner.name || 'WhatsApp boutique',
        isActive: true,
        defaultPrefix: 'Bonjour,',
      };
    }

    return {
      tenantId,
      phoneNumber: '',
      displayName: '',
      isActive: false,
      defaultPrefix: 'Bonjour,',
    };
  }

  async updateConnection(tenantId: string, dto: UpdateWhatsAppConnectionDto) {
    return this.prisma.whatsAppConnection.upsert({
      where: { tenantId },
      update: {
        phoneNumber: dto.phoneNumber,
        displayName: dto.displayName,
        isActive: dto.isActive,
        defaultPrefix: dto.defaultPrefix,
      },
      create: {
        tenantId,
        phoneNumber: dto.phoneNumber ?? '',
        displayName: dto.displayName ?? 'WhatsApp boutique',
        isActive: dto.isActive ?? true,
        defaultPrefix: dto.defaultPrefix ?? 'Bonjour,',
      },
    });
  }

  async sendOrderMessage(tenantId: string, dto: SendOrderMessageDto) {
    return this.generateOrderMessage(tenantId, dto.orderId, dto.customerPhone);
  }

  async generateOrderMessage(
    tenantId: string,
    orderId: string,
    customerPhone?: string,
  ) {
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        tenantId,
      },
      include: {
        store: true,
        paymentMethod: true,
        items: true,
        payment: {
          include: {
            proofs: {
              orderBy: { createdAt: 'desc' },
            },
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Commande introuvable pour WhatsApp.');
    }

    const connection = await this.getConnection(tenantId);
    const lines = order.items.map(
      (item) => `- ${item.name} x${item.quantity} : ${Number(item.lineTotal)}`,
    );
    const prefix =
      typeof connection.defaultPrefix === 'string' && connection.defaultPrefix.trim()
        ? connection.defaultPrefix.trim()
        : 'Bonjour,';
    const appUrl = (
      this.configService.get<string>('APP_URL', 'http://127.0.0.1:5173') ||
      'http://127.0.0.1:5173'
    ).replace(/\/$/, '');
    const dashboardOrderUrl = `${appUrl}/dashboard?tab=commandes&order=${order.id}`;
    const paymentProofLine = order.payment?.proofs?.length
      ? `Regarder la preuve de paiement ici : ${dashboardOrderUrl}`
      : `Voir la commande dans le dashboard : ${dashboardOrderUrl}`;
    const message = [
      prefix,
      `commande ${order.orderNumber}`,
      '',
      `Boutique : ${order.store.name}`,
      `Client : ${order.customerName}`,
      `Suivi : ${order.trackingReference}`,
      '',
      'Produits :',
      ...lines,
      '',
      `Livraison : ${Number(order.deliveryFee)}`,
      `Total : ${Number(order.total)} ${order.currency}`,
      order.paymentMethod
        ? `Paiement : ${order.paymentMethod.network} - ${order.paymentMethod.displayName}`
        : 'Paiement : à confirmer',
      paymentProofLine,
      order.notes ? `Note : ${order.notes}` : null,
    ]
      .filter(Boolean)
      .join('\n');

    const targetPhone = this.normalizePhoneNumber(
      customerPhone || order.customerPhone,
    );
    const sellerPhone =
      typeof connection.phoneNumber === 'string'
        ? this.normalizePhoneNumber(connection.phoneNumber)
        : '';

    await this.prisma.messageLog.create({
      data: {
        tenantId,
        orderId: order.id,
        customerId: order.customerId,
        templateType: MessageTemplateType.ORDER_CONFIRMATION,
        payload: {
          message,
          targetPhone,
          sellerPhone,
          dashboardOrderUrl,
        },
        status: connection.isActive ? 'GENERATED' : 'DISABLED',
      },
    });

    return {
      connection,
      message,
      targetPhone,
      dashboardOrderUrl,
      whatsappUrl:
        connection.isActive && sellerPhone
          ? `https://wa.me/${sellerPhone}?text=${encodeURIComponent(message)}`
          : null,
    };
  }

  private normalizePhoneNumber(value: string) {
    return value.replace(/\D/g, '');
  }
}

