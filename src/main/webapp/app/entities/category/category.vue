<template>
  <div class="admin-categories-page">
    <header class="admin-categories-header">
      <div>
        <span class="admin-categories-eyebrow">{{ t$('project1OnlineShoppingWebsiteApp.category.home.eyebrow') }}</span>
        <h1 id="page-heading" data-cy="CategoryHeading">
          {{ t$('project1OnlineShoppingWebsiteApp.category.home.title') }}
        </h1>
        <p>{{ t$('project1OnlineShoppingWebsiteApp.category.home.subtitle') }}</p>
      </div>
      <button
        type="button"
        @click="openCreateCategory"
        id="jh-create-entity"
        data-cy="entityCreateButton"
        class="btn admin-category-add-button create-category"
      >
        <font-awesome-icon icon="plus"></font-awesome-icon>
        <span>{{ t$('project1OnlineShoppingWebsiteApp.category.home.createLabel') }}</span>
      </button>
    </header>

    <div class="admin-categories-loading" v-if="isFetching && categories?.length === 0">
      <div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>
    </div>

    <section class="admin-categories-empty" v-else-if="categories?.length === 0">
      <span><font-awesome-icon icon="tags"></font-awesome-icon></span>
      <h2>{{ t$('project1OnlineShoppingWebsiteApp.category.home.notFound') }}</h2>
      <p>{{ t$('project1OnlineShoppingWebsiteApp.category.home.emptySubtitle') }}</p>
    </section>

    <section class="admin-categories-panel" v-else>
      <div class="admin-categories-panel-heading">
        <div>
          <h2>{{ t$('project1OnlineShoppingWebsiteApp.category.home.listTitle') }}</h2>
          <p>{{ t$('project1OnlineShoppingWebsiteApp.category.home.count', { count: categories.length }) }}</p>
        </div>
      </div>

      <ul class="admin-category-list" aria-describedby="categories">
        <li class="admin-category-item" v-for="category in categories" :key="category.id" data-cy="entityTable">
          <span class="admin-category-icon"><font-awesome-icon icon="tags"></font-awesome-icon></span>
          <div class="admin-category-content">
            <strong>{{ category.name }}</strong>
            <p v-if="category.description">{{ category.description }}</p>
            <p v-else class="admin-category-no-description">
              {{ t$('project1OnlineShoppingWebsiteApp.category.home.noDescription') }}
            </p>
          </div>
          <div class="admin-category-actions">
            <button
              type="button"
              @click="openEditCategory(category)"
              class="btn admin-category-action admin-category-rename edit"
              data-cy="entityEditButton"
            >
              <font-awesome-icon icon="pencil-alt"></font-awesome-icon>
              <span>{{ t$('project1OnlineShoppingWebsiteApp.category.rename') }}</span>
            </button>
            <b-button @click="prepareRemove(category)" class="btn admin-category-action admin-category-remove" data-cy="entityDeleteButton">
              <font-awesome-icon icon="times"></font-awesome-icon>
              <span>{{ t$('project1OnlineShoppingWebsiteApp.category.remove') }}</span>
            </b-button>
          </div>
        </li>
      </ul>
    </section>

    <b-modal ref="createEntity" id="createCategoryModal">
      <template #title>
        <span class="admin-category-modal-title">{{ t$('project1OnlineShoppingWebsiteApp.category.create.title') }}</span>
      </template>
      <form class="admin-category-create-form" @submit.prevent="createCategory">
        <label for="new-category-name">{{ t$('project1OnlineShoppingWebsiteApp.category.create.nameLabel') }}</label>
        <input
          id="new-category-name"
          v-model="newCategoryName"
          type="text"
          maxlength="100"
          autocomplete="off"
          autofocus
          data-cy="name"
          :placeholder="t$('project1OnlineShoppingWebsiteApp.category.create.namePlaceholder')"
          :class="{ 'is-invalid': createCategoryError }"
          @input="createCategoryError = ''"
        />
        <small>{{ t$('project1OnlineShoppingWebsiteApp.category.create.help') }}</small>
        <p class="admin-category-create-error" v-if="createCategoryError">{{ createCategoryError }}</p>
      </form>
      <template #footer>
        <div class="admin-category-modal-actions">
          <button type="button" class="btn admin-category-modal-cancel" :disabled="isCreatingCategory" @click="closeCreateCategory">
            {{ t$('entity.action.cancel') }}
          </button>
          <button
            type="button"
            class="btn admin-category-modal-save"
            :disabled="isCreatingCategory"
            data-cy="entityCreateSaveButton"
            @click="createCategory"
          >
            <span class="spinner-border spinner-border-sm" v-if="isCreatingCategory" role="status"></span>
            <font-awesome-icon icon="plus" v-else></font-awesome-icon>
            {{ t$('project1OnlineShoppingWebsiteApp.category.create.save') }}
          </button>
        </div>
      </template>
    </b-modal>

    <b-modal ref="editEntity" id="editCategoryModal">
      <template #title>
        <span class="admin-category-modal-title">{{ t$('project1OnlineShoppingWebsiteApp.category.edit.title') }}</span>
      </template>
      <form class="admin-category-create-form" @submit.prevent="updateCategory">
        <label for="edit-category-name">{{ t$('project1OnlineShoppingWebsiteApp.category.create.nameLabel') }}</label>
        <input
          id="edit-category-name"
          v-model="editCategoryName"
          type="text"
          maxlength="100"
          autocomplete="off"
          autofocus
          data-cy="editName"
          :placeholder="t$('project1OnlineShoppingWebsiteApp.category.create.namePlaceholder')"
          :class="{ 'is-invalid': editCategoryError }"
          @input="editCategoryError = ''"
        />
        <small>{{ t$('project1OnlineShoppingWebsiteApp.category.edit.help') }}</small>
        <p class="admin-category-create-error" v-if="editCategoryError">{{ editCategoryError }}</p>
      </form>
      <template #footer>
        <div class="admin-category-modal-actions">
          <button type="button" class="btn admin-category-modal-cancel" :disabled="isUpdatingCategory" @click="closeEditCategory">
            {{ t$('entity.action.cancel') }}
          </button>
          <button
            type="button"
            class="btn admin-category-modal-save"
            :disabled="isUpdatingCategory"
            data-cy="entityEditSaveButton"
            @click="updateCategory"
          >
            <span class="spinner-border spinner-border-sm" v-if="isUpdatingCategory" role="status"></span>
            <font-awesome-icon icon="save" v-else></font-awesome-icon>
            {{ t$('project1OnlineShoppingWebsiteApp.category.edit.save') }}
          </button>
        </div>
      </template>
    </b-modal>

    <b-modal ref="removeEntity" id="removeEntity">
      <template #title>
        <span id="project1OnlineShoppingWebsiteApp.category.delete.question" data-cy="categoryDeleteDialogHeading">
          {{ t$('project1OnlineShoppingWebsiteApp.category.delete.title') }}
        </span>
      </template>
      <div class="modal-body admin-category-delete-message">
        <span><font-awesome-icon icon="times"></font-awesome-icon></span>
        <div>
          <strong>{{ t$('project1OnlineShoppingWebsiteApp.category.delete.confirmTitle') }}</strong>
          <p id="jhi-delete-category-heading">
            {{ t$('project1OnlineShoppingWebsiteApp.category.delete.question', { id: removeId }) }}
          </p>
        </div>
      </div>
      <template #footer>
        <div class="admin-category-modal-actions">
          <button type="button" class="btn admin-category-modal-cancel" @click="closeDialog()">
            {{ t$('entity.action.cancel') }}
          </button>
          <button
            type="button"
            class="btn admin-category-modal-remove"
            id="jhi-confirm-delete-category"
            data-cy="entityConfirmDeleteButton"
            @click="removeCategory"
          >
            {{ t$('project1OnlineShoppingWebsiteApp.category.remove') }}
          </button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script lang="ts" src="./category.component.ts"></script>
<style lang="scss" src="./category.scss"></style>
