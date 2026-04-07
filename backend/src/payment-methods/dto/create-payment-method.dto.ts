import { ApiProperty } from '@nestjs/swagger';
import type { PaymentNetwork } from '@prisma/client';
import { IsBoolean, IsIn, IsString } from 'class-validator';

const PAYMENT_NETWORK_VALUES = ['ORANGE', 'AIRTEL', 'VODACOM', 'AFRICELL'] as const;

export class CreatePaymentMethodDto {
  @ApiProperty({ enum: PAYMENT_NETWORK_VALUES })
  @IsIn(PAYMENT_NETWORK_VALUES)
  network: PaymentNetwork;

  @ApiProperty()
  @IsString()
  phoneNumber: string;

  @ApiProperty()
  @IsString()
  displayName: string;

  @ApiProperty()
  @IsBoolean()
  isActive: boolean;
}
