import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { type RouteLocation } from 'vue-router';

import { type MountingOptions, shallowMount } from '@vue/test-utils';
import dayjs from 'dayjs';

import AlertService from '@/shared/alert/alert.service';
import { DATE_TIME_LONG_FORMAT } from '@/shared/composables/date-format';

import WishlistUpdate from './wishlist-update.vue';

type WishlistUpdateComponentType = InstanceType<typeof WishlistUpdate>;

let route: Partial<RouteLocation>;
const routerGoMock = vi.fn();

vi.mock('vue-router', () => ({
  useRoute: () => route,
  useRouter: () => ({ go: routerGoMock }),
}));

const wishlistSample = { id: 123 };

describe('Component Tests', () => {
  let mountOptions: MountingOptions<WishlistUpdateComponentType>['global'];
  let alertService: AlertService;

  describe('Wishlist Management Update Component', () => {
    let comp: WishlistUpdateComponentType;
    let wishlistServiceStub: any;

    beforeEach(() => {
      route = {};
      wishlistServiceStub = {
        retrieve: vi.fn(),
        find: vi.fn(),
        update: vi.fn(),
        create: vi.fn(),
      };
      wishlistServiceStub.retrieve.mockResolvedValueOnce([]);

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
          wishlistService: () => wishlistServiceStub,

          userService: () => ({
            retrieve: vi.fn().mockResolvedValue({}),
          }),
          productService: () => ({
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
        const wrapper = shallowMount(WishlistUpdate, { global: mountOptions });
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
        const wrapper = shallowMount(WishlistUpdate, { global: mountOptions });
        comp = wrapper.vm;
        comp.wishlist = wishlistSample;
        wishlistServiceStub.update.mockResolvedValue(wishlistSample);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(wishlistServiceStub.update).toHaveBeenCalledWith(wishlistSample);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', async () => {
        // GIVEN
        const entity = {};
        wishlistServiceStub.create.mockResolvedValue(entity);
        const wrapper = shallowMount(WishlistUpdate, { global: mountOptions });
        comp = wrapper.vm;
        comp.wishlist = entity;

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(wishlistServiceStub.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      });
    });

    describe('Before route enter', () => {
      it('Should retrieve data', async () => {
        // GIVEN
        wishlistServiceStub.find.mockResolvedValue(wishlistSample);
        wishlistServiceStub.retrieve.mockResolvedValue([wishlistSample]);

        // WHEN
        route = {
          params: {
            wishlistId: `${wishlistSample.id}`,
          },
        };
        const wrapper = shallowMount(WishlistUpdate, { global: mountOptions });
        comp = wrapper.vm;
        await comp.$nextTick();

        // THEN
        expect(comp.wishlist).toMatchObject(wishlistSample);
      });
    });

    describe('Previous state', () => {
      it('Should go previous state', async () => {
        wishlistServiceStub.find.mockResolvedValue(wishlistSample);
        const wrapper = shallowMount(WishlistUpdate, { global: mountOptions });
        comp = wrapper.vm;
        await comp.$nextTick();

        comp.previousState();
        await comp.$nextTick();

        expect(routerGoMock).toHaveBeenCalledWith(-1);
      });
    });
  });
});
