import { type Ref, defineComponent, inject, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { useAlertService } from '@/shared/alert/alert.service';
import { type ICategory } from '@/shared/model/category.model';

import CategoryService from './category.service';

export default defineComponent({
  name: 'Category',
  setup() {
    const { t: t$ } = useI18n();
    const categoryService = inject('categoryService', () => new CategoryService());
    const alertService = inject('alertService', () => useAlertService(), true);

    const categories: Ref<ICategory[]> = ref([]);

    const isFetching = ref(false);
    const createEntity = ref<any>(null);
    const newCategoryName = ref('');
    const createCategoryError = ref('');
    const isCreatingCategory = ref(false);
    const editEntity = ref<any>(null);
    const editingCategory: Ref<ICategory> = ref(null);
    const editCategoryName = ref('');
    const editCategoryError = ref('');
    const isUpdatingCategory = ref(false);

    const clear = () => {};

    const retrieveCategorys = async () => {
      isFetching.value = true;
      try {
        const res = await categoryService().retrieve();
        categories.value = res.data ?? [];
      } catch (err) {
        alertService.showHttpError(err.response);
      } finally {
        isFetching.value = false;
      }
    };

    onMounted(async () => {
      await retrieveCategorys();
    });

    const openCreateCategory = () => {
      newCategoryName.value = '';
      createCategoryError.value = '';
      createEntity.value.show();
    };

    const closeCreateCategory = () => {
      createEntity.value.hide();
      newCategoryName.value = '';
      createCategoryError.value = '';
    };

    const createCategory = async () => {
      const name = newCategoryName.value.trim();
      if (!name) {
        createCategoryError.value = t$('project1OnlineShoppingWebsiteApp.category.create.required').toString();
        return;
      }
      if (name.length > 100) {
        createCategoryError.value = t$('project1OnlineShoppingWebsiteApp.category.create.maxLength').toString();
        return;
      }

      isCreatingCategory.value = true;
      createCategoryError.value = '';
      try {
        const createdCategory = await categoryService().create({ name });
        categories.value = [...categories.value, createdCategory];
        alertService.showSuccess(t$('project1OnlineShoppingWebsiteApp.category.created', { param: createdCategory.id }).toString());
        closeCreateCategory();
      } catch (error) {
        alertService.showHttpError(error.response);
      } finally {
        isCreatingCategory.value = false;
      }
    };

    const openEditCategory = (category: ICategory) => {
      editingCategory.value = category;
      editCategoryName.value = category.name ?? '';
      editCategoryError.value = '';
      editEntity.value.show();
    };

    const closeEditCategory = () => {
      editEntity.value.hide();
      editingCategory.value = null;
      editCategoryName.value = '';
      editCategoryError.value = '';
    };

    const updateCategory = async () => {
      const name = editCategoryName.value.trim();
      if (!name) {
        editCategoryError.value = t$('project1OnlineShoppingWebsiteApp.category.create.required').toString();
        return;
      }
      if (name.length > 100) {
        editCategoryError.value = t$('project1OnlineShoppingWebsiteApp.category.create.maxLength').toString();
        return;
      }
      if (!editingCategory.value?.id) {
        return;
      }

      isUpdatingCategory.value = true;
      editCategoryError.value = '';
      try {
        const updatedCategory = await categoryService().partialUpdate({ id: editingCategory.value.id, name });
        categories.value = categories.value.map(category => (category.id === updatedCategory.id ? updatedCategory : category));
        alertService.showInfo(t$('project1OnlineShoppingWebsiteApp.category.updated', { param: updatedCategory.id }).toString());
        closeEditCategory();
      } catch (error) {
        alertService.showHttpError(error.response);
      } finally {
        isUpdatingCategory.value = false;
      }
    };

    const removeId: Ref<number> = ref(null);
    const removeEntity = ref<any>(null);
    const prepareRemove = (instance: ICategory) => {
      removeId.value = instance.id;
      removeEntity.value.show();
    };
    const closeDialog = () => {
      removeEntity.value.hide();
    };
    const removeCategory = async () => {
      try {
        await categoryService().delete(removeId.value);
        const message = t$('project1OnlineShoppingWebsiteApp.category.deleted', { param: removeId.value }).toString();
        alertService.showInfo(message, { variant: 'danger' });
        removeId.value = null;
        retrieveCategorys();
        closeDialog();
      } catch (error) {
        alertService.showHttpError(error.response);
      }
    };

    return {
      categories,
      isFetching,
      retrieveCategorys,
      clear,
      createEntity,
      newCategoryName,
      createCategoryError,
      isCreatingCategory,
      openCreateCategory,
      closeCreateCategory,
      createCategory,
      editEntity,
      editingCategory,
      editCategoryName,
      editCategoryError,
      isUpdatingCategory,
      openEditCategory,
      closeEditCategory,
      updateCategory,
      removeId,
      removeEntity,
      prepareRemove,
      closeDialog,
      removeCategory,
      t$,
    };
  },
});
