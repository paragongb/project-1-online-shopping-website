import { beforeEach, describe, expect, it, vi } from 'vitest';

import { type MountingOptions, shallowMount } from '@vue/test-utils';

import AlertService from '@/shared/alert/alert.service';

import Wishlist from './wishlist.vue';

type WishlistComponentType = InstanceType<typeof Wishlist>;

const bModalStub = {
  render: () => {},
  methods: {
    hide: () => {},
    show: () => {},
  },
};

describe('Component Tests', () => {
  let alertService: AlertService;

  describe('Wishlist Management Component', () => {
    let wishlistServiceStub: any;
    let mountOptions: MountingOptions<WishlistComponentType>['global'];

    beforeEach(() => {
      wishlistServiceStub = {
        retrieve: vi.fn(),
        delete: vi.fn(),
      };
      wishlistServiceStub.retrieve.mockResolvedValue({ headers: {} });

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
          wishlistService: () => wishlistServiceStub,
        },
      };
    });

    describe('Mount', () => {
      it('Should call load all on init', async () => {
        // GIVEN
        wishlistServiceStub.retrieve.mockResolvedValue({ headers: {}, data: [{ id: 123 }] });

        // WHEN
        const wrapper = shallowMount(Wishlist, { global: mountOptions });
        const comp = wrapper.vm;
        await comp.$nextTick();

        // THEN
        expect(wishlistServiceStub.retrieve).toHaveBeenCalledOnce();
        expect(comp.wishlists[0]).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
    describe('Handles', () => {
      let comp: WishlistComponentType;

      beforeEach(async () => {
        const wrapper = shallowMount(Wishlist, { global: mountOptions });
        comp = wrapper.vm;
        await comp.$nextTick();
        wishlistServiceStub.retrieve.mockReset();
        wishlistServiceStub.retrieve.mockResolvedValue({ headers: {}, data: [] });
      });

      it('Should call delete service on confirmDelete', async () => {
        // GIVEN
        wishlistServiceStub.delete.mockResolvedValue({});

        // WHEN
        comp.prepareRemove({ id: 123 });

        comp.removeWishlist();
        await comp.$nextTick(); // clear components

        // THEN
        expect(wishlistServiceStub.delete).toHaveBeenCalled();

        // THEN
        await comp.$nextTick(); // handle component clear watch
        expect(wishlistServiceStub.retrieve).toHaveBeenCalledTimes(1);
      });
    });
  });
});
