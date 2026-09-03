import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { type RouteLocation } from 'vue-router';

import { type MountingOptions, shallowMount } from '@vue/test-utils';
import dayjs from 'dayjs';

import AlertService from '@/shared/alert/alert.service';
import { DATE_TIME_LONG_FORMAT } from '@/shared/composables/date-format';

import CustomerOrderUpdate from './customer-order-update.vue';

type CustomerOrderUpdateComponentType = InstanceType<typeof CustomerOrderUpdate>;

let route: Partial<RouteLocation>;
const routerGoMock = vi.fn();

vi.mock('vue-router', () => ({
  useRoute: () => route,
  useRouter: () => ({ go: routerGoMock }),
}));

const customerOrderSample = { id: 123 };

describe('Component Tests', () => {
  let mountOptions: MountingOptions<CustomerOrderUpdateComponentType>['global'];
  let alertService: AlertService;

  describe('CustomerOrder Management Update Component', () => {
    let comp: CustomerOrderUpdateComponentType;
    let customerOrderServiceStub: any;

    beforeEach(() => {
      route = {};
      customerOrderServiceStub = {
        retrieve: vi.fn(),
        find: vi.fn(),
        update: vi.fn(),
        create: vi.fn(),
      };
      customerOrderServiceStub.retrieve.mockResolvedValueOnce([]);

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
          customerOrderService: () => customerOrderServiceStub,
          addressService: () => ({
            retrieve: vi.fn().mockResolvedValue({}),
          }),

          userService: () => ({
            retrieve: vi.fn().mockResolvedValue({}),
          }),
        },
      };
    });

    afterEach(() => {
      vi.resetAllMocks();
    });

    describe('load', () => {
      beforeEach(() => {
        const wrapper = shallowMount(CustomerOrderUpdate, { global: mountOptions });
        comp = wrapper.vm;
      });
      it('Should convert date from string', () => {
        // GIVEN
        const date = new Date('2019-10-15T11:42:02Z');

        // WHEN
        const convertedDate = comp.convertDateTimeFromServer(date);

        // THEN
        expect(convertedDate).toEqual(dayjs(date).format(DATE_TIME_LONG_FORMAT));
      });

      it('Should not convert date if date is not present', () => {
        expect(comp.convertDateTimeFromServer(null)).toBeNull();
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', async () => {
        // GIVEN
        const wrapper = shallowMount(CustomerOrderUpdate, { global: mountOptions });
        comp = wrapper.vm;
        comp.customerOrder = customerOrderSample;
        customerOrderServiceStub.update.mockResolvedValue(customerOrderSample);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(customerOrderServiceStub.update).toHaveBeenCalledWith(customerOrderSample);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', async () => {
        // GIVEN
        const entity = {};
        customerOrderServiceStub.create.mockResolvedValue(entity);
        const wrapper = shallowMount(CustomerOrderUpdate, { global: mountOptions });
        comp = wrapper.vm;
        comp.customerOrder = entity;

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(customerOrderServiceStub.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      });
    });

    describe('Before route enter', () => {
      it('Should retrieve data', async () => {
        // GIVEN
        customerOrderServiceStub.find.mockResolvedValue(customerOrderSample);
        customerOrderServiceStub.retrieve.mockResolvedValue([customerOrderSample]);

        // WHEN
        route = {
          params: {
            customerOrderId: `${customerOrderSample.id}`,
          },
        };
        const wrapper = shallowMount(CustomerOrderUpdate, { global: mountOptions });
        comp = wrapper.vm;
        await comp.$nextTick();

        // THEN
        expect(comp.customerOrder).toMatchObject(customerOrderSample);
      });
    });

    describe('Previous state', () => {
      it('Should go previous state', async () => {
        customerOrderServiceStub.find.mockResolvedValue(customerOrderSample);
        const wrapper = shallowMount(CustomerOrderUpdate, { global: mountOptions });
        comp = wrapper.vm;
        await comp.$nextTick();

        comp.previousState();
        await comp.$nextTick();

        expect(routerGoMock).toHaveBeenCalledWith(-1);
      });
    });
  });
});
