import { ApiProperty } from '@nestjs/swagger';
import { PaymentNetwork } from '@prisma/client';
import { IsBoolean, IsEnum, IsString } from 'class-validator';

export class CreatePaymentMethodDto {
  @ApiProperty({ enum: PaymentNetwork })
  @IsEnum(PaymentNetwork)
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
