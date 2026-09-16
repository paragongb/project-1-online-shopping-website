import { ref, watch } from 'vue';

const STORAGE_KEY = 'shop-color-theme';
const dark = ref(false);

export const useTheme = () => {
  const initialize = () => {
    try {
      dark.value = window.localStorage.getItem(STORAGE_KEY) === 'dark';
    } catch {
      dark.value = false;
    }
    document.documentElement.dataset.theme = dark.value ? 'dark' : 'light';
  };

  const toggle = () => {
    dark.value = !dark.value;
  };

  return { dark, initialize, toggle };
};

watch(dark, value => {
  if (typeof document === 'undefined') return;
  document.documentElement.dataset.theme = value ? 'dark' : 'light';
  try {
    window.localStorage.setItem(STORAGE_KEY, value ? 'dark' : 'light');
  } catch {
    // Keep the selected theme for this session when storage is unavailable.
  }
});
