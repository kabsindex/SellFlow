import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDeliveryZoneDto } from './dto/create-delivery-zone.dto';
import { UpdateDeliveryZoneDto } from './dto/update-delivery-zone.dto';

@Injectable()
export class DeliveryService {
  constructor(private readonly prisma: PrismaService) {}

  async listZones(tenantId: string) {
    return this.prisma.deliveryZone.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createZone(tenantId: string, dto: CreateDeliveryZoneDto) {
    return this.prisma.deliveryZone.create({
      data: {
        tenantId,
        name: dto.name,
        price: dto.price,
        isActive: dto.isActive ?? true,
      },
    });
  }

  async updateZone(tenantId: string, zoneId: string, dto: UpdateDeliveryZoneDto) {
    await this.requireZone(tenantId, zoneId);
    return this.prisma.deliveryZone.update({
      where: { id: zoneId },
      data: {
        name: dto.name,
        price: dto.price,
        isActive: dto.isActive,
      },
    });
  }

  async removeZone(tenantId: string, zoneId: string) {
    await this.requireZone(tenantId, zoneId);
    await this.prisma.deliveryZone.delete({
      where: { id: zoneId },
    });

    return { success: true };
  }

  async getZone(tenantId: string, zoneId: string) {
    return this.requireZone(tenantId, zoneId);
  }

  private async requireZone(tenantId: string, zoneId: string) {
    const zone = await this.prisma.deliveryZone.findFirst({
      where: {
        id: zoneId,
        tenantId,
      },
    });

    if (!zone) {
      throw new NotFoundException('Zone de livraison introuvable.');
    }

    return zone;
  }
}
