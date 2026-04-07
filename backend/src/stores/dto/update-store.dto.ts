import { ApiPropertyOptional } from '@nestjs/swagger';
import { StoreCurrency } from '@prisma/client';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateStoreDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: StoreCurrency })
  @IsOptional()
  @IsEnum(StoreCurrency)
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
