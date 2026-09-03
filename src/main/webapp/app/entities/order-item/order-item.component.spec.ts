import { beforeEach, describe, expect, it, vi } from 'vitest';

import { type MountingOptions, shallowMount } from '@vue/test-utils';

import AlertService from '@/shared/alert/alert.service';

import OrderItem from './order-item.vue';

type OrderItemComponentType = InstanceType<typeof OrderItem>;

const bModalStub = {
  render: () => {},
  methods: {
    hide: () => {},
    show: () => {},
  },
};

describe('Component Tests', () => {
  let alertService: AlertService;

  describe('OrderItem Management Component', () => {
    let orderItemServiceStub: any;
    let mountOptions: MountingOptions<OrderItemComponentType>['global'];

    beforeEach(() => {
      orderItemServiceStub = {
        retrieve: vi.fn(),
        delete: vi.fn(),
      };
      orderItemServiceStub.retrieve.mockResolvedValue({ headers: {} });

      alertService = new AlertService({
        i18n: { t: vi.fn() } as any,
        toast: {
          create: vi.fn(),
        } as any,
      });

      mountOptions = {
        stubs: {
          bModal: bModalStub as any,
          'font-awesome-icon': true,
          'b-badge': true,
          'b-button': true,
          'router-link': true,
        },
        directives: {
          'b-modal': {},
        },
        provide: {
          alertService,
          orderItemService: () => orderItemServiceStub,
        },
      };
    });

    describe('Mount', () => {
      it('Should call load all on init', async () => {
        // GIVEN
        orderItemServiceStub.retrieve.mockResolvedValue({ headers: {}, data: [{ id: 123 }] });

        // WHEN
        const wrapper = shallowMount(OrderItem, { global: mountOptions });
        const comp = wrapper.vm;
        await comp.$nextTick();

        // THEN
        expect(orderItemServiceStub.retrieve).toHaveBeenCalledOnce();
        expect(comp.orderItems[0]).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
    describe('Handles', () => {
      let comp: OrderItemComponentType;

      beforeEach(async () => {
        const wrapper = shallowMount(OrderItem, { global: mountOptions });
        comp = wrapper.vm;
        await comp.$nextTick();
        orderItemServiceStub.retrieve.mockReset();
        orderItemServiceStub.retrieve.mockResolvedValue({ headers: {}, data: [] });
      });

      it('Should call delete service on confirmDelete', async () => {
        // GIVEN
        orderItemServiceStub.delete.mockResolvedValue({});

        // WHEN
        comp.prepareRemove({ id: 123 });

        comp.removeOrderItem();
        await comp.$nextTick(); // clear components

        // THEN
        expect(orderItemServiceStub.delete).toHaveBeenCalled();

        // THEN
        await comp.$nextTick(); // handle component clear watch
        expect(orderItemServiceStub.retrieve).toHaveBeenCalledTimes(1);
      });
    });
  });
});
