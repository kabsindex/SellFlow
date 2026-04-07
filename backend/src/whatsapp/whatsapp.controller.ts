import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuthUser } from '../common/interfaces/auth-user.interface';
import { SendOrderMessageDto } from './dto/send-order-message.dto';
import { UpdateWhatsAppConnectionDto } from './dto/update-whatsapp-connection.dto';
import { WhatsAppService } from './whatsapp.service';

@ApiTags('WhatsApp')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('whatsapp')
export class WhatsAppController {
  constructor(private readonly whatsAppService: WhatsAppService) {}

  @Get('connection')
  getConnection(@CurrentUser() user: AuthUser) {
    return this.whatsAppService.getConnection(user.tenantId!);
  }

  @Patch('connection')
  updateConnection(
    @CurrentUser() user: AuthUser,
    @Body() dto: UpdateWhatsAppConnectionDto,
  ) {
    return this.whatsAppService.updateConnection(user.tenantId!, dto);
  }

  @Post('send-order-message')
  sendOrderMessage(@CurrentUser() user: AuthUser, @Body() dto: SendOrderMessageDto) {
    return this.whatsAppService.sendOrderMessage(user.tenantId!, dto);
  }
}
