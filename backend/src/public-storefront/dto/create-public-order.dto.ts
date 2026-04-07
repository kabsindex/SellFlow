import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class PublicOrderItemDto {
  @ApiProperty()
  @IsString()
  productId: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreatePublicOrderDto {
  @ApiProperty()
  @IsString()
  customerName: string;

  @ApiProperty()
  @IsString()
  customerPhone: string;

  @ApiProperty()
  @IsString()
  customerAddress: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  paymentMethodId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  deliveryZoneId?: string;

  @ApiProperty({ type: [PublicOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PublicOrderItemDto)
  items: PublicOrderItemDto[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  paymentProofDataUrl?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  paymentProofFileName?: string;
}
