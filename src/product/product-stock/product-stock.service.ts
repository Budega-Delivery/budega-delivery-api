import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  Collection,
  Db,
  DeleteWriteOpResultObject,
  InsertOneWriteOpResult,
  ObjectID,
} from 'mongodb';
import { COLLECTION, ProductStock } from './dtos/product-stock';
// import { COLLECTION as HISTORY } from '../product-stock-history/dtos/product-stock-history';
import { ProductStatus } from '../dtos/product';

@Injectable()
export class ProductStockService {
  collection: Collection;
  // history: Collection;

  constructor(
    @Inject('DATABASE_CONNECTION')
    private db: Db,
  ) {
    try {
      this.collection = db.collection(COLLECTION);
      // this.history = db.collection(HISTORY);
      this.collection
        .createIndex({ productId: 1 }, { unique: true })
        .then((r) => /*TODO: Log this*/ console.log(r));
    } catch (err: unknown) {
      throw err;
    }
  }
  async create(
    productId: string,
    amount: number,
    minimumAlert: number,
    uid: string,
  ): Promise<{
    stock: InsertOneWriteOpResult<ProductStock>;
    status: ProductStatus;
  }> {
    if (!ObjectID.isValid(productId)) throw new BadRequestException();
    // TODO: add to history, need user keycloak ID
    const stock = await this.collection.insertOne({
      productId,
      amount,
      minimumAlert,
      uid,
    });
    return { stock, status: this.status(amount, minimumAlert) };
  }

  async findByProductId(productId: string): Promise<ProductStock> {
    if (!ObjectID.isValid(productId)) throw new BadRequestException();
    return await this.collection
      .find({ productId: productId })
      .sort({ productId: 1 })
      .next();
  }

  // TODO: Check if id is valid
  // TODO: Check if amount is valid
  // TODO: leitura: https://www.cin.ufpe.br/~if695/arquivos/aulas/aulas_NoSQL.pdf
  // TODO: add to history

  // async put(id: string, amount: number): Promise<boolean> {
  //   return await
  // }
  //
  // async remove(id: string, amount: number): Promise<boolean> {
  // }

  async update(
    productId: string,
    _id: string,
    amount: number,
    minimumAlert: number,
    uid: string,
  ): Promise<ProductStatus> {
    if (!ObjectID.isValid(productId)) throw new BadRequestException();

    await this.collection.updateOne(
      { _id },
      {
        $set: {
          productId,
          amount,
          minimumAlert,
          uid,
        },
      },
    );
    return this.status(amount, minimumAlert);
  }

  async remove(productId: string): Promise<DeleteWriteOpResultObject> {
    if (!ObjectID.isValid(productId)) throw new BadRequestException();
    const { _id } = await this.findByProductId(productId);
    if (!ObjectID.isValid(_id)) throw new BadRequestException();
    return await this.collection.deleteOne({
      _id: new ObjectID(_id),
    });
  }

  status(amount: number, minimumAlert: number): ProductStatus {
    if (amount === 0) return ProductStatus.OUT_OF_STOCK;
    else if (amount <= minimumAlert) return ProductStatus.RUNNING_LOW;
    else return ProductStatus.IN_STOCK;
  }
}
