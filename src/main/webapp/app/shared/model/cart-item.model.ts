import { type IProduct } from '@/shared/model/product.model';
import { type IShoppingCart } from '@/shared/model/shopping-cart.model';

export interface ICartItem {
  id?: number;
  quantity?: number;
  product?: IProduct | null;
  cart?: IShoppingCart | null;
}

export class CartItem implements ICartItem {
  constructor(
    public id?: number,
    public quantity?: number,
    public product?: IProduct | null,
    public cart?: IShoppingCart | null,
  ) {}
}
