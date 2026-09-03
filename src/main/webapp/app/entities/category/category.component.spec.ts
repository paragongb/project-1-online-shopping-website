import { beforeEach, describe, expect, it, vi } from 'vitest';

import { type MountingOptions, shallowMount } from '@vue/test-utils';

import AlertService from '@/shared/alert/alert.service';

import Category from './category.vue';

type CategoryComponentType = InstanceType<typeof Category>;

const bModalStub = {
  render: () => {},
  methods: {
    hide: () => {},
    show: () => {},
  },
};

describe('Component Tests', () => {
  let alertService: AlertService;

  describe('Category Management Component', () => {
    let categoryServiceStub: any;
    let mountOptions: MountingOptions<CategoryComponentType>['global'];

    beforeEach(() => {
      categoryServiceStub = {
        retrieve: vi.fn(),
        delete: vi.fn(),
      };
      categoryServiceStub.retrieve.mockResolvedValue({ headers: {} });

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
          categoryService: () => categoryServiceStub,
        },
      };
    });

    describe('Mount', () => {
      it('Should call load all on init', async () => {
        // GIVEN
        categoryServiceStub.retrieve.mockResolvedValue({ headers: {}, data: [{ id: 123 }] });

        // WHEN
        const wrapper = shallowMount(Category, { global: mountOptions });
        const comp = wrapper.vm;
        await comp.$nextTick();

        // THEN
        expect(categoryServiceStub.retrieve).toHaveBeenCalledOnce();
        expect(comp.categories[0]).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
    describe('Handles', () => {
      let comp: CategoryComponentType;

      beforeEach(async () => {
        const wrapper = shallowMount(Category, { global: mountOptions });
        comp = wrapper.vm;
        await comp.$nextTick();
        categoryServiceStub.retrieve.mockReset();
        categoryServiceStub.retrieve.mockResolvedValue({ headers: {}, data: [] });
      });

      it('Should call delete service on confirmDelete', async () => {
        // GIVEN
        categoryServiceStub.delete.mockResolvedValue({});

        // WHEN
        comp.prepareRemove({ id: 123 });

        comp.removeCategory();
        await comp.$nextTick(); // clear components

        // THEN
        expect(categoryServiceStub.delete).toHaveBeenCalled();

        // THEN
        await comp.$nextTick(); // handle component clear watch
        expect(categoryServiceStub.retrieve).toHaveBeenCalledTimes(1);
      });
    });
  });
});
