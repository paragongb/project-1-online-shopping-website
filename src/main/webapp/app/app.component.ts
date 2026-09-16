import { type Component, defineComponent, onMounted, onUnmounted, provide, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { BApp } from 'bootstrap-vue-next';
import { storeToRefs } from 'pinia';

import LoginForm from '@/account/login-form/login-form.vue';
import { useLoginModal } from '@/account/login-modal';
import JhiFooter from '@/core/jhi-footer/jhi-footer.vue';
import JhiNavbar from '@/core/jhi-navbar/jhi-navbar.vue';
import Ribbon from '@/core/ribbon/ribbon.vue';
import { useAlertService } from '@/shared/alert/alert.service';
import '@/shared/config/dayjs';
import { useTheme } from '@/shared/config/theme';

export default defineComponent({
  name: 'App',
  components: {
    BApp: BApp as Component,
    Ribbon,
    JhiNavbar,
    LoginForm,
    JhiFooter,
  },
  setup() {
    provide('alertService', useAlertService());
    const { loginModalOpen } = storeToRefs(useLoginModal());
    const showBackToTop = ref(false);
    const updateScroll = () => {
      showBackToTop.value = window.scrollY > 450;
    };
    onMounted(() => {
      useTheme().initialize();
      window.addEventListener('scroll', updateScroll, { passive: true });
      updateScroll();
    });
    onUnmounted(() => window.removeEventListener('scroll', updateScroll));

    return {
      loginModalOpen,
      showBackToTop,
      backToTop: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
      t$: useI18n().t,
    };
  },
});
