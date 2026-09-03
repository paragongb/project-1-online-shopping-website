import { type Ref, defineComponent, inject, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { useAlertService } from '@/shared/alert/alert.service';
import { type ICartItem } from '@/shared/model/cart-item.model';

import CartItemService from './cart-item.service';

export default defineComponent({
  name: 'CartItem',
  setup() {
    const { t: t$ } = useI18n();
    const cartItemService = inject('cartItemService', () => new CartItemService());
    const alertService = inject('alertService', () => useAlertService(), true);

    const cartItems: Ref<ICartItem[]> = ref([]);

    const isFetching = ref(false);

    const clear = () => {};

    const retrieveCartItems = async () => {
      isFetching.value = true;
      try {
        const res = await cartItemService().retrieve();
        cartItems.value = res.data;
      } catch (err) {
        alertService.showHttpError(err.response);
      } finally {
        isFetching.value = false;
      }
    };

    const handleSyncList = () => {
      retrieveCartItems();
    };

    onMounted(async () => {
      await retrieveCartItems();
    });

    const removeId: Ref<number> = ref(null);
    const removeEntity = ref<any>(null);
    const prepareRemove = (instance: ICartItem) => {
      removeId.value = instance.id;
      removeEntity.value.show();
    };
    const closeDialog = () => {
      removeEntity.value.hide();
    };
    const removeCartItem = async () => {
      try {
        await cartItemService().delete(removeId.value);
        const message = t$('project1OnlineShoppingWebsiteApp.cartItem.deleted', { param: removeId.value }).toString();
        alertService.showInfo(message, { variant: 'danger' });
        removeId.value = null;
        retrieveCartItems();
        closeDialog();
      } catch (error) {
        alertService.showHttpError(error.response);
      }
    };

    return {
      cartItems,
      handleSyncList,
      isFetching,
      retrieveCartItems,
      clear,
      removeId,
      removeEntity,
      prepareRemove,
      closeDialog,
      removeCartItem,
      t$,
    };
  },
});
