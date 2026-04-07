import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class MaketouWebhookDto {
  @ApiProperty()
  @IsString()
  tenantId: string;

  @ApiProperty()
  @IsString()
  providerReference: string;

  @ApiProperty()
  @IsBoolean()
  success: boolean;

  @ApiProperty()
  @IsString()
  @IsOptional()
  status?: string;
}
