import { type ComputedRef, type Ref, computed, defineComponent, inject, onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import axios from 'axios';

import type AccountService from '@/account/account.service';
import { useLoginModal } from '@/account/login-modal';
import CategoryService from '@/entities/category/category.service';
import ProductService from '@/entities/product/product.service';
import { useAlertService } from '@/shared/alert/alert.service';
import { Authority } from '@/shared/jhipster/constants';
import { type ICategory } from '@/shared/model/category.model';
import { type ICustomerOrder } from '@/shared/model/customer-order.model';
import { type IProduct } from '@/shared/model/product.model';
import { type IReview } from '@/shared/model/review.model';
import { type IUser } from '@/shared/model/user.model';
import { useCartStore } from '@/store';

interface IDashboardPeriod {
  orders: number;
  revenue: number;
  newUsers: number;
  reviews: number;
}

interface IAdminDashboardStats {
  generatedAt: string;
  overview: {
    users: number;
    products: number;
    categories: number;
    orders: number;
    revenue: number;
    reviews: number;
    averageRating: number;
    cartItems: number;
    wishlists: number;
  };
  today: IDashboardPeriod;
  week: IDashboardPeriod;
  month: IDashboardPeriod;
  catalog: { inStock: number; lowStock: number; outOfStock: number; preOrder: number };
  orderStatuses: { pending: number; paid: number; processing: number; shipped: number; delivered: number; cancelled: number };
}

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
    const dashboard: Ref<IAdminDashboardStats> = ref(null);
    const recentOrders = ref<ICustomerOrder[]>([]);
    const recentReviews = ref<IReview[]>([]);
    const recentUsers = ref<IUser[]>([]);
    const lowStockProducts = ref<IProduct[]>([]);
    const isLoadingDashboard = ref(false);
    const featuredProducts: Ref<IProduct[]> = ref([]);
    const categories: Ref<ICategory[]> = ref([]);
    const isLoadingHome = ref(false);
    const addingToCartId: Ref<number> = ref(null);
    const cartConfirmation: Ref<IProduct> = ref(null);
    let cartConfirmationTimer: ReturnType<typeof setTimeout>;

    const productService = new ProductService();
    const categoryService = new CategoryService();

    const retrieveDashboard = async () => {
      isLoadingDashboard.value = true;
      try {
        const response = await axios.get<IAdminDashboardStats>('api/admin/dashboard');
        dashboard.value = response.data;
        const activity = await Promise.allSettled([
          axios.get('api/customer-orders', { params: { page: 0, size: 4, sort: 'placedDate,desc' } }),
          axios.get('api/reviews', { params: { page: 0, size: 4, sort: 'reviewDate,desc' } }),
          axios.get('api/admin/users', { params: { page: 0, size: 4, sort: 'createdDate,desc' } }),
          axios.get('api/products', { params: { page: 0, size: 5, sort: 'stockQuantity,asc' } }),
        ]);
        if (activity[0].status === 'fulfilled') recentOrders.value = activity[0].value.data ?? [];
        if (activity[1].status === 'fulfilled') recentReviews.value = activity[1].value.data ?? [];
        if (activity[2].status === 'fulfilled') recentUsers.value = activity[2].value.data ?? [];
        if (activity[3].status === 'fulfilled')
          lowStockProducts.value = (activity[3].value.data ?? []).filter(product => Number(product.stockQuantity ?? 0) <= 5);
      } catch (err: any) {
        alertService.showHttpError(err.response);
      } finally {
        isLoadingDashboard.value = false;
      }
    };

    const dashboardPeriods = computed(() => {
      if (!dashboard.value) return [];
      return [
        { key: 'today', label: t$('home.dashboard.activity.today'), data: dashboard.value.today },
        { key: 'week', label: t$('home.dashboard.activity.week'), data: dashboard.value.week },
        { key: 'month', label: t$('home.dashboard.activity.month'), data: dashboard.value.month },
      ];
    });

    const activityChartMax = computed(() =>
      Math.max(1, ...dashboardPeriods.value.flatMap(period => [period.data.orders, period.data.newUsers, period.data.reviews])),
    );
    const revenueChartMax = computed(() => Math.max(1, ...dashboardPeriods.value.map(period => period.data.revenue)));
    const orderStatusTotal = computed(() => {
      if (!dashboard.value) return 0;
      return Object.values(dashboard.value.orderStatuses).reduce((total, value) => total + value, 0);
    });
    const inventoryChartMax = computed(() => {
      if (!dashboard.value) return 1;
      return Math.max(1, ...Object.values(dashboard.value.catalog));
    });
    const activeOrderTotal = computed(() => {
      if (!dashboard.value) return 0;
      const statuses = dashboard.value.orderStatuses;
      return statuses.pending + statuses.paid + statuses.processing + statuses.shipped;
    });
    const inventoryAttentionTotal = computed(() => {
      if (!dashboard.value) return 0;
      return dashboard.value.catalog.lowStock + dashboard.value.catalog.outOfStock;
    });

    const chartPercent = (value: number, maximum: number, minimumVisible = 4) => {
      if (!value || !maximum) return '0%';
      return `${Math.max((value / maximum) * 100, minimumVisible)}%`;
    };
    const formatPercentage = (value: number, total: number) => (total ? `${Math.round((value / total) * 100)}%` : '0%');

    const formatCurrency = (value?: number) =>
      new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(value ?? 0));
    const formatNumber = (value?: number) => new Intl.NumberFormat('en-US').format(Number(value ?? 0));
    const formatGeneratedAt = (value?: string) => (value ? new Date(value).toLocaleString() : '');
    const printDashboard = () => {
      if (dashboard.value) {
        const printModeClass = 'admin-dashboard-print-mode';
        const clearPrintMode = () => document.body.classList.remove(printModeClass);
        document.body.classList.add(printModeClass);
        window.addEventListener('afterprint', clearPrintMode, { once: true });
        window.print();
      }
    };

    onMounted(async () => {
      isAdmin.value = (await accountService?.hasAnyAuthorityAndCheckAuth(Authority.ADMIN)) ?? false;
      if (isAdmin.value) {
        await retrieveDashboard();
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
        cartConfirmation.value = product;
        clearTimeout(cartConfirmationTimer);
        cartConfirmationTimer = setTimeout(() => (cartConfirmation.value = null), 5000);
        alertService.showInfo(t$('home.addedToCart', { name: product.name }).toString());
      } catch (err) {
        alertService.showHttpError(err.response);
      } finally {
        addingToCartId.value = null;
      }
    };
    onUnmounted(() => clearTimeout(cartConfirmationTimer));

    return {
      authenticated,
      username,
      showLogin,
      isAdmin,
      dashboard,
      recentOrders,
      recentReviews,
      recentUsers,
      lowStockProducts,
      dashboardPeriods,
      activityChartMax,
      revenueChartMax,
      orderStatusTotal,
      inventoryChartMax,
      activeOrderTotal,
      inventoryAttentionTotal,
      chartPercent,
      formatPercentage,
      isLoadingDashboard,
      retrieveDashboard,
      formatCurrency,
      formatNumber,
      formatGeneratedAt,
      printDashboard,
      featuredProducts,
      categories,
      isLoadingHome,
      addingToCartId,
      cartConfirmation,
      addToCart,
      t$,
    };
  },
});
