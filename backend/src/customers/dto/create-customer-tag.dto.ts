import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCustomerTagDto {
  @ApiProperty()
  @IsString()
  label: string;
}
