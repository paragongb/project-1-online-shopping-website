<template>
  <div>
    <h2 id="page-heading" data-cy="WishlistHeading">
      <span id="wishlist">{{ t$('project1OnlineShoppingWebsiteApp.wishlist.home.title') }}</span>
      <div class="d-flex justify-content-end">
        <button class="btn btn-info me-2" @click="handleSyncList" :disabled="isFetching">
          <font-awesome-icon icon="sync" :spin="isFetching"></font-awesome-icon>
          <span>{{ t$('project1OnlineShoppingWebsiteApp.wishlist.home.refreshListLabel') }}</span>
        </button>
        <router-link :to="{ name: 'WishlistCreate' }" custom v-slot="{ navigate }">
          <button
            @click="navigate"
            id="jh-create-entity"
            data-cy="entityCreateButton"
            class="btn btn-primary jh-create-entity create-wishlist"
          >
            <font-awesome-icon icon="plus"></font-awesome-icon>
            <span>{{ t$('project1OnlineShoppingWebsiteApp.wishlist.home.createLabel') }}</span>
          </button>
        </router-link>
      </div>
    </h2>
    <br />
    <div class="alert alert-warning" v-if="!isFetching && wishlists?.length === 0">
      <span>{{ t$('project1OnlineShoppingWebsiteApp.wishlist.home.notFound') }}</span>
    </div>
    <div class="table-responsive" v-if="wishlists?.length > 0">
      <table class="table table-striped" aria-describedby="wishlists">
        <thead>
          <tr>
            <th scope="col">
              <span>{{ t$('global.field.id') }}</span>
            </th>
            <th scope="col">
              <span>{{ t$('project1OnlineShoppingWebsiteApp.wishlist.createdDate') }}</span>
            </th>
            <th scope="col">
              <span>{{ t$('project1OnlineShoppingWebsiteApp.wishlist.user') }}</span>
            </th>
            <th scope="col">
              <span>{{ t$('project1OnlineShoppingWebsiteApp.wishlist.product') }}</span>
            </th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="wishlist in wishlists" :key="wishlist.id" data-cy="entityTable">
            <td>
              <router-link :to="{ name: 'WishlistView', params: { wishlistId: wishlist.id } }">{{ wishlist.id }}</router-link>
            </td>
            <td>{{ formatDateShort(wishlist.createdDate) || '' }}</td>
            <td>
              {{ wishlist.user ? wishlist.user.login : '' }}
            </td>
            <td>
              <span v-for="(product, i) in wishlist.products" :key="product.id"
                >{{ i > 0 ? ', ' : '' }}
                <router-link class="form-control-static" :to="{ name: 'ProductView', params: { productId: product.id } }">{{
                  product.name
                }}</router-link>
              </span>
            </td>
            <td class="text-end">
              <div class="btn-group">
                <router-link :to="{ name: 'WishlistView', params: { wishlistId: wishlist.id } }" custom v-slot="{ navigate }">
                  <button @click="navigate" class="btn btn-info btn-sm details" data-cy="entityDetailsButton">
                    <font-awesome-icon icon="eye"></font-awesome-icon>
                    <span class="d-none d-md-inline">{{ t$('entity.action.view') }}</span>
                  </button>
                </router-link>
                <router-link :to="{ name: 'WishlistEdit', params: { wishlistId: wishlist.id } }" custom v-slot="{ navigate }">
                  <button @click="navigate" class="btn btn-primary btn-sm edit" data-cy="entityEditButton">
                    <font-awesome-icon icon="pencil-alt"></font-awesome-icon>
                    <span class="d-none d-md-inline">{{ t$('entity.action.edit') }}</span>
                  </button>
                </router-link>
                <b-button @click="prepareRemove(wishlist)" variant="danger" class="btn btn-sm" data-cy="entityDeleteButton">
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
        <span id="project1OnlineShoppingWebsiteApp.wishlist.delete.question" data-cy="wishlistDeleteDialogHeading">{{
          t$('entity.delete.title')
        }}</span>
      </template>
      <div class="modal-body">
        <p id="jhi-delete-wishlist-heading">{{ t$('project1OnlineShoppingWebsiteApp.wishlist.delete.question', { id: removeId }) }}</p>
      </div>
      <template #footer>
        <div>
          <button type="button" class="btn btn-secondary" @click="closeDialog()">{{ t$('entity.action.cancel') }}</button>
          <button
            type="button"
            class="btn btn-primary"
            id="jhi-confirm-delete-wishlist"
            data-cy="entityConfirmDeleteButton"
            @click="removeWishlist"
          >
            {{ t$('entity.action.delete') }}
          </button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script lang="ts" src="./wishlist.component.ts"></script>
