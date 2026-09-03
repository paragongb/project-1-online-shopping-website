<template>
  <div>
    <h2 id="page-heading" data-cy="CategoryHeading">
      <span id="category">{{ t$('project1OnlineShoppingWebsiteApp.category.home.title') }}</span>
      <div class="d-flex justify-content-end">
        <button class="btn btn-info me-2" @click="handleSyncList" :disabled="isFetching">
          <font-awesome-icon icon="sync" :spin="isFetching"></font-awesome-icon>
          <span>{{ t$('project1OnlineShoppingWebsiteApp.category.home.refreshListLabel') }}</span>
        </button>
        <router-link :to="{ name: 'CategoryCreate' }" custom v-slot="{ navigate }">
          <button
            @click="navigate"
            id="jh-create-entity"
            data-cy="entityCreateButton"
            class="btn btn-primary jh-create-entity create-category"
          >
            <font-awesome-icon icon="plus"></font-awesome-icon>
            <span>{{ t$('project1OnlineShoppingWebsiteApp.category.home.createLabel') }}</span>
          </button>
        </router-link>
      </div>
    </h2>
    <br />
    <div class="alert alert-warning" v-if="!isFetching && categories?.length === 0">
      <span>{{ t$('project1OnlineShoppingWebsiteApp.category.home.notFound') }}</span>
    </div>
    <div class="table-responsive" v-if="categories?.length > 0">
      <table class="table table-striped" aria-describedby="categories">
        <thead>
          <tr>
            <th scope="col">
              <span>{{ t$('global.field.id') }}</span>
            </th>
            <th scope="col">
              <span>{{ t$('project1OnlineShoppingWebsiteApp.category.name') }}</span>
            </th>
            <th scope="col">
              <span>{{ t$('project1OnlineShoppingWebsiteApp.category.description') }}</span>
            </th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="category in categories" :key="category.id" data-cy="entityTable">
            <td>
              <router-link :to="{ name: 'CategoryView', params: { categoryId: category.id } }">{{ category.id }}</router-link>
            </td>
            <td>{{ category.name }}</td>
            <td>{{ category.description }}</td>
            <td class="text-end">
              <div class="btn-group">
                <router-link :to="{ name: 'CategoryView', params: { categoryId: category.id } }" custom v-slot="{ navigate }">
                  <button @click="navigate" class="btn btn-info btn-sm details" data-cy="entityDetailsButton">
                    <font-awesome-icon icon="eye"></font-awesome-icon>
                    <span class="d-none d-md-inline">{{ t$('entity.action.view') }}</span>
                  </button>
                </router-link>
                <router-link :to="{ name: 'CategoryEdit', params: { categoryId: category.id } }" custom v-slot="{ navigate }">
                  <button @click="navigate" class="btn btn-primary btn-sm edit" data-cy="entityEditButton">
                    <font-awesome-icon icon="pencil-alt"></font-awesome-icon>
                    <span class="d-none d-md-inline">{{ t$('entity.action.edit') }}</span>
                  </button>
                </router-link>
                <b-button @click="prepareRemove(category)" variant="danger" class="btn btn-sm" data-cy="entityDeleteButton">
                  <font-awesome-icon icon="times"></font-awesome-icon>
                  <span class="d-none d-md-inline">{{ t$('entity.action.delete') }}</span>
                </b-button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <b-modal ref="removeEntity" id="removeEntity">
      <template #title>
        <span id="project1OnlineShoppingWebsiteApp.category.delete.question" data-cy="categoryDeleteDialogHeading">{{
          t$('entity.delete.title')
        }}</span>
      </template>
      <div class="modal-body">
        <p id="jhi-delete-category-heading">{{ t$('project1OnlineShoppingWebsiteApp.category.delete.question', { id: removeId }) }}</p>
      </div>
      <template #footer>
        <div>
          <button type="button" class="btn btn-secondary" @click="closeDialog()">{{ t$('entity.action.cancel') }}</button>
          <button
            type="button"
            class="btn btn-primary"
            id="jhi-confirm-delete-category"
            data-cy="entityConfirmDeleteButton"
            @click="removeCategory"
          >
            {{ t$('entity.action.delete') }}
          </button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script lang="ts" src="./category.component.ts"></script>
