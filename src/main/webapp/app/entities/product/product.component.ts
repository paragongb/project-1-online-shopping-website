import { type Ref, computed, defineComponent, inject, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import type AccountService from '@/account/account.service';
import { useAlertService } from '@/shared/alert/alert.service';
import useDataUtils from '@/shared/data/data-utils.service';
import { Authority } from '@/shared/jhipster/constants';
import { type IProduct } from '@/shared/model/product.model';
import { useCartStore } from '@/store';

import ProductService from './product.service';

export default defineComponent({
  name: 'Product',
  setup() {
    const { t: t$ } = useI18n();
    const dataUtils = useDataUtils();
    const productService = inject('productService', () => new ProductService());
    const alertService = inject('alertService', () => useAlertService(), true);
    const accountService = inject<AccountService>('accountService');
    const cartStore = useCartStore();

    const itemsPerPage = ref(20);
    const queryCount: Ref<number> = ref(null);
    const page: Ref<number> = ref(1);
    const propOrder = ref('id');
    const reverse = ref(false);
    const totalItems = ref(0);

    const products: Ref<IProduct[]> = ref([]);

    const isFetching = ref(false);
    const isAdmin = ref(false);
    const searchQuery = ref('');
    const selectedProduct: Ref<IProduct> = ref(null);
    const showProductDetails = ref(false);

    const openProductDetails = (product: IProduct) => {
      selectedProduct.value = product;
      showProductDetails.value = true;
    };
    const closeProductDetails = () => {
      showProductDetails.value = false;
    };

    const addingToCartId: Ref<number> = ref(null);
    const addToCart = async (product: IProduct) => {
      addingToCartId.value = product.id;
      try {
        await cartStore.addToCart(product.id, 1);
        alertService.showInfo(t$('project1OnlineShoppingWebsiteApp.product.shop.addedToCart', { name: product.name }).toString());
      } catch (err) {
        alertService.showHttpError(err.response);
      } finally {
        addingToCartId.value = null;
      }
    };

    const filteredProducts = computed(() => {
      const query = searchQuery.value.trim().toLowerCase();
      if (!query) {
        return products.value;
      }
      return products.value.filter(product => {
        return (
          product.name?.toLowerCase().includes(query) ||
          product.sku?.toLowerCase().includes(query) ||
          product.category?.name?.toLowerCase().includes(query)
        );
      });
    });

    const statusVariant = (status: string): string => {
      switch (status) {
        case 'IN_STOCK':
          return 'success';
        case 'PRE_ORDER':
          return 'info';
        case 'OUT_OF_STOCK':
        default:
          return 'secondary';
      }
    };

    const sortSelection = computed({
      get: () => `${propOrder.value},${reverse.value ? 'desc' : 'asc'}`,
      set: (value: string) => {
        const [field, direction] = value.split(',');
        propOrder.value = field;
        reverse.value = direction === 'desc';
      },
    });

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

    const retrieveProducts = async () => {
      isFetching.value = true;
      try {
        const paginationQuery = {
          page: page.value - 1,
          size: itemsPerPage.value,
          sort: sort(),
        };
        const res = await productService().retrieve(paginationQuery);
        totalItems.value = Number(res.headers['x-total-count']);
        queryCount.value = totalItems.value;
        products.value = res.data;
      } catch (err) {
        alertService.showHttpError(err.response);
      } finally {
        isFetching.value = false;
      }
    };

    const handleSyncList = () => {
      retrieveProducts();
    };

    onMounted(async () => {
      await retrieveProducts();
      isAdmin.value = (await accountService?.hasAnyAuthorityAndCheckAuth(Authority.ADMIN)) ?? false;
    });

    const removeId: Ref<number> = ref(null);
    const removeEntity = ref<any>(null);
    const prepareRemove = (instance: IProduct) => {
      removeId.value = instance.id;
      removeEntity.value.show();
    };
    const closeDialog = () => {
      removeEntity.value.hide();
    };
    const removeProduct = async () => {
      try {
        await productService().delete(removeId.value);
        const message = t$('project1OnlineShoppingWebsiteApp.product.deleted', { param: removeId.value }).toString();
        alertService.showInfo(message, { variant: 'danger' });
        removeId.value = null;
        retrieveProducts();
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
        await retrieveProducts();
      } else {
        // reset the pagination
        clear();
      }
    });

    // Whenever page changes, switch to the new page.
    watch(page, async () => {
      await retrieveProducts();
    });

    return {
      products,
      handleSyncList,
      isFetching,
      retrieveProducts,
      clear,
      removeId,
      removeEntity,
      prepareRemove,
      closeDialog,
      removeProduct,
      itemsPerPage,
      queryCount,
      page,
      propOrder,
      reverse,
      totalItems,
      changeOrder,
      t$,
      isAdmin,
      searchQuery,
      filteredProducts,
      statusVariant,
      sortSelection,
      selectedProduct,
      showProductDetails,
      openProductDetails,
      closeProductDetails,
      addingToCartId,
      addToCart,
      ...dataUtils,
    };
  },
});
