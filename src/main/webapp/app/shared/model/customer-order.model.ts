import { type IAddress } from '@/shared/model/address.model';
import { type OrderStatus } from '@/shared/model/enumerations/order-status.model';
import { type IUser } from '@/shared/model/user.model';

export interface ICustomerOrder {
  id?: number;
  placedDate?: Date;
  status?: keyof typeof OrderStatus;
  totalAmount?: number;
  shippingAddress?: IAddress | null;
  billingAddress?: IAddress | null;
  user?: IUser | null;
}

export class CustomerOrder implements ICustomerOrder {
  constructor(
    public id?: number,
    public placedDate?: Date,
    public status?: keyof typeof OrderStatus,
    public totalAmount?: number,
    public shippingAddress?: IAddress | null,
    public billingAddress?: IAddress | null,
    public user?: IUser | null,
  ) {}
}
