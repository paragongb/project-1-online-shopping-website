<template>
  <div v-if="isAdmin">
    <h2 id="page-heading" data-cy="OrderItemHeading">
      <span id="order-item">{{ t$('project1OnlineShoppingWebsiteApp.orderItem.home.title') }}</span>
      <div class="d-flex justify-content-end">
        <button class="btn btn-info me-2" @click="handleSyncList" :disabled="isFetching">
          <font-awesome-icon icon="sync" :spin="isFetching"></font-awesome-icon>
          <span>{{ t$('project1OnlineShoppingWebsiteApp.orderItem.home.refreshListLabel') }}</span>
        </button>
        <router-link :to="{ name: 'OrderItemCreate' }" custom v-slot="{ navigate }">
          <button
            @click="navigate"
            id="jh-create-entity"
            data-cy="entityCreateButton"
            class="btn btn-primary jh-create-entity create-order-item"
          >
            <font-awesome-icon icon="plus"></font-awesome-icon>
            <span>{{ t$('project1OnlineShoppingWebsiteApp.orderItem.home.createLabel') }}</span>
          </button>
        </router-link>
      </div>
    </h2>
    <br />
    <div class="alert alert-warning" v-if="!isFetching && orderItems?.length === 0">
      <span>{{ t$('project1OnlineShoppingWebsiteApp.orderItem.home.notFound') }}</span>
    </div>
    <div class="table-responsive" v-if="orderItems?.length > 0">
      <table class="table table-striped" aria-describedby="orderItems">
        <thead>
          <tr>
            <th scope="col">
              <span>{{ t$('global.field.id') }}</span>
            </th>
            <th scope="col">
              <span>{{ t$('project1OnlineShoppingWebsiteApp.orderItem.quantity') }}</span>
            </th>
            <th scope="col">
              <span>{{ t$('project1OnlineShoppingWebsiteApp.orderItem.priceAtPurchase') }}</span>
            </th>
            <th scope="col">
              <span>{{ t$('project1OnlineShoppingWebsiteApp.orderItem.product') }}</span>
            </th>
            <th scope="col">
              <span>{{ t$('project1OnlineShoppingWebsiteApp.orderItem.order') }}</span>
            </th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="orderItem in orderItems" :key="orderItem.id" data-cy="entityTable">
            <td>
              <router-link :to="{ name: 'OrderItemView', params: { orderItemId: orderItem.id } }">{{ orderItem.id }}</router-link>
            </td>
            <td>{{ orderItem.quantity }}</td>
            <td>{{ orderItem.priceAtPurchase }}</td>
            <td>
              <div v-if="orderItem.product">
                <router-link :to="{ name: 'ProductView', params: { productId: orderItem.product.id } }">{{
                  orderItem.product.name
                }}</router-link>
              </div>
            </td>
            <td>
              <div v-if="orderItem.order">
                <router-link :to="{ name: 'CustomerOrderView', params: { customerOrderId: orderItem.order.id } }">{{
                  orderItem.order.id
                }}</router-link>
              </div>
            </td>
            <td class="text-end">
              <div class="btn-group">
                <router-link :to="{ name: 'OrderItemView', params: { orderItemId: orderItem.id } }" custom v-slot="{ navigate }">
                  <button @click="navigate" class="btn btn-info btn-sm details" data-cy="entityDetailsButton">
                    <font-awesome-icon icon="eye"></font-awesome-icon>
                    <span class="d-none d-md-inline">{{ t$('entity.action.view') }}</span>
                  </button>
                </router-link>
                <router-link :to="{ name: 'OrderItemEdit', params: { orderItemId: orderItem.id } }" custom v-slot="{ navigate }">
                  <button @click="navigate" class="btn btn-primary btn-sm edit" data-cy="entityEditButton">
                    <font-awesome-icon icon="pencil-alt"></font-awesome-icon>
                    <span class="d-none d-md-inline">{{ t$('entity.action.edit') }}</span>
                  </button>
                </router-link>
                <b-button @click="prepareRemove(orderItem)" variant="danger" class="btn btn-sm" data-cy="entityDeleteButton">
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
        <span id="project1OnlineShoppingWebsiteApp.orderItem.delete.question" data-cy="orderItemDeleteDialogHeading">{{
          t$('entity.delete.title')
        }}</span>
      </template>
      <div class="modal-body">
        <p id="jhi-delete-orderItem-heading">{{ t$('project1OnlineShoppingWebsiteApp.orderItem.delete.question', { id: removeId }) }}</p>
      </div>
      <template #footer>
        <div>
          <button type="button" class="btn btn-secondary" @click="closeDialog()">{{ t$('entity.action.cancel') }}</button>
          <button
            type="button"
            class="btn btn-primary"
            id="jhi-confirm-delete-orderItem"
            data-cy="entityConfirmDeleteButton"
            @click="removeOrderItem"
          >
            {{ t$('entity.action.delete') }}
          </button>
        </div>
      </template>
    </b-modal>
  </div>

  <div class="orders-page" v-else>
    <div class="orders-header">
      <h1 class="orders-title">{{ t$('project1OnlineShoppingWebsiteApp.orderItem.myOrders.title') }}</h1>
    </div>

    <div class="orders-loading" v-if="isFetching">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div class="orders-empty" v-else-if="myOrders.length === 0">
      <font-awesome-icon icon="receipt" class="orders-empty-icon"></font-awesome-icon>
      <p>{{ t$('project1OnlineShoppingWebsiteApp.orderItem.myOrders.empty') }}</p>
      <router-link :to="{ name: 'Product' }" class="btn orders-btn-primary">
        {{ t$('project1OnlineShoppingWebsiteApp.shoppingCart.myCart.continueShopping') }}
      </router-link>
    </div>

    <ul class="orders-list" v-else>
      <li class="order-card" v-for="order in myOrders" :key="order.id" data-cy="myOrderCard">
        <div class="order-card-header">
          <div>
            <span class="order-card-id">{{ t$('project1OnlineShoppingWebsiteApp.orderItem.myOrders.order') }} #{{ order.id }}</span>
            <span class="order-card-date">{{ formatDateShort(order.placedDate) || '' }}</span>
          </div>
          <span class="order-status-badge" :class="'order-status-' + order.status?.toLowerCase()">
            {{ t$('project1OnlineShoppingWebsiteApp.OrderStatus.' + order.status) }}
          </span>
        </div>
        <ul class="order-card-items">
          <li class="order-card-item" v-for="item in order.items" :key="item.id">
            <div class="order-card-item-media">
              <img
                v-if="item.product?.image"
                :src="'data:' + item.product.imageContentType + ';base64,' + item.product.image"
                :alt="item.product.name"
              />
              <div v-else class="order-card-item-media-placeholder">
                <font-awesome-icon icon="image"></font-awesome-icon>
              </div>
            </div>
            <span class="order-card-item-name">{{ item.product?.name }}</span>
            <span class="order-card-item-qty">x{{ item.quantity }}</span>
            <span class="order-card-item-subtotal">{{ '$' + ((item.priceAtPurchase ?? 0) * (item.quantity ?? 0)).toFixed(2) }}</span>
          </li>
        </ul>
        <div class="order-card-footer">
          <span>{{ t$('project1OnlineShoppingWebsiteApp.shoppingCart.myCart.total') }}</span>
          <span class="order-card-total">{{ '$' + (order.totalAmount ?? 0).toFixed(2) }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" src="./order-item.component.ts"></script>
<style lang="scss" src="./my-orders.scss"></style>
