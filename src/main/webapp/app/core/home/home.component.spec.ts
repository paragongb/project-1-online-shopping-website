import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ref } from 'vue';

import { createTestingPinia } from '@pinia/testing';
import { shallowMount } from '@vue/test-utils';

import { useLoginModal } from '@/account/login-modal';

import Home from './home.vue';

type HomeComponentType = InstanceType<typeof Home>;

describe('Home', () => {
  let home: HomeComponentType;
  let authenticated;
  let currentUsername;
  let login: ReturnType<typeof useLoginModal>;

  beforeEach(() => {
    authenticated = ref(false);
    currentUsername = ref('');
    const wrapper = shallowMount(Home, {
      global: {
        plugins: [createTestingPinia()],
        stubs: {
          'router-link': true,
          'font-awesome-icon': true,
        },
        provide: {
          authenticated,
          currentUsername,
          alertService: { showInfo: vi.fn(), showHttpError: vi.fn() },
          accountService: { hasAnyAuthorityAndCheckAuth: vi.fn().mockResolvedValue(false) },
        },
      },
    });
    home = wrapper.vm;
    login = useLoginModal();
  });

  it('should not have user data set', () => {
    expect(home.authenticated).toBeFalsy();
    expect(home.username).toBe('');
  });

  it('should have user data set after authentication', () => {
    authenticated.value = true;
    currentUsername.value = 'test';

    expect(home.authenticated).toBeTruthy();
    expect(home.username).toBe('test');
  });

  it('should use login service', () => {
    home.showLogin();
    expect(login.showLogin).toHaveBeenCalled();
  });
});
