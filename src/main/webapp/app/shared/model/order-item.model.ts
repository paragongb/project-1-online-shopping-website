import { type ICustomerOrder } from '@/shared/model/customer-order.model';
import { type IProduct } from '@/shared/model/product.model';

export interface IOrderItem {
  id?: number;
  quantity?: number;
  priceAtPurchase?: number;
  product?: IProduct | null;
  order?: ICustomerOrder | null;
}

export class OrderItem implements IOrderItem {
  constructor(
    public id?: number,
    public quantity?: number,
    public priceAtPurchase?: number,
    public product?: IProduct | null,
    public order?: ICustomerOrder | null,
  ) {}
}
