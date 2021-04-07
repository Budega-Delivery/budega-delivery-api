import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  Collection,
  Db,
  DeleteWriteOpResultObject,
  InsertOneWriteOpResult,
  ObjectID,
  UpdateWriteOpResult,
} from 'mongodb';
import { COLLECTION, ProductBrand } from './dtos/product-brand';

import { CreateProductBrandDto } from './dtos/create-product-brand.dto';
import { UpdateProductBrandDto } from './dtos/update-product-brand.dto';

@Injectable()
export class ProductBrandService {
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
    createProductBrandDto: CreateProductBrandDto,
  ): Promise<InsertOneWriteOpResult<ProductBrand>> {
    return await this.db
      .collection(COLLECTION)
      .insertOne(createProductBrandDto);
  }

  async findAll(): Promise<ProductBrand[]> {
    return await this.collection.find().toArray();
  }

  async findOne(id: string): Promise<ProductBrand> {
    if (!ObjectID.isValid(id)) throw new BadRequestException();

    const response = await this.collection.findOne({
      _id: new ObjectID(id),
    });

    if (!response) throw new NotFoundException();
    return response;
  }

  async findByName(nameToFind: string): Promise<ProductBrand> {
    return await this.collection
      .find({ name: nameToFind })
      .sort({ name: 1 })
      .next();
  }

  async update(
    id: string,
    updateProductBrandDto: UpdateProductBrandDto,
  ): Promise<UpdateWriteOpResult> {
    if (!ObjectID.isValid(id)) throw new BadRequestException();
    // TODO: update the brand from products
    return await this.db
      .collection(COLLECTION)
      .updateOne(
        { _id: new ObjectID(id) },
        { $set: { ...updateProductBrandDto } },
      );
  }

  async remove(id: string): Promise<DeleteWriteOpResultObject> {
    // TODO: remove the brand from products
    if (!ObjectID.isValid(id)) throw new BadRequestException();
    return await this.collection.deleteOne({
      _id: new ObjectID(id),
    });
  }
}
