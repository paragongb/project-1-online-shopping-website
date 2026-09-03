import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { type RouteLocation } from 'vue-router';

import { type MountingOptions, shallowMount } from '@vue/test-utils';

import AlertService from '@/shared/alert/alert.service';

import ReviewDetails from './review-details.vue';

type ReviewDetailsComponentType = InstanceType<typeof ReviewDetails>;

let route: Partial<RouteLocation>;
const routerGoMock = vi.fn();

vi.mock('vue-router', () => ({
  useRoute: () => route,
  useRouter: () => ({ go: routerGoMock }),
}));

const reviewSample = { id: 123 };

describe('Component Tests', () => {
  let alertService: AlertService;

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Review Management Detail Component', () => {
    let reviewServiceStub: any;
    let mountOptions: MountingOptions<ReviewDetailsComponentType>['global'];

    beforeEach(() => {
      route = {};
      reviewServiceStub = {
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
          reviewService: () => reviewServiceStub,
        },
      };
    });

    describe('Navigate to details', () => {
      it('Should call load all on init', async () => {
        // GIVEN
        reviewServiceStub.find.mockResolvedValue(reviewSample);
        route = {
          params: {
            reviewId: `${123}`,
          },
        };
        const wrapper = shallowMount(ReviewDetails, { global: mountOptions });
        const comp = wrapper.vm;
        // WHEN
        await comp.$nextTick();

        // THEN
        expect(comp.review).toMatchObject(reviewSample);
      });
    });

    describe('Previous state', () => {
      it('Should go previous state', async () => {
        reviewServiceStub.find.mockResolvedValue(reviewSample);
        const wrapper = shallowMount(ReviewDetails, { global: mountOptions });
        const comp = wrapper.vm;
        await comp.$nextTick();

        comp.previousState();
        await comp.$nextTick();

        expect(routerGoMock).toHaveBeenCalledWith(-1);
      });
    });
  });
});
