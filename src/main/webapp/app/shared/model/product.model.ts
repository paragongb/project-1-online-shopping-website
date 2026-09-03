import { type ICategory } from '@/shared/model/category.model';
import { type ProductStatus } from '@/shared/model/enumerations/product-status.model';
import { type IWishlist } from '@/shared/model/wishlist.model';

export interface IProduct {
  id?: number;
  sku?: string;
  name?: string;
  description?: string;
  price?: number;
  stockQuantity?: number;
  status?: keyof typeof ProductStatus;
  imageContentType?: string | null;
  image?: string | null;
  category?: ICategory | null;
  wishlists?: IWishlist[] | null;
}

export class Product implements IProduct {
  constructor(
    public id?: number,
    public sku?: string,
    public name?: string,
    public description?: string,
    public price?: number,
    public stockQuantity?: number,
    public status?: keyof typeof ProductStatus,
    public imageContentType?: string | null,
    public image?: string | null,
    public category?: ICategory | null,
    public wishlists?: IWishlist[] | null,
  ) {}
}
