import { type Ref, defineComponent, inject, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import axios from 'axios';

import type AccountService from '@/account/account.service';
import { useAlertService } from '@/shared/alert/alert.service';
import { useDateFormat } from '@/shared/composables';
import { Authority } from '@/shared/jhipster/constants';
import { type IOrderItem } from '@/shared/model/order-item.model';

import OrderItemService from './order-item.service';

export interface IOrderItemView {
  id?: number;
  quantity?: number;
  priceAtPurchase?: number;
  product?: { id?: number; name?: string; price?: number; image?: string | null; imageContentType?: string | null };
}

export interface IOrderSummaryView {
  id?: number;
  placedDate?: string;
  status?: string;
  totalAmount?: number;
  items?: IOrderItemView[];
}

export default defineComponent({
  name: 'OrderItem',
  setup() {
    const { t: t$ } = useI18n();
    const dateFormat = useDateFormat();
    const orderItemService = inject('orderItemService', () => new OrderItemService());
    const alertService = inject('alertService', () => useAlertService(), true);
    const accountService = inject<AccountService>('accountService');

    const orderItems: Ref<IOrderItem[]> = ref([]);
    const myOrders: Ref<IOrderSummaryView[]> = ref([]);

    const isFetching = ref(false);
    const isAdmin = ref(false);

    const clear = () => {};

    const retrieveOrderItems = async () => {
      isFetching.value = true;
      try {
        const res = await orderItemService().retrieve();
        orderItems.value = res.data;
      } catch (err) {
        alertService.showHttpError(err.response);
      } finally {
        isFetching.value = false;
      }
    };

    const retrieveMyOrders = async () => {
      isFetching.value = true;
      try {
        const res = await axios.get<IOrderSummaryView[]>('api/orders/my-orders');
        myOrders.value = res.data;
      } catch (err) {
        alertService.showHttpError(err.response);
      } finally {
        isFetching.value = false;
      }
    };

    const handleSyncList = () => {
      retrieveOrderItems();
    };

    onMounted(async () => {
      isAdmin.value = (await accountService?.hasAnyAuthorityAndCheckAuth(Authority.ADMIN)) ?? false;
      if (isAdmin.value) {
        await retrieveOrderItems();
      } else {
        await retrieveMyOrders();
      }
    });

    const removeId: Ref<number> = ref(null);
    const removeEntity = ref<any>(null);
    const prepareRemove = (instance: IOrderItem) => {
      removeId.value = instance.id;
      removeEntity.value.show();
    };
    const closeDialog = () => {
      removeEntity.value.hide();
    };
    const removeOrderItem = async () => {
      try {
        await orderItemService().delete(removeId.value);
        const message = t$('project1OnlineShoppingWebsiteApp.orderItem.deleted', { param: removeId.value }).toString();
        alertService.showInfo(message, { variant: 'danger' });
        removeId.value = null;
        retrieveOrderItems();
        closeDialog();
      } catch (error) {
        alertService.showHttpError(error.response);
      }
    };

    return {
      orderItems,
      myOrders,
      handleSyncList,
      isFetching,
      isAdmin,
      retrieveOrderItems,
      clear,
      ...dateFormat,
      removeId,
      removeEntity,
      prepareRemove,
      closeDialog,
      removeOrderItem,
      t$,
    };
  },
});
