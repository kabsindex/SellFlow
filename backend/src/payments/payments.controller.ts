import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuthUser } from '../common/interfaces/auth-user.interface';
import { CreatePaymentDto, UpdatePaymentStatusDto } from './dto/create-payment.dto';
import { PaymentsService } from './payments.service';

function ensureUploadDirectory() {
  const uploadPath = join(process.cwd(), 'uploads', 'payment-proofs');
  if (!existsSync(uploadPath)) {
    mkdirSync(uploadPath, { recursive: true });
  }
  return uploadPath;
}

@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  list(
    @CurrentUser() user: AuthUser,
    @Query('includeTrashed') includeTrashed?: string,
  ) {
    return this.paymentsService.list(user.tenantId!, includeTrashed === 'true');
  }

  @Get(':id')
  getById(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.paymentsService.getById(user.tenantId!, id);
  }

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreatePaymentDto) {
    return this.paymentsService.create(user.tenantId!, dto);
  }

  @Patch(':id/status')
  updateStatus(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdatePaymentStatusDto,
  ) {
    return this.paymentsService.updateStatus(user.tenantId!, id, dto);
  }

  @ApiConsumes('multipart/form-data')
  @Post(':id/proof')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: () => ensureUploadDirectory(),
        filename: (_req, file, callback) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          callback(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  addProof(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!file) {
      throw new Error('Fichier de preuve manquant.');
    }

    return this.paymentsService.addProof(user.tenantId!, id, {
      fileUrl: `/uploads/payment-proofs/${file.filename}`,
      fileName: file.originalname,
      mimeType: file.mimetype,
    });
  }

  @Delete(':id')
  trash(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.paymentsService.trash(user.tenantId!, id);
  }
}
