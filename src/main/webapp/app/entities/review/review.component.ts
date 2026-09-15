import { type Ref, computed, defineComponent, inject, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import axios from 'axios';

import type AccountService from '@/account/account.service';
import ProductService from '@/entities/product/product.service';
import { useAlertService } from '@/shared/alert/alert.service';
import { useDateFormat } from '@/shared/composables';
import useDataUtils from '@/shared/data/data-utils.service';
import { Authority } from '@/shared/jhipster/constants';
import { type IReview } from '@/shared/model/review.model';
import { type IProduct } from '@/shared/model/product.model';

import ReviewService from './review.service';

export default defineComponent({
  name: 'Review',
  setup() {
    const { t: t$ } = useI18n();
    const dateFormat = useDateFormat();
    const dataUtils = useDataUtils();
    const reviewService = inject('reviewService', () => new ReviewService());
    const alertService = inject('alertService', () => useAlertService(), true);
    const accountService = inject<AccountService>('accountService');
    const productService = inject('productService', () => new ProductService());

    const itemsPerPage = ref(20);
    const queryCount: Ref<number> = ref(null);
    const page: Ref<number> = ref(1);
    const propOrder = ref('reviewDate');
    const reverse = ref(true);
    const totalItems = ref(0);

    const reviews: Ref<IReview[]> = ref([]);

    const isFetching = ref(false);
    const isAdmin = ref(false);
    const adminProducts: Ref<IProduct[]> = ref([]);
    const selectedProductId = ref('');
    const reviewedFrom = ref('');
    const reviewedTo = ref('');
    const dateOrder = ref('newest');

    const adminReviewSummary = computed(() => {
      const ratings = reviews.value.map(review => Number(review.rating ?? 0));
      const averageRating = ratings.length ? ratings.reduce((total, rating) => total + rating, 0) / ratings.length : 0;
      return {
        averageRating: averageRating.toFixed(1),
        fiveStarCount: ratings.filter(rating => rating === 5).length,
        productsShown: new Set(reviews.value.map(review => review.product?.id).filter(Boolean)).size,
      };
    });

    const activeFilterCount = computed(
      () => Number(Boolean(selectedProductId.value)) + Number(Boolean(reviewedFrom.value)) + Number(Boolean(reviewedTo.value)),
    );

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

    const retrieveReviews = async () => {
      isFetching.value = true;
      try {
        const paginationQuery = {
          page: page.value - 1,
          size: itemsPerPage.value,
          sort: sort(),
          ...(selectedProductId.value ? { productId: Number(selectedProductId.value) } : {}),
          ...(reviewedFrom.value ? { reviewedFrom: new Date(`${reviewedFrom.value}T00:00:00`).toISOString() } : {}),
          ...(reviewedTo.value ? { reviewedBefore: getFollowingDayIso(reviewedTo.value) } : {}),
        };
        const res = await reviewService().retrieve(paginationQuery);
        totalItems.value = Number(res.headers['x-total-count'] ?? 0);
        queryCount.value = totalItems.value;
        reviews.value = res.data ?? [];
      } catch (err: any) {
        alertService.showHttpError(err.response);
      } finally {
        isFetching.value = false;
      }
    };

    const handleSyncList = () => {
      retrieveReviews();
    };

    const getFollowingDayIso = (date: string): string => {
      const followingDay = new Date(`${date}T00:00:00`);
      followingDay.setDate(followingDay.getDate() + 1);
      return followingDay.toISOString();
    };

    const retrieveAdminProducts = async () => {
      try {
        const res = await productService().retrieve({ page: 0, size: 1000, sort: ['name,asc'] });
        adminProducts.value = res.data ?? [];
      } catch (err: any) {
        alertService.showHttpError(err.response);
      }
    };

    const applyAdminFilters = async () => {
      if (page.value !== 1) {
        page.value = 1;
      } else {
        await retrieveReviews();
      }
    };

    const clearAdminFilters = async () => {
      selectedProductId.value = '';
      reviewedFrom.value = '';
      reviewedTo.value = '';
      await applyAdminFilters();
    };

    const changeDateOrder = () => {
      propOrder.value = 'reviewDate';
      reverse.value = dateOrder.value === 'newest';
    };

    const retrieveMyReviews = async () => {
      isFetching.value = true;
      try {
        const res = await axios.get<IReview[]>('api/reviews/my-reviews');
        reviews.value = res.data;
      } catch (err: any) {
        alertService.showHttpError(err.response);
      } finally {
        isFetching.value = false;
      }
    };

    onMounted(async () => {
      isAdmin.value = (await accountService?.hasAnyAuthorityAndCheckAuth(Authority.ADMIN)) ?? false;
      if (isAdmin.value) {
        await Promise.all([retrieveReviews(), retrieveAdminProducts()]);
      } else {
        await retrieveMyReviews();
      }
    });

    const removeId: Ref<number> = ref(null);
    const removeEntity = ref<any>(null);
    const prepareRemove = (instance: IReview) => {
      removeId.value = instance.id;
      removeEntity.value.show();
    };
    const closeDialog = () => {
      removeEntity.value.hide();
    };
    const removeReview = async () => {
      try {
        await reviewService().delete(removeId.value);
        const message = t$('project1OnlineShoppingWebsiteApp.review.deleted', { param: removeId.value }).toString();
        alertService.showInfo(message, { variant: 'danger' });
        removeId.value = null;
        retrieveReviews();
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
        await retrieveReviews();
      } else {
        // reset the pagination
        clear();
      }
    });

    // Whenever page changes, switch to the new page.
    watch(page, async () => {
      await retrieveReviews();
    });

    return {
      reviews,
      handleSyncList,
      isFetching,
      isAdmin,
      adminProducts,
      selectedProductId,
      reviewedFrom,
      reviewedTo,
      dateOrder,
      adminReviewSummary,
      activeFilterCount,
      applyAdminFilters,
      clearAdminFilters,
      changeDateOrder,
      retrieveReviews,
      clear,
      ...dateFormat,
      removeId,
      removeEntity,
      prepareRemove,
      closeDialog,
      removeReview,
      itemsPerPage,
      queryCount,
      page,
      propOrder,
      reverse,
      totalItems,
      changeOrder,
      t$,
      ...dataUtils,
    };
  },
});
