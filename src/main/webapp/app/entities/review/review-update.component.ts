import { type Ref, computed, defineComponent, inject, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

import { useVuelidate } from '@vuelidate/core';

import ProductService from '@/entities/product/product.service';
import UserService from '@/entities/user/user.service';
import { useAlertService } from '@/shared/alert/alert.service';
import { useDateFormat, useValidation } from '@/shared/composables';
import useDataUtils from '@/shared/data/data-utils.service';
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
    const userService = inject('userService', () => new UserService());
    const users: Ref<Array<any>> = ref([]);
    const isSaving = ref(false);
    const currentLanguage = inject('currentLanguage', () => computed(() => navigator.language ?? 'en'), true);

    const route = useRoute();
    const router = useRouter();

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

    if (route.params?.reviewId) {
      retrieveReview(route.params.reviewId);
    }

    const initRelationships = () => {
      productService()
        .retrieve()
        .then(res => {
          products.value = res.data;
        });
      userService()
        .retrieve()
        .then(res => {
          users.value = res.data;
        });
    };

    initRelationships();

    const dataUtils = useDataUtils();

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
      reviewDate: {
        required: validations.required(t$('entity.validation.required').toString()),
      },
      product: {},
      user: {},
    };
    const v$ = useVuelidate(validationRules, review as any);
    v$.value.$validate();

    return {
      reviewService,
      alertService,
      review,
      previousState,
      isSaving,
      currentLanguage,
      products,
      users,
      ...dataUtils,
      v$,
      ...useDateFormat({ entityRef: review }),
      t$,
    };
  },
  created(): void {},
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
