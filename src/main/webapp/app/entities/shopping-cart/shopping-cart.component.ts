import { type Ref, computed, defineComponent, inject, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import type AccountService from '@/account/account.service';
import { useAlertService } from '@/shared/alert/alert.service';
import { useDateFormat } from '@/shared/composables';
import { Authority } from '@/shared/jhipster/constants';
import { type IShoppingCart } from '@/shared/model/shopping-cart.model';
import { useCartStore } from '@/store';

import ShoppingCartService from './shopping-cart.service';

// TODO: replace with the seller's real WhatsApp number (digits only, with country code, no + or spaces)
const SELLER_WHATSAPP_NUMBER = '10000000000';

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

    const showCheckoutConfirm = ref(false);
    const openCheckoutConfirm = () => {
      showCheckoutConfirm.value = true;
    };
    const confirmCheckout = () => {
      const lines = cartStore.items.map(
        item => `- ${item.product?.name} x${item.quantity} ($${((item.product?.price ?? 0) * (item.quantity ?? 0)).toFixed(2)})`,
      );
      const message = [
        t$('project1OnlineShoppingWebsiteApp.shoppingCart.myCart.checkoutMessageGreeting').toString(),
        ...lines,
        `${t$('project1OnlineShoppingWebsiteApp.shoppingCart.myCart.total')}: $${cartTotal.value.toFixed(2)}`,
      ].join('\n');
      const whatsappUrl = `https://wa.me/${+601151811980}?text=${encodeURIComponent(message)}`;
      showCheckoutConfirm.value = false;
      window.open(whatsappUrl, '_blank', 'noopener');
    };

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
      showCheckoutConfirm,
      openCheckoutConfirm,
      confirmCheckout,
      t$,
    };
  },
});
