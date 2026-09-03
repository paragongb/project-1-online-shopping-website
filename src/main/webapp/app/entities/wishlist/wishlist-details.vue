<template>
  <div class="d-flex justify-content-center">
    <div class="col-8">
      <div v-if="wishlist">
        <h2 class="jh-entity-heading" data-cy="wishlistDetailsHeading">
          <span>{{ t$('project1OnlineShoppingWebsiteApp.wishlist.detail.title') }}</span> {{ wishlist.id }}
        </h2>
        <dl class="row-md jh-entity-details">
          <dt>
            <span>{{ t$('project1OnlineShoppingWebsiteApp.wishlist.createdDate') }}</span>
          </dt>
          <dd>
            <span v-if="wishlist.createdDate">{{ formatDateLong(wishlist.createdDate) }}</span>
          </dd>
          <dt>
            <span>{{ t$('project1OnlineShoppingWebsiteApp.wishlist.user') }}</span>
          </dt>
          <dd>
            {{ wishlist.user ? wishlist.user.login : '' }}
          </dd>
          <dt>
            <span>{{ t$('project1OnlineShoppingWebsiteApp.wishlist.product') }}</span>
          </dt>
          <dd>
            <span v-for="(product, i) in wishlist.products" :key="product.id"
              >{{ i > 0 ? ', ' : '' }}
              <router-link :to="{ name: 'ProductView', params: { productId: product.id } }">{{ product.name }}</router-link>
            </span>
          </dd>
        </dl>
        <button type="submit" @click.prevent="previousState()" class="btn btn-info" data-cy="entityDetailsBackButton">
          <font-awesome-icon icon="arrow-left"></font-awesome-icon>&nbsp;<span>{{ t$('entity.action.back') }}</span>
        </button>
        <router-link v-if="wishlist.id" :to="{ name: 'WishlistEdit', params: { wishlistId: wishlist.id } }" custom v-slot="{ navigate }">
          <button @click="navigate" class="btn btn-primary">
            <font-awesome-icon icon="pencil-alt"></font-awesome-icon>&nbsp;<span>{{ t$('entity.action.edit') }}</span>
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./wishlist-details.component.ts"></script>
