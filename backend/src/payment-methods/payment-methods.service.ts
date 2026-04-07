import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';

@Injectable()
export class PaymentMethodsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(tenantId: string) {
    return this.prisma.paymentMethod.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(tenantId: string, dto: CreatePaymentMethodDto) {
    return this.prisma.paymentMethod.create({
      data: {
        tenantId,
        network: dto.network,
        phoneNumber: dto.phoneNumber,
        displayName: dto.displayName,
        isActive: dto.isActive,
      },
    });
  }

  async update(tenantId: string, paymentMethodId: string, dto: UpdatePaymentMethodDto) {
    await this.requirePaymentMethod(tenantId, paymentMethodId);

    return this.prisma.paymentMethod.update({
      where: { id: paymentMethodId },
      data: {
        network: dto.network,
        phoneNumber: dto.phoneNumber,
        displayName: dto.displayName,
        isActive: dto.isActive,
      },
    });
  }

  async remove(tenantId: string, paymentMethodId: string) {
    await this.requirePaymentMethod(tenantId, paymentMethodId);
    await this.prisma.paymentMethod.delete({
      where: { id: paymentMethodId },
    });

    return { success: true };
  }

  private async requirePaymentMethod(tenantId: string, paymentMethodId: string) {
    const paymentMethod = await this.prisma.paymentMethod.findFirst({
      where: {
        id: paymentMethodId,
        tenantId,
      },
    });

    if (!paymentMethod) {
      throw new NotFoundException('Moyen de paiement introuvable.');
    }

    return paymentMethod;
  }
}
