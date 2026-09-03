import { type Ref, defineComponent, inject, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { useAlertService } from '@/shared/alert/alert.service';
import { type IOrderItem } from '@/shared/model/order-item.model';

import OrderItemService from './order-item.service';

export default defineComponent({
  name: 'OrderItem',
  setup() {
    const { t: t$ } = useI18n();
    const orderItemService = inject('orderItemService', () => new OrderItemService());
    const alertService = inject('alertService', () => useAlertService(), true);

    const orderItems: Ref<IOrderItem[]> = ref([]);

    const isFetching = ref(false);

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

    const handleSyncList = () => {
      retrieveOrderItems();
    };

    onMounted(async () => {
      await retrieveOrderItems();
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
      handleSyncList,
      isFetching,
      retrieveOrderItems,
      clear,
      removeId,
      removeEntity,
      prepareRemove,
      closeDialog,
      removeOrderItem,
      t$,
    };
  },
});
