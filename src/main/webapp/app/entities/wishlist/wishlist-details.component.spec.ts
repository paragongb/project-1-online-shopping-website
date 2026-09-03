import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { type RouteLocation } from 'vue-router';

import { type MountingOptions, shallowMount } from '@vue/test-utils';

import AlertService from '@/shared/alert/alert.service';

import WishlistDetails from './wishlist-details.vue';

type WishlistDetailsComponentType = InstanceType<typeof WishlistDetails>;

let route: Partial<RouteLocation>;
const routerGoMock = vi.fn();

vi.mock('vue-router', () => ({
  useRoute: () => route,
  useRouter: () => ({ go: routerGoMock }),
}));

const wishlistSample = { id: 123 };

describe('Component Tests', () => {
  let alertService: AlertService;

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Wishlist Management Detail Component', () => {
    let wishlistServiceStub: any;
    let mountOptions: MountingOptions<WishlistDetailsComponentType>['global'];

    beforeEach(() => {
      route = {};
      wishlistServiceStub = {
        find: vi.fn(),
      };

      alertService = new AlertService({
        i18n: { t: vi.fn() } as any,
        toast: {
          create: vi.fn(),
        } as any,
      });

      mountOptions = {
        stubs: {
          'font-awesome-icon': true,
          'router-link': true,
        },
        provide: {
          alertService,
          wishlistService: () => wishlistServiceStub,
        },
      };
    });

    describe('Navigate to details', () => {
      it('Should call load all on init', async () => {
        // GIVEN
        wishlistServiceStub.find.mockResolvedValue(wishlistSample);
        route = {
          params: {
            wishlistId: `${123}`,
          },
        };
        const wrapper = shallowMount(WishlistDetails, { global: mountOptions });
        const comp = wrapper.vm;
        // WHEN
        await comp.$nextTick();

        // THEN
        expect(comp.wishlist).toMatchObject(wishlistSample);
      });
    });

    describe('Previous state', () => {
      it('Should go previous state', async () => {
        wishlistServiceStub.find.mockResolvedValue(wishlistSample);
        const wrapper = shallowMount(WishlistDetails, { global: mountOptions });
        const comp = wrapper.vm;
        await comp.$nextTick();

        comp.previousState();
        await comp.$nextTick();

        expect(routerGoMock).toHaveBeenCalledWith(-1);
      });
    });
  });
});
