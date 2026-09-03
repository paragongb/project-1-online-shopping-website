<template>
  <div class="d-flex justify-content-center">
    <div class="col-8">
      <div v-if="shoppingCart">
        <h2 class="jh-entity-heading" data-cy="shoppingCartDetailsHeading">
          <span>{{ t$('project1OnlineShoppingWebsiteApp.shoppingCart.detail.title') }}</span> {{ shoppingCart.id }}
        </h2>
        <dl class="row-md jh-entity-details">
          <dt>
            <span>{{ t$('project1OnlineShoppingWebsiteApp.shoppingCart.createdDate') }}</span>
          </dt>
          <dd>
            <span v-if="shoppingCart.createdDate">{{ formatDateLong(shoppingCart.createdDate) }}</span>
          </dd>
          <dt>
            <span>{{ t$('project1OnlineShoppingWebsiteApp.shoppingCart.user') }}</span>
          </dt>
          <dd>
            {{ shoppingCart.user ? shoppingCart.user.login : '' }}
          </dd>
        </dl>
        <button type="submit" @click.prevent="previousState()" class="btn btn-info" data-cy="entityDetailsBackButton">
          <font-awesome-icon icon="arrow-left"></font-awesome-icon>&nbsp;<span>{{ t$('entity.action.back') }}</span>
        </button>
        <router-link
          v-if="shoppingCart.id"
          :to="{ name: 'ShoppingCartEdit', params: { shoppingCartId: shoppingCart.id } }"
          custom
          v-slot="{ navigate }"
        >
          <button @click="navigate" class="btn btn-primary">
            <font-awesome-icon icon="pencil-alt"></font-awesome-icon>&nbsp;<span>{{ t$('entity.action.edit') }}</span>
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./shopping-cart-details.component.ts"></script>
