import { type Ref, computed, defineComponent, inject, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

import { useVuelidate } from '@vuelidate/core';

import ProductService from '@/entities/product/product.service';
import UserService from '@/entities/user/user.service';
import { useAlertService } from '@/shared/alert/alert.service';
import { useDateFormat, useValidation } from '@/shared/composables';
import { type IProduct } from '@/shared/model/product.model';
import { type IWishlist, Wishlist } from '@/shared/model/wishlist.model';

import WishlistService from './wishlist.service';

export default defineComponent({
  name: 'WishlistUpdate',
  setup() {
    const wishlistService = inject('wishlistService', () => new WishlistService());
    const alertService = inject('alertService', () => useAlertService(), true);

    const wishlist: Ref<IWishlist> = ref(new Wishlist());
    const userService = inject('userService', () => new UserService());
    const users: Ref<Array<any>> = ref([]);

    const productService = inject('productService', () => new ProductService());

    const products: Ref<IProduct[]> = ref([]);
    const isSaving = ref(false);
    const currentLanguage = inject('currentLanguage', () => computed(() => navigator.language ?? 'en'), true);

    const route = useRoute();
    const router = useRouter();

    const previousState = () => router.go(-1);

    const retrieveWishlist = async wishlistId => {
      try {
        const res = await wishlistService().find(wishlistId);
        res.createdDate = new Date(res.createdDate);
        wishlist.value = res;
      } catch (error) {
        alertService.showHttpError(error.response);
      }
    };

    if (route.params?.wishlistId) {
      retrieveWishlist(route.params.wishlistId);
    }

    const initRelationships = () => {
      userService()
        .retrieve()
        .then(res => {
          users.value = res.data;
        });
      productService()
        .retrieve()
        .then(res => {
          products.value = res.data;
        });
    };

    initRelationships();

    const { t: t$ } = useI18n();
    const validations = useValidation();
    const validationRules = {
      createdDate: {
        required: validations.required(t$('entity.validation.required').toString()),
      },
      user: {},
      products: {},
    };
    const v$ = useVuelidate(validationRules, wishlist as any);
    v$.value.$validate();

    return {
      wishlistService,
      alertService,
      wishlist,
      previousState,
      isSaving,
      currentLanguage,
      users,
      products,
      v$,
      ...useDateFormat({ entityRef: wishlist }),
      t$,
    };
  },
  created(): void {
    this.wishlist.products = [];
  },
  methods: {
    save(): void {
      this.isSaving = true;
      if (this.wishlist.id) {
        this.wishlistService()
          .update(this.wishlist)
          .then(param => {
            this.isSaving = false;
            this.previousState();
            this.alertService.showInfo(this.t$('project1OnlineShoppingWebsiteApp.wishlist.updated', { param: param.id }));
          })
          .catch(error => {
            this.isSaving = false;
            this.alertService.showHttpError(error.response);
          });
      } else {
        this.wishlistService()
          .create(this.wishlist)
          .then(param => {
            this.isSaving = false;
            this.previousState();
            this.alertService.showSuccess(this.t$('project1OnlineShoppingWebsiteApp.wishlist.created', { param: param.id }).toString());
          })
          .catch(error => {
            this.isSaving = false;
            this.alertService.showHttpError(error.response);
          });
      }
    },

    getSelected(selectedVals, option, pkField = 'id'): any {
      if (selectedVals) {
        return selectedVals.find(value => option[pkField] === value[pkField]) ?? option;
      }
      return option;
    },
  },
});
