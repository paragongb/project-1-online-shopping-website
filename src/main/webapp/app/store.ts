import { useAccountStore as useStore } from '@/shared/config/store/account-store';
export type AccountStore = ReturnType<typeof useStore>;
export { useStore };

export { useTranslationStore } from '@/shared/config/store/translation-store';
export { useCartStore } from '@/shared/config/store/cart-store';
