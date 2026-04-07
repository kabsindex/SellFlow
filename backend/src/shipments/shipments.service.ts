import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateShipmentStatusDto } from './dto/update-shipment-status.dto';

@Injectable()
export class ShipmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(tenantId: string) {
    return this.prisma.shipment.findMany({
      where: { tenantId },
      include: {
        order: true,
        deliveryZone: true,
        statusHistory: {
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getById(tenantId: string, shipmentId: string) {
    const shipment = await this.prisma.shipment.findFirst({
      where: {
        id: shipmentId,
        tenantId,
      },
      include: {
        order: true,
        deliveryZone: true,
        statusHistory: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!shipment) {
      throw new NotFoundException('Expedition introuvable.');
    }

    return shipment;
  }

  async updateStatus(
    tenantId: string,
    shipmentId: string,
    dto: UpdateShipmentStatusDto,
  ) {
    await this.getById(tenantId, shipmentId);

    return this.prisma.$transaction(async (tx) => {
      await tx.shipment.update({
        where: { id: shipmentId },
        data: {
          status: dto.status,
        },
      });

      await tx.shipmentStatusHistory.create({
        data: {
          shipmentId,
          status: dto.status,
          note: dto.note,
        },
      });

      return tx.shipment.findUniqueOrThrow({
        where: { id: shipmentId },
        include: {
          order: true,
          deliveryZone: true,
          statusHistory: {
            orderBy: { createdAt: 'desc' },
          },
        },
      });
    });
  }
}
