import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductCategoryDto } from './dtos/create-product-category.dto';
import { UpdateProductCategoryDto } from './dtos/update-product-category.dto';
import {
  Collection,
  Db,
  DeleteWriteOpResultObject,
  InsertOneWriteOpResult,
  ObjectID,
  UpdateWriteOpResult,
} from 'mongodb';
import { COLLECTION, ProductCategory } from './dtos/product-category';

@Injectable()
export class ProductCategoryService {
  collection: Collection;

  constructor(
    @Inject('DATABASE_CONNECTION')
    private db: Db,
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
    createProductCategoryDto: CreateProductCategoryDto,
  ): Promise<InsertOneWriteOpResult<ProductCategory>> {
    return await this.db
      .collection(COLLECTION)
      .insertOne(createProductCategoryDto);
  }

  async findAll(): Promise<ProductCategory[]> {
    return await this.collection.find().toArray();
  }

  async findOne(id: string): Promise<ProductCategory> {
    if (!ObjectID.isValid(id)) throw new BadRequestException();

    const response = await this.collection.findOne({
      _id: new ObjectID(id),
    });

    if (!response) throw new NotFoundException();
    return response;
  }

  async findByName(nameToFind: string): Promise<ProductCategory> {
    return await this.collection
      .find({ name: nameToFind })
      .sort({ name: 1 })
      .next();
  }

  async update(
    id: string,
    updateProductCategoryDto: UpdateProductCategoryDto,
  ): Promise<UpdateWriteOpResult> {
    if (!ObjectID.isValid(id)) throw new BadRequestException();
    // TODO: update the category from products
    return await this.db
      .collection(COLLECTION)
      .updateOne(
        { _id: new ObjectID(id) },
        { $set: { ...updateProductCategoryDto } },
      );
  }

  async remove(id: string): Promise<DeleteWriteOpResultObject> {
    // TODO: remove the category from products
    if (!ObjectID.isValid(id)) throw new BadRequestException();
    return await this.collection.deleteOne({
      _id: new ObjectID(id),
    });
  }
}
