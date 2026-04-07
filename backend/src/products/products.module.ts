import { Module } from '@nestjs/common';
import { BillingModule } from '../billing/billing.module';
import { CategoriesModule } from '../categories/categories.module';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [BillingModule, CategoriesModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
