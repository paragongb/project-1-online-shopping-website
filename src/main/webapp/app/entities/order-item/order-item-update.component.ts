import { type Ref, computed, defineComponent, inject, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

import { useVuelidate } from '@vuelidate/core';

import CustomerOrderService from '@/entities/customer-order/customer-order.service';
import ProductService from '@/entities/product/product.service';
import { useAlertService } from '@/shared/alert/alert.service';
import { useValidation } from '@/shared/composables';
import { type ICustomerOrder } from '@/shared/model/customer-order.model';
import { type IOrderItem, OrderItem } from '@/shared/model/order-item.model';
import { type IProduct } from '@/shared/model/product.model';

import OrderItemService from './order-item.service';

export default defineComponent({
  name: 'OrderItemUpdate',
  setup() {
    const orderItemService = inject('orderItemService', () => new OrderItemService());
    const alertService = inject('alertService', () => useAlertService(), true);

    const orderItem: Ref<IOrderItem> = ref(new OrderItem());

    const productService = inject('productService', () => new ProductService());

    const products: Ref<IProduct[]> = ref([]);

    const customerOrderService = inject('customerOrderService', () => new CustomerOrderService());

    const customerOrders: Ref<ICustomerOrder[]> = ref([]);
    const isSaving = ref(false);
    const currentLanguage = inject('currentLanguage', () => computed(() => navigator.language ?? 'en'), true);

    const route = useRoute();
    const router = useRouter();

    const previousState = () => router.go(-1);

    const retrieveOrderItem = async orderItemId => {
      try {
        const res = await orderItemService().find(orderItemId);
        orderItem.value = res;
      } catch (error) {
        alertService.showHttpError(error.response);
      }
    };

    if (route.params?.orderItemId) {
      retrieveOrderItem(route.params.orderItemId);
    }

    const initRelationships = () => {
      productService()
        .retrieve()
        .then(res => {
          products.value = res.data;
        });
      customerOrderService()
        .retrieve()
        .then(res => {
          customerOrders.value = res.data;
        });
    };

    initRelationships();

    const { t: t$ } = useI18n();
    const validations = useValidation();
    const validationRules = {
      quantity: {
        required: validations.required(t$('entity.validation.required').toString()),
        integer: validations.integer(t$('entity.validation.number').toString()),
        min: validations.minValue(t$('entity.validation.min', { min: 1 }).toString(), 1),
      },
      priceAtPurchase: {
        required: validations.required(t$('entity.validation.required').toString()),
        min: validations.minValue(t$('entity.validation.min', { min: 0 }).toString(), 0),
      },
      product: {},
      order: {},
    };
    const v$ = useVuelidate(validationRules, orderItem as any);
    v$.value.$validate();

    return {
      orderItemService,
      alertService,
      orderItem,
      previousState,
      isSaving,
      currentLanguage,
      products,
      customerOrders,
      v$,
      t$,
    };
  },
  created(): void {},
  methods: {
    save(): void {
      this.isSaving = true;
      if (this.orderItem.id) {
        this.orderItemService()
          .update(this.orderItem)
          .then(param => {
            this.isSaving = false;
            this.previousState();
            this.alertService.showInfo(this.t$('project1OnlineShoppingWebsiteApp.orderItem.updated', { param: param.id }));
          })
          .catch(error => {
            this.isSaving = false;
            this.alertService.showHttpError(error.response);
          });
      } else {
        this.orderItemService()
          .create(this.orderItem)
          .then(param => {
            this.isSaving = false;
            this.previousState();
            this.alertService.showSuccess(this.t$('project1OnlineShoppingWebsiteApp.orderItem.created', { param: param.id }).toString());
          })
          .catch(error => {
            this.isSaving = false;
            this.alertService.showHttpError(error.response);
          });
      }
    },
  },
});
