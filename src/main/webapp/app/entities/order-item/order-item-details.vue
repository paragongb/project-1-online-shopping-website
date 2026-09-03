<template>
  <div class="d-flex justify-content-center">
    <div class="col-8">
      <div v-if="orderItem">
        <h2 class="jh-entity-heading" data-cy="orderItemDetailsHeading">
          <span>{{ t$('project1OnlineShoppingWebsiteApp.orderItem.detail.title') }}</span> {{ orderItem.id }}
        </h2>
        <dl class="row-md jh-entity-details">
          <dt>
            <span>{{ t$('project1OnlineShoppingWebsiteApp.orderItem.quantity') }}</span>
          </dt>
          <dd>
            <span>{{ orderItem.quantity }}</span>
          </dd>
          <dt>
            <span>{{ t$('project1OnlineShoppingWebsiteApp.orderItem.priceAtPurchase') }}</span>
          </dt>
          <dd>
            <span>{{ orderItem.priceAtPurchase }}</span>
          </dd>
          <dt>
            <span>{{ t$('project1OnlineShoppingWebsiteApp.orderItem.product') }}</span>
          </dt>
          <dd>
            <div v-if="orderItem.product">
              <router-link :to="{ name: 'ProductView', params: { productId: orderItem.product.id } }">{{
                orderItem.product.name
              }}</router-link>
            </div>
          </dd>
          <dt>
            <span>{{ t$('project1OnlineShoppingWebsiteApp.orderItem.order') }}</span>
          </dt>
          <dd>
            <div v-if="orderItem.order">
              <router-link :to="{ name: 'CustomerOrderView', params: { customerOrderId: orderItem.order.id } }">{{
                orderItem.order.id
              }}</router-link>
            </div>
          </dd>
        </dl>
        <button type="submit" @click.prevent="previousState()" class="btn btn-info" data-cy="entityDetailsBackButton">
          <font-awesome-icon icon="arrow-left"></font-awesome-icon>&nbsp;<span>{{ t$('entity.action.back') }}</span>
        </button>
        <router-link
          v-if="orderItem.id"
          :to="{ name: 'OrderItemEdit', params: { orderItemId: orderItem.id } }"
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

<script lang="ts" src="./order-item-details.component.ts"></script>
