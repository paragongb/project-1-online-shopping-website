<template>
  <div class="admin-products-page" v-if="isAdmin">
    <header class="admin-products-header">
      <div>
        <span class="admin-products-eyebrow">{{ t$('project1OnlineShoppingWebsiteApp.product.admin.eyebrow') }}</span>
        <h1 id="page-heading" data-cy="ProductHeading">{{ t$('project1OnlineShoppingWebsiteApp.product.home.title') }}</h1>
        <p>{{ t$('project1OnlineShoppingWebsiteApp.product.admin.subtitle') }}</p>
      </div>
      <div class="admin-products-header-actions">
        <button type="button" class="btn admin-products-refresh" @click="handleSyncList" :disabled="isFetching">
          <font-awesome-icon icon="sync" :spin="isFetching"></font-awesome-icon>
          <span>{{ t$('project1OnlineShoppingWebsiteApp.product.home.refreshListLabel') }}</span>
        </button>
        <router-link :to="{ name: 'ProductCreate' }" custom v-slot="{ navigate }">
          <button
            type="button"
            @click="navigate"
            id="jh-create-entity"
            data-cy="entityCreateButton"
            class="btn admin-products-add create-product"
          >
            <font-awesome-icon icon="plus"></font-awesome-icon>
            <span>{{ t$('project1OnlineShoppingWebsiteApp.product.home.createLabel') }}</span>
          </button>
        </router-link>
      </div>
    </header>

    <section class="admin-products-summary" aria-label="Product summary">
      <article>
        <span class="admin-products-summary-icon"><font-awesome-icon icon="box-open"></font-awesome-icon></span>
        <div>
          <strong>{{ totalItems }}</strong>
          <p>{{ t$('project1OnlineShoppingWebsiteApp.product.admin.totalProducts') }}</p>
        </div>
      </article>
      <article>
        <span class="admin-products-summary-icon"><font-awesome-icon icon="check"></font-awesome-icon></span>
        <div>
          <strong>{{ adminProductSummary.inStock }}</strong>
          <p>{{ t$('project1OnlineShoppingWebsiteApp.product.admin.availableShown') }}</p>
        </div>
      </article>
      <article>
        <span class="admin-products-summary-icon admin-products-summary-warning"
          ><font-awesome-icon icon="times-circle"></font-awesome-icon
        ></span>
        <div>
          <strong>{{ adminProductSummary.needsAttention }}</strong>
          <p>{{ t$('project1OnlineShoppingWebsiteApp.product.admin.needsAttention') }}</p>
        </div>
      </article>
      <article>
        <span class="admin-products-summary-icon"><font-awesome-icon icon="database"></font-awesome-icon></span>
        <div>
          <strong>{{ adminProductSummary.unitsShown }}</strong>
          <p>{{ t$('project1OnlineShoppingWebsiteApp.product.admin.unitsShown') }}</p>
        </div>
      </article>
    </section>

    <section class="admin-products-panel">
      <div class="admin-products-panel-heading">
        <div>
          <h2>{{ t$('project1OnlineShoppingWebsiteApp.product.admin.inventoryTitle') }}</h2>
          <p>{{ t$('project1OnlineShoppingWebsiteApp.product.admin.inventorySubtitle') }}</p>
        </div>
        <span>{{ t$('project1OnlineShoppingWebsiteApp.product.admin.pageCount', { count: products.length }) }}</span>
      </div>

      <div class="admin-products-loading" v-if="isFetching && products?.length === 0">
        <div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>
      </div>

      <div class="admin-products-empty" v-else-if="products?.length === 0">
        <span><font-awesome-icon icon="box-open"></font-awesome-icon></span>
        <h2>{{ t$('project1OnlineShoppingWebsiteApp.product.home.notFound') }}</h2>
        <p>{{ t$('project1OnlineShoppingWebsiteApp.product.admin.emptySubtitle') }}</p>
      </div>

      <div class="table-responsive" v-else>
        <table class="table admin-products-table" aria-describedby="products">
          <thead>
            <tr>
              <th scope="col" @click="changeOrder('name')">
                <span>{{ t$('project1OnlineShoppingWebsiteApp.product.name') }}</span>
                <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" field-name="name"></jhi-sort-indicator>
              </th>
              <th scope="col" @click="changeOrder('sku')">
                <span>{{ t$('project1OnlineShoppingWebsiteApp.product.sku') }}</span>
                <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" field-name="sku"></jhi-sort-indicator>
              </th>
              <th scope="col" @click="changeOrder('category.name')">
                <span>{{ t$('project1OnlineShoppingWebsiteApp.product.category') }}</span>
                <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" field-name="category.name"></jhi-sort-indicator>
              </th>
              <th scope="col" @click="changeOrder('price')">
                <span>{{ t$('project1OnlineShoppingWebsiteApp.product.price') }}</span>
                <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" field-name="price"></jhi-sort-indicator>
              </th>
              <th scope="col" @click="changeOrder('stockQuantity')">
                <span>{{ t$('project1OnlineShoppingWebsiteApp.product.admin.inventory') }}</span>
                <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" field-name="stockQuantity"></jhi-sort-indicator>
              </th>
              <th scope="col" @click="changeOrder('status')">
                <span>{{ t$('project1OnlineShoppingWebsiteApp.product.status') }}</span>
                <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" field-name="status"></jhi-sort-indicator>
              </th>
              <th scope="col" class="admin-products-actions-heading">{{ t$('project1OnlineShoppingWebsiteApp.product.admin.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product.id" data-cy="entityTable">
              <td>
                <div class="admin-product-identity">
                  <button
                    type="button"
                    class="admin-product-thumbnail"
                    :class="{ 'admin-product-thumbnail-empty': !product.image }"
                    :aria-label="product.name"
                    @click="product.image && openFile(product.imageContentType, product.image)"
                  >
                    <img v-if="product.image" :src="'data:' + product.imageContentType + ';base64,' + product.image" :alt="product.name" />
                    <font-awesome-icon icon="image" v-else></font-awesome-icon>
                  </button>
                  <div>
                    <router-link :to="{ name: 'ProductView', params: { productId: product.id } }">{{ product.name }}</router-link>
                    <p :title="product.description">{{ product.description }}</p>
                  </div>
                </div>
              </td>
              <td>
                <span class="admin-product-sku">{{ product.sku }}</span>
              </td>
              <td>
                <span class="admin-product-category">{{
                  product.category?.name || t$('project1OnlineShoppingWebsiteApp.product.admin.uncategorized')
                }}</span>
              </td>
              <td>
                <strong class="admin-product-price">{{ formatCurrency(product.price) }}</strong>
              </td>
              <td>
                <div class="admin-product-stock" :class="{ 'admin-product-stock-low': Number(product.stockQuantity ?? 0) <= 5 }">
                  <strong>{{ product.stockQuantity ?? 0 }}</strong>
                  <span>{{ t$('project1OnlineShoppingWebsiteApp.product.admin.units') }}</span>
                </div>
              </td>
              <td>
                <span class="admin-product-status" :class="'admin-product-status-' + statusVariant(product.status)">
                  {{ t$('project1OnlineShoppingWebsiteApp.ProductStatus.' + product.status) }}
                </span>
              </td>
              <td>
                <div class="admin-product-actions">
                  <router-link :to="{ name: 'ProductView', params: { productId: product.id } }" custom v-slot="{ navigate }">
                    <button
                      type="button"
                      @click="navigate"
                      class="btn admin-product-action admin-product-view details"
                      data-cy="entityDetailsButton"
                      :title="t$('entity.action.view')"
                      :aria-label="t$('entity.action.view')"
                    >
                      <font-awesome-icon icon="eye"></font-awesome-icon>
                    </button>
                  </router-link>
                  <router-link :to="{ name: 'ProductEdit', params: { productId: product.id } }" custom v-slot="{ navigate }">
                    <button
                      type="button"
                      @click="navigate"
                      class="btn admin-product-action admin-product-edit edit"
                      data-cy="entityEditButton"
                      :title="t$('entity.action.edit')"
                      :aria-label="t$('entity.action.edit')"
                    >
                      <font-awesome-icon icon="pencil-alt"></font-awesome-icon>
                    </button>
                  </router-link>
                  <b-button
                    @click="prepareRemove(product)"
                    class="btn admin-product-action admin-product-delete"
                    data-cy="entityDeleteButton"
                    :title="t$('entity.action.delete')"
                    :aria-label="t$('entity.action.delete')"
                    ><font-awesome-icon icon="times"></font-awesome-icon
                  ></b-button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <b-modal ref="removeEntity" id="removeProductModal">
      <template #title>
        <span class="admin-product-delete-title" data-cy="productDeleteDialogHeading">{{ t$('entity.delete.title') }}</span>
      </template>
      <div class="admin-product-delete-message">
        <span><font-awesome-icon icon="times-circle"></font-awesome-icon></span>
        <div>
          <strong>{{ t$('project1OnlineShoppingWebsiteApp.product.admin.deleteTitle') }}</strong>
          <p id="jhi-delete-product-heading">
            Remove <strong>{{ productToRemove?.name }}</strong> (product #{{ removeId }})? This cannot be undone.
          </p>
        </div>
      </div>
      <template #footer>
        <div class="admin-product-modal-actions">
          <button type="button" class="btn admin-product-modal-cancel" @click="closeDialog()">{{ t$('entity.action.cancel') }}</button>
          <button
            type="button"
            class="btn admin-product-modal-delete"
            id="jhi-confirm-delete-product"
            data-cy="entityConfirmDeleteButton"
            @click="removeProduct"
          >
            {{ t$('entity.action.delete') }}
          </button>
        </div>
      </template>
    </b-modal>
    <div v-show="products?.length > 0" class="admin-products-pagination">
      <div>
        <jhi-item-count :page="page" :total="queryCount" :items-per-page="itemsPerPage"></jhi-item-count>
      </div>
      <div>
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
    <div class="shop-filter-bar" aria-label="Product filters">
      <div class="shop-category-chips">
        <button type="button" class="shop-filter-chip" :class="{ active: !selectedCategoryId }" @click="selectedCategoryId = ''">
          All categories
        </button>
        <button
          v-for="category in categories"
          :key="category.id"
          type="button"
          class="shop-filter-chip"
          :class="{ active: selectedCategoryId === String(category.id) }"
          @click="selectedCategoryId = String(category.id)"
        >
          {{ category.name }}
        </button>
      </div>
      <div class="shop-filter-options">
        <label for="shop-availability">Availability</label>
        <select id="shop-availability" v-model="availability" class="form-select form-select-sm">
          <option value="all">All products</option>
          <option value="IN_STOCK">In stock</option>
          <option value="PRE_ORDER">Pre-order</option>
          <option value="OUT_OF_STOCK">Out of stock</option>
        </select>
        <button v-if="activeFilterCount" type="button" class="btn shop-clear-filters" @click="clearShopFilters">
          Clear filters ({{ activeFilterCount }})
        </button>
      </div>
    </div>
    <div v-if="cartConfirmation" class="shop-cart-confirmation" role="status" aria-live="polite">
      <span class="shop-cart-confirmation-icon"><font-awesome-icon icon="check"></font-awesome-icon></span>
      <span
        ><strong>{{ cartConfirmation.name }}</strong> added to your cart.</span
      >
      <router-link :to="{ name: 'ShoppingCart' }" class="btn btn-sm shop-cart-confirmation-link">View cart</router-link>
      <button type="button" class="shop-cart-confirmation-close" aria-label="Dismiss confirmation" @click="cartConfirmation = null">
        ×
      </button>
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
        <button
          type="button"
          class="shop-wishlist-btn"
          :class="{ 'shop-wishlist-btn-active': wishlistStore.hasProduct(product.id) }"
          :disabled="updatingWishlistId === product.id"
          :aria-label="
            wishlistStore.hasProduct(product.id)
              ? t$('project1OnlineShoppingWebsiteApp.product.shop.removeFromWishlist')
              : t$('project1OnlineShoppingWebsiteApp.product.shop.addToWishlist')
          "
          :title="
            wishlistStore.hasProduct(product.id)
              ? t$('project1OnlineShoppingWebsiteApp.product.shop.removeFromWishlist')
              : t$('project1OnlineShoppingWebsiteApp.product.shop.addToWishlist')
          "
          data-cy="shopWishlistButton"
          @click="toggleWishlist(product)"
        >
          <font-awesome-icon icon="heart"></font-awesome-icon>
        </button>
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
            <button
              type="button"
              class="btn shop-btn-wishlist"
              :class="{ 'shop-btn-wishlist-active': wishlistStore.hasProduct(selectedProduct.id) }"
              :disabled="updatingWishlistId === selectedProduct.id"
              data-cy="shopModalWishlistButton"
              @click="toggleWishlist(selectedProduct)"
            >
              <font-awesome-icon icon="heart"></font-awesome-icon>
              <span>{{
                wishlistStore.hasProduct(selectedProduct.id)
                  ? t$('project1OnlineShoppingWebsiteApp.product.shop.removeFromWishlist')
                  : t$('project1OnlineShoppingWebsiteApp.product.shop.addToWishlist')
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
<style lang="scss" src="./product-admin.scss"></style>
