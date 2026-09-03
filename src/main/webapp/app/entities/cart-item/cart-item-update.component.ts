import { type Ref, computed, defineComponent, inject, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

import { useVuelidate } from '@vuelidate/core';

import ProductService from '@/entities/product/product.service';
import ShoppingCartService from '@/entities/shopping-cart/shopping-cart.service';
import { useAlertService } from '@/shared/alert/alert.service';
import { useValidation } from '@/shared/composables';
import { CartItem, type ICartItem } from '@/shared/model/cart-item.model';
import { type IProduct } from '@/shared/model/product.model';
import { type IShoppingCart } from '@/shared/model/shopping-cart.model';

import CartItemService from './cart-item.service';

export default defineComponent({
  name: 'CartItemUpdate',
  setup() {
    const cartItemService = inject('cartItemService', () => new CartItemService());
    const alertService = inject('alertService', () => useAlertService(), true);

    const cartItem: Ref<ICartItem> = ref(new CartItem());

    const productService = inject('productService', () => new ProductService());

    const products: Ref<IProduct[]> = ref([]);

    const shoppingCartService = inject('shoppingCartService', () => new ShoppingCartService());

    const shoppingCarts: Ref<IShoppingCart[]> = ref([]);
    const isSaving = ref(false);
    const currentLanguage = inject('currentLanguage', () => computed(() => navigator.language ?? 'en'), true);

    const route = useRoute();
    const router = useRouter();

    const previousState = () => router.go(-1);

    const retrieveCartItem = async cartItemId => {
      try {
        const res = await cartItemService().find(cartItemId);
        cartItem.value = res;
      } catch (error) {
        alertService.showHttpError(error.response);
      }
    };

    if (route.params?.cartItemId) {
      retrieveCartItem(route.params.cartItemId);
    }

    const initRelationships = () => {
      productService()
        .retrieve()
        .then(res => {
          products.value = res.data;
        });
      shoppingCartService()
        .retrieve()
        .then(res => {
          shoppingCarts.value = res.data;
        });
    };

    initRelationships();

    const { t: t$ } = useI18n();
    const validations = useValidation();
    const validationRules = {
      quantity: {
        required: validations.required(t$('entity.validation.required').toString()),
        integer: validations.integer(t$('entity.validation.number').toString()),
        min: validations.minValue(t$('entity.validation.min', { min: 1 }).toString(), 1),
      },
      product: {},
      cart: {},
    };
    const v$ = useVuelidate(validationRules, cartItem as any);
    v$.value.$validate();

    return {
      cartItemService,
      alertService,
      cartItem,
      previousState,
      isSaving,
      currentLanguage,
      products,
      shoppingCarts,
      v$,
      t$,
    };
  },
  created(): void {},
  methods: {
    save(): void {
      this.isSaving = true;
      if (this.cartItem.id) {
        this.cartItemService()
          .update(this.cartItem)
          .then(param => {
            this.isSaving = false;
            this.previousState();
            this.alertService.showInfo(this.t$('project1OnlineShoppingWebsiteApp.cartItem.updated', { param: param.id }));
          })
          .catch(error => {
            this.isSaving = false;
            this.alertService.showHttpError(error.response);
          });
      } else {
        this.cartItemService()
          .create(this.cartItem)
          .then(param => {
            this.isSaving = false;
            this.previousState();
            this.alertService.showSuccess(this.t$('project1OnlineShoppingWebsiteApp.cartItem.created', { param: param.id }).toString());
          })
          .catch(error => {
            this.isSaving = false;
            this.alertService.showHttpError(error.response);
          });
      }
    },
  },
});
