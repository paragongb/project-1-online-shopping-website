import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { type RouteLocation } from 'vue-router';

import { type MountingOptions, shallowMount } from '@vue/test-utils';

import AlertService from '@/shared/alert/alert.service';

import CartItemDetails from './cart-item-details.vue';

type CartItemDetailsComponentType = InstanceType<typeof CartItemDetails>;

let route: Partial<RouteLocation>;
const routerGoMock = vi.fn();

vi.mock('vue-router', () => ({
  useRoute: () => route,
  useRouter: () => ({ go: routerGoMock }),
}));

const cartItemSample = { id: 123 };

describe('Component Tests', () => {
  let alertService: AlertService;

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('CartItem Management Detail Component', () => {
    let cartItemServiceStub: any;
    let mountOptions: MountingOptions<CartItemDetailsComponentType>['global'];

    beforeEach(() => {
      route = {};
      cartItemServiceStub = {
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
          cartItemService: () => cartItemServiceStub,
        },
      };
    });

    describe('Navigate to details', () => {
      it('Should call load all on init', async () => {
        // GIVEN
        cartItemServiceStub.find.mockResolvedValue(cartItemSample);
        route = {
          params: {
            cartItemId: `${123}`,
          },
        };
        const wrapper = shallowMount(CartItemDetails, { global: mountOptions });
        const comp = wrapper.vm;
        // WHEN
        await comp.$nextTick();

        // THEN
        expect(comp.cartItem).toMatchObject(cartItemSample);
      });
    });

    describe('Previous state', () => {
      it('Should go previous state', async () => {
        cartItemServiceStub.find.mockResolvedValue(cartItemSample);
        const wrapper = shallowMount(CartItemDetails, { global: mountOptions });
        const comp = wrapper.vm;
        await comp.$nextTick();

        comp.previousState();
        await comp.$nextTick();

        expect(routerGoMock).toHaveBeenCalledWith(-1);
      });
    });
  });
});
