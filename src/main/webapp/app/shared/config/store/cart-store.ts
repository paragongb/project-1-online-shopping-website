import axios from 'axios';

import { defineStore } from 'pinia';

import { type IProduct } from '@/shared/model/product.model';

export interface ICartItemView {
  id?: number;
  quantity?: number;
  product?: IProduct;
}

interface CartState {
  id: number | null;
  items: ICartItemView[];
  loaded: boolean;
}

const baseApiUrl = 'api/cart';

// Cart contents are always fetched from/persisted to the backend (scoped to the
// logged-in user), never localStorage, so they survive logout/login and reopening the site.
export const useCartStore = defineStore('cartStore', {
  state: (): CartState => ({
    id: null,
    items: [],
    loaded: false,
  }),
  getters: {
    totalItemCount(state): number {
      return state.items.reduce((total, item) => total + (item.quantity ?? 0), 0);
    },
  },
  actions: {
    applyCart(cart: { id?: number; items?: ICartItemView[] }) {
      this.id = cart?.id ?? null;
      this.items = cart?.items ?? [];
      this.loaded = true;
    },
    async fetchCart() {
      const res = await axios.get(baseApiUrl);
      this.applyCart(res.data);
    },
    async addToCart(productId: number, quantity = 1) {
      const res = await axios.post(`${baseApiUrl}/items`, { productId, quantity });
      this.applyCart(res.data);
    },
    async updateQuantity(itemId: number, quantity: number) {
      const res = await axios.put(`${baseApiUrl}/items/${itemId}`, { quantity });
      this.applyCart(res.data);
    },
    async removeItem(itemId: number) {
      const res = await axios.delete(`${baseApiUrl}/items/${itemId}`);
      this.applyCart(res.data);
    },
    reset() {
      this.id = null;
      this.items = [];
      this.loaded = false;
    },
  },
});
