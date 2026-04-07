import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuthUser } from '../common/interfaces/auth-user.interface';
import { BillingService } from './billing.service';
import { MaketouWebhookDto } from './dto/maketou-webhook.dto';
import { SetPreviewModeDto } from './dto/set-preview-mode.dto';
import { UpgradeDto } from './dto/upgrade.dto';

@ApiTags('Billing')
@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('current-plan')
  currentPlan(@CurrentUser() user: AuthUser) {
    return this.billingService.getCurrentPlan(user.tenantId!);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('subscription')
  subscription(@CurrentUser() user: AuthUser) {
    return this.billingService.getSubscription(user.tenantId!);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('upgrade')
  upgrade(@CurrentUser() user: AuthUser, @Body() dto: UpgradeDto) {
    return this.billingService.upgrade(user.sub, user.tenantId!, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('confirm')
  confirm(
    @CurrentUser() user: AuthUser,
    @Query('subscriptionId') subscriptionId: string,
  ) {
    return this.billingService.confirmUpgrade(
      user.sub,
      user.tenantId!,
      subscriptionId,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('preview')
  async preview(@CurrentUser() user: AuthUser, @Body() dto: SetPreviewModeDto) {
    await this.billingService.setPreviewMode(user.tenantId!, dto.enabled);
    return this.billingService.getCurrentPlan(user.tenantId!);
  }

  @Post('maketou/webhook')
  webhook(@Body() dto: MaketouWebhookDto) {
    return this.billingService.handleMaketouWebhook(dto);
  }
}
