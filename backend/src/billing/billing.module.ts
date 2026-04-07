import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { NotificationsModule } from '../notifications/notifications.module';
import { BillingController } from './billing.controller';
import { BillingProcessor } from './billing.processor';
import { BillingService } from './billing.service';
import { MaketouService } from './maketou.service';

@Module({
  imports: [
    NotificationsModule,
    BullModule.registerQueue({
      name: 'subscription-expiry',
    }),
  ],
  controllers: [BillingController],
  providers: [BillingService, BillingProcessor, MaketouService],
  exports: [BillingService],
})
export class BillingModule {}
