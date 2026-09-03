import { type Ref, computed, defineComponent, inject, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

import { useVuelidate } from '@vuelidate/core';

import { useAlertService } from '@/shared/alert/alert.service';
import { useValidation } from '@/shared/composables';
import { Address, type IAddress } from '@/shared/model/address.model';

import AddressService from './address.service';

export default defineComponent({
  name: 'AddressUpdate',
  setup() {
    const addressService = inject('addressService', () => new AddressService());
    const alertService = inject('alertService', () => useAlertService(), true);

    const address: Ref<IAddress> = ref(new Address());
    const isSaving = ref(false);
    const currentLanguage = inject('currentLanguage', () => computed(() => navigator.language ?? 'en'), true);

    const route = useRoute();
    const router = useRouter();

    const previousState = () => router.go(-1);

    const retrieveAddress = async addressId => {
      try {
        const res = await addressService().find(addressId);
        address.value = res;
      } catch (error) {
        alertService.showHttpError(error.response);
      }
    };

    if (route.params?.addressId) {
      retrieveAddress(route.params.addressId);
    }

    const initRelationships = () => {};

    initRelationships();

    const { t: t$ } = useI18n();
    const validations = useValidation();
    const validationRules = {
      addressLine1: {
        required: validations.required(t$('entity.validation.required').toString()),
      },
      addressLine2: {},
      city: {
        required: validations.required(t$('entity.validation.required').toString()),
      },
      state: {
        required: validations.required(t$('entity.validation.required').toString()),
      },
      postalCode: {
        required: validations.required(t$('entity.validation.required').toString()),
      },
      country: {
        required: validations.required(t$('entity.validation.required').toString()),
      },
      shippingOrder: {},
      billingOrder: {},
    };
    const v$ = useVuelidate(validationRules, address as any);
    v$.value.$validate();

    return {
      addressService,
      alertService,
      address,
      previousState,
      isSaving,
      currentLanguage,
      v$,
      t$,
    };
  },
  created(): void {},
  methods: {
    save(): void {
      this.isSaving = true;
      if (this.address.id) {
        this.addressService()
          .update(this.address)
          .then(param => {
            this.isSaving = false;
            this.previousState();
            this.alertService.showInfo(this.t$('project1OnlineShoppingWebsiteApp.address.updated', { param: param.id }));
          })
          .catch(error => {
            this.isSaving = false;
            this.alertService.showHttpError(error.response);
          });
      } else {
        this.addressService()
          .create(this.address)
          .then(param => {
            this.isSaving = false;
            this.previousState();
            this.alertService.showSuccess(this.t$('project1OnlineShoppingWebsiteApp.address.created', { param: param.id }).toString());
          })
          .catch(error => {
            this.isSaving = false;
            this.alertService.showHttpError(error.response);
          });
      }
    },
  },
});
