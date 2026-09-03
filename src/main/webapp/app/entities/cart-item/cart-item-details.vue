<template>
  <div class="d-flex justify-content-center">
    <div class="col-8">
      <div v-if="cartItem">
        <h2 class="jh-entity-heading" data-cy="cartItemDetailsHeading">
          <span>{{ t$('project1OnlineShoppingWebsiteApp.cartItem.detail.title') }}</span> {{ cartItem.id }}
        </h2>
        <dl class="row-md jh-entity-details">
          <dt>
            <span>{{ t$('project1OnlineShoppingWebsiteApp.cartItem.quantity') }}</span>
          </dt>
          <dd>
            <span>{{ cartItem.quantity }}</span>
          </dd>
          <dt>
            <span>{{ t$('project1OnlineShoppingWebsiteApp.cartItem.product') }}</span>
          </dt>
          <dd>
            <div v-if="cartItem.product">
              <router-link :to="{ name: 'ProductView', params: { productId: cartItem.product.id } }">{{
                cartItem.product.name
              }}</router-link>
            </div>
          </dd>
          <dt>
            <span>{{ t$('project1OnlineShoppingWebsiteApp.cartItem.cart') }}</span>
          </dt>
          <dd>
            <div v-if="cartItem.cart">
              <router-link :to="{ name: 'ShoppingCartView', params: { shoppingCartId: cartItem.cart.id } }">{{
                cartItem.cart.id
              }}</router-link>
            </div>
          </dd>
        </dl>
        <button type="submit" @click.prevent="previousState()" class="btn btn-info" data-cy="entityDetailsBackButton">
          <font-awesome-icon icon="arrow-left"></font-awesome-icon>&nbsp;<span>{{ t$('entity.action.back') }}</span>
        </button>
        <router-link v-if="cartItem.id" :to="{ name: 'CartItemEdit', params: { cartItemId: cartItem.id } }" custom v-slot="{ navigate }">
          <button @click="navigate" class="btn btn-primary">
            <font-awesome-icon icon="pencil-alt"></font-awesome-icon>&nbsp;<span>{{ t$('entity.action.edit') }}</span>
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./cart-item-details.component.ts"></script>
