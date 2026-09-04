<template>
  <div>
    <h2 id="page-heading" data-cy="CustomerOrderHeading">
      <span id="customer-order">{{ t$('project1OnlineShoppingWebsiteApp.customerOrder.home.title') }}</span>
      <div class="d-flex justify-content-end">
        <button class="btn btn-info me-2" @click="handleSyncList" :disabled="isFetching">
          <font-awesome-icon icon="sync" :spin="isFetching"></font-awesome-icon>
          <span>{{ t$('project1OnlineShoppingWebsiteApp.customerOrder.home.refreshListLabel') }}</span>
        </button>
        <router-link :to="{ name: 'CustomerOrderCreate' }" custom v-slot="{ navigate }">
          <button
            @click="navigate"
            id="jh-create-entity"
            data-cy="entityCreateButton"
            class="btn btn-primary jh-create-entity create-customer-order"
          >
            <font-awesome-icon icon="plus"></font-awesome-icon>
            <span>{{ t$('project1OnlineShoppingWebsiteApp.customerOrder.home.createLabel') }}</span>
          </button>
        </router-link>
      </div>
    </h2>
    <br />
    <div class="alert alert-warning" v-if="!isFetching && customerOrders?.length === 0">
      <span>{{ t$('project1OnlineShoppingWebsiteApp.customerOrder.home.notFound') }}</span>
    </div>
    <div class="table-responsive" v-if="customerOrders?.length > 0">
      <table class="table table-striped" aria-describedby="customerOrders">
        <thead>
          <tr>
            <th scope="col" @click="changeOrder('id')">
              <span>{{ t$('global.field.id') }}</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'id'"></jhi-sort-indicator>
            </th>
            <th scope="col"></th>
            <th scope="col" @click="changeOrder('placedDate')">
              <span>{{ t$('project1OnlineShoppingWebsiteApp.customerOrder.placedDate') }}</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'placedDate'"></jhi-sort-indicator>
            </th>
            <th scope="col" @click="changeOrder('status')">
              <span>{{ t$('project1OnlineShoppingWebsiteApp.customerOrder.status') }}</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'status'"></jhi-sort-indicator>
            </th>
            <th scope="col" @click="changeOrder('totalAmount')">
              <span>{{ t$('project1OnlineShoppingWebsiteApp.customerOrder.totalAmount') }}</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'totalAmount'"></jhi-sort-indicator>
            </th>
            <th scope="col" @click="changeOrder('shippingAddress.id')">
              <span>{{ t$('project1OnlineShoppingWebsiteApp.customerOrder.shippingAddress') }}</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'shippingAddress.id'"></jhi-sort-indicator>
            </th>
            <th scope="col" @click="changeOrder('billingAddress.id')">
              <span>{{ t$('project1OnlineShoppingWebsiteApp.customerOrder.billingAddress') }}</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'billingAddress.id'"></jhi-sort-indicator>
            </th>
            <th scope="col" @click="changeOrder('user.login')">
              <span>{{ t$('project1OnlineShoppingWebsiteApp.customerOrder.user') }}</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'user.login'"></jhi-sort-indicator>
            </th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <template v-for="customerOrder in customerOrders" :key="customerOrder.id">
            <tr
              class="order-row"
              data-cy="entityTable"
              role="button"
              @click="toggleOrderItems(customerOrder)"
              :aria-expanded="expandedOrderId === customerOrder.id"
            >
              <td>
                <router-link :to="{ name: 'CustomerOrderView', params: { customerOrderId: customerOrder.id } }" @click.stop>{{
                  customerOrder.id
                }}</router-link>
              </td>
              <td>
                <font-awesome-icon
                  icon="chevron-down"
                  class="order-row-chevron"
                  :class="{ 'order-row-chevron-open': expandedOrderId === customerOrder.id }"
                ></font-awesome-icon>
              </td>
              <td>{{ formatDateShort(customerOrder.placedDate) || '' }}</td>
              <td>{{ t$('project1OnlineShoppingWebsiteApp.OrderStatus.' + customerOrder.status) }}</td>
              <td>{{ customerOrder.totalAmount }}</td>
              <td>
                <div v-if="customerOrder.shippingAddress">
                  <router-link :to="{ name: 'AddressView', params: { addressId: customerOrder.shippingAddress.id } }" @click.stop>{{
                    customerOrder.shippingAddress.id
                  }}</router-link>
                </div>
              </td>
              <td>
                <div v-if="customerOrder.billingAddress">
                  <router-link :to="{ name: 'AddressView', params: { addressId: customerOrder.billingAddress.id } }" @click.stop>{{
                    customerOrder.billingAddress.id
                  }}</router-link>
                </div>
              </td>
              <td>
                {{ customerOrder.user ? customerOrder.user.login : '' }}
              </td>
              <td class="text-end" @click.stop>
                <div class="btn-group">
                  <router-link
                    :to="{ name: 'CustomerOrderView', params: { customerOrderId: customerOrder.id } }"
                    custom
                    v-slot="{ navigate }"
                  >
                    <button @click="navigate" class="btn btn-info btn-sm details" data-cy="entityDetailsButton">
                      <font-awesome-icon icon="eye"></font-awesome-icon>
                      <span class="d-none d-md-inline">{{ t$('entity.action.view') }}</span>
                    </button>
                  </router-link>
                  <router-link
                    :to="{ name: 'CustomerOrderEdit', params: { customerOrderId: customerOrder.id } }"
                    custom
                    v-slot="{ navigate }"
                  >
                    <button @click="navigate" class="btn btn-primary btn-sm edit" data-cy="entityEditButton">
                      <font-awesome-icon icon="pencil-alt"></font-awesome-icon>
                      <span class="d-none d-md-inline">{{ t$('entity.action.edit') }}</span>
                    </button>
                  </router-link>
                  <b-button @click="prepareRemove(customerOrder)" variant="danger" class="btn btn-sm" data-cy="entityDeleteButton">
                    <font-awesome-icon icon="times"></font-awesome-icon>
                    <span class="d-none d-md-inline">{{ t$('entity.action.delete') }}</span>
                  </b-button>
                  <b-button
                    v-if="customerOrder.status !== 'DELIVERED'"
                    @click="markDelivered(customerOrder)"
                    :disabled="isMarkingDelivered"
                    variant="success"
                    class="btn btn-sm"
                    data-cy="customerOrderDeliveredButton"
                  >
                    <font-awesome-icon icon="truck-fast"></font-awesome-icon>
                    <span class="d-none d-md-inline">{{ t$('project1OnlineShoppingWebsiteApp.customerOrder.delivered') }}</span>
                  </b-button>
                </div>
              </td>
            </tr>
            <tr v-if="expandedOrderId === customerOrder.id" class="order-items-row">
              <td colspan="9">
                <div class="order-items-dropdown">
                  <div class="order-items-loading" v-if="isLoadingItems && !orderItemsByOrderId[customerOrder.id]">
                    <div class="spinner-border spinner-border-sm" role="status">
                      <span class="visually-hidden">Loading...</span>
                    </div>
                  </div>
                  <div
                    class="order-items-empty"
                    v-else-if="orderItemsByOrderId[customerOrder.id] && orderItemsByOrderId[customerOrder.id].length === 0"
                  >
                    {{ t$('project1OnlineShoppingWebsiteApp.orderItem.home.notFound') }}
                  </div>
                  <ul class="order-items-list" v-else-if="orderItemsByOrderId[customerOrder.id]">
                    <li class="order-items-item" v-for="item in orderItemsByOrderId[customerOrder.id]" :key="item.id">
                      <div class="order-items-item-media">
                        <img
                          v-if="item.product?.image"
                          :src="'data:' + item.product.imageContentType + ';base64,' + item.product.image"
                          :alt="item.product.name"
                        />
                        <div v-else class="order-items-item-media-placeholder">
                          <font-awesome-icon icon="image"></font-awesome-icon>
                        </div>
                      </div>
                      <span class="order-items-item-name">{{ item.product?.name }}</span>
                      <span class="order-items-item-qty">x{{ item.quantity }}</span>
                      <span class="order-items-item-price">{{ '$' + item.priceAtPurchase }}</span>
                    </li>
                  </ul>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <b-modal ref="removeEntity" id="removeEntity">
      <template #title>
        <span id="project1OnlineShoppingWebsiteApp.customerOrder.delete.question" data-cy="customerOrderDeleteDialogHeading">{{
          t$('entity.delete.title')
        }}</span>
      </template>
      <div class="modal-body">
        <p id="jhi-delete-customerOrder-heading">
          {{ t$('project1OnlineShoppingWebsiteApp.customerOrder.delete.question', { id: removeId }) }}
        </p>
      </div>
      <template #footer>
        <div>
          <button type="button" class="btn btn-secondary" @click="closeDialog()">{{ t$('entity.action.cancel') }}</button>
          <button
            type="button"
            class="btn btn-primary"
            id="jhi-confirm-delete-customerOrder"
            data-cy="entityConfirmDeleteButton"
            @click="removeCustomerOrder"
          >
            {{ t$('entity.action.delete') }}
          </button>
        </div>
      </template>
    </b-modal>
    <div v-show="customerOrders?.length > 0">
      <div class="d-flex justify-content-center">
        <jhi-item-count :page="page" :total="queryCount" :items-per-page="itemsPerPage"></jhi-item-count>
      </div>
      <div class="d-flex justify-content-center">
        <b-pagination size="md" :total-rows="totalItems" v-model="page" :per-page="itemsPerPage"></b-pagination>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./customer-order.component.ts"></script>
<style lang="scss" src="./customer-order.scss"></style>
