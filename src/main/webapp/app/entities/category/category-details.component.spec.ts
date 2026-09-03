import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { type RouteLocation } from 'vue-router';

import { type MountingOptions, shallowMount } from '@vue/test-utils';

import AlertService from '@/shared/alert/alert.service';

import CategoryDetails from './category-details.vue';

type CategoryDetailsComponentType = InstanceType<typeof CategoryDetails>;

let route: Partial<RouteLocation>;
const routerGoMock = vi.fn();

vi.mock('vue-router', () => ({
  useRoute: () => route,
  useRouter: () => ({ go: routerGoMock }),
}));

const categorySample = { id: 123 };

describe('Component Tests', () => {
  let alertService: AlertService;

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Category Management Detail Component', () => {
    let categoryServiceStub: any;
    let mountOptions: MountingOptions<CategoryDetailsComponentType>['global'];

    beforeEach(() => {
      route = {};
      categoryServiceStub = {
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
          categoryService: () => categoryServiceStub,
        },
      };
    });

    describe('Navigate to details', () => {
      it('Should call load all on init', async () => {
        // GIVEN
        categoryServiceStub.find.mockResolvedValue(categorySample);
        route = {
          params: {
            categoryId: `${123}`,
          },
        };
        const wrapper = shallowMount(CategoryDetails, { global: mountOptions });
        const comp = wrapper.vm;
        // WHEN
        await comp.$nextTick();

        // THEN
        expect(comp.category).toMatchObject(categorySample);
      });
    });

    describe('Previous state', () => {
      it('Should go previous state', async () => {
        categoryServiceStub.find.mockResolvedValue(categorySample);
        const wrapper = shallowMount(CategoryDetails, { global: mountOptions });
        const comp = wrapper.vm;
        await comp.$nextTick();

        comp.previousState();
        await comp.$nextTick();

        expect(routerGoMock).toHaveBeenCalledWith(-1);
      });
    });
  });
});
