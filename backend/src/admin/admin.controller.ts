import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { AdminService } from './admin.service';
import { UpdateSubscriptionPlanDto } from './dto/update-subscription-plan.dto';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard')
  dashboard() {
    return this.adminService.getDashboard();
  }

  @Get('subscriptions')
  subscriptions() {
    return this.adminService.getSubscriptions();
  }

  @Patch('subscriptions/:tenantId/plan')
  updatePlan(
    @Param('tenantId') tenantId: string,
    @Body() dto: UpdateSubscriptionPlanDto,
  ) {
    return this.adminService.updateSubscriptionPlan(tenantId, dto);
  }

  @Get('accounts')
  accounts() {
    return this.adminService.getAccounts();
  }

  @Get('plan-preview')
  planPreview() {
    return this.adminService.getPlanPreview();
  }
}
