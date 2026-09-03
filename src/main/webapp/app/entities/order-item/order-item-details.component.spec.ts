import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { type RouteLocation } from 'vue-router';

import { type MountingOptions, shallowMount } from '@vue/test-utils';

import AlertService from '@/shared/alert/alert.service';

import OrderItemDetails from './order-item-details.vue';

type OrderItemDetailsComponentType = InstanceType<typeof OrderItemDetails>;

let route: Partial<RouteLocation>;
const routerGoMock = vi.fn();

vi.mock('vue-router', () => ({
  useRoute: () => route,
  useRouter: () => ({ go: routerGoMock }),
}));

const orderItemSample = { id: 123 };

describe('Component Tests', () => {
  let alertService: AlertService;

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('OrderItem Management Detail Component', () => {
    let orderItemServiceStub: any;
    let mountOptions: MountingOptions<OrderItemDetailsComponentType>['global'];

    beforeEach(() => {
      route = {};
      orderItemServiceStub = {
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
          orderItemService: () => orderItemServiceStub,
        },
      };
    });

    describe('Navigate to details', () => {
      it('Should call load all on init', async () => {
        // GIVEN
        orderItemServiceStub.find.mockResolvedValue(orderItemSample);
        route = {
          params: {
            orderItemId: `${123}`,
          },
        };
        const wrapper = shallowMount(OrderItemDetails, { global: mountOptions });
        const comp = wrapper.vm;
        // WHEN
        await comp.$nextTick();

        // THEN
        expect(comp.orderItem).toMatchObject(orderItemSample);
      });
    });

    describe('Previous state', () => {
      it('Should go previous state', async () => {
        orderItemServiceStub.find.mockResolvedValue(orderItemSample);
        const wrapper = shallowMount(OrderItemDetails, { global: mountOptions });
        const comp = wrapper.vm;
        await comp.$nextTick();

        comp.previousState();
        await comp.$nextTick();

        expect(routerGoMock).toHaveBeenCalledWith(-1);
      });
    });
  });
});
