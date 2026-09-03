import { beforeEach, describe, expect, it, vi } from 'vitest';

import { type MountingOptions, shallowMount } from '@vue/test-utils';

import AlertService from '@/shared/alert/alert.service';

import CartItem from './cart-item.vue';

type CartItemComponentType = InstanceType<typeof CartItem>;

const bModalStub = {
  render: () => {},
  methods: {
    hide: () => {},
    show: () => {},
  },
};

describe('Component Tests', () => {
  let alertService: AlertService;

  describe('CartItem Management Component', () => {
    let cartItemServiceStub: any;
    let mountOptions: MountingOptions<CartItemComponentType>['global'];

    beforeEach(() => {
      cartItemServiceStub = {
        retrieve: vi.fn(),
        delete: vi.fn(),
      };
      cartItemServiceStub.retrieve.mockResolvedValue({ headers: {} });

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
          cartItemService: () => cartItemServiceStub,
        },
      };
    });

    describe('Mount', () => {
      it('Should call load all on init', async () => {
        // GIVEN
        cartItemServiceStub.retrieve.mockResolvedValue({ headers: {}, data: [{ id: 123 }] });

        // WHEN
        const wrapper = shallowMount(CartItem, { global: mountOptions });
        const comp = wrapper.vm;
        await comp.$nextTick();

        // THEN
        expect(cartItemServiceStub.retrieve).toHaveBeenCalledOnce();
        expect(comp.cartItems[0]).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
    describe('Handles', () => {
      let comp: CartItemComponentType;

      beforeEach(async () => {
        const wrapper = shallowMount(CartItem, { global: mountOptions });
        comp = wrapper.vm;
        await comp.$nextTick();
        cartItemServiceStub.retrieve.mockReset();
        cartItemServiceStub.retrieve.mockResolvedValue({ headers: {}, data: [] });
      });

      it('Should call delete service on confirmDelete', async () => {
        // GIVEN
        cartItemServiceStub.delete.mockResolvedValue({});

        // WHEN
        comp.prepareRemove({ id: 123 });

        comp.removeCartItem();
        await comp.$nextTick(); // clear components

        // THEN
        expect(cartItemServiceStub.delete).toHaveBeenCalled();

        // THEN
        await comp.$nextTick(); // handle component clear watch
        expect(cartItemServiceStub.retrieve).toHaveBeenCalledTimes(1);
      });
    });
  });
});
