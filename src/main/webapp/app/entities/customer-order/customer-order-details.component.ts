import { type Ref, defineComponent, inject, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

import { useAlertService } from '@/shared/alert/alert.service';
import { useDateFormat } from '@/shared/composables';
import { type ICustomerOrder } from '@/shared/model/customer-order.model';
import { type IAddress } from '@/shared/model/address.model';

import CustomerOrderService from './customer-order.service';

export default defineComponent({
  name: 'CustomerOrderDetails',
  setup() {
    const dateFormat = useDateFormat();
    const customerOrderService = inject('customerOrderService', () => new CustomerOrderService());
    const alertService = inject('alertService', () => useAlertService(), true);

    const route = useRoute();
    const router = useRouter();

    const previousState = () => router.go(-1);
    const customerOrder: Ref<ICustomerOrder> = ref({});
    const formatAddress = (address?: IAddress | null) =>
      address
        ? [address.addressLine1, address.addressLine2, address.postalCode, address.city, address.state, address.country]
            .filter(Boolean)
            .join(', ')
        : '—';

    const retrieveCustomerOrder = async customerOrderId => {
      try {
        const res = await customerOrderService().find(customerOrderId);
        customerOrder.value = res;
      } catch (error) {
        alertService.showHttpError(error.response);
      }
    };

    if (route.params?.customerOrderId) {
      retrieveCustomerOrder(route.params.customerOrderId);
    }

    return {
      ...dateFormat,
      customerOrder,

      previousState,
      formatAddress,
      t$: useI18n().t,
    };
  },
});
