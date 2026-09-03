import { beforeEach, describe, expect, it, vi } from 'vitest';

import { type MountingOptions, shallowMount } from '@vue/test-utils';

import AlertService from '@/shared/alert/alert.service';

import Address from './address.vue';

type AddressComponentType = InstanceType<typeof Address>;

const bModalStub = {
  render: () => {},
  methods: {
    hide: () => {},
    show: () => {},
  },
};

describe('Component Tests', () => {
  let alertService: AlertService;

  describe('Address Management Component', () => {
    let addressServiceStub: any;
    let mountOptions: MountingOptions<AddressComponentType>['global'];

    beforeEach(() => {
      addressServiceStub = {
        retrieve: vi.fn(),
        delete: vi.fn(),
      };
      addressServiceStub.retrieve.mockResolvedValue({ headers: {} });

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
          addressService: () => addressServiceStub,
        },
      };
    });

    describe('Mount', () => {
      it('Should call load all on init', async () => {
        // GIVEN
        addressServiceStub.retrieve.mockResolvedValue({ headers: {}, data: [{ id: 123 }] });

        // WHEN
        const wrapper = shallowMount(Address, { global: mountOptions });
        const comp = wrapper.vm;
        await comp.$nextTick();

        // THEN
        expect(addressServiceStub.retrieve).toHaveBeenCalledOnce();
        expect(comp.addresses[0]).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
    describe('Handles', () => {
      let comp: AddressComponentType;

      beforeEach(async () => {
        const wrapper = shallowMount(Address, { global: mountOptions });
        comp = wrapper.vm;
        await comp.$nextTick();
        addressServiceStub.retrieve.mockReset();
        addressServiceStub.retrieve.mockResolvedValue({ headers: {}, data: [] });
      });

      it('Should call delete service on confirmDelete', async () => {
        // GIVEN
        addressServiceStub.delete.mockResolvedValue({});

        // WHEN
        comp.prepareRemove({ id: 123 });

        comp.removeAddress();
        await comp.$nextTick(); // clear components

        // THEN
        expect(addressServiceStub.delete).toHaveBeenCalled();

        // THEN
        await comp.$nextTick(); // handle component clear watch
        expect(addressServiceStub.retrieve).toHaveBeenCalledTimes(1);
      });
    });
  });
});
