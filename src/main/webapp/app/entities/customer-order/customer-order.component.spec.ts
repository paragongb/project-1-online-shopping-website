import { beforeEach, describe, expect, it, vi } from 'vitest';

import { type MountingOptions, shallowMount } from '@vue/test-utils';

import AlertService from '@/shared/alert/alert.service';

import CustomerOrder from './customer-order.vue';

type CustomerOrderComponentType = InstanceType<typeof CustomerOrder>;

const bModalStub = {
  render: () => {},
  methods: {
    hide: () => {},
    show: () => {},
  },
};

describe('Component Tests', () => {
  let alertService: AlertService;

  describe('CustomerOrder Management Component', () => {
    let customerOrderServiceStub: any;
    let mountOptions: MountingOptions<CustomerOrderComponentType>['global'];

    beforeEach(() => {
      customerOrderServiceStub = {
        retrieve: vi.fn(),
        delete: vi.fn(),
      };
      customerOrderServiceStub.retrieve.mockResolvedValue({ headers: {} });

      alertService = new AlertService({
        i18n: { t: vi.fn() } as any,
        toast: {
          create: vi.fn(),
        } as any,
      });

      mountOptions = {
        stubs: {
          jhiItemCount: true,
          bPagination: true,
          bModal: bModalStub as any,
          'font-awesome-icon': true,
          'b-badge': true,
          'jhi-sort-indicator': true,
          'b-button': true,
          'router-link': true,
        },
        directives: {
          'b-modal': {},
        },
        provide: {
          alertService,
          customerOrderService: () => customerOrderServiceStub,
        },
      };
    });

    describe('Mount', () => {
      it('Should call load all on init', async () => {
        // GIVEN
        customerOrderServiceStub.retrieve.mockResolvedValue({ headers: {}, data: [{ id: 123 }] });

        // WHEN
        const wrapper = shallowMount(CustomerOrder, { global: mountOptions });
        const comp = wrapper.vm;
        await comp.$nextTick();

        // THEN
        expect(customerOrderServiceStub.retrieve).toHaveBeenCalledOnce();
        expect(comp.customerOrders[0]).toEqual(expect.objectContaining({ id: 123 }));
      });

      it('should calculate the sort attribute for an id', async () => {
        // WHEN
        const wrapper = shallowMount(CustomerOrder, { global: mountOptions });
        const comp = wrapper.vm;
        await comp.$nextTick();

        // THEN
        expect(customerOrderServiceStub.retrieve.mock.lastCall?.[0]).toMatchObject({
          sort: ['id,asc'],
        });
      });
    });
    describe('Handles', () => {
      let comp: CustomerOrderComponentType;

      beforeEach(async () => {
        const wrapper = shallowMount(CustomerOrder, { global: mountOptions });
        comp = wrapper.vm;
        await comp.$nextTick();
        customerOrderServiceStub.retrieve.mockReset();
        customerOrderServiceStub.retrieve.mockResolvedValue({ headers: {}, data: [] });
      });

      it('should load a page', async () => {
        // GIVEN
        customerOrderServiceStub.retrieve.mockResolvedValue({ headers: {}, data: [{ id: 123 }] });

        // WHEN
        comp.page = 2;
        await comp.$nextTick();

        // THEN
        expect(customerOrderServiceStub.retrieve).toHaveBeenCalled();
        expect(comp.customerOrders[0]).toEqual(expect.objectContaining({ id: 123 }));
      });

      it('should not load a page if the page is the same as the previous page', () => {
        // WHEN
        comp.page = 1;

        // THEN
        expect(customerOrderServiceStub.retrieve).not.toHaveBeenCalled();
      });

      it('should re-initialize the page', async () => {
        // GIVEN
        comp.page = 2;
        await comp.$nextTick();
        customerOrderServiceStub.retrieve.mockReset();
        customerOrderServiceStub.retrieve.mockResolvedValue({ headers: {}, data: [{ id: 123 }] });

        // WHEN
        comp.clear();
        await comp.$nextTick();

        // THEN
        expect(comp.page).toEqual(1);
        expect(customerOrderServiceStub.retrieve).toHaveBeenCalledTimes(1);
        expect(comp.customerOrders[0]).toEqual(expect.objectContaining({ id: 123 }));
      });

      it('should calculate the sort attribute for a non-id attribute', async () => {
        // WHEN
        comp.propOrder = 'name';
        await comp.$nextTick();

        // THEN
        expect(customerOrderServiceStub.retrieve.mock.lastCall?.[0]).toMatchObject({
          sort: ['name,asc', 'id'],
        });
      });

      it('Should call delete service on confirmDelete', async () => {
        // GIVEN
        customerOrderServiceStub.delete.mockResolvedValue({});

        // WHEN
        comp.prepareRemove({ id: 123 });

        comp.removeCustomerOrder();
        await comp.$nextTick(); // clear components

        // THEN
        expect(customerOrderServiceStub.delete).toHaveBeenCalled();

        // THEN
        await comp.$nextTick(); // handle component clear watch
        expect(customerOrderServiceStub.retrieve).toHaveBeenCalledTimes(1);
      });
    });
  });
});
