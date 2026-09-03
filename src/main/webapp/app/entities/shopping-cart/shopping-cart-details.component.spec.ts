import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { type RouteLocation } from 'vue-router';

import { type MountingOptions, shallowMount } from '@vue/test-utils';

import AlertService from '@/shared/alert/alert.service';

import ShoppingCartDetails from './shopping-cart-details.vue';

type ShoppingCartDetailsComponentType = InstanceType<typeof ShoppingCartDetails>;

let route: Partial<RouteLocation>;
const routerGoMock = vi.fn();

vi.mock('vue-router', () => ({
  useRoute: () => route,
  useRouter: () => ({ go: routerGoMock }),
}));

const shoppingCartSample = { id: 123 };

describe('Component Tests', () => {
  let alertService: AlertService;

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('ShoppingCart Management Detail Component', () => {
    let shoppingCartServiceStub: any;
    let mountOptions: MountingOptions<ShoppingCartDetailsComponentType>['global'];

    beforeEach(() => {
      route = {};
      shoppingCartServiceStub = {
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
          shoppingCartService: () => shoppingCartServiceStub,
        },
      };
    });

    describe('Navigate to details', () => {
      it('Should call load all on init', async () => {
        // GIVEN
        shoppingCartServiceStub.find.mockResolvedValue(shoppingCartSample);
        route = {
          params: {
            shoppingCartId: `${123}`,
          },
        };
        const wrapper = shallowMount(ShoppingCartDetails, { global: mountOptions });
        const comp = wrapper.vm;
        // WHEN
        await comp.$nextTick();

        // THEN
        expect(comp.shoppingCart).toMatchObject(shoppingCartSample);
      });
    });

    describe('Previous state', () => {
      it('Should go previous state', async () => {
        shoppingCartServiceStub.find.mockResolvedValue(shoppingCartSample);
        const wrapper = shallowMount(ShoppingCartDetails, { global: mountOptions });
        const comp = wrapper.vm;
        await comp.$nextTick();

        comp.previousState();
        await comp.$nextTick();

        expect(routerGoMock).toHaveBeenCalledWith(-1);
      });
    });
  });
});
