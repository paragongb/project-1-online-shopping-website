import { beforeEach, describe, expect, it, vi } from 'vitest';

import { type MountingOptions, flushPromises, shallowMount } from '@vue/test-utils';

import AlertService from '@/shared/alert/alert.service';

import Review from './review.vue';

type ReviewComponentType = InstanceType<typeof Review>;

const bModalStub = {
  render: () => {},
  methods: {
    hide: () => {},
    show: () => {},
  },
};

describe('Component Tests', () => {
  let alertService: AlertService;

  describe('Review Management Component', () => {
    let reviewServiceStub: any;
    let productServiceStub: any;
    let mountOptions: MountingOptions<ReviewComponentType>['global'];

    beforeEach(() => {
      reviewServiceStub = {
        retrieve: vi.fn(),
        delete: vi.fn(),
      };
      reviewServiceStub.retrieve.mockResolvedValue({ headers: {} });
      productServiceStub = {
        retrieve: vi.fn().mockResolvedValue({ headers: {}, data: [] }),
      };

      alertService = new AlertService({
        i18n: { t: vi.fn() } as any,
        toast: {
          create: vi.fn(),
        } as any,
      });

      mountOptions = {
        stubs: {
          jhiItemCount: true,
          bPagination: true,
          bModal: bModalStub as any,
          'font-awesome-icon': true,
          'b-badge': true,
          'jhi-sort-indicator': true,
          'b-button': true,
          'router-link': true,
        },
        directives: {
          'b-modal': {},
        },
        provide: {
          alertService,
          reviewService: () => reviewServiceStub,
          productService: () => productServiceStub,
          accountService: {
            hasAnyAuthorityAndCheckAuth: vi.fn().mockResolvedValue(true),
          },
        },
      };
    });

    describe('Mount', () => {
      it('Should call load all on init', async () => {
        // GIVEN
        reviewServiceStub.retrieve.mockResolvedValue({ headers: {}, data: [{ id: 123 }] });

        // WHEN
        const wrapper = shallowMount(Review, { global: mountOptions });
        const comp = wrapper.vm;
        await flushPromises();

        // THEN
        expect(reviewServiceStub.retrieve).toHaveBeenCalledOnce();
        expect(comp.reviews[0]).toEqual(expect.objectContaining({ id: 123 }));
      });

      it('should calculate the sort attribute for an id', async () => {
        // WHEN
        const wrapper = shallowMount(Review, { global: mountOptions });
        const comp = wrapper.vm;
        await comp.$nextTick();

        // THEN
        expect(reviewServiceStub.retrieve.mock.lastCall?.[0]).toMatchObject({
          sort: ['reviewDate,desc', 'id'],
        });
      });
    });
    describe('Handles', () => {
      let comp: ReviewComponentType;

      beforeEach(async () => {
        const wrapper = shallowMount(Review, { global: mountOptions });
        comp = wrapper.vm;
        await flushPromises();
        reviewServiceStub.retrieve.mockReset();
        reviewServiceStub.retrieve.mockResolvedValue({ headers: {}, data: [] });
      });

      it('should load a page', async () => {
        // GIVEN
        reviewServiceStub.retrieve.mockResolvedValue({ headers: {}, data: [{ id: 123 }] });

        // WHEN
        comp.page = 2;
        await comp.$nextTick();

        // THEN
        expect(reviewServiceStub.retrieve).toHaveBeenCalled();
        expect(comp.reviews[0]).toEqual(expect.objectContaining({ id: 123 }));
      });

      it('should not load a page if the page is the same as the previous page', () => {
        // WHEN
        comp.page = 1;

        // THEN
        expect(reviewServiceStub.retrieve).not.toHaveBeenCalled();
      });

      it('should re-initialize the page', async () => {
        // GIVEN
        comp.page = 2;
        await comp.$nextTick();
        reviewServiceStub.retrieve.mockReset();
        reviewServiceStub.retrieve.mockResolvedValue({ headers: {}, data: [{ id: 123 }] });

        // WHEN
        comp.clear();
        await comp.$nextTick();

        // THEN
        expect(comp.page).toEqual(1);
        expect(reviewServiceStub.retrieve).toHaveBeenCalledTimes(1);
        expect(comp.reviews[0]).toEqual(expect.objectContaining({ id: 123 }));
      });

      it('should calculate the sort attribute for a non-id attribute', async () => {
        // WHEN
        comp.changeOrder('name');
        await comp.$nextTick();

        // THEN
        expect(reviewServiceStub.retrieve.mock.lastCall?.[0]).toMatchObject({
          sort: ['name,asc', 'id'],
        });
      });

      it('Should call delete service on confirmDelete', async () => {
        // GIVEN
        reviewServiceStub.delete.mockResolvedValue({});

        // WHEN
        comp.prepareRemove({ id: 123 });

        comp.removeReview();
        await comp.$nextTick(); // clear components

        // THEN
        expect(reviewServiceStub.delete).toHaveBeenCalled();

        // THEN
        await comp.$nextTick(); // handle component clear watch
        expect(reviewServiceStub.retrieve).toHaveBeenCalledTimes(1);
      });

      it('should combine product and date filters', async () => {
        comp.selectedProductId = '42';
        comp.reviewedFrom = '2026-09-01';
        comp.reviewedTo = '2026-09-15';

        await comp.applyAdminFilters();

        expect(reviewServiceStub.retrieve.mock.lastCall?.[0]).toMatchObject({
          productId: 42,
          reviewedFrom: new Date('2026-09-01T00:00:00').toISOString(),
          reviewedBefore: new Date('2026-09-16T00:00:00').toISOString(),
        });
      });
    });
  });
});
