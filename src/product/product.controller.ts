import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { Roles, Public } from 'nest-keycloak-connect';
import { FileInterceptor } from '@nestjs/platform-express';
import { KeycloakUser, User } from '@gaucho/nest-keycloak';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @Roles('budega-app:manager')
  async create(@Body() createProductDto: CreateProductDto) {
    const resp = await this.productService.create(createProductDto);
    return { id: resp.insertedId.toString() };
  }

  @Get()
  @Public()
  async findAll() {
    return await this.productService.findAll();
  }

  @Get(':id')
  @Public()
  async findOne(@Param('id') id: string) {
    return await this.productService.findOne(String(id));
  }

  @Put(':id')
  @Roles('budega-app:manager')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @User() user: KeycloakUser,
  ) {
    return await this.productService.update(String(id), updateProductDto, user);
  }

  @Put('image/:id')
  @Roles('budega-app:manager')
  @UseInterceptors(FileInterceptor('image'))
  async updateImage(
    @Param('id') id: string,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return await this.productService.updateImage(String(id), image);
  }

  @Delete(':id')
  @Roles('budega-app:manager')
  async remove(@Param('id') id: string) {
    return await this.productService.remove(String(id));
  }
}
