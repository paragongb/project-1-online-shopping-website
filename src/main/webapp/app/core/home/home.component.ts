import { type ComputedRef, type Ref, defineComponent, inject, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import type AccountService from '@/account/account.service';
import { useLoginModal } from '@/account/login-modal';
import CategoryService from '@/entities/category/category.service';
import ProductService from '@/entities/product/product.service';
import { useAlertService } from '@/shared/alert/alert.service';
import { Authority } from '@/shared/jhipster/constants';
import { type ICategory } from '@/shared/model/category.model';
import { type IProduct } from '@/shared/model/product.model';
import { useCartStore } from '@/store';

export default defineComponent({
  setup() {
    const { showLogin } = useLoginModal();
    const { t: t$ } = useI18n();
    const authenticated = inject<ComputedRef<boolean>>('authenticated');
    const username = inject<ComputedRef<string>>('currentUsername');
    const accountService = inject<AccountService>('accountService');
    const alertService = inject('alertService', () => useAlertService(), true);
    const cartStore = useCartStore();

    const isAdmin = ref(false);
    const featuredProducts: Ref<IProduct[]> = ref([]);
    const categories: Ref<ICategory[]> = ref([]);
    const isLoadingHome = ref(false);
    const addingToCartId: Ref<number> = ref(null);

    const productService = new ProductService();
    const categoryService = new CategoryService();

    onMounted(async () => {
      isAdmin.value = (await accountService?.hasAnyAuthorityAndCheckAuth(Authority.ADMIN)) ?? false;
      if (isAdmin.value) {
        return;
      }
      isLoadingHome.value = true;
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          productService.retrieve({ page: 0, size: 8, sort: ['id,desc'] }),
          categoryService.retrieve(),
        ]);
        featuredProducts.value = productsRes.data;
        categories.value = categoriesRes.data.slice(0, 6);
      } catch {
        // Silently ignore: the landing page still works without featured content.
      } finally {
        isLoadingHome.value = false;
      }
    });

    const addToCart = async (product: IProduct) => {
      if (!authenticated.value) {
        showLogin();
        return;
      }
      addingToCartId.value = product.id;
      try {
        await cartStore.addToCart(product.id, 1);
        alertService.showInfo(t$('home.addedToCart', { name: product.name }).toString());
      } catch (err) {
        alertService.showHttpError(err.response);
      } finally {
        addingToCartId.value = null;
      }
    };

    return {
      authenticated,
      username,
      showLogin,
      isAdmin,
      featuredProducts,
      categories,
      isLoadingHome,
      addingToCartId,
      addToCart,
      t$,
    };
  },
});
