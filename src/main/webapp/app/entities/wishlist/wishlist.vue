<template>
  <div v-if="isAdmin">
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

  <div class="wishlist-page" v-else>
    <div class="wishlist-hero">
      <div>
        <span class="wishlist-eyebrow">{{ t$('project1OnlineShoppingWebsiteApp.wishlist.myWishlist.eyebrow') }}</span>
        <h1 class="wishlist-title">{{ t$('project1OnlineShoppingWebsiteApp.wishlist.myWishlist.title') }}</h1>
        <p class="wishlist-subtitle">{{ t$('project1OnlineShoppingWebsiteApp.wishlist.myWishlist.subtitle') }}</p>
      </div>
      <span class="wishlist-count" v-if="wishlistStore.products.length > 0">
        {{ t$('project1OnlineShoppingWebsiteApp.wishlist.myWishlist.itemCount', { count: wishlistStore.products.length }) }}
      </span>
    </div>

    <div class="wishlist-loading" v-if="isFetching">
      <div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>
    </div>

    <div class="wishlist-empty" v-else-if="wishlistStore.products.length === 0">
      <span class="wishlist-empty-icon"><font-awesome-icon icon="heart"></font-awesome-icon></span>
      <h2>{{ t$('project1OnlineShoppingWebsiteApp.wishlist.myWishlist.emptyTitle') }}</h2>
      <p>{{ t$('project1OnlineShoppingWebsiteApp.wishlist.myWishlist.empty') }}</p>
      <router-link :to="{ name: 'Product' }" class="btn wishlist-btn-primary">
        {{ t$('project1OnlineShoppingWebsiteApp.wishlist.myWishlist.browseProducts') }}
      </router-link>
    </div>

    <div class="wishlist-grid" v-else>
      <article class="wishlist-card" v-for="product in wishlistStore.products" :key="product.id" data-cy="wishlistProductCard">
        <div class="wishlist-card-media">
          <img v-if="product.image" :src="'data:' + product.imageContentType + ';base64,' + product.image" :alt="product.name" />
          <font-awesome-icon v-else icon="image"></font-awesome-icon>
          <span class="badge wishlist-status" :class="'bg-' + statusVariant(product.status)">
            {{ t$('project1OnlineShoppingWebsiteApp.ProductStatus.' + product.status) }}
          </span>
        </div>
        <div class="wishlist-card-body">
          <span class="wishlist-category" v-if="product.category">{{ product.category.name }}</span>
          <h2 class="wishlist-product-name">{{ product.name }}</h2>
          <p class="wishlist-description">{{ product.description }}</p>
          <span class="wishlist-price">{{ '$' + product.price }}</span>
          <div class="wishlist-actions">
            <button
              type="button"
              class="btn wishlist-btn-primary"
              :disabled="product.status === 'OUT_OF_STOCK' || addingToCartId === product.id"
              @click="addToCart(product)"
            >
              <font-awesome-icon icon="cart-plus"></font-awesome-icon>
              {{
                addingToCartId === product.id
                  ? t$('project1OnlineShoppingWebsiteApp.wishlist.myWishlist.addingToCart')
                  : t$('project1OnlineShoppingWebsiteApp.wishlist.myWishlist.addToCart')
              }}
            </button>
            <button
              type="button"
              class="btn wishlist-btn-remove"
              :disabled="removingProductId === product.id"
              @click="removeProduct(product)"
            >
              <font-awesome-icon icon="trash"></font-awesome-icon>
              {{ t$('project1OnlineShoppingWebsiteApp.wishlist.myWishlist.remove') }}
            </button>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script lang="ts" src="./wishlist.component.ts"></script>
<style lang="scss" src="./wishlist.scss"></style>
