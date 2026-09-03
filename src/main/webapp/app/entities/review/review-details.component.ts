import { type Ref, defineComponent, inject, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

import { useAlertService } from '@/shared/alert/alert.service';
import { useDateFormat } from '@/shared/composables';
import useDataUtils from '@/shared/data/data-utils.service';
import { type IReview } from '@/shared/model/review.model';

import ReviewService from './review.service';

export default defineComponent({
  name: 'ReviewDetails',
  setup() {
    const dateFormat = useDateFormat();
    const reviewService = inject('reviewService', () => new ReviewService());
    const alertService = inject('alertService', () => useAlertService(), true);

    const dataUtils = useDataUtils();

    const route = useRoute();
    const router = useRouter();

    const previousState = () => router.go(-1);
    const review: Ref<IReview> = ref({});

    const retrieveReview = async reviewId => {
      try {
        const res = await reviewService().find(reviewId);
        review.value = res;
      } catch (error) {
        alertService.showHttpError(error.response);
      }
    };

    if (route.params?.reviewId) {
      retrieveReview(route.params.reviewId);
    }

    return {
      ...dateFormat,
      review,

      ...dataUtils,

      previousState,
      t$: useI18n().t,
    };
  },
});
