import { type IProduct } from '@/shared/model/product.model';
import { type IUser } from '@/shared/model/user.model';

export interface IWishlist {
  id?: number;
  createdDate?: Date;
  user?: IUser | null;
  products?: IProduct[] | null;
}

export class Wishlist implements IWishlist {
  constructor(
    public id?: number,
    public createdDate?: Date,
    public user?: IUser | null,
    public products?: IProduct[] | null,
  ) {}
}
