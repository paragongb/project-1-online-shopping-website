<template>
  <div v-if="isAdmin">
    <h2 id="page-heading" data-cy="ProductHeading">
      <span id="product">{{ t$('project1OnlineShoppingWebsiteApp.product.home.title') }}</span>
      <div class="d-flex justify-content-end">
        <button class="btn btn-info me-2" @click="handleSyncList" :disabled="isFetching">
          <font-awesome-icon icon="sync" :spin="isFetching"></font-awesome-icon>
          <span>{{ t$('project1OnlineShoppingWebsiteApp.product.home.refreshListLabel') }}</span>
        </button>
        <router-link :to="{ name: 'ProductCreate' }" custom v-slot="{ navigate }">
          <button
            @click="navigate"
            id="jh-create-entity"
            data-cy="entityCreateButton"
            class="btn btn-primary jh-create-entity create-product"
          >
            <font-awesome-icon icon="plus"></font-awesome-icon>
            <span>{{ t$('project1OnlineShoppingWebsiteApp.product.home.createLabel') }}</span>
          </button>
        </router-link>
      </div>
    </h2>
    <br />
    <div class="alert alert-warning" v-if="!isFetching && products?.length === 0">
      <span>{{ t$('project1OnlineShoppingWebsiteApp.product.home.notFound') }}</span>
    </div>
    <div class="table-responsive" v-if="products?.length > 0">
      <table class="table table-striped" aria-describedby="products">
        <thead>
          <tr>
            <th scope="col" @click="changeOrder('id')">
              <span>{{ t$('global.field.id') }}</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'id'"></jhi-sort-indicator>
            </th>
            <th scope="col" @click="changeOrder('sku')">
              <span>{{ t$('project1OnlineShoppingWebsiteApp.product.sku') }}</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'sku'"></jhi-sort-indicator>
            </th>
            <th scope="col" @click="changeOrder('name')">
              <span>{{ t$('project1OnlineShoppingWebsiteApp.product.name') }}</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'name'"></jhi-sort-indicator>
            </th>
            <th scope="col" @click="changeOrder('description')">
              <span>{{ t$('project1OnlineShoppingWebsiteApp.product.description') }}</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'description'"></jhi-sort-indicator>
            </th>
            <th scope="col" @click="changeOrder('price')">
              <span>{{ t$('project1OnlineShoppingWebsiteApp.product.price') }}</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'price'"></jhi-sort-indicator>
            </th>
            <th scope="col" @click="changeOrder('stockQuantity')">
              <span>{{ t$('project1OnlineShoppingWebsiteApp.product.stockQuantity') }}</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'stockQuantity'"></jhi-sort-indicator>
            </th>
            <th scope="col" @click="changeOrder('status')">
              <span>{{ t$('project1OnlineShoppingWebsiteApp.product.status') }}</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'status'"></jhi-sort-indicator>
            </th>
            <th scope="col" @click="changeOrder('image')">
              <span>{{ t$('project1OnlineShoppingWebsiteApp.product.image') }}</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'image'"></jhi-sort-indicator>
            </th>
            <th scope="col" @click="changeOrder('category.name')">
              <span>{{ t$('project1OnlineShoppingWebsiteApp.product.category') }}</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'category.name'"></jhi-sort-indicator>
            </th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id" data-cy="entityTable">
            <td>
              <router-link :to="{ name: 'ProductView', params: { productId: product.id } }">{{ product.id }}</router-link>
            </td>
            <td>{{ product.sku }}</td>
            <td>{{ product.name }}</td>
            <td>{{ product.description }}</td>
            <td>{{ product.price }}</td>
            <td>{{ product.stockQuantity }}</td>
            <td>{{ t$('project1OnlineShoppingWebsiteApp.ProductStatus.' + product.status) }}</td>
            <td>
              <a v-if="product.image" @click="openFile(product.imageContentType, product.image)">
                <img :src="'data:' + product.imageContentType + ';base64,' + product.image" style="max-height: 30px" alt="product" />
              </a>
              <span v-if="product.image">{{ product.imageContentType }}, {{ byteSize(product.image) }}</span>
            </td>
            <td>
              <div v-if="product.category">
                <router-link :to="{ name: 'CategoryView', params: { categoryId: product.category.id } }">{{
                  product.category.name
                }}</router-link>
              </div>
            </td>
            <td class="text-end">
              <div class="btn-group">
                <router-link :to="{ name: 'ProductView', params: { productId: product.id } }" custom v-slot="{ navigate }">
                  <button @click="navigate" class="btn btn-info btn-sm details" data-cy="entityDetailsButton">
                    <font-awesome-icon icon="eye"></font-awesome-icon>
                    <span class="d-none d-md-inline">{{ t$('entity.action.view') }}</span>
                  </button>
                </router-link>
                <router-link :to="{ name: 'ProductEdit', params: { productId: product.id } }" custom v-slot="{ navigate }">
                  <button @click="navigate" class="btn btn-primary btn-sm edit" data-cy="entityEditButton">
                    <font-awesome-icon icon="pencil-alt"></font-awesome-icon>
                    <span class="d-none d-md-inline">{{ t$('entity.action.edit') }}</span>
                  </button>
                </router-link>
                <b-button @click="prepareRemove(product)" variant="danger" class="btn btn-sm" data-cy="entityDeleteButton">
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
        <span id="project1OnlineShoppingWebsiteApp.product.delete.question" data-cy="productDeleteDialogHeading">{{
          t$('entity.delete.title')
        }}</span>
      </template>
      <div class="modal-body">
        <p id="jhi-delete-product-heading">{{ t$('project1OnlineShoppingWebsiteApp.product.delete.question', { id: removeId }) }}</p>
      </div>
      <template #footer>
        <div>
          <button type="button" class="btn btn-secondary" @click="closeDialog()">{{ t$('entity.action.cancel') }}</button>
          <button
            type="button"
            class="btn btn-primary"
            id="jhi-confirm-delete-product"
            data-cy="entityConfirmDeleteButton"
            @click="removeProduct"
          >
            {{ t$('entity.action.delete') }}
          </button>
        </div>
      </template>
    </b-modal>
    <div v-show="products?.length > 0">
      <div class="d-flex justify-content-center">
        <jhi-item-count :page="page" :total="queryCount" :items-per-page="itemsPerPage"></jhi-item-count>
      </div>
      <div class="d-flex justify-content-center">
        <b-pagination size="md" :total-rows="totalItems" v-model="page" :per-page="itemsPerPage"></b-pagination>
      </div>
    </div>
  </div>

  <div class="shop-page" v-else>
    <div class="shop-hero">
      <div class="shop-hero-text">
        <h1 class="shop-title">{{ t$('project1OnlineShoppingWebsiteApp.product.home.title') }}</h1>
        <p class="shop-subtitle">{{ t$('project1OnlineShoppingWebsiteApp.product.shop.subtitle') }}</p>
      </div>
    </div>

    <div class="shop-toolbar">
      <div class="shop-search">
        <font-awesome-icon icon="search" class="shop-search-icon"></font-awesome-icon>
        <input
          type="search"
          class="form-control shop-search-input"
          v-model="searchQuery"
          :placeholder="t$('project1OnlineShoppingWebsiteApp.product.shop.searchPlaceholder')"
          data-cy="shopSearchInput"
        />
      </div>
      <div class="shop-sort">
        <label class="shop-sort-label" for="shop-sort-select">{{ t$('project1OnlineShoppingWebsiteApp.product.shop.sortBy') }}</label>
        <select id="shop-sort-select" class="form-select shop-sort-select" v-model="sortSelection">
          <option value="name,asc">{{ t$('project1OnlineShoppingWebsiteApp.product.shop.sortNameAsc') }}</option>
          <option value="name,desc">{{ t$('project1OnlineShoppingWebsiteApp.product.shop.sortNameDesc') }}</option>
          <option value="price,asc">{{ t$('project1OnlineShoppingWebsiteApp.product.shop.sortPriceAsc') }}</option>
          <option value="price,desc">{{ t$('project1OnlineShoppingWebsiteApp.product.shop.sortPriceDesc') }}</option>
        </select>
      </div>
    </div>

    <div class="shop-loading" v-if="isFetching">
      <div class="spinner-border shop-spinner" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div class="shop-empty" v-else-if="filteredProducts?.length === 0">
      <font-awesome-icon icon="box-open" class="shop-empty-icon"></font-awesome-icon>
      <p>{{ t$('project1OnlineShoppingWebsiteApp.product.home.notFound') }}</p>
    </div>

    <div class="shop-grid" v-else>
      <div class="shop-card" v-for="product in filteredProducts" :key="product.id" data-cy="shopProductCard">
        <a class="shop-card-media" role="button" @click="openProductDetails(product)">
          <img
            v-if="product.image"
            :src="'data:' + product.imageContentType + ';base64,' + product.image"
            :alt="product.name"
            class="shop-card-img"
          />
          <div v-else class="shop-card-img-placeholder">
            <font-awesome-icon icon="image"></font-awesome-icon>
          </div>
          <span class="badge shop-status-badge" :class="'bg-' + statusVariant(product.status)">
            {{ t$('project1OnlineShoppingWebsiteApp.ProductStatus.' + product.status) }}
          </span>
        </a>
        <div class="shop-card-body">
          <span class="shop-card-category" v-if="product.category">{{ product.category.name }}</span>
          <a class="shop-card-title" role="button" @click="openProductDetails(product)">
            {{ product.name }}
          </a>
          <p class="shop-card-description">{{ product.description }}</p>
          <div class="shop-card-footer">
            <span class="shop-card-price">{{ '$' + product.price }}</span>
            <button type="button" class="btn btn-sm shop-btn-view" data-cy="shopViewDetailsButton" @click="openProductDetails(product)">
              {{ t$('project1OnlineShoppingWebsiteApp.product.shop.viewDetails') }}
            </button>
          </div>
          <button
            type="button"
            class="btn shop-btn-add-cart"
            data-cy="shopAddToCartButton"
            :disabled="product.status === 'OUT_OF_STOCK' || addingToCartId === product.id"
            @click="addToCart(product)"
          >
            <font-awesome-icon icon="cart-plus"></font-awesome-icon>
            <span>{{
              product.status === 'OUT_OF_STOCK'
                ? t$('project1OnlineShoppingWebsiteApp.product.shop.outOfStock')
                : addingToCartId === product.id
                  ? t$('project1OnlineShoppingWebsiteApp.product.shop.addingToCart')
                  : t$('project1OnlineShoppingWebsiteApp.product.shop.addToCart')
            }}</span>
          </button>
        </div>
      </div>
    </div>

    <b-modal
      v-model="showProductDetails"
      no-footer
      centered
      size="lg"
      body-class="shop-modal-body"
      content-class="shop-modal-content"
      @hide="closeProductDetails"
    >
      <template #title>
        <span class="shop-modal-title">{{ selectedProduct?.name }}</span>
      </template>
      <div class="shop-modal" v-if="selectedProduct">
        <div class="shop-modal-media">
          <img
            v-if="selectedProduct.image"
            :src="'data:' + selectedProduct.imageContentType + ';base64,' + selectedProduct.image"
            :alt="selectedProduct.name"
            class="shop-modal-img"
          />
          <div v-else class="shop-card-img-placeholder shop-modal-img-placeholder">
            <font-awesome-icon icon="image"></font-awesome-icon>
          </div>
        </div>
        <div class="shop-modal-info">
          <span class="badge shop-status-badge shop-modal-badge" :class="'bg-' + statusVariant(selectedProduct.status)">
            {{ t$('project1OnlineShoppingWebsiteApp.ProductStatus.' + selectedProduct.status) }}
          </span>
          <span class="shop-card-category" v-if="selectedProduct.category">{{ selectedProduct.category.name }}</span>
          <p class="shop-modal-price">{{ '$' + selectedProduct.price }}</p>
          <p class="shop-modal-description">{{ selectedProduct.description }}</p>
          <ul class="shop-modal-meta">
            <li>
              <span class="shop-modal-meta-label">{{ t$('project1OnlineShoppingWebsiteApp.product.sku') }}</span>
              <span>{{ selectedProduct.sku }}</span>
            </li>
            <li>
              <span class="shop-modal-meta-label">{{ t$('project1OnlineShoppingWebsiteApp.product.stockQuantity') }}</span>
              <span>{{ selectedProduct.stockQuantity }}</span>
            </li>
          </ul>
          <div class="shop-modal-actions">
            <button
              type="button"
              class="btn shop-btn-add-cart"
              data-cy="shopModalAddToCartButton"
              :disabled="selectedProduct.status === 'OUT_OF_STOCK' || addingToCartId === selectedProduct.id"
              @click="addToCart(selectedProduct)"
            >
              <font-awesome-icon icon="cart-plus"></font-awesome-icon>
              <span>{{
                selectedProduct.status === 'OUT_OF_STOCK'
                  ? t$('project1OnlineShoppingWebsiteApp.product.shop.outOfStock')
                  : addingToCartId === selectedProduct.id
                    ? t$('project1OnlineShoppingWebsiteApp.product.shop.addingToCart')
                    : t$('project1OnlineShoppingWebsiteApp.product.shop.addToCart')
              }}</span>
            </button>
            <button type="button" class="btn shop-btn-view shop-modal-close" @click="closeProductDetails">
              {{ t$('project1OnlineShoppingWebsiteApp.product.shop.close') }}
            </button>
          </div>
        </div>
      </div>
    </b-modal>

    <div v-show="products?.length > 0" class="shop-pagination">
      <div class="d-flex justify-content-center">
        <jhi-item-count :page="page" :total="queryCount" :items-per-page="itemsPerPage"></jhi-item-count>
      </div>
      <div class="d-flex justify-content-center">
        <b-pagination size="md" :total-rows="totalItems" v-model="page" :per-page="itemsPerPage"></b-pagination>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./product.component.ts"></script>
<style lang="scss" src="./product-shop.scss"></style>
