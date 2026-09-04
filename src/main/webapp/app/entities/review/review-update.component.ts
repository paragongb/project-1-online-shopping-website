import { type Ref, computed, defineComponent, inject, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

import { useVuelidate } from '@vuelidate/core';

import ProductService from '@/entities/product/product.service';
import { useAlertService } from '@/shared/alert/alert.service';
import { useValidation } from '@/shared/composables';
import { useStore } from '@/store';
import { type IProduct } from '@/shared/model/product.model';
import { type IReview, Review } from '@/shared/model/review.model';

import ReviewService from './review.service';

export default defineComponent({
  name: 'ReviewUpdate',
  setup() {
    const reviewService = inject('reviewService', () => new ReviewService());
    const alertService = inject('alertService', () => useAlertService(), true);

    const review: Ref<IReview> = ref(new Review());

    const productService = inject('productService', () => new ProductService());

    const products: Ref<IProduct[]> = ref([]);
    const isSaving = ref(false);
    const isLoading = ref(true);
    const alreadyReviewed = ref(false);

    const route = useRoute();
    const router = useRouter();
    const store = useStore();

    const isEditing = computed(() => !!route.params?.reviewId);

    const previousState = () => router.go(-1);

    const retrieveReview = async reviewId => {
      try {
        const res = await reviewService().find(reviewId);
        res.reviewDate = new Date(res.reviewDate);
        review.value = res;
      } catch (error) {
        alertService.showHttpError(error.response);
      }
    };

    const initRelationships = async () => {
      try {
        const [productsRes, reviewsRes] = await Promise.all([productService().retrieve(), reviewService().retrieve()]);
        products.value = productsRes.data;

        if (isEditing.value) {
          await retrieveReview(route.params.reviewId);
        } else {
          // New reviews are always attributed to the logged-in user, right now.
          review.value.user = { id: store.account?.id, login: store.account?.login };
          review.value.reviewDate = new Date();

          const queryProductId = route.query?.productId ? Number(route.query.productId) : null;
          if (queryProductId) {
            const preselected = products.value.find(product => product.id === queryProductId);
            if (preselected) {
              review.value.product = preselected;
            }
            const existingReviews: IReview[] = reviewsRes.data ?? [];
            alreadyReviewed.value = existingReviews.some(
              existing => existing.product?.id === queryProductId && existing.user?.id === store.account?.id,
            );
          }
        }
      } catch (error) {
        alertService.showHttpError(error.response);
      } finally {
        isLoading.value = false;
      }
    };

    initRelationships();

    const { t: t$ } = useI18n();
    const validations = useValidation();
    const validationRules = {
      rating: {
        required: validations.required(t$('entity.validation.required').toString()),
        integer: validations.integer(t$('entity.validation.number').toString()),
        min: validations.minValue(t$('entity.validation.min', { min: 1 }).toString(), 1),
        max: validations.maxValue(t$('entity.validation.max', { max: 5 }).toString(), 5),
      },
      comment: {},
      product: {},
    };
    const v$ = useVuelidate(validationRules, review as any);
    v$.value.$validate();

    const setRating = (value: number) => {
      v$.value.rating.$model = value;
    };

    return {
      reviewService,
      alertService,
      review,
      previousState,
      isSaving,
      isLoading,
      isEditing,
      alreadyReviewed,
      products,
      v$,
      setRating,
      t$,
    };
  },
  methods: {
    save(): void {
      this.isSaving = true;
      if (this.review.id) {
        this.reviewService()
          .update(this.review)
          .then(param => {
            this.isSaving = false;
            this.previousState();
            this.alertService.showInfo(this.t$('project1OnlineShoppingWebsiteApp.review.updated', { param: param.id }));
          })
          .catch(error => {
            this.isSaving = false;
            this.alertService.showHttpError(error.response);
          });
      } else {
        this.reviewService()
          .create(this.review)
          .then(param => {
            this.isSaving = false;
            this.previousState();
            this.alertService.showSuccess(this.t$('project1OnlineShoppingWebsiteApp.review.created', { param: param.id }).toString());
          })
          .catch(error => {
            this.isSaving = false;
            this.alertService.showHttpError(error.response);
          });
      }
    },
  },
});
