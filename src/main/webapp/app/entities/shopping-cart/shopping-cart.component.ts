import { type Ref, computed, defineComponent, inject, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import type AccountService from '@/account/account.service';
import { useAlertService } from '@/shared/alert/alert.service';
import { useDateFormat } from '@/shared/composables';
import { Authority } from '@/shared/jhipster/constants';
import { type IShoppingCart } from '@/shared/model/shopping-cart.model';
import { useCartStore } from '@/store';

import ShoppingCartService from './shopping-cart.service';

export default defineComponent({
  name: 'ShoppingCart',
  setup() {
    const { t: t$ } = useI18n();
    const dateFormat = useDateFormat();
    const shoppingCartService = inject('shoppingCartService', () => new ShoppingCartService());
    const alertService = inject('alertService', () => useAlertService(), true);
    const accountService = inject<AccountService>('accountService');
    const cartStore = useCartStore();

    const shoppingCarts: Ref<IShoppingCart[]> = ref([]);

    const isFetching = ref(false);
    const isAdmin = ref(false);
    const isUpdatingItem = ref(false);

    const cartTotal = computed(() => cartStore.items.reduce((total, item) => total + (item.product?.price ?? 0) * (item.quantity ?? 0), 0));

    const changeQuantity = async (itemId: number, quantity: number) => {
      isUpdatingItem.value = true;
      try {
        await cartStore.updateQuantity(itemId, quantity);
      } catch (err) {
        alertService.showHttpError(err.response);
      } finally {
        isUpdatingItem.value = false;
      }
    };

    const removeCartItem = async (itemId: number) => {
      isUpdatingItem.value = true;
      try {
        await cartStore.removeItem(itemId);
      } catch (err) {
        alertService.showHttpError(err.response);
      } finally {
        isUpdatingItem.value = false;
      }
    };

    const clear = () => {};

    const retrieveShoppingCarts = async () => {
      isFetching.value = true;
      try {
        const res = await shoppingCartService().retrieve();
        shoppingCarts.value = res.data;
      } catch (err) {
        alertService.showHttpError(err.response);
      } finally {
        isFetching.value = false;
      }
    };

    const handleSyncList = () => {
      retrieveShoppingCarts();
    };

    onMounted(async () => {
      isAdmin.value = (await accountService?.hasAnyAuthorityAndCheckAuth(Authority.ADMIN)) ?? false;
      if (isAdmin.value) {
        await retrieveShoppingCarts();
      } else {
        isFetching.value = true;
        try {
          await cartStore.fetchCart();
        } finally {
          isFetching.value = false;
        }
      }
    });

    const removeId: Ref<number> = ref(null);
    const removeEntity = ref<any>(null);
    const prepareRemove = (instance: IShoppingCart) => {
      removeId.value = instance.id;
      removeEntity.value.show();
    };
    const closeDialog = () => {
      removeEntity.value.hide();
    };
    const removeShoppingCart = async () => {
      try {
        await shoppingCartService().delete(removeId.value);
        const message = t$('project1OnlineShoppingWebsiteApp.shoppingCart.deleted', { param: removeId.value }).toString();
        alertService.showInfo(message, { variant: 'danger' });
        removeId.value = null;
        retrieveShoppingCarts();
        closeDialog();
      } catch (error) {
        alertService.showHttpError(error.response);
      }
    };

    return {
      shoppingCarts,
      handleSyncList,
      isFetching,
      retrieveShoppingCarts,
      clear,
      ...dateFormat,
      removeId,
      removeEntity,
      prepareRemove,
      closeDialog,
      removeShoppingCart,
      isAdmin,
      isUpdatingItem,
      cartStore,
      cartTotal,
      changeQuantity,
      removeCartItem,
      t$,
    };
  },
});
