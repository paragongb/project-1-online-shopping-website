import { type Ref, computed, defineComponent, inject, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

import { useVuelidate } from '@vuelidate/core';

import UserService from '@/entities/user/user.service';
import { useAlertService } from '@/shared/alert/alert.service';
import { useDateFormat, useValidation } from '@/shared/composables';
import { type IShoppingCart, ShoppingCart } from '@/shared/model/shopping-cart.model';

import ShoppingCartService from './shopping-cart.service';

export default defineComponent({
  name: 'ShoppingCartUpdate',
  setup() {
    const shoppingCartService = inject('shoppingCartService', () => new ShoppingCartService());
    const alertService = inject('alertService', () => useAlertService(), true);

    const shoppingCart: Ref<IShoppingCart> = ref(new ShoppingCart());
    const userService = inject('userService', () => new UserService());
    const users: Ref<Array<any>> = ref([]);
    const isSaving = ref(false);
    const currentLanguage = inject('currentLanguage', () => computed(() => navigator.language ?? 'en'), true);

    const route = useRoute();
    const router = useRouter();

    const previousState = () => router.go(-1);

    const retrieveShoppingCart = async shoppingCartId => {
      try {
        const res = await shoppingCartService().find(shoppingCartId);
        res.createdDate = new Date(res.createdDate);
        shoppingCart.value = res;
      } catch (error) {
        alertService.showHttpError(error.response);
      }
    };

    if (route.params?.shoppingCartId) {
      retrieveShoppingCart(route.params.shoppingCartId);
    }

    const initRelationships = () => {
      userService()
        .retrieve()
        .then(res => {
          users.value = res.data;
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
      cartItems: {},
    };
    const v$ = useVuelidate(validationRules, shoppingCart as any);
    v$.value.$validate();

    return {
      shoppingCartService,
      alertService,
      shoppingCart,
      previousState,
      isSaving,
      currentLanguage,
      users,
      v$,
      ...useDateFormat({ entityRef: shoppingCart }),
      t$,
    };
  },
  created(): void {},
  methods: {
    save(): void {
      this.isSaving = true;
      if (this.shoppingCart.id) {
        this.shoppingCartService()
          .update(this.shoppingCart)
          .then(param => {
            this.isSaving = false;
            this.previousState();
            this.alertService.showInfo(this.t$('project1OnlineShoppingWebsiteApp.shoppingCart.updated', { param: param.id }));
          })
          .catch(error => {
            this.isSaving = false;
            this.alertService.showHttpError(error.response);
          });
      } else {
        this.shoppingCartService()
          .create(this.shoppingCart)
          .then(param => {
            this.isSaving = false;
            this.previousState();
            this.alertService.showSuccess(this.t$('project1OnlineShoppingWebsiteApp.shoppingCart.created', { param: param.id }).toString());
          })
          .catch(error => {
            this.isSaving = false;
            this.alertService.showHttpError(error.response);
          });
      }
    },
  },
});
