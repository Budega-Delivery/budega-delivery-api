import { CartItem, PAYMENT_MODE } from './orders';

export class CreateOrderDto {
  itemsList: CartItem[];
  addressId: string;
  paymentMode: PAYMENT_MODE;
}
