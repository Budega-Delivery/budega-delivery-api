import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { ProductDepartmentService } from './product-department.service';
import { CreateProductDepartmentDto } from './dtos/create-product-department.dto';
import { UpdateProductDepartmentDto } from './dtos/update-product-department.dto';
import { Public, Roles } from 'nest-keycloak-connect';

@Controller('departments')
export class ProductDepartmentController {
  constructor(
    private readonly productDepartmentService: ProductDepartmentService,
  ) {}

  @Post()
  @Roles('budega-app:manager', 'budega-app:stockist')
  create(@Body() createProductDepartmentDto: CreateProductDepartmentDto) {
    return this.productDepartmentService.create(createProductDepartmentDto);
  }

  @Get()
  async findAll() {
    return await this.productDepartmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productDepartmentService.findOne(+id);
  }

  @Get(':name')
  @Public()
  findByName(@Param('name') name: string) {
    return this.productDepartmentService.findByName(name);
  }

  @Put(':id')
  @Roles('budega-app:manager', 'budega-app:stockist')
  update(
    @Param('id') id: string,
    @Body() updateProductDepartmentDto: UpdateProductDepartmentDto,
  ) {
    return this.productDepartmentService.update(
      +id,
      updateProductDepartmentDto,
    );
  }

  @Delete(':id')
  @Roles('budega-app:manager')
  remove(@Param('id') id: string) {
    return this.productDepartmentService.remove(+id);
  }
}
