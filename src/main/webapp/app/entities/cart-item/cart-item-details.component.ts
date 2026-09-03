import { type Ref, defineComponent, inject, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

import { useAlertService } from '@/shared/alert/alert.service';
import { type ICartItem } from '@/shared/model/cart-item.model';

import CartItemService from './cart-item.service';

export default defineComponent({
  name: 'CartItemDetails',
  setup() {
    const cartItemService = inject('cartItemService', () => new CartItemService());
    const alertService = inject('alertService', () => useAlertService(), true);

    const route = useRoute();
    const router = useRouter();

    const previousState = () => router.go(-1);
    const cartItem: Ref<ICartItem> = ref({});

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

    return {
      cartItem,

      previousState,
      t$: useI18n().t,
    };
  },
});
