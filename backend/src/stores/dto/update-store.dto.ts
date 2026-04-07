import { ApiPropertyOptional } from '@nestjs/swagger';
import type { StoreCurrency } from '@prisma/client';
import { IsBoolean, IsIn, IsOptional, IsString } from 'class-validator';

const STORE_CURRENCY_VALUES = ['USD', 'CDF', 'FCFA'] as const;

export class UpdateStoreDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: STORE_CURRENCY_VALUES })
  @IsOptional()
  @IsIn(STORE_CURRENCY_VALUES)
  defaultCurrency?: StoreCurrency;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  logoUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  brandingEnabled?: boolean;
}
