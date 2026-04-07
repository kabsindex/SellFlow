import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreatePublicOrderDto } from './dto/create-public-order.dto';
import { PublicStorefrontService } from './public-storefront.service';

@ApiTags('Public Storefront')
@Controller('public/store/:slug')
export class PublicStorefrontController {
  constructor(
    private readonly publicStorefrontService: PublicStorefrontService,
  ) {}

  @Get()
  getStore(@Param('slug') slug: string) {
    return this.publicStorefrontService.getStore(slug);
  }

  @Get('products')
  listProducts(@Param('slug') slug: string) {
    return this.publicStorefrontService.listProducts(slug);
  }

  @Get('products/:productSlug')
  getProduct(
    @Param('slug') slug: string,
    @Param('productSlug') productSlug: string,
  ) {
    return this.publicStorefrontService.getProduct(slug, productSlug);
  }

  @Post('orders')
  createOrder(@Param('slug') slug: string, @Body() dto: CreatePublicOrderDto) {
    return this.publicStorefrontService.createOrder(slug, dto);
  }

  @Get('orders/tracking/:trackingReference')
  trackOrder(
    @Param('slug') slug: string,
    @Param('trackingReference') trackingReference: string,
  ) {
    return this.publicStorefrontService.trackOrder(slug, trackingReference);
  }
}
