import { type Ref, computed, defineComponent, inject, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import axios from 'axios';

import type AccountService from '@/account/account.service';
import { useAlertService } from '@/shared/alert/alert.service';
import { useDateFormat } from '@/shared/composables';
import { Authority } from '@/shared/jhipster/constants';
import { type IShoppingCart } from '@/shared/model/shopping-cart.model';
import { type IAddress } from '@/shared/model/address.model';
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
    const isCheckingOut = ref(false);
    const sellerWhatsappNumber = ref('');
    const addressTouched = ref(false);
    const deliveryAddress: Ref<IAddress> = ref({
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'Malaysia',
    });

    const cartTotal = computed(() => cartStore.items.reduce((total, item) => total + (item.product?.price ?? 0) * (item.quantity ?? 0), 0));
    const isAddressComplete = computed(() =>
      [
        deliveryAddress.value.addressLine1,
        deliveryAddress.value.city,
        deliveryAddress.value.state,
        deliveryAddress.value.postalCode,
        deliveryAddress.value.country,
      ].every(value => value?.trim()),
    );
    const formattedAddress = computed(() =>
      [
        deliveryAddress.value.addressLine1,
        deliveryAddress.value.addressLine2,
        deliveryAddress.value.postalCode,
        deliveryAddress.value.city,
        deliveryAddress.value.state,
        deliveryAddress.value.country,
      ]
        .filter(value => value?.trim())
        .join(', '),
    );

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
      addressTouched.value = true;
      if (!isAddressComplete.value) {
        return;
      }
      showCheckoutConfirm.value = true;
    };
    const confirmCheckout = async () => {
      if (!isAddressComplete.value || isCheckingOut.value || !sellerWhatsappNumber.value) return;
      const whatsappWindow = window.open('about:blank', '_blank');
      if (whatsappWindow) whatsappWindow.opener = null;
      isCheckingOut.value = true;
      try {
        const res = await axios.post('api/orders/checkout', deliveryAddress.value);
        const order = res.data;
        const lines = cartStore.items.map(
          item => `- ${item.product?.name} x${item.quantity} ($${((item.product?.price ?? 0) * (item.quantity ?? 0)).toFixed(2)})`,
        );
        const message = [
          t$('project1OnlineShoppingWebsiteApp.shoppingCart.myCart.checkoutMessageGreeting').toString(),
          `${t$('project1OnlineShoppingWebsiteApp.orderItem.myOrders.order')} #${order.id}`,
          ...lines,
          `${t$('project1OnlineShoppingWebsiteApp.shoppingCart.myCart.total')}: $${cartTotal.value.toFixed(2)}`,
          '',
          `${t$('project1OnlineShoppingWebsiteApp.shoppingCart.myCart.deliveryAddress')}:`,
          formattedAddress.value,
        ].join('\n');
        const whatsappUrl = `https://wa.me/${sellerWhatsappNumber.value}?text=${encodeURIComponent(message)}`;
        cartStore.applyCart({ items: [] });
        showCheckoutConfirm.value = false;
        alertService.showInfo(t$('project1OnlineShoppingWebsiteApp.shoppingCart.myCart.orderCreated').toString(), { variant: 'success' });
        if (whatsappWindow) {
          whatsappWindow.location.href = whatsappUrl;
        } else {
          window.location.assign(whatsappUrl);
        }
      } catch (err) {
        whatsappWindow?.close();
        alertService.showHttpError(err.response);
      } finally {
        isCheckingOut.value = false;
      }
    };

    const retrieveSavedAddress = async () => {
      try {
        const res = await axios.get<IAddress>('api/orders/my-delivery-address');
        deliveryAddress.value = { ...deliveryAddress.value, ...res.data };
      } catch (err) {
        if (err.response?.status !== 404) alertService.showHttpError(err.response);
      }
    };
    const canIncreaseQuantity = (item: any) =>
      item.product?.status === 'PRE_ORDER' || Number(item.quantity ?? 0) < Number(item.product?.stockQuantity ?? 0);

    const retrieveStoreConfiguration = async () => {
      try {
        const res = await axios.get<{ whatsappNumber: string }>('api/store-config');
        sellerWhatsappNumber.value = res.data.whatsappNumber;
      } catch (err) {
        sellerWhatsappNumber.value = '';
        alertService.showHttpError(err.response);
      }
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
          await Promise.all([cartStore.fetchCart(), retrieveSavedAddress(), retrieveStoreConfiguration()]);
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
      canIncreaseQuantity,
      removeCartItem,
      showCheckoutConfirm,
      openCheckoutConfirm,
      confirmCheckout,
      deliveryAddress,
      isAddressComplete,
      formattedAddress,
      addressTouched,
      isCheckingOut,
      sellerWhatsappNumber,
      t$,
    };
  },
});
