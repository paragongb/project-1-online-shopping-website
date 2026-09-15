import { type IUser } from '@/shared/model/user.model';

export interface IAddress {
  id?: number;
  addressLine1?: string;
  addressLine2?: string | null;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  user?: IUser | null;
}

export class Address implements IAddress {
  constructor(
    public id?: number,
    public addressLine1?: string,
    public addressLine2?: string | null,
    public city?: string,
    public state?: string,
    public postalCode?: string,
    public country?: string,
    public user?: IUser | null,
  ) {}
}
