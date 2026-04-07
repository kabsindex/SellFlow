import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaymentStatus, PaymentType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreatePaymentDto, UpdatePaymentStatusDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async list(tenantId: string, includeTrashed = false) {
    return this.prisma.payment.findMany({
      where: {
        tenantId,
        trashedAt: includeTrashed ? undefined : null,
      },
      include: {
        order: true,
        paymentMethod: true,
        proofs: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getById(tenantId: string, paymentId: string) {
    const payment = await this.prisma.payment.findFirst({
      where: {
        id: paymentId,
        tenantId,
      },
      include: {
        order: true,
        paymentMethod: true,
        proofs: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException('Paiement introuvable.');
    }

    return payment;
  }

  async create(tenantId: string, dto: CreatePaymentDto) {
    if (!dto.orderId && !dto.amount) {
      throw new BadRequestException(
        'Le paiement doit être lié à une commande ou à un montant.',
      );
    }

    const order = dto.orderId
      ? await this.prisma.order.findFirst({
          where: {
            id: dto.orderId,
            tenantId,
          },
        })
      : null;

    return this.prisma.payment.create({
      data: {
        tenantId,
        orderId: dto.orderId,
        paymentMethodId: dto.paymentMethodId,
        type: PaymentType.ORDER,
        amount: dto.amount ?? Number(order?.total ?? 0),
        status: PaymentStatus.PENDING,
      },
    });
  }

  async updateStatus(
    tenantId: string,
    paymentId: string,
    dto: UpdatePaymentStatusDto,
  ) {
    const payment = await this.getById(tenantId, paymentId);

    const updated = await this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: dto.status,
        message: dto.message,
      },
      include: {
        order: true,
      },
    });

    const owner = await this.prisma.user.findFirst({
      where: {
        tenantId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    if (owner) {
      await this.notificationsService.createNotification({
        userId: owner.id,
        tenantId,
        type: 'PAYMENT_STATUS_UPDATED',
        title: 'Paiement mis à jour',
        body: `Le paiement ${paymentId} est maintenant ${dto.status}.`,
        link: '/dashboard?tab=commandes',
        data: { paymentId, orderId: updated.orderId },
      });
    }

    return updated;
  }

  async addProof(tenantId: string, paymentId: string, input: {
    fileUrl: string;
    fileName: string;
    mimeType: string;
  }) {
    const payment = await this.getById(tenantId, paymentId);

    const proof = await this.prisma.paymentProof.create({
      data: {
        tenantId,
        paymentId,
        fileUrl: input.fileUrl,
        fileName: input.fileName,
        mimeType: input.mimeType,
      },
    });

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: PaymentStatus.PROOF_SUBMITTED,
      },
    });

    if (payment.orderId) {
      const order = await this.prisma.order.findUnique({
        where: { id: payment.orderId },
      });
      const currentAttachments = Array.isArray(order?.attachments)
        ? (order?.attachments as unknown as string[])
        : [];

      await this.prisma.order.update({
        where: { id: payment.orderId },
        data: {
          attachments: [...currentAttachments, input.fileUrl],
        },
      });
    }

    const owner = await this.prisma.user.findFirst({
      where: { tenantId },
      orderBy: { createdAt: 'asc' },
    });

    if (owner) {
      await this.notificationsService.createNotification({
        userId: owner.id,
        tenantId,
        type: 'PAYMENT_PROOF_RECEIVED',
        title: 'Preuve de paiement reçue',
        body: `Une preuve de paiement a été ajoutée au paiement ${paymentId}.`,
        link: '/dashboard?tab=commandes',
        data: { paymentId },
      });
    }

    return proof;
  }

  async trash(tenantId: string, paymentId: string) {
    await this.getById(tenantId, paymentId);

    return this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        trashedAt: new Date(),
      },
    });
  }
}


