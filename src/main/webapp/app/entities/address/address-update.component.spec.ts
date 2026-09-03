import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { type RouteLocation } from 'vue-router';

import { type MountingOptions, shallowMount } from '@vue/test-utils';

import AlertService from '@/shared/alert/alert.service';

import AddressUpdate from './address-update.vue';

type AddressUpdateComponentType = InstanceType<typeof AddressUpdate>;

let route: Partial<RouteLocation>;
const routerGoMock = vi.fn();

vi.mock('vue-router', () => ({
  useRoute: () => route,
  useRouter: () => ({ go: routerGoMock }),
}));

const addressSample = { id: 123 };

describe('Component Tests', () => {
  let mountOptions: MountingOptions<AddressUpdateComponentType>['global'];
  let alertService: AlertService;

  describe('Address Management Update Component', () => {
    let comp: AddressUpdateComponentType;
    let addressServiceStub: any;

    beforeEach(() => {
      route = {};
      addressServiceStub = {
        retrieve: vi.fn(),
        find: vi.fn(),
        update: vi.fn(),
        create: vi.fn(),
      };
      addressServiceStub.retrieve.mockResolvedValueOnce([]);

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
          addressService: () => addressServiceStub,
        },
      };
    });

    afterEach(() => {
      vi.resetAllMocks();
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', async () => {
        // GIVEN
        const wrapper = shallowMount(AddressUpdate, { global: mountOptions });
        comp = wrapper.vm;
        comp.address = addressSample;
        addressServiceStub.update.mockResolvedValue(addressSample);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(addressServiceStub.update).toHaveBeenCalledWith(addressSample);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', async () => {
        // GIVEN
        const entity = {};
        addressServiceStub.create.mockResolvedValue(entity);
        const wrapper = shallowMount(AddressUpdate, { global: mountOptions });
        comp = wrapper.vm;
        comp.address = entity;

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(addressServiceStub.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      });
    });

    describe('Before route enter', () => {
      it('Should retrieve data', async () => {
        // GIVEN
        addressServiceStub.find.mockResolvedValue(addressSample);
        addressServiceStub.retrieve.mockResolvedValue([addressSample]);

        // WHEN
        route = {
          params: {
            addressId: `${addressSample.id}`,
          },
        };
        const wrapper = shallowMount(AddressUpdate, { global: mountOptions });
        comp = wrapper.vm;
        await comp.$nextTick();

        // THEN
        expect(comp.address).toMatchObject(addressSample);
      });
    });

    describe('Previous state', () => {
      it('Should go previous state', async () => {
        addressServiceStub.find.mockResolvedValue(addressSample);
        const wrapper = shallowMount(AddressUpdate, { global: mountOptions });
        comp = wrapper.vm;
        await comp.$nextTick();

        comp.previousState();
        await comp.$nextTick();

        expect(routerGoMock).toHaveBeenCalledWith(-1);
      });
    });
  });
});
