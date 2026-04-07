import { Module } from '@nestjs/common';
import { OrdersModule } from '../orders/orders.module';
import { WhatsAppModule } from '../whatsapp/whatsapp.module';
import { PublicStorefrontController } from './public-storefront.controller';
import { PublicStorefrontService } from './public-storefront.service';

@Module({
  imports: [OrdersModule, WhatsAppModule],
  controllers: [PublicStorefrontController],
  providers: [PublicStorefrontService],
})
export class PublicStorefrontModule {}
