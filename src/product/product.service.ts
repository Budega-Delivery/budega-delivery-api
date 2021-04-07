import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { COLLECTION, Product, ProductStatus } from './dtos/product';

import { ProductBrandService } from './product-brand/product-brand.service';

import {
  Collection,
  Db,
  DeleteWriteOpResultObject,
  InsertOneWriteOpResult,
  ObjectID,
  UpdateWriteOpResult,
} from 'mongodb';

import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ProductDepartmentService } from './product-department/product-department.service';
import { ProductCategoryService } from './product-category/product-category.service';
import { CreateProductCategoryDto } from './product-category/dtos/create-product-category.dto';
import { ProductStockService } from './product-stock/product-stock.service';

@Injectable()
export class ProductService {
  collection: Collection;

  constructor(
    @Inject('DATABASE_CONNECTION')
    private db: Db,
    private brandService: ProductBrandService,
    private departmentService: ProductDepartmentService,
    private categoryService: ProductCategoryService,
    private stockService: ProductStockService,
  ) {
    try {
      this.collection = db.collection(COLLECTION);
      this.collection
        .createIndex({ name: 1 }, { unique: true })
        .then((r) => /*TODO: Log this*/ console.log(r));
    } catch (err: unknown) {
      throw err;
    }
  }

  async create(
    createProductDto: CreateProductDto,
  ): Promise<InsertOneWriteOpResult<Product>> {
    createProductDto.status = ProductStatus.OUT_OF_STOCK;
    createProductDto.isActive = false;
    return await this.collection.insertOne(createProductDto);
  }

  async findAll(): Promise<Product[]> {
    return await this.collection.find().toArray();
  }

  async findOne(id: string): Promise<Product> {
    if (!ObjectID.isValid(id)) throw new BadRequestException();

    const response = await this.collection.findOne({
      _id: new ObjectID(id),
    });

    if (!response) throw new NotFoundException();
    return response;
  }

  // TODO: Find by name

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    user,
  ): Promise<UpdateWriteOpResult> {
    if (!ObjectID.isValid(id)) throw new BadRequestException();
    // add/override new brand if dont exist
    if (updateProductDto.brand) {
      const response = await this.brandService.findByName(
        updateProductDto.brand.name,
      );
      if (!response) await this.brandService.create(updateProductDto.brand);
    }

    // add/override new department if dont exist
    if (updateProductDto.department) {
      const response = await this.departmentService.findByName(
        updateProductDto.department.name,
      );
      if (!response)
        await this.departmentService.create(updateProductDto.department);
    }

    // add new category if dont exist
    if (updateProductDto.categories) {
      for (const n of updateProductDto.categories) {
        const newC = new CreateProductCategoryDto();
        newC.name = n.name;
        let response;
        try {
          response = await this.categoryService.create(newC);
        } catch (e) {}
        if (response) n._id = response.insertedId.toString();
      }
    }

    if (
      updateProductDto.stockAmount >= 0 &&
      updateProductDto.stockMinimumAlert >= 0
    ) {
      const stock = await this.stockService.findByProductId(id);
      if (!stock) {
        const { stock, status } = await this.stockService.create(
          id,
          updateProductDto.stockAmount,
          updateProductDto.stockMinimumAlert,
          user.sub,
        );
        updateProductDto.stock = stock.ops[0];
        updateProductDto.status = status;
      } else {
        updateProductDto.status = await this.stockService.update(
          id,
          stock._id,
          updateProductDto.stockAmount,
          updateProductDto.stockMinimumAlert,
          user.sub,
        );
      }
    }

    delete updateProductDto.stockAmount;
    delete updateProductDto.stockMinimumAlert;

    return await this.collection.updateOne(
      { _id: new ObjectID(id) },
      { $set: { ...updateProductDto } },
    );
  }

  async updateImage(
    id: string,
    file: Express.Multer.File,
  ): Promise<UpdateWriteOpResult> {
    if (!ObjectID.isValid(id)) throw new BadRequestException();

    return await this.db
      .collection(COLLECTION)
      .updateOne({ _id: new ObjectID(id) }, { $set: { image: file } });
  }

  async remove(id: string): Promise<DeleteWriteOpResultObject> {
    if (!ObjectID.isValid(id)) throw new BadRequestException();
    await this.stockService.remove(id);
    return await this.collection.deleteOne({
      _id: new ObjectID(id),
    });
  }
}
