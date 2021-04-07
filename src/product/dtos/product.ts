import {
  ProductDepartment,
  ProductBrand,
  ProductCategory,
  ProductStock,
} from '../../interfaces';
import { StockHistoryAction } from '../product-stock-history/dtos/product-stock-history';

export enum ProductStatus {
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  IN_STOCK = 'IN_STOCK',
  RUNNING_LOW = 'RUNNING_LOW',
}

export const COLLECTION = 'products';

export class Product {
  _id: string;
  name: string;
  isActive: boolean;
  price: number;
  images: string[];
  status: ProductStatus;
  department: ProductDepartment;
  // TODO: add Unidade de medida Type: peso, litro, unidade
  brand: ProductBrand;
  categories: ProductCategory[];
  stock: ProductStock;
  createdAt: Date;
  updatedAt: Date;
}

export class ProductStockHistory {
  id: string;
  action: StockHistoryAction;
  agent: string; // Users Keycloak ID
  createdAt: string;
}
