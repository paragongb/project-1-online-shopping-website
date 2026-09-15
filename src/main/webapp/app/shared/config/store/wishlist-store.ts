import axios from 'axios';
import { defineStore } from 'pinia';

import { type IProduct } from '@/shared/model/product.model';

interface WishlistState {
  id: number | null;
  products: IProduct[];
  loaded: boolean;
}

const baseApiUrl = 'api/wishlists/mine';

export const useWishlistStore = defineStore('wishlistStore', {
  state: (): WishlistState => ({
    id: null,
    products: [],
    loaded: false,
  }),
  getters: {
    productIds: state => new Set(state.products.map(product => product.id)),
  },
  actions: {
    applyWishlist(wishlist: { id?: number; products?: IProduct[] }) {
      this.id = wishlist?.id ?? null;
      this.products = wishlist?.products ?? [];
      this.loaded = true;
    },
    hasProduct(productId?: number): boolean {
      return productId !== undefined && this.productIds.has(productId);
    },
    async fetchWishlist() {
      const res = await axios.get(baseApiUrl);
      this.applyWishlist(res.data);
    },
    async addProduct(productId: number) {
      const res = await axios.post(`${baseApiUrl}/products/${productId}`);
      this.applyWishlist(res.data);
    },
    async removeProduct(productId: number) {
      const res = await axios.delete(`${baseApiUrl}/products/${productId}`);
      this.applyWishlist(res.data);
    },
    reset() {
      this.id = null;
      this.products = [];
      this.loaded = false;
    },
  },
});
