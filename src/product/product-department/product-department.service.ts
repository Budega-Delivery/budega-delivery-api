import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDepartmentDto } from './dtos/create-product-department.dto';
import { UpdateProductDepartmentDto } from './dtos/update-product-department.dto';
import {
  Collection,
  Db,
  DeleteWriteOpResultObject,
  InsertOneWriteOpResult,
  ObjectID,
  UpdateWriteOpResult,
} from 'mongodb';
import { COLLECTION, ProductDepartment } from './dtos/product-department';

@Injectable()
export class ProductDepartmentService {
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
    createProductDepartmentDto: CreateProductDepartmentDto,
  ): Promise<InsertOneWriteOpResult<ProductDepartment>> {
    return await this.db
      .collection(COLLECTION)
      .insertOne(createProductDepartmentDto);
  }

  async findAll(): Promise<ProductDepartment[]> {
    return await this.collection.find().toArray();
  }

  async findOne(id: number): Promise<ProductDepartment> {
    if (!ObjectID.isValid(id)) throw new BadRequestException();

    const response = await this.collection.findOne({
      _id: new ObjectID(id),
    });

    if (!response) throw new NotFoundException();
    return response;
  }

  async findByName(nameToFind: string): Promise<ProductDepartment> {
    return await this.collection
      .find({ name: nameToFind })
      .sort({ name: 1 })
      .next();
  }

  async update(
    id: number,
    updateProductDepartmentDto: UpdateProductDepartmentDto,
  ): Promise<UpdateWriteOpResult> {
    if (!ObjectID.isValid(id)) throw new BadRequestException();

    return await this.db
      .collection(COLLECTION)
      .updateOne(
        { _id: new ObjectID(id) },
        { $set: { ...updateProductDepartmentDto } },
      );
  }

  async remove(id: number): Promise<DeleteWriteOpResultObject> {
    // TODO: remove the department from products
    if (!ObjectID.isValid(id)) throw new BadRequestException();
    return await this.collection.deleteOne({
      _id: new ObjectID(id),
    });
  }
}
