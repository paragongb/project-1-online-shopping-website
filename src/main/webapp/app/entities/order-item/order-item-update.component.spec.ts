import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { type RouteLocation } from 'vue-router';

import { type MountingOptions, shallowMount } from '@vue/test-utils';

import AlertService from '@/shared/alert/alert.service';

import OrderItemUpdate from './order-item-update.vue';

type OrderItemUpdateComponentType = InstanceType<typeof OrderItemUpdate>;

let route: Partial<RouteLocation>;
const routerGoMock = vi.fn();

vi.mock('vue-router', () => ({
  useRoute: () => route,
  useRouter: () => ({ go: routerGoMock }),
}));

const orderItemSample = { id: 123 };

describe('Component Tests', () => {
  let mountOptions: MountingOptions<OrderItemUpdateComponentType>['global'];
  let alertService: AlertService;

  describe('OrderItem Management Update Component', () => {
    let comp: OrderItemUpdateComponentType;
    let orderItemServiceStub: any;

    beforeEach(() => {
      route = {};
      orderItemServiceStub = {
        retrieve: vi.fn(),
        find: vi.fn(),
        update: vi.fn(),
        create: vi.fn(),
      };
      orderItemServiceStub.retrieve.mockResolvedValueOnce([]);

      alertService = new AlertService({
        i18n: { t: vi.fn() } as any,
        toast: {
          create: vi.fn(),
        } as any,
      });

      mountOptions = {
        stubs: {
          'font-awesome-icon': true,
          'b-input-group': true,
          'b-input-group-prepend': true,
          'b-form-datepicker': true,
          'b-form-input': true,
        },
        provide: {
          alertService,
          orderItemService: () => orderItemServiceStub,
          productService: () => ({
            retrieve: vi.fn().mockResolvedValue({}),
          }),
          customerOrderService: () => ({
            retrieve: vi.fn().mockResolvedValue({}),
          }),
        },
      };
    });

    afterEach(() => {
      vi.resetAllMocks();
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', async () => {
        // GIVEN
        const wrapper = shallowMount(OrderItemUpdate, { global: mountOptions });
        comp = wrapper.vm;
        comp.orderItem = orderItemSample;
        orderItemServiceStub.update.mockResolvedValue(orderItemSample);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(orderItemServiceStub.update).toHaveBeenCalledWith(orderItemSample);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', async () => {
        // GIVEN
        const entity = {};
        orderItemServiceStub.create.mockResolvedValue(entity);
        const wrapper = shallowMount(OrderItemUpdate, { global: mountOptions });
        comp = wrapper.vm;
        comp.orderItem = entity;

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(orderItemServiceStub.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      });
    });

    describe('Before route enter', () => {
      it('Should retrieve data', async () => {
        // GIVEN
        orderItemServiceStub.find.mockResolvedValue(orderItemSample);
        orderItemServiceStub.retrieve.mockResolvedValue([orderItemSample]);

        // WHEN
        route = {
          params: {
            orderItemId: `${orderItemSample.id}`,
          },
        };
        const wrapper = shallowMount(OrderItemUpdate, { global: mountOptions });
        comp = wrapper.vm;
        await comp.$nextTick();

        // THEN
        expect(comp.orderItem).toMatchObject(orderItemSample);
      });
    });

    describe('Previous state', () => {
      it('Should go previous state', async () => {
        orderItemServiceStub.find.mockResolvedValue(orderItemSample);
        const wrapper = shallowMount(OrderItemUpdate, { global: mountOptions });
        comp = wrapper.vm;
        await comp.$nextTick();

        comp.previousState();
        await comp.$nextTick();

        expect(routerGoMock).toHaveBeenCalledWith(-1);
      });
    });
  });
});
