import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuthUser } from '../common/interfaces/auth-user.interface';
import { UpdateStoreThemeDto } from './dto/update-store-theme.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { StoresService } from './stores.service';

@ApiTags('Stores')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Get('current')
  current(@CurrentUser() user: AuthUser) {
    return this.storesService.getCurrentStore(user.tenantId!);
  }

  @Patch('current')
  updateCurrent(@CurrentUser() user: AuthUser, @Body() dto: UpdateStoreDto) {
    return this.storesService.updateCurrentStore(user.tenantId!, dto);
  }

  @Get('current/theme')
  theme(@CurrentUser() user: AuthUser) {
    return this.storesService.getTheme(user.tenantId!);
  }

  @Patch('current/theme')
  updateTheme(
    @CurrentUser() user: AuthUser,
    @Body() dto: UpdateStoreThemeDto,
  ) {
    return this.storesService.updateTheme(user.tenantId!, dto);
  }

  @Get('current/preview')
  preview(@CurrentUser() user: AuthUser) {
    return this.storesService.getPreview(user.tenantId!);
  }
}
