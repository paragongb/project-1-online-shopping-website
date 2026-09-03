import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { type RouteLocation } from 'vue-router';

import { type MountingOptions, shallowMount } from '@vue/test-utils';

import AlertService from '@/shared/alert/alert.service';

import AddressDetails from './address-details.vue';

type AddressDetailsComponentType = InstanceType<typeof AddressDetails>;

let route: Partial<RouteLocation>;
const routerGoMock = vi.fn();

vi.mock('vue-router', () => ({
  useRoute: () => route,
  useRouter: () => ({ go: routerGoMock }),
}));

const addressSample = { id: 123 };

describe('Component Tests', () => {
  let alertService: AlertService;

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Address Management Detail Component', () => {
    let addressServiceStub: any;
    let mountOptions: MountingOptions<AddressDetailsComponentType>['global'];

    beforeEach(() => {
      route = {};
      addressServiceStub = {
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
          addressService: () => addressServiceStub,
        },
      };
    });

    describe('Navigate to details', () => {
      it('Should call load all on init', async () => {
        // GIVEN
        addressServiceStub.find.mockResolvedValue(addressSample);
        route = {
          params: {
            addressId: `${123}`,
          },
        };
        const wrapper = shallowMount(AddressDetails, { global: mountOptions });
        const comp = wrapper.vm;
        // WHEN
        await comp.$nextTick();

        // THEN
        expect(comp.address).toMatchObject(addressSample);
      });
    });

    describe('Previous state', () => {
      it('Should go previous state', async () => {
        addressServiceStub.find.mockResolvedValue(addressSample);
        const wrapper = shallowMount(AddressDetails, { global: mountOptions });
        const comp = wrapper.vm;
        await comp.$nextTick();

        comp.previousState();
        await comp.$nextTick();

        expect(routerGoMock).toHaveBeenCalledWith(-1);
      });
    });
  });
});
