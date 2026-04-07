import { ApiPropertyOptional } from '@nestjs/swagger';
import type { ShipmentStatus } from '@prisma/client';
import { IsIn, IsOptional, IsString } from 'class-validator';

const SHIPMENT_STATUS_VALUES = [
  'PENDING',
  'PREPARING',
  'SHIPPED',
  'DELIVERED',
  'FAILED',
] as const;

export class UpdateShipmentStatusDto {
  @ApiPropertyOptional({ enum: SHIPMENT_STATUS_VALUES })
  @IsIn(SHIPMENT_STATUS_VALUES)
  status: ShipmentStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  note?: string;
}
