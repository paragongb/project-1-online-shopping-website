import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { type RouteLocation } from 'vue-router';

import { createTestingPinia } from '@pinia/testing';
import { type MountingOptions, flushPromises, shallowMount } from '@vue/test-utils';
import axios from 'axios';

import AlertService from '@/shared/alert/alert.service';

import ReviewUpdate from './review-update.vue';

type ReviewUpdateComponentType = InstanceType<typeof ReviewUpdate>;

let route: Partial<RouteLocation>;
const routerGoMock = vi.fn();

vi.mock('vue-router', () => ({
  useRoute: () => route,
  useRouter: () => ({ go: routerGoMock }),
}));

const reviewSample = { id: 123 };

describe('Component Tests', () => {
  let mountOptions: MountingOptions<ReviewUpdateComponentType>['global'];
  let alertService: AlertService;

  describe('Review Management Update Component', () => {
    let comp: ReviewUpdateComponentType;
    let reviewServiceStub: any;

    beforeEach(() => {
      route = {};
      reviewServiceStub = {
        retrieve: vi.fn(),
        find: vi.fn(),
        update: vi.fn(),
        create: vi.fn(),
      };
      reviewServiceStub.retrieve.mockResolvedValueOnce([]);
      vi.spyOn(axios, 'get').mockResolvedValue({ data: [] });

      alertService = new AlertService({
        i18n: { t: vi.fn() } as any,
        toast: {
          create: vi.fn(),
        } as any,
      });

      mountOptions = {
        plugins: [
          createTestingPinia({
            initialState: { main: { userIdentity: { id: 1, login: 'user' } } },
          }),
        ],
        stubs: {
          'font-awesome-icon': true,
          'b-input-group': true,
          'b-input-group-prepend': true,
          'b-form-datepicker': true,
          'b-form-input': true,
        },
        provide: {
          alertService,
          reviewService: () => reviewServiceStub,
          productService: () => ({
            retrieve: vi.fn().mockResolvedValue({ data: [] }),
          }),

          userService: () => ({
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
        const wrapper = shallowMount(ReviewUpdate, { global: mountOptions });
        comp = wrapper.vm;
        comp.review = reviewSample;
        reviewServiceStub.update.mockResolvedValue(reviewSample);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(reviewServiceStub.update).toHaveBeenCalledWith(reviewSample);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', async () => {
        // GIVEN
        const entity = {};
        reviewServiceStub.create.mockResolvedValue(entity);
        const wrapper = shallowMount(ReviewUpdate, { global: mountOptions });
        comp = wrapper.vm;
        comp.review = entity;

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(reviewServiceStub.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      });
    });

    describe('Before route enter', () => {
      it('Should retrieve data', async () => {
        // GIVEN
        reviewServiceStub.find.mockResolvedValue(reviewSample);
        reviewServiceStub.retrieve.mockResolvedValue([reviewSample]);

        // WHEN
        route = {
          params: {
            reviewId: `${reviewSample.id}`,
          },
        };
        const wrapper = shallowMount(ReviewUpdate, { global: mountOptions });
        comp = wrapper.vm;
        await flushPromises();

        // THEN
        expect(comp.review).toMatchObject(reviewSample);
      });
    });

    describe('Previous state', () => {
      it('Should go previous state', async () => {
        reviewServiceStub.find.mockResolvedValue(reviewSample);
        const wrapper = shallowMount(ReviewUpdate, { global: mountOptions });
        comp = wrapper.vm;
        await comp.$nextTick();

        comp.previousState();
        await comp.$nextTick();

        expect(routerGoMock).toHaveBeenCalledWith(-1);
      });
    });
  });
});
