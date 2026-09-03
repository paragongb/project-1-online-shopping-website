import { type IUser } from '@/shared/model/user.model';

export interface IShoppingCart {
  id?: number;
  createdDate?: Date;
  user?: IUser | null;
}

export class ShoppingCart implements IShoppingCart {
  constructor(
    public id?: number,
    public createdDate?: Date,
    public user?: IUser | null,
  ) {}
}
