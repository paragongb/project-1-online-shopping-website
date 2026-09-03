<template>
  <div>
    <h2 id="page-heading" data-cy="CartItemHeading">
      <span id="cart-item">{{ t$('project1OnlineShoppingWebsiteApp.cartItem.home.title') }}</span>
      <div class="d-flex justify-content-end">
        <button class="btn btn-info me-2" @click="handleSyncList" :disabled="isFetching">
          <font-awesome-icon icon="sync" :spin="isFetching"></font-awesome-icon>
          <span>{{ t$('project1OnlineShoppingWebsiteApp.cartItem.home.refreshListLabel') }}</span>
        </button>
        <router-link :to="{ name: 'CartItemCreate' }" custom v-slot="{ navigate }">
          <button
            @click="navigate"
            id="jh-create-entity"
            data-cy="entityCreateButton"
            class="btn btn-primary jh-create-entity create-cart-item"
          >
            <font-awesome-icon icon="plus"></font-awesome-icon>
            <span>{{ t$('project1OnlineShoppingWebsiteApp.cartItem.home.createLabel') }}</span>
          </button>
        </router-link>
      </div>
    </h2>
    <br />
    <div class="alert alert-warning" v-if="!isFetching && cartItems?.length === 0">
      <span>{{ t$('project1OnlineShoppingWebsiteApp.cartItem.home.notFound') }}</span>
    </div>
    <div class="table-responsive" v-if="cartItems?.length > 0">
      <table class="table table-striped" aria-describedby="cartItems">
        <thead>
          <tr>
            <th scope="col">
              <span>{{ t$('global.field.id') }}</span>
            </th>
            <th scope="col">
              <span>{{ t$('project1OnlineShoppingWebsiteApp.cartItem.quantity') }}</span>
            </th>
            <th scope="col">
              <span>{{ t$('project1OnlineShoppingWebsiteApp.cartItem.product') }}</span>
            </th>
            <th scope="col">
              <span>{{ t$('project1OnlineShoppingWebsiteApp.cartItem.cart') }}</span>
            </th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cartItem in cartItems" :key="cartItem.id" data-cy="entityTable">
            <td>
              <router-link :to="{ name: 'CartItemView', params: { cartItemId: cartItem.id } }">{{ cartItem.id }}</router-link>
            </td>
            <td>{{ cartItem.quantity }}</td>
            <td>
              <div v-if="cartItem.product">
                <router-link :to="{ name: 'ProductView', params: { productId: cartItem.product.id } }">{{
                  cartItem.product.name
                }}</router-link>
              </div>
            </td>
            <td>
              <div v-if="cartItem.cart">
                <router-link :to="{ name: 'ShoppingCartView', params: { shoppingCartId: cartItem.cart.id } }">{{
                  cartItem.cart.id
                }}</router-link>
              </div>
            </td>
            <td class="text-end">
              <div class="btn-group">
                <router-link :to="{ name: 'CartItemView', params: { cartItemId: cartItem.id } }" custom v-slot="{ navigate }">
                  <button @click="navigate" class="btn btn-info btn-sm details" data-cy="entityDetailsButton">
                    <font-awesome-icon icon="eye"></font-awesome-icon>
                    <span class="d-none d-md-inline">{{ t$('entity.action.view') }}</span>
                  </button>
                </router-link>
                <router-link :to="{ name: 'CartItemEdit', params: { cartItemId: cartItem.id } }" custom v-slot="{ navigate }">
                  <button @click="navigate" class="btn btn-primary btn-sm edit" data-cy="entityEditButton">
                    <font-awesome-icon icon="pencil-alt"></font-awesome-icon>
                    <span class="d-none d-md-inline">{{ t$('entity.action.edit') }}</span>
                  </button>
                </router-link>
                <b-button @click="prepareRemove(cartItem)" variant="danger" class="btn btn-sm" data-cy="entityDeleteButton">
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
        <span id="project1OnlineShoppingWebsiteApp.cartItem.delete.question" data-cy="cartItemDeleteDialogHeading">{{
          t$('entity.delete.title')
        }}</span>
      </template>
      <div class="modal-body">
        <p id="jhi-delete-cartItem-heading">{{ t$('project1OnlineShoppingWebsiteApp.cartItem.delete.question', { id: removeId }) }}</p>
      </div>
      <template #footer>
        <div>
          <button type="button" class="btn btn-secondary" @click="closeDialog()">{{ t$('entity.action.cancel') }}</button>
          <button
            type="button"
            class="btn btn-primary"
            id="jhi-confirm-delete-cartItem"
            data-cy="entityConfirmDeleteButton"
            @click="removeCartItem"
          >
            {{ t$('entity.action.delete') }}
          </button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script lang="ts" src="./cart-item.component.ts"></script>
