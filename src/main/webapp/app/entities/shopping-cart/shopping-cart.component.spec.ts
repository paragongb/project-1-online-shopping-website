import { beforeEach, describe, expect, it, vi } from 'vitest';

import { type MountingOptions, shallowMount } from '@vue/test-utils';

import AlertService from '@/shared/alert/alert.service';

import ShoppingCart from './shopping-cart.vue';

type ShoppingCartComponentType = InstanceType<typeof ShoppingCart>;

const bModalStub = {
  render: () => {},
  methods: {
    hide: () => {},
    show: () => {},
  },
};

describe('Component Tests', () => {
  let alertService: AlertService;

  describe('ShoppingCart Management Component', () => {
    let shoppingCartServiceStub: any;
    let mountOptions: MountingOptions<ShoppingCartComponentType>['global'];

    beforeEach(() => {
      shoppingCartServiceStub = {
        retrieve: vi.fn(),
        delete: vi.fn(),
      };
      shoppingCartServiceStub.retrieve.mockResolvedValue({ headers: {} });

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
          shoppingCartService: () => shoppingCartServiceStub,
        },
      };
    });

    describe('Mount', () => {
      it('Should call load all on init', async () => {
        // GIVEN
        shoppingCartServiceStub.retrieve.mockResolvedValue({ headers: {}, data: [{ id: 123 }] });

        // WHEN
        const wrapper = shallowMount(ShoppingCart, { global: mountOptions });
        const comp = wrapper.vm;
        await comp.$nextTick();

        // THEN
        expect(shoppingCartServiceStub.retrieve).toHaveBeenCalledOnce();
        expect(comp.shoppingCarts[0]).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
    describe('Handles', () => {
      let comp: ShoppingCartComponentType;

      beforeEach(async () => {
        const wrapper = shallowMount(ShoppingCart, { global: mountOptions });
        comp = wrapper.vm;
        await comp.$nextTick();
        shoppingCartServiceStub.retrieve.mockReset();
        shoppingCartServiceStub.retrieve.mockResolvedValue({ headers: {}, data: [] });
      });

      it('Should call delete service on confirmDelete', async () => {
        // GIVEN
        shoppingCartServiceStub.delete.mockResolvedValue({});

        // WHEN
        comp.prepareRemove({ id: 123 });

        comp.removeShoppingCart();
        await comp.$nextTick(); // clear components

        // THEN
        expect(shoppingCartServiceStub.delete).toHaveBeenCalled();

        // THEN
        await comp.$nextTick(); // handle component clear watch
        expect(shoppingCartServiceStub.retrieve).toHaveBeenCalledTimes(1);
      });
    });
  });
});
