// src/products/products.controller.ts
import { Controller, Get, Param } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('api/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get(':id')
  async getProduct(@Param('id') id: string) {
    console.log(id)
    return this.productsService.getProductDetails(id);
  }

  @Get(':id/related')
  async getRelatedProducts(@Param('id') id: string) {
    return this.productsService.getRelatedProducts(id);
  }
}