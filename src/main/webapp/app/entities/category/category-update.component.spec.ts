import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { type RouteLocation } from 'vue-router';

import { type MountingOptions, shallowMount } from '@vue/test-utils';

import AlertService from '@/shared/alert/alert.service';

import CategoryUpdate from './category-update.vue';

type CategoryUpdateComponentType = InstanceType<typeof CategoryUpdate>;

let route: Partial<RouteLocation>;
const routerGoMock = vi.fn();

vi.mock('vue-router', () => ({
  useRoute: () => route,
  useRouter: () => ({ go: routerGoMock }),
}));

const categorySample = { id: 123 };

describe('Component Tests', () => {
  let mountOptions: MountingOptions<CategoryUpdateComponentType>['global'];
  let alertService: AlertService;

  describe('Category Management Update Component', () => {
    let comp: CategoryUpdateComponentType;
    let categoryServiceStub: any;

    beforeEach(() => {
      route = {};
      categoryServiceStub = {
        retrieve: vi.fn(),
        find: vi.fn(),
        update: vi.fn(),
        create: vi.fn(),
      };
      categoryServiceStub.retrieve.mockResolvedValueOnce([]);

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
          categoryService: () => categoryServiceStub,
        },
      };
    });

    afterEach(() => {
      vi.resetAllMocks();
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', async () => {
        // GIVEN
        const wrapper = shallowMount(CategoryUpdate, { global: mountOptions });
        comp = wrapper.vm;
        comp.category = categorySample;
        categoryServiceStub.update.mockResolvedValue(categorySample);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(categoryServiceStub.update).toHaveBeenCalledWith(categorySample);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', async () => {
        // GIVEN
        const entity = {};
        categoryServiceStub.create.mockResolvedValue(entity);
        const wrapper = shallowMount(CategoryUpdate, { global: mountOptions });
        comp = wrapper.vm;
        comp.category = entity;

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(categoryServiceStub.create).toHaveBeenCalledWith(entity);
        expect(comp.isSaving).toEqual(false);
      });
    });

    describe('Before route enter', () => {
      it('Should retrieve data', async () => {
        // GIVEN
        categoryServiceStub.find.mockResolvedValue(categorySample);
        categoryServiceStub.retrieve.mockResolvedValue([categorySample]);

        // WHEN
        route = {
          params: {
            categoryId: `${categorySample.id}`,
          },
        };
        const wrapper = shallowMount(CategoryUpdate, { global: mountOptions });
        comp = wrapper.vm;
        await comp.$nextTick();

        // THEN
        expect(comp.category).toMatchObject(categorySample);
      });
    });

    describe('Previous state', () => {
      it('Should go previous state', async () => {
        categoryServiceStub.find.mockResolvedValue(categorySample);
        const wrapper = shallowMount(CategoryUpdate, { global: mountOptions });
        comp = wrapper.vm;
        await comp.$nextTick();

        comp.previousState();
        await comp.$nextTick();

        expect(routerGoMock).toHaveBeenCalledWith(-1);
      });
    });
  });
});
