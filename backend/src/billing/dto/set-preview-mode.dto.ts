import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean } from 'class-validator';

export class SetPreviewModeDto {
  @ApiProperty()
  @IsBoolean()
  enabled: boolean;
}
