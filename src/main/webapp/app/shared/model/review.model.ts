import { type IProduct } from '@/shared/model/product.model';
import { type IUser } from '@/shared/model/user.model';

export interface IReview {
  id?: number;
  rating?: number;
  comment?: string | null;
  reviewDate?: Date;
  product?: IProduct | null;
  user?: IUser | null;
}

export class Review implements IReview {
  constructor(
    public id?: number,
    public rating?: number,
    public comment?: string | null,
    public reviewDate?: Date,
    public product?: IProduct | null,
    public user?: IUser | null,
  ) {}
}
