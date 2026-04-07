import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuthUser } from '../common/interfaces/auth-user.interface';
import { CreateDeliveryZoneDto } from './dto/create-delivery-zone.dto';
import { UpdateDeliveryZoneDto } from './dto/update-delivery-zone.dto';
import { DeliveryService } from './delivery.service';

@ApiTags('Delivery')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('delivery')
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Get('zones')
  listZones(@CurrentUser() user: AuthUser) {
    return this.deliveryService.listZones(user.tenantId!);
  }

  @Post('zones')
  createZone(@CurrentUser() user: AuthUser, @Body() dto: CreateDeliveryZoneDto) {
    return this.deliveryService.createZone(user.tenantId!, dto);
  }

  @Patch('zones/:id')
  updateZone(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateDeliveryZoneDto,
  ) {
    return this.deliveryService.updateZone(user.tenantId!, id, dto);
  }

  @Delete('zones/:id')
  removeZone(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.deliveryService.removeZone(user.tenantId!, id);
  }
}
