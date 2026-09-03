import { defineComponent, provide } from 'vue';

import UserService from '@/entities/user/user.service';

import AddressService from './address/address.service';
import CartItemService from './cart-item/cart-item.service';
import CategoryService from './category/category.service';
import CustomerOrderService from './customer-order/customer-order.service';
import OrderItemService from './order-item/order-item.service';
import ProductService from './product/product.service';
import ReviewService from './review/review.service';
import ShoppingCartService from './shopping-cart/shopping-cart.service';
import WishlistService from './wishlist/wishlist.service';
// jhipster-needle-add-entity-service-to-entities-component-import - JHipster will import entities services here

export default defineComponent({
  name: 'Entities',
  setup() {
    provide('userService', () => new UserService());
    provide('categoryService', () => new CategoryService());
    provide('productService', () => new ProductService());
    provide('shoppingCartService', () => new ShoppingCartService());
    provide('cartItemService', () => new CartItemService());
    provide('customerOrderService', () => new CustomerOrderService());
    provide('orderItemService', () => new OrderItemService());
    provide('addressService', () => new AddressService());
    provide('reviewService', () => new ReviewService());
    provide('wishlistService', () => new WishlistService());
    // jhipster-needle-add-entity-service-to-entities-component - JHipster will import entities services here
  },
});
