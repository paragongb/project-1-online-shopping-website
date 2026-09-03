import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { type RouteLocation } from 'vue-router';

import { type MountingOptions, shallowMount } from '@vue/test-utils';
import dayjs from 'dayjs';

import AlertService from '@/shared/alert/alert.service';
import { DATE_TIME_LONG_FORMAT } from '@/shared/composables/date-format';

import ShoppingCartUpdate from './shopping-cart-update.vue';

type ShoppingCartUpdateComponentType = InstanceType<typeof ShoppingCartUpdate>;

let route: Partial<RouteLocation>;
const routerGoMock = vi.fn();

vi.mock('vue-router', () => ({
  useRoute: () => route,
  useRouter: () => ({ go: routerGoMock }),
}));

const shoppingCartSample = { id: 123 };

describe('Component Tests', () => {
  let mountOptions: MountingOptions<ShoppingCartUpdateComponentType>['global'];
  let alertService: AlertService;

  describe('ShoppingCart Management Update Component', () => {
    let comp: ShoppingCartUpdateComponentType;
    let shoppingCartServiceStub: any;

    beforeEach(() => {
      route = {};
      shoppingCartServiceStub = {
        retrieve: vi.fn(),
        find: vi.fn(),
        update: vi.fn(),
        create: vi.fn(),
      };
      shoppingCartServiceStub.retrieve.mockResolvedValueOnce([]);

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
          shoppingCartService: () => shoppingCartServiceStub,

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
        const wrapper = shallowMount(ShoppingCartUpdate, { global: mountOptions });
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
        const wrapper = shallowMount(ShoppingCartUpdate, { global: mountOptions });
        comp = wrapper.vm;
        comp.shoppingCart = shoppingCartSample;
        shoppingCartServiceStub.update.mockResolvedValue(shoppingCartSample);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(shoppingCartServiceStub.update).toHaveBeenCalledWith(shoppingCartSample);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', async () => {
        // GIVEN
        const entity = {};
        shoppingCartServiceStub.create.mockResolvedValue(entity);
        const wrapper = shallowMount(ShoppingCartUpdate, { global: mountOptions });
        comp = wrapper.vm;
        comp.shoppingCart = entity;

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(shoppingCartServiceStub.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      });
    });

    describe('Before route enter', () => {
      it('Should retrieve data', async () => {
        // GIVEN
        shoppingCartServiceStub.find.mockResolvedValue(shoppingCartSample);
        shoppingCartServiceStub.retrieve.mockResolvedValue([shoppingCartSample]);

        // WHEN
        route = {
          params: {
            shoppingCartId: `${shoppingCartSample.id}`,
          },
        };
        const wrapper = shallowMount(ShoppingCartUpdate, { global: mountOptions });
        comp = wrapper.vm;
        await comp.$nextTick();

        // THEN
        expect(comp.shoppingCart).toMatchObject(shoppingCartSample);
      });
    });

    describe('Previous state', () => {
      it('Should go previous state', async () => {
        shoppingCartServiceStub.find.mockResolvedValue(shoppingCartSample);
        const wrapper = shallowMount(ShoppingCartUpdate, { global: mountOptions });
        comp = wrapper.vm;
        await comp.$nextTick();

        comp.previousState();
        await comp.$nextTick();

        expect(routerGoMock).toHaveBeenCalledWith(-1);
      });
    });
  });
});
