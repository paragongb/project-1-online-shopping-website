<template>
  <div v-if="isAdmin">
    <h2 id="page-heading" data-cy="ShoppingCartHeading">
      <span id="shopping-cart">{{ t$('project1OnlineShoppingWebsiteApp.shoppingCart.home.title') }}</span>
      <div class="d-flex justify-content-end">
        <button class="btn btn-info me-2" @click="handleSyncList" :disabled="isFetching">
          <font-awesome-icon icon="sync" :spin="isFetching"></font-awesome-icon>
          <span>{{ t$('project1OnlineShoppingWebsiteApp.shoppingCart.home.refreshListLabel') }}</span>
        </button>
        <router-link :to="{ name: 'ShoppingCartCreate' }" custom v-slot="{ navigate }">
          <button
            @click="navigate"
            id="jh-create-entity"
            data-cy="entityCreateButton"
            class="btn btn-primary jh-create-entity create-shopping-cart"
          >
            <font-awesome-icon icon="plus"></font-awesome-icon>
            <span>{{ t$('project1OnlineShoppingWebsiteApp.shoppingCart.home.createLabel') }}</span>
          </button>
        </router-link>
      </div>
    </h2>
    <br />
    <div class="alert alert-warning" v-if="!isFetching && shoppingCarts?.length === 0">
      <span>{{ t$('project1OnlineShoppingWebsiteApp.shoppingCart.home.notFound') }}</span>
    </div>
    <div class="table-responsive" v-if="shoppingCarts?.length > 0">
      <table class="table table-striped" aria-describedby="shoppingCarts">
        <thead>
          <tr>
            <th scope="col">
              <span>{{ t$('global.field.id') }}</span>
            </th>
            <th scope="col">
              <span>{{ t$('project1OnlineShoppingWebsiteApp.shoppingCart.createdDate') }}</span>
            </th>
            <th scope="col">
              <span>{{ t$('project1OnlineShoppingWebsiteApp.shoppingCart.user') }}</span>
            </th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="shoppingCart in shoppingCarts" :key="shoppingCart.id" data-cy="entityTable">
            <td>
              <router-link :to="{ name: 'ShoppingCartView', params: { shoppingCartId: shoppingCart.id } }">{{
                shoppingCart.id
              }}</router-link>
            </td>
            <td>{{ formatDateShort(shoppingCart.createdDate) || '' }}</td>
            <td>
              {{ shoppingCart.user ? shoppingCart.user.login : '' }}
            </td>
            <td class="text-end">
              <div class="btn-group">
                <router-link :to="{ name: 'ShoppingCartView', params: { shoppingCartId: shoppingCart.id } }" custom v-slot="{ navigate }">
                  <button @click="navigate" class="btn btn-info btn-sm details" data-cy="entityDetailsButton">
                    <font-awesome-icon icon="eye"></font-awesome-icon>
                    <span class="d-none d-md-inline">{{ t$('entity.action.view') }}</span>
                  </button>
                </router-link>
                <router-link :to="{ name: 'ShoppingCartEdit', params: { shoppingCartId: shoppingCart.id } }" custom v-slot="{ navigate }">
                  <button @click="navigate" class="btn btn-primary btn-sm edit" data-cy="entityEditButton">
                    <font-awesome-icon icon="pencil-alt"></font-awesome-icon>
                    <span class="d-none d-md-inline">{{ t$('entity.action.edit') }}</span>
                  </button>
                </router-link>
                <b-button @click="prepareRemove(shoppingCart)" variant="danger" class="btn btn-sm" data-cy="entityDeleteButton">
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
        <span id="project1OnlineShoppingWebsiteApp.shoppingCart.delete.question" data-cy="shoppingCartDeleteDialogHeading">{{
          t$('entity.delete.title')
        }}</span>
      </template>
      <div class="modal-body">
        <p id="jhi-delete-shoppingCart-heading">
          {{ t$('project1OnlineShoppingWebsiteApp.shoppingCart.delete.question', { id: removeId }) }}
        </p>
      </div>
      <template #footer>
        <div>
          <button type="button" class="btn btn-secondary" @click="closeDialog()">{{ t$('entity.action.cancel') }}</button>
          <button
            type="button"
            class="btn btn-primary"
            id="jhi-confirm-delete-shoppingCart"
            data-cy="entityConfirmDeleteButton"
            @click="removeShoppingCart"
          >
            {{ t$('entity.action.delete') }}
          </button>
        </div>
      </template>
    </b-modal>
  </div>

  <div class="cart-page" v-else>
    <div class="cart-header">
      <h1 class="cart-title">{{ t$('project1OnlineShoppingWebsiteApp.shoppingCart.myCart.title') }}</h1>
      <router-link :to="{ name: 'Product' }" class="cart-continue-link">
        {{ t$('project1OnlineShoppingWebsiteApp.shoppingCart.myCart.continueShopping') }}
      </router-link>
    </div>

    <div class="cart-loading" v-if="isFetching">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div class="cart-empty" v-else-if="cartStore.items.length === 0">
      <font-awesome-icon icon="box-open" class="cart-empty-icon"></font-awesome-icon>
      <p>{{ t$('project1OnlineShoppingWebsiteApp.shoppingCart.myCart.empty') }}</p>
      <router-link :to="{ name: 'Product' }" class="btn cart-btn-primary">
        {{ t$('project1OnlineShoppingWebsiteApp.shoppingCart.myCart.continueShopping') }}
      </router-link>
    </div>

    <div class="cart-layout" v-else>
      <ul class="cart-list">
        <li class="cart-line" v-for="item in cartStore.items" :key="item.id" data-cy="cartLineItem">
          <div class="cart-line-media">
            <img
              v-if="item.product?.image"
              :src="'data:' + item.product.imageContentType + ';base64,' + item.product.image"
              :alt="item.product.name"
            />
            <div v-else class="cart-line-media-placeholder">
              <font-awesome-icon icon="image"></font-awesome-icon>
            </div>
          </div>
          <div class="cart-line-info">
            <span class="cart-line-name">{{ item.product?.name }}</span>
            <span class="cart-line-price">{{ '$' + item.product?.price }}</span>
          </div>
          <div class="cart-line-qty">
            <button
              type="button"
              class="cart-qty-btn"
              :disabled="isUpdatingItem"
              @click="changeQuantity(item.id, (item.quantity ?? 1) - 1)"
            >
              −
            </button>
            <span class="cart-qty-value">{{ item.quantity }}</span>
            <button
              type="button"
              class="cart-qty-btn"
              :disabled="isUpdatingItem"
              @click="changeQuantity(item.id, (item.quantity ?? 0) + 1)"
            >
              +
            </button>
          </div>
          <div class="cart-line-subtotal">{{ '$' + ((item.product?.price ?? 0) * (item.quantity ?? 0)).toFixed(2) }}</div>
          <button
            type="button"
            class="cart-line-remove"
            :disabled="isUpdatingItem"
            data-cy="cartRemoveItemButton"
            @click="removeCartItem(item.id)"
          >
            <font-awesome-icon icon="times"></font-awesome-icon>
          </button>
        </li>
      </ul>

      <div class="cart-summary">
        <div class="cart-summary-row">
          <span>{{ t$('project1OnlineShoppingWebsiteApp.shoppingCart.myCart.total') }}</span>
          <span class="cart-summary-total">{{ '$' + cartTotal.toFixed(2) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./shopping-cart.component.ts"></script>
<style lang="scss" src="./my-cart.scss"></style>
