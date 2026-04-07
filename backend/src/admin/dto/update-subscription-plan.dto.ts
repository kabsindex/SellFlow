import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { PlanType } from '@prisma/client';
import { IsBoolean, IsIn, IsOptional } from 'class-validator';

const PLAN_TYPE_VALUES = ['BASIC', 'PREMIUM'] as const;

export class UpdateSubscriptionPlanDto {
  @ApiProperty({ enum: PLAN_TYPE_VALUES })
  @IsIn(PLAN_TYPE_VALUES)
  planType: PlanType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  previewMode?: boolean;
}
