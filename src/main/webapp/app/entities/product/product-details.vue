<template>
  <div class="d-flex justify-content-center">
    <div class="col-8">
      <div v-if="product">
        <h2 class="jh-entity-heading" data-cy="productDetailsHeading">
          <span>{{ t$('project1OnlineShoppingWebsiteApp.product.detail.title') }}</span> {{ product.id }}
        </h2>
        <dl class="row-md jh-entity-details">
          <dt>
            <span>{{ t$('project1OnlineShoppingWebsiteApp.product.sku') }}</span>
          </dt>
          <dd>
            <span>{{ product.sku }}</span>
          </dd>
          <dt>
            <span>{{ t$('project1OnlineShoppingWebsiteApp.product.name') }}</span>
          </dt>
          <dd>
            <span>{{ product.name }}</span>
          </dd>
          <dt>
            <span>{{ t$('project1OnlineShoppingWebsiteApp.product.description') }}</span>
          </dt>
          <dd>
            <span>{{ product.description }}</span>
          </dd>
          <dt>
            <span>{{ t$('project1OnlineShoppingWebsiteApp.product.price') }}</span>
          </dt>
          <dd>
            <span>{{ product.price }}</span>
          </dd>
          <dt>
            <span>{{ t$('project1OnlineShoppingWebsiteApp.product.stockQuantity') }}</span>
          </dt>
          <dd>
            <span>{{ product.stockQuantity }}</span>
          </dd>
          <dt>
            <span>{{ t$('project1OnlineShoppingWebsiteApp.product.status') }}</span>
          </dt>
          <dd>
            <span>{{ t$('project1OnlineShoppingWebsiteApp.ProductStatus.' + product.status) }}</span>
          </dd>
          <dt>
            <span>{{ t$('project1OnlineShoppingWebsiteApp.product.image') }}</span>
          </dt>
          <dd>
            <div v-if="product.image">
              <a @click="openFile(product.imageContentType, product.image)">
                <img :src="'data:' + product.imageContentType + ';base64,' + product.image" style="max-width: 100%" alt="product" />
              </a>
              {{ product.imageContentType }}, {{ byteSize(product.image) }}
            </div>
          </dd>
          <dt>
            <span>{{ t$('project1OnlineShoppingWebsiteApp.product.category') }}</span>
          </dt>
          <dd>
            <div v-if="product.category">
              <router-link :to="{ name: 'CategoryView', params: { categoryId: product.category.id } }">{{
                product.category.name
              }}</router-link>
            </div>
          </dd>
          <dt>
            <span>{{ t$('project1OnlineShoppingWebsiteApp.product.wishlist') }}</span>
          </dt>
          <dd>
            <span v-for="(wishlist, i) in product.wishlists" :key="wishlist.id"
              >{{ i > 0 ? ', ' : '' }}
              <router-link :to="{ name: 'WishlistView', params: { wishlistId: wishlist.id } }">{{ wishlist.id }}</router-link>
            </span>
          </dd>
        </dl>
        <button type="submit" @click.prevent="previousState()" class="btn btn-info" data-cy="entityDetailsBackButton">
          <font-awesome-icon icon="arrow-left"></font-awesome-icon>&nbsp;<span>{{ t$('entity.action.back') }}</span>
        </button>
        <router-link v-if="product.id" :to="{ name: 'ProductEdit', params: { productId: product.id } }" custom v-slot="{ navigate }">
          <button @click="navigate" class="btn btn-primary">
            <font-awesome-icon icon="pencil-alt"></font-awesome-icon>&nbsp;<span>{{ t$('entity.action.edit') }}</span>
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./product-details.component.ts"></script>
