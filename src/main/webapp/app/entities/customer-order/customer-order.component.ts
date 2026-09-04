import { type Ref, defineComponent, inject, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import axios from 'axios';

import { useAlertService } from '@/shared/alert/alert.service';
import { useDateFormat } from '@/shared/composables';
import { type ICustomerOrder } from '@/shared/model/customer-order.model';

import CustomerOrderService from './customer-order.service';

export interface IOrderItemRow {
  id?: number;
  quantity?: number;
  priceAtPurchase?: number;
  product?: { id?: number; name?: string; image?: string | null; imageContentType?: string | null };
}

export default defineComponent({
  name: 'CustomerOrder',
  setup() {
    const { t: t$ } = useI18n();
    const dateFormat = useDateFormat();
    const customerOrderService = inject('customerOrderService', () => new CustomerOrderService());
    const alertService = inject('alertService', () => useAlertService(), true);

    const itemsPerPage = ref(20);
    const queryCount: Ref<number> = ref(null);
    const page: Ref<number> = ref(1);
    const propOrder = ref('id');
    const reverse = ref(false);
    const totalItems = ref(0);

    const customerOrders: Ref<ICustomerOrder[]> = ref([]);

    const isFetching = ref(false);

    const expandedOrderId: Ref<number> = ref(null);
    const isLoadingItems = ref(false);
    const orderItemsByOrderId = ref<Record<number, IOrderItemRow[]>>({});
    const isMarkingDelivered = ref(false);

    const clear = () => {
      page.value = 1;
    };

    const sort = (): Array<any> => {
      const result = [`${propOrder.value},${reverse.value ? 'desc' : 'asc'}`];
      if (propOrder.value !== 'id') {
        result.push('id');
      }
      return result;
    };

    const retrieveCustomerOrders = async () => {
      isFetching.value = true;
      try {
        const paginationQuery = {
          page: page.value - 1,
          size: itemsPerPage.value,
          sort: sort(),
        };
        const res = await customerOrderService().retrieve(paginationQuery);
        totalItems.value = Number(res.headers['x-total-count']);
        queryCount.value = totalItems.value;
        customerOrders.value = res.data;
      } catch (err) {
        alertService.showHttpError(err.response);
      } finally {
        isFetching.value = false;
      }
    };

    const handleSyncList = () => {
      retrieveCustomerOrders();
    };

    const toggleOrderItems = async (customerOrder: ICustomerOrder) => {
      if (expandedOrderId.value === customerOrder.id) {
        expandedOrderId.value = null;
        return;
      }
      expandedOrderId.value = customerOrder.id;
      if (orderItemsByOrderId.value[customerOrder.id]) {
        return;
      }
      isLoadingItems.value = true;
      try {
        const res = await axios.get<IOrderItemRow[]>(`api/orders/${customerOrder.id}/items`);
        orderItemsByOrderId.value = { ...orderItemsByOrderId.value, [customerOrder.id]: res.data };
      } catch (err) {
        alertService.showHttpError(err.response);
      } finally {
        isLoadingItems.value = false;
      }
    };

    onMounted(async () => {
      await retrieveCustomerOrders();
    });

    const markDelivered = async (customerOrder: ICustomerOrder) => {
      isMarkingDelivered.value = true;
      try {
        const updated = await customerOrderService().partialUpdate({ id: customerOrder.id, status: 'DELIVERED' });
        const target = customerOrders.value.find(order => order.id === customerOrder.id);
        if (target) {
          target.status = updated.status;
        }
        const message = t$('project1OnlineShoppingWebsiteApp.customerOrder.deliveredSuccess', { param: customerOrder.id }).toString();
        alertService.showInfo(message, { variant: 'success' });
      } catch (error) {
        alertService.showHttpError(error.response);
      } finally {
        isMarkingDelivered.value = false;
      }
    };

    const removeId: Ref<number> = ref(null);
    const removeEntity = ref<any>(null);
    const prepareRemove = (instance: ICustomerOrder) => {
      removeId.value = instance.id;
      removeEntity.value.show();
    };
    const closeDialog = () => {
      removeEntity.value.hide();
    };
    const removeCustomerOrder = async () => {
      try {
        await customerOrderService().delete(removeId.value);
        const message = t$('project1OnlineShoppingWebsiteApp.customerOrder.deleted', { param: removeId.value }).toString();
        alertService.showInfo(message, { variant: 'danger' });
        removeId.value = null;
        retrieveCustomerOrders();
        closeDialog();
      } catch (error) {
        alertService.showHttpError(error.response);
      }
    };

    const changeOrder = (newOrder: string) => {
      if (propOrder.value === newOrder) {
        reverse.value = !reverse.value;
      } else {
        reverse.value = false;
      }
      propOrder.value = newOrder;
    };

    // Whenever order changes, reset the pagination
    watch([propOrder, reverse], async () => {
      if (page.value === 1) {
        // first page, retrieve new data
        await retrieveCustomerOrders();
      } else {
        // reset the pagination
        clear();
      }
    });

    // Whenever page changes, switch to the new page.
    watch(page, async () => {
      await retrieveCustomerOrders();
    });

    return {
      customerOrders,
      handleSyncList,
      isFetching,
      retrieveCustomerOrders,
      clear,
      ...dateFormat,
      removeId,
      removeEntity,
      prepareRemove,
      closeDialog,
      removeCustomerOrder,
      itemsPerPage,
      queryCount,
      page,
      propOrder,
      reverse,
      totalItems,
      changeOrder,
      expandedOrderId,
      isLoadingItems,
      orderItemsByOrderId,
      toggleOrderItems,
      isMarkingDelivered,
      markDelivered,
      t$,
    };
  },
});
