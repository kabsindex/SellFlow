import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PlanType } from '@prisma/client';
import { IsBoolean, IsEnum, IsOptional } from 'class-validator';

export class UpdateSubscriptionPlanDto {
  @ApiProperty({ enum: PlanType })
  @IsEnum(PlanType)
  planType: PlanType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  previewMode?: boolean;
}
