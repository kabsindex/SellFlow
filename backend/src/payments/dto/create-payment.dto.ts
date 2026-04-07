import { ApiPropertyOptional } from '@nestjs/swagger';
import type { PaymentStatus } from '@prisma/client';
import { IsIn, IsNumber, IsOptional, IsString, Min } from 'class-validator';

const PAYMENT_STATUS_VALUES = [
  'PENDING',
  'PROOF_SUBMITTED',
  'VALIDATED',
  'REJECTED',
  'FAILED',
] as const;

export class CreatePaymentDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  orderId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  paymentMethodId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;
}

export class UpdatePaymentStatusDto {
  @ApiPropertyOptional({ enum: PAYMENT_STATUS_VALUES })
  @IsIn(PAYMENT_STATUS_VALUES)
  status: PaymentStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  message?: string;
}
