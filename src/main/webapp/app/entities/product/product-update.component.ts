import { type Ref, computed, defineComponent, inject, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

import { useVuelidate } from '@vuelidate/core';

import CategoryService from '@/entities/category/category.service';
import WishlistService from '@/entities/wishlist/wishlist.service';
import { useAlertService } from '@/shared/alert/alert.service';
import { useValidation } from '@/shared/composables';
import useDataUtils from '@/shared/data/data-utils.service';
import { type ICategory } from '@/shared/model/category.model';
import { ProductStatus } from '@/shared/model/enumerations/product-status.model';
import { type IProduct, Product } from '@/shared/model/product.model';
import { type IWishlist } from '@/shared/model/wishlist.model';

import ProductService from './product.service';

export default defineComponent({
  name: 'ProductUpdate',
  setup() {
    const productService = inject('productService', () => new ProductService());
    const alertService = inject('alertService', () => useAlertService(), true);

    const product: Ref<IProduct> = ref(new Product());

    const categoryService = inject('categoryService', () => new CategoryService());

    const categories: Ref<ICategory[]> = ref([]);

    const wishlistService = inject('wishlistService', () => new WishlistService());

    const wishlists: Ref<IWishlist[]> = ref([]);
    const productStatusValues: Ref<string[]> = ref(Object.keys(ProductStatus));
    const isSaving = ref(false);
    const currentLanguage = inject('currentLanguage', () => computed(() => navigator.language ?? 'en'), true);

    const route = useRoute();
    const router = useRouter();

    const previousState = () => router.go(-1);

    const retrieveProduct = async productId => {
      try {
        const res = await productService().find(productId);
        product.value = res;
      } catch (error) {
        alertService.showHttpError(error.response);
      }
    };

    if (route.params?.productId) {
      retrieveProduct(route.params.productId);
    }

    const initRelationships = () => {
      categoryService()
        .retrieve()
        .then(res => {
          categories.value = res.data;
        });
      wishlistService()
        .retrieve()
        .then(res => {
          wishlists.value = res.data;
        });
    };

    initRelationships();

    const dataUtils = useDataUtils();

    const { t: t$ } = useI18n();
    const validations = useValidation();
    const validationRules = {
      sku: {
        required: validations.required(t$('entity.validation.required').toString()),
        minLength: validations.minLength(t$('entity.validation.minlength', { min: 3 }).toString(), 3),
      },
      name: {
        required: validations.required(t$('entity.validation.required').toString()),
        maxLength: validations.maxLength(t$('entity.validation.maxlength', { max: 255 }).toString(), 255),
      },
      description: {
        required: validations.required(t$('entity.validation.required').toString()),
      },
      price: {
        required: validations.required(t$('entity.validation.required').toString()),
        min: validations.minValue(t$('entity.validation.min', { min: 0 }).toString(), 0),
      },
      stockQuantity: {
        required: validations.required(t$('entity.validation.required').toString()),
        integer: validations.integer(t$('entity.validation.number').toString()),
        min: validations.minValue(t$('entity.validation.min', { min: 0 }).toString(), 0),
      },
      status: {
        required: validations.required(t$('entity.validation.required').toString()),
      },
      image: {},
      category: {},
      wishlists: {},
    };
    const v$ = useVuelidate(validationRules, product as any);
    v$.value.$validate();

    return {
      productService,
      alertService,
      product,
      previousState,
      productStatusValues,
      isSaving,
      currentLanguage,
      categories,
      wishlists,
      ...dataUtils,
      v$,
      t$,
    };
  },
  created(): void {
    this.product.wishlists = [];
  },
  methods: {
    save(): void {
      this.isSaving = true;
      if (this.product.id) {
        this.productService()
          .update(this.product)
          .then(param => {
            this.isSaving = false;
            this.previousState();
            this.alertService.showInfo(this.t$('project1OnlineShoppingWebsiteApp.product.updated', { param: param.id }));
          })
          .catch(error => {
            this.isSaving = false;
            this.alertService.showHttpError(error.response);
          });
      } else {
        this.productService()
          .create(this.product)
          .then(param => {
            this.isSaving = false;
            this.previousState();
            this.alertService.showSuccess(this.t$('project1OnlineShoppingWebsiteApp.product.created', { param: param.id }).toString());
          })
          .catch(error => {
            this.isSaving = false;
            this.alertService.showHttpError(error.response);
          });
      }
    },

    clearInputImage(field, fieldContentType, idInput): void {
      if (this.product && field && fieldContentType) {
        if (Object.hasOwn(this.product, field)) {
          this.product[field] = null;
        }
        if (Object.hasOwn(this.product, fieldContentType)) {
          this.product[fieldContentType] = null;
        }
        if (idInput) {
          (<any>this).$refs[idInput] = null;
        }
      }
    },

    getSelected(selectedVals, option, pkField = 'id'): any {
      if (selectedVals) {
        return selectedVals.find(value => option[pkField] === value[pkField]) ?? option;
      }
      return option;
    },
  },
});
