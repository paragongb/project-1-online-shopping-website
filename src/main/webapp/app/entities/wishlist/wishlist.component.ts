import { type Ref, defineComponent, inject, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import type AccountService from '@/account/account.service';
import { useAlertService } from '@/shared/alert/alert.service';
import { useDateFormat } from '@/shared/composables';
import { Authority } from '@/shared/jhipster/constants';
import { type IProduct } from '@/shared/model/product.model';
import { type IWishlist } from '@/shared/model/wishlist.model';
import { useCartStore, useWishlistStore } from '@/store';

import WishlistService from './wishlist.service';

export default defineComponent({
  name: 'Wishlist',
  setup() {
    const { t: t$ } = useI18n();
    const dateFormat = useDateFormat();
    const wishlistService = inject('wishlistService', () => new WishlistService());
    const alertService = inject('alertService', () => useAlertService(), true);
    const accountService = inject<AccountService>('accountService');
    const wishlistStore = useWishlistStore();
    const cartStore = useCartStore();

    const wishlists: Ref<IWishlist[]> = ref([]);

    const isFetching = ref(false);
    const isAdmin = ref(false);
    const removingProductId: Ref<number> = ref(null);
    const addingToCartId: Ref<number> = ref(null);

    const clear = () => {};

    const retrieveWishlists = async () => {
      isFetching.value = true;
      try {
        const res = await wishlistService().retrieve();
        wishlists.value = res.data;
      } catch (err) {
        alertService.showHttpError(err.response);
      } finally {
        isFetching.value = false;
      }
    };

    const handleSyncList = () => {
      retrieveWishlists();
    };

    onMounted(async () => {
      isAdmin.value = (await accountService?.hasAnyAuthorityAndCheckAuth(Authority.ADMIN)) ?? false;
      if (!accountService || isAdmin.value) {
        await retrieveWishlists();
      } else {
        isFetching.value = true;
        try {
          await wishlistStore.fetchWishlist();
        } catch (err: any) {
          alertService.showHttpError(err.response);
        } finally {
          isFetching.value = false;
        }
      }
    });

    const removeProduct = async (product: IProduct) => {
      removingProductId.value = product.id;
      try {
        await wishlistStore.removeProduct(product.id);
        alertService.showInfo(t$('project1OnlineShoppingWebsiteApp.wishlist.myWishlist.removed', { name: product.name }).toString());
      } catch (err: any) {
        alertService.showHttpError(err.response);
      } finally {
        removingProductId.value = null;
      }
    };

    const addToCart = async (product: IProduct) => {
      addingToCartId.value = product.id;
      try {
        await cartStore.addToCart(product.id, 1);
        alertService.showInfo(t$('project1OnlineShoppingWebsiteApp.product.shop.addedToCart', { name: product.name }).toString());
      } catch (err: any) {
        alertService.showHttpError(err.response);
      } finally {
        addingToCartId.value = null;
      }
    };

    const statusVariant = (status: string): string => {
      if (status === 'IN_STOCK') return 'success';
      if (status === 'PRE_ORDER') return 'info';
      return 'secondary';
    };

    const removeId: Ref<number> = ref(null);
    const removeEntity = ref<any>(null);
    const prepareRemove = (instance: IWishlist) => {
      removeId.value = instance.id;
      removeEntity.value.show();
    };
    const closeDialog = () => {
      removeEntity.value.hide();
    };
    const removeWishlist = async () => {
      try {
        await wishlistService().delete(removeId.value);
        const message = t$('project1OnlineShoppingWebsiteApp.wishlist.deleted', { param: removeId.value }).toString();
        alertService.showInfo(message, { variant: 'danger' });
        removeId.value = null;
        retrieveWishlists();
        closeDialog();
      } catch (error) {
        alertService.showHttpError(error.response);
      }
    };

    return {
      wishlists,
      handleSyncList,
      isFetching,
      isAdmin,
      wishlistStore,
      removingProductId,
      addingToCartId,
      removeProduct,
      addToCart,
      statusVariant,
      retrieveWishlists,
      clear,
      ...dateFormat,
      removeId,
      removeEntity,
      prepareRemove,
      closeDialog,
      removeWishlist,
      t$,
    };
  },
});
