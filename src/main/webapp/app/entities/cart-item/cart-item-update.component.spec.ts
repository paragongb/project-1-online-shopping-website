import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { type RouteLocation } from 'vue-router';

import { type MountingOptions, shallowMount } from '@vue/test-utils';

import AlertService from '@/shared/alert/alert.service';

import CartItemUpdate from './cart-item-update.vue';

type CartItemUpdateComponentType = InstanceType<typeof CartItemUpdate>;

let route: Partial<RouteLocation>;
const routerGoMock = vi.fn();

vi.mock('vue-router', () => ({
  useRoute: () => route,
  useRouter: () => ({ go: routerGoMock }),
}));

const cartItemSample = { id: 123 };

describe('Component Tests', () => {
  let mountOptions: MountingOptions<CartItemUpdateComponentType>['global'];
  let alertService: AlertService;

  describe('CartItem Management Update Component', () => {
    let comp: CartItemUpdateComponentType;
    let cartItemServiceStub: any;

    beforeEach(() => {
      route = {};
      cartItemServiceStub = {
        retrieve: vi.fn(),
        find: vi.fn(),
        update: vi.fn(),
        create: vi.fn(),
      };
      cartItemServiceStub.retrieve.mockResolvedValueOnce([]);

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
          cartItemService: () => cartItemServiceStub,
          productService: () => ({
            retrieve: vi.fn().mockResolvedValue({}),
          }),
          shoppingCartService: () => ({
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
        const wrapper = shallowMount(CartItemUpdate, { global: mountOptions });
        comp = wrapper.vm;
        comp.cartItem = cartItemSample;
        cartItemServiceStub.update.mockResolvedValue(cartItemSample);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(cartItemServiceStub.update).toHaveBeenCalledWith(cartItemSample);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', async () => {
        // GIVEN
        const entity = {};
        cartItemServiceStub.create.mockResolvedValue(entity);
        const wrapper = shallowMount(CartItemUpdate, { global: mountOptions });
        comp = wrapper.vm;
        comp.cartItem = entity;

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(cartItemServiceStub.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      });
    });

    describe('Before route enter', () => {
      it('Should retrieve data', async () => {
        // GIVEN
        cartItemServiceStub.find.mockResolvedValue(cartItemSample);
        cartItemServiceStub.retrieve.mockResolvedValue([cartItemSample]);

        // WHEN
        route = {
          params: {
            cartItemId: `${cartItemSample.id}`,
          },
        };
        const wrapper = shallowMount(CartItemUpdate, { global: mountOptions });
        comp = wrapper.vm;
        await comp.$nextTick();

        // THEN
        expect(comp.cartItem).toMatchObject(cartItemSample);
      });
    });

    describe('Previous state', () => {
      it('Should go previous state', async () => {
        cartItemServiceStub.find.mockResolvedValue(cartItemSample);
        const wrapper = shallowMount(CartItemUpdate, { global: mountOptions });
        comp = wrapper.vm;
        await comp.$nextTick();

        comp.previousState();
        await comp.$nextTick();

        expect(routerGoMock).toHaveBeenCalledWith(-1);
      });
    });
  });
});
