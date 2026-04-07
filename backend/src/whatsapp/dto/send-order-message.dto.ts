import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class SendOrderMessageDto {
  @ApiProperty()
  @IsString()
  orderId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  customerPhone?: string;
}
