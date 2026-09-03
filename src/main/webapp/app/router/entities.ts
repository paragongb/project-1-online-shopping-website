import { Authority } from '@/shared/jhipster/constants';
const Entities = () => import('@/entities/entities.vue');

const Category = () => import('@/entities/category/category.vue');
const CategoryUpdate = () => import('@/entities/category/category-update.vue');
const CategoryDetails = () => import('@/entities/category/category-details.vue');

const Product = () => import('@/entities/product/product.vue');
const ProductUpdate = () => import('@/entities/product/product-update.vue');
const ProductDetails = () => import('@/entities/product/product-details.vue');

const ShoppingCart = () => import('@/entities/shopping-cart/shopping-cart.vue');
const ShoppingCartUpdate = () => import('@/entities/shopping-cart/shopping-cart-update.vue');
const ShoppingCartDetails = () => import('@/entities/shopping-cart/shopping-cart-details.vue');

const CartItem = () => import('@/entities/cart-item/cart-item.vue');
const CartItemUpdate = () => import('@/entities/cart-item/cart-item-update.vue');
const CartItemDetails = () => import('@/entities/cart-item/cart-item-details.vue');

const CustomerOrder = () => import('@/entities/customer-order/customer-order.vue');
const CustomerOrderUpdate = () => import('@/entities/customer-order/customer-order-update.vue');
const CustomerOrderDetails = () => import('@/entities/customer-order/customer-order-details.vue');

const OrderItem = () => import('@/entities/order-item/order-item.vue');
const OrderItemUpdate = () => import('@/entities/order-item/order-item-update.vue');
const OrderItemDetails = () => import('@/entities/order-item/order-item-details.vue');

const Address = () => import('@/entities/address/address.vue');
const AddressUpdate = () => import('@/entities/address/address-update.vue');
const AddressDetails = () => import('@/entities/address/address-details.vue');

const Review = () => import('@/entities/review/review.vue');
const ReviewUpdate = () => import('@/entities/review/review-update.vue');
const ReviewDetails = () => import('@/entities/review/review-details.vue');

const Wishlist = () => import('@/entities/wishlist/wishlist.vue');
const WishlistUpdate = () => import('@/entities/wishlist/wishlist-update.vue');
const WishlistDetails = () => import('@/entities/wishlist/wishlist-details.vue');

// jhipster-needle-add-entity-to-router-import - JHipster will import entities to the router here

export default {
  path: '/',
  component: Entities,
  children: [
    {
      path: 'category',
      name: 'Category',
      component: Category,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'category/new',
      name: 'CategoryCreate',
      component: CategoryUpdate,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'category/:categoryId/edit',
      name: 'CategoryEdit',
      component: CategoryUpdate,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'category/:categoryId/view',
      name: 'CategoryView',
      component: CategoryDetails,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'product',
      name: 'Product',
      component: Product,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'product/new',
      name: 'ProductCreate',
      component: ProductUpdate,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'product/:productId/edit',
      name: 'ProductEdit',
      component: ProductUpdate,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'product/:productId/view',
      name: 'ProductView',
      component: ProductDetails,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'shopping-cart',
      name: 'ShoppingCart',
      component: ShoppingCart,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'shopping-cart/new',
      name: 'ShoppingCartCreate',
      component: ShoppingCartUpdate,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'shopping-cart/:shoppingCartId/edit',
      name: 'ShoppingCartEdit',
      component: ShoppingCartUpdate,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'shopping-cart/:shoppingCartId/view',
      name: 'ShoppingCartView',
      component: ShoppingCartDetails,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'cart-item',
      name: 'CartItem',
      component: CartItem,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'cart-item/new',
      name: 'CartItemCreate',
      component: CartItemUpdate,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'cart-item/:cartItemId/edit',
      name: 'CartItemEdit',
      component: CartItemUpdate,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'cart-item/:cartItemId/view',
      name: 'CartItemView',
      component: CartItemDetails,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'customer-order',
      name: 'CustomerOrder',
      component: CustomerOrder,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'customer-order/new',
      name: 'CustomerOrderCreate',
      component: CustomerOrderUpdate,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'customer-order/:customerOrderId/edit',
      name: 'CustomerOrderEdit',
      component: CustomerOrderUpdate,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'customer-order/:customerOrderId/view',
      name: 'CustomerOrderView',
      component: CustomerOrderDetails,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'order-item',
      name: 'OrderItem',
      component: OrderItem,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'order-item/new',
      name: 'OrderItemCreate',
      component: OrderItemUpdate,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'order-item/:orderItemId/edit',
      name: 'OrderItemEdit',
      component: OrderItemUpdate,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'order-item/:orderItemId/view',
      name: 'OrderItemView',
      component: OrderItemDetails,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'address',
      name: 'Address',
      component: Address,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'address/new',
      name: 'AddressCreate',
      component: AddressUpdate,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'address/:addressId/edit',
      name: 'AddressEdit',
      component: AddressUpdate,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'address/:addressId/view',
      name: 'AddressView',
      component: AddressDetails,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'review',
      name: 'Review',
      component: Review,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'review/new',
      name: 'ReviewCreate',
      component: ReviewUpdate,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'review/:reviewId/edit',
      name: 'ReviewEdit',
      component: ReviewUpdate,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'review/:reviewId/view',
      name: 'ReviewView',
      component: ReviewDetails,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'wishlist',
      name: 'Wishlist',
      component: Wishlist,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'wishlist/new',
      name: 'WishlistCreate',
      component: WishlistUpdate,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'wishlist/:wishlistId/edit',
      name: 'WishlistEdit',
      component: WishlistUpdate,
      meta: { authorities: [Authority.USER] },
    },
    {
      path: 'wishlist/:wishlistId/view',
      name: 'WishlistView',
      component: WishlistDetails,
      meta: { authorities: [Authority.USER] },
    },
    // jhipster-needle-add-entity-to-router - JHipster will add entities to the router here
  ],
};
