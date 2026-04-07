import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { BillingModule } from './billing/billing.module';
import { NotificationsModule } from './notifications/notifications.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { CustomersModule } from './customers/customers.module';
import { StoresModule } from './stores/stores.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentMethodsModule } from './payment-methods/payment-methods.module';
import { PaymentsModule } from './payments/payments.module';
import { DeliveryModule } from './delivery/delivery.module';
import { ShipmentsModule } from './shipments/shipments.module';
import { WhatsAppModule } from './whatsapp/whatsapp.module';
import { AdminModule } from './admin/admin.module';
import { PublicStorefrontModule } from './public-storefront/public-storefront.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.local'],
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redisUrl = new URL(
          configService.get<string>('REDIS_URL', 'redis://localhost:6379'),
        );

        return {
          connection: {
            host: redisUrl.hostname,
            port: Number(redisUrl.port || 6379),
            username: redisUrl.username || undefined,
            password: redisUrl.password || undefined,
          },
        };
      },
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    BillingModule,
    NotificationsModule,
    CategoriesModule,
    ProductsModule,
    CustomersModule,
    StoresModule,
    DashboardModule,
    OrdersModule,
    PaymentMethodsModule,
    PaymentsModule,
    DeliveryModule,
    ShipmentsModule,
    WhatsAppModule,
    AdminModule,
    PublicStorefrontModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
