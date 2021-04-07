import { IsNotEmpty, IsString } from 'class-validator';
import { ProductStatus } from './product';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  isActive?: boolean;

  status?: ProductStatus;

  constructor() {
    this.isActive = false;
    this.status = ProductStatus.OUT_OF_STOCK;
  }
}
