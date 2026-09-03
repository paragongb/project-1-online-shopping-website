<template>
  <div class="d-flex justify-content-center">
    <div class="col-8">
      <div v-if="customerOrder">
        <h2 class="jh-entity-heading" data-cy="customerOrderDetailsHeading">
          <span>{{ t$('project1OnlineShoppingWebsiteApp.customerOrder.detail.title') }}</span> {{ customerOrder.id }}
        </h2>
        <dl class="row-md jh-entity-details">
          <dt>
            <span>{{ t$('project1OnlineShoppingWebsiteApp.customerOrder.placedDate') }}</span>
          </dt>
          <dd>
            <span v-if="customerOrder.placedDate">{{ formatDateLong(customerOrder.placedDate) }}</span>
          </dd>
          <dt>
            <span>{{ t$('project1OnlineShoppingWebsiteApp.customerOrder.status') }}</span>
          </dt>
          <dd>
            <span>{{ t$('project1OnlineShoppingWebsiteApp.OrderStatus.' + customerOrder.status) }}</span>
          </dd>
          <dt>
            <span>{{ t$('project1OnlineShoppingWebsiteApp.customerOrder.totalAmount') }}</span>
          </dt>
          <dd>
            <span>{{ customerOrder.totalAmount }}</span>
          </dd>
          <dt>
            <span>{{ t$('project1OnlineShoppingWebsiteApp.customerOrder.shippingAddress') }}</span>
          </dt>
          <dd>
            <div v-if="customerOrder.shippingAddress">
              <router-link :to="{ name: 'AddressView', params: { addressId: customerOrder.shippingAddress.id } }">{{
                customerOrder.shippingAddress.id
              }}</router-link>
            </div>
          </dd>
          <dt>
            <span>{{ t$('project1OnlineShoppingWebsiteApp.customerOrder.billingAddress') }}</span>
          </dt>
          <dd>
            <div v-if="customerOrder.billingAddress">
              <router-link :to="{ name: 'AddressView', params: { addressId: customerOrder.billingAddress.id } }">{{
                customerOrder.billingAddress.id
              }}</router-link>
            </div>
          </dd>
          <dt>
            <span>{{ t$('project1OnlineShoppingWebsiteApp.customerOrder.user') }}</span>
          </dt>
          <dd>
            {{ customerOrder.user ? customerOrder.user.login : '' }}
          </dd>
        </dl>
        <button type="submit" @click.prevent="previousState()" class="btn btn-info" data-cy="entityDetailsBackButton">
          <font-awesome-icon icon="arrow-left"></font-awesome-icon>&nbsp;<span>{{ t$('entity.action.back') }}</span>
        </button>
        <router-link
          v-if="customerOrder.id"
          :to="{ name: 'CustomerOrderEdit', params: { customerOrderId: customerOrder.id } }"
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

<script lang="ts" src="./customer-order-details.component.ts"></script>
