import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuthUser } from '../common/interfaces/auth-user.interface';
import { CreateCustomerNoteDto } from './dto/create-customer-note.dto';
import { CreateCustomerTagDto } from './dto/create-customer-tag.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomersService } from './customers.service';

@ApiTags('Customers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  list(@CurrentUser() user: AuthUser, @Query('search') search?: string) {
    return this.customersService.list(user.tenantId!, search);
  }

  @Get(':id')
  getById(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.customersService.getById(user.tenantId!, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateCustomerDto,
  ) {
    return this.customersService.update(user.tenantId!, id, dto);
  }

  @Post(':id/notes')
  addNote(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: CreateCustomerNoteDto,
  ) {
    return this.customersService.addNote(user.tenantId!, id, dto);
  }

  @Post(':id/tags')
  addTag(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: CreateCustomerTagDto,
  ) {
    return this.customersService.addTag(user.tenantId!, id, dto);
  }
}
