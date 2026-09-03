import { type Ref, defineComponent, inject, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

import { useAlertService } from '@/shared/alert/alert.service';
import { useDateFormat } from '@/shared/composables';
import { type IWishlist } from '@/shared/model/wishlist.model';

import WishlistService from './wishlist.service';

export default defineComponent({
  name: 'WishlistDetails',
  setup() {
    const dateFormat = useDateFormat();
    const wishlistService = inject('wishlistService', () => new WishlistService());
    const alertService = inject('alertService', () => useAlertService(), true);

    const route = useRoute();
    const router = useRouter();

    const previousState = () => router.go(-1);
    const wishlist: Ref<IWishlist> = ref({});

    const retrieveWishlist = async wishlistId => {
      try {
        const res = await wishlistService().find(wishlistId);
        wishlist.value = res;
      } catch (error) {
        alertService.showHttpError(error.response);
      }
    };

    if (route.params?.wishlistId) {
      retrieveWishlist(route.params.wishlistId);
    }

    return {
      ...dateFormat,
      wishlist,

      previousState,
      t$: useI18n().t,
    };
  },
});
