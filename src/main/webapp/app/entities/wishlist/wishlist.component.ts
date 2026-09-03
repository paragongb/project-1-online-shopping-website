import { type Ref, defineComponent, inject, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { useAlertService } from '@/shared/alert/alert.service';
import { useDateFormat } from '@/shared/composables';
import { type IWishlist } from '@/shared/model/wishlist.model';

import WishlistService from './wishlist.service';

export default defineComponent({
  name: 'Wishlist',
  setup() {
    const { t: t$ } = useI18n();
    const dateFormat = useDateFormat();
    const wishlistService = inject('wishlistService', () => new WishlistService());
    const alertService = inject('alertService', () => useAlertService(), true);

    const wishlists: Ref<IWishlist[]> = ref([]);

    const isFetching = ref(false);

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
      await retrieveWishlists();
    });

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
