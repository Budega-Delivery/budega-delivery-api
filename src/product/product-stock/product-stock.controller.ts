import { Controller, Get } from '@nestjs/common';
import { ProductStockService } from './product-stock.service';
import { Roles } from 'nest-keycloak-connect';

@Controller('stocks')
export class ProductStockController {
  constructor(private readonly productStockService: ProductStockService) {}

  @Get()
  @Roles('budega-app:manager')
  findAll() {
    return [];
  }
}
