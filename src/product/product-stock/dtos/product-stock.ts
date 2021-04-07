import { ProductStockHistory } from '../../product-stock-history/dtos/product-stock-history';

export const COLLECTION = 'productStock';

export class ProductStock {
  _id: string;
  productId: string;
  amount: number;
  minimumAlert: number;
  uid: string;
  stockHistory: ProductStockHistory;
  createdAt: string;
  updatedAt: string;
}
