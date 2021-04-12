import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductBrandService } from './product-brand.service';
import { CreateProductBrandDto } from './dtos/create-product-brand.dto';
import { UpdateProductBrandDto } from './dtos/update-product-brand.dto';
import { Public, Roles } from 'nest-keycloak-connect';

@Controller('brands')
export class ProductBrandController {
  constructor(private readonly productBrandService: ProductBrandService) {}

  @Post()
  @Roles('budega-app:manager', 'budega-app:stockist')
  create(@Body() createProductBrandDto: CreateProductBrandDto) {
    return this.productBrandService.create(createProductBrandDto);
  }

  @Get()
  @Public()
  findAll() {
    return this.productBrandService.findAll();
  }

  @Get(':id')
  @Public()
  findOne(@Param('id') id: string) {
    return this.productBrandService.findOne(id);
  }

  @Get(':name')
  @Public()
  findByName(@Param('name') name: string) {
    return this.productBrandService.findByName(name);
  }

  @Put(':id')
  @Roles('budega-app:manager', 'budega-app:stockist')
  update(
    @Param('id') id: string,
    @Body() updateProductBrandDto: UpdateProductBrandDto,
  ) {
    return this.productBrandService.update(id, updateProductBrandDto);
  }

  @Delete(':id')
  @Roles('budega-app:manager')
  remove(@Param('id') id: string) {
    return this.productBrandService.remove(id);
  }
}
