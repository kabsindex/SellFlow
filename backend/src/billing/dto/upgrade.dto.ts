import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpgradeDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  paymentMethodId?: string;
}
