import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { OrderStatus } from '@prisma/client';
import { IsArray, IsIn, IsOptional, IsString } from 'class-validator';

const ORDER_STATUS_VALUES = [
  'NEW',
  'CONFIRMED',
  'PAYMENT_PENDING',
  'PROCESSING',
  'SHIPPED',
  'DELIVERED',
  'CANCELED',
  'OUT_OF_STOCK',
] as const;

export class UpdateOrderStatusDto {
  @ApiProperty({ enum: ORDER_STATUS_VALUES })
  @IsIn(ORDER_STATUS_VALUES)
  status: OrderStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  note?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  internalNote?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  attachmentUrls?: string[];
}
