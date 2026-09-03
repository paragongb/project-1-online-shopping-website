import { type Ref, computed, defineComponent, inject, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

import { useVuelidate } from '@vuelidate/core';

import AddressService from '@/entities/address/address.service';
import UserService from '@/entities/user/user.service';
import { useAlertService } from '@/shared/alert/alert.service';
import { useDateFormat, useValidation } from '@/shared/composables';
import { type IAddress } from '@/shared/model/address.model';
import { CustomerOrder, type ICustomerOrder } from '@/shared/model/customer-order.model';
import { OrderStatus } from '@/shared/model/enumerations/order-status.model';

import CustomerOrderService from './customer-order.service';

export default defineComponent({
  name: 'CustomerOrderUpdate',
  setup() {
    const customerOrderService = inject('customerOrderService', () => new CustomerOrderService());
    const alertService = inject('alertService', () => useAlertService(), true);

    const customerOrder: Ref<ICustomerOrder> = ref(new CustomerOrder());

    const addressService = inject('addressService', () => new AddressService());

    const addresses: Ref<IAddress[]> = ref([]);
    const userService = inject('userService', () => new UserService());
    const users: Ref<Array<any>> = ref([]);
    const orderStatusValues: Ref<string[]> = ref(Object.keys(OrderStatus));
    const isSaving = ref(false);
    const currentLanguage = inject('currentLanguage', () => computed(() => navigator.language ?? 'en'), true);

    const route = useRoute();
    const router = useRouter();

    const previousState = () => router.go(-1);

    const retrieveCustomerOrder = async customerOrderId => {
      try {
        const res = await customerOrderService().find(customerOrderId);
        res.placedDate = new Date(res.placedDate);
        customerOrder.value = res;
      } catch (error) {
        alertService.showHttpError(error.response);
      }
    };

    if (route.params?.customerOrderId) {
      retrieveCustomerOrder(route.params.customerOrderId);
    }

    const initRelationships = () => {
      addressService()
        .retrieve()
        .then(res => {
          addresses.value = res.data;
        });
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
      placedDate: {
        required: validations.required(t$('entity.validation.required').toString()),
      },
      status: {
        required: validations.required(t$('entity.validation.required').toString()),
      },
      totalAmount: {
        required: validations.required(t$('entity.validation.required').toString()),
        min: validations.minValue(t$('entity.validation.min', { min: 0 }).toString(), 0),
      },
      shippingAddress: {},
      billingAddress: {},
      orderItems: {},
      user: {},
    };
    const v$ = useVuelidate(validationRules, customerOrder as any);
    v$.value.$validate();

    return {
      customerOrderService,
      alertService,
      customerOrder,
      previousState,
      orderStatusValues,
      isSaving,
      currentLanguage,
      addresses,
      users,
      v$,
      ...useDateFormat({ entityRef: customerOrder }),
      t$,
    };
  },
  created(): void {},
  methods: {
    save(): void {
      this.isSaving = true;
      if (this.customerOrder.id) {
        this.customerOrderService()
          .update(this.customerOrder)
          .then(param => {
            this.isSaving = false;
            this.previousState();
            this.alertService.showInfo(this.t$('project1OnlineShoppingWebsiteApp.customerOrder.updated', { param: param.id }));
          })
          .catch(error => {
            this.isSaving = false;
            this.alertService.showHttpError(error.response);
          });
      } else {
        this.customerOrderService()
          .create(this.customerOrder)
          .then(param => {
            this.isSaving = false;
            this.previousState();
            this.alertService.showSuccess(
              this.t$('project1OnlineShoppingWebsiteApp.customerOrder.created', { param: param.id }).toString(),
            );
          })
          .catch(error => {
            this.isSaving = false;
            this.alertService.showHttpError(error.response);
          });
      }
    },
  },
});
