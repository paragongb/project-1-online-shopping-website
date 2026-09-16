import { type Ref, computed, defineComponent, inject, onMounted, onUnmounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import type AccountService from '@/account/account.service';
import { useAlertService } from '@/shared/alert/alert.service';
import useDataUtils from '@/shared/data/data-utils.service';
import { Authority } from '@/shared/jhipster/constants';
import { type IProduct } from '@/shared/model/product.model';
import { type ICategory } from '@/shared/model/category.model';
import { useCartStore, useWishlistStore } from '@/store';
import CategoryService from '@/entities/category/category.service';

import ProductService from './product.service';

export default defineComponent({
  name: 'Product',
  setup() {
    const { t: t$ } = useI18n();
    const dataUtils = useDataUtils();
    const productService = inject('productService', () => new ProductService());
    const categoryService = inject('categoryService', () => new CategoryService());
    const alertService = inject('alertService', () => useAlertService(), true);
    const accountService = inject<AccountService>('accountService');
    const cartStore = useCartStore();
    const wishlistStore = useWishlistStore();

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
    const selectedCategoryId = ref('');
    const availability = ref('all');
    const categories: Ref<ICategory[]> = ref([]);
    const cartConfirmation: Ref<IProduct> = ref(null);
    let cartConfirmationTimer: ReturnType<typeof setTimeout>;
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
    const updatingWishlistId: Ref<number> = ref(null);
    const addToCart = async (product: IProduct) => {
      addingToCartId.value = product.id;
      try {
        await cartStore.addToCart(product.id, 1);
        cartConfirmation.value = product;
        clearTimeout(cartConfirmationTimer);
        cartConfirmationTimer = setTimeout(() => (cartConfirmation.value = null), 5000);
        alertService.showInfo(t$('project1OnlineShoppingWebsiteApp.product.shop.addedToCart', { name: product.name }).toString());
      } catch (err) {
        alertService.showHttpError(err.response);
      } finally {
        addingToCartId.value = null;
      }
    };

    const toggleWishlist = async (product: IProduct) => {
      updatingWishlistId.value = product.id;
      const isSaved = wishlistStore.hasProduct(product.id);
      try {
        if (isSaved) {
          await wishlistStore.removeProduct(product.id);
        } else {
          await wishlistStore.addProduct(product.id);
        }
        const messageKey = isSaved
          ? 'project1OnlineShoppingWebsiteApp.product.shop.removedFromWishlist'
          : 'project1OnlineShoppingWebsiteApp.product.shop.addedToWishlist';
        alertService.showInfo(t$(messageKey, { name: product.name }).toString());
      } catch (err: any) {
        alertService.showHttpError(err.response);
      } finally {
        updatingWishlistId.value = null;
      }
    };

    const filteredProducts = computed(() => products.value);
    const activeFilterCount = computed(
      () => Number(Boolean(searchQuery.value.trim())) + Number(Boolean(selectedCategoryId.value)) + Number(availability.value !== 'all'),
    );
    const clearShopFilters = () => {
      searchQuery.value = '';
      selectedCategoryId.value = '';
      availability.value = 'all';
    };

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

    const adminProductSummary = computed(() => ({
      inStock: products.value.filter(product => product.status === 'IN_STOCK').length,
      needsAttention: products.value.filter(product => product.status === 'OUT_OF_STOCK' || Number(product.stockQuantity ?? 0) <= 5).length,
      unitsShown: products.value.reduce((total, product) => total + Number(product.stockQuantity ?? 0), 0),
    }));

    const formatCurrency = (price: number | undefined): string =>
      new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(Number(price ?? 0));

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
          ...(!isAdmin.value && searchQuery.value.trim() ? { 'name.contains': searchQuery.value.trim() } : {}),
          ...(!isAdmin.value && selectedCategoryId.value ? { 'categoryId.equals': selectedCategoryId.value } : {}),
          ...(!isAdmin.value && availability.value !== 'all' ? { 'status.equals': availability.value } : {}),
        };
        const res = await productService().retrieve(paginationQuery);
        totalItems.value = Number(res.headers['x-total-count'] ?? 0);
        queryCount.value = totalItems.value;
        products.value = res.data ?? [];
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
      if (!isAdmin.value) {
        try {
          categories.value = (await categoryService().retrieve()).data ?? [];
        } catch {
          // Products remain usable when categories cannot be loaded.
        }
      }
    });

    const removeId: Ref<number> = ref(null);
    const productToRemove: Ref<IProduct> = ref(null);
    const removeEntity = ref<any>(null);
    const prepareRemove = (instance: IProduct) => {
      removeId.value = instance.id;
      productToRemove.value = instance;
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
    let searchTimer: ReturnType<typeof setTimeout>;
    watch([searchQuery, selectedCategoryId, availability], () => {
      if (isAdmin.value) return;
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        if (page.value === 1) retrieveProducts();
        else page.value = 1;
      }, 200);
    });
    onUnmounted(() => {
      clearTimeout(searchTimer);
      clearTimeout(cartConfirmationTimer);
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
      selectedCategoryId,
      availability,
      categories,
      activeFilterCount,
      clearShopFilters,
      cartConfirmation,
      productToRemove,
      filteredProducts,
      statusVariant,
      adminProductSummary,
      formatCurrency,
      sortSelection,
      selectedProduct,
      showProductDetails,
      openProductDetails,
      closeProductDetails,
      addingToCartId,
      addToCart,
      wishlistStore,
      updatingWishlistId,
      toggleWishlist,
      ...dataUtils,
    };
  },
});
