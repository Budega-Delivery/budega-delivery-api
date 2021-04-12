import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';

import { ProductCategoryModule } from './product-category/product-category.module';
import { ProductBrandModule } from './product-brand/product-brand.module';
import { ProductDepartmentModule } from './product-department/product-department.module';
import { ProductStockModule } from './product-stock/product-stock.module';
import { DatabaseModule } from '../database/database.module';
import { ProductBrandService } from './product-brand/product-brand.service';
import { ProductDepartmentService } from './product-department/product-department.service';
import { ProductCategoryService } from './product-category/product-category.service';
import { ProductStockService } from './product-stock/product-stock.service';
import { KCService } from '../keycloak/keycloak.service';

@Module({
  imports: [
    ProductCategoryModule,
    ProductBrandModule,
    ProductDepartmentModule,
    ProductCategoryModule,
    ProductStockModule,
    DatabaseModule,
  ],
  controllers: [ProductController],
  providers: [
    ProductService,
    ProductBrandService,
    ProductDepartmentService,
    ProductCategoryService,
    ProductStockService,
    KCService,
  ],
})
export class ProductModule {}
