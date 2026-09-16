<template>
  <div class="admin-orders-page">
    <header class="admin-orders-header">
      <div>
        <span class="admin-orders-eyebrow">{{ t$('project1OnlineShoppingWebsiteApp.customerOrder.home.eyebrow') }}</span>
        <h1 id="page-heading" data-cy="CustomerOrderHeading">
          {{ t$('project1OnlineShoppingWebsiteApp.customerOrder.home.title') }}
        </h1>
        <p>{{ t$('project1OnlineShoppingWebsiteApp.customerOrder.home.subtitle') }}</p>
      </div>
      <div class="admin-orders-header-actions">
        <button class="btn admin-orders-button admin-orders-button-secondary" @click="handleSyncList" :disabled="isFetching">
          <font-awesome-icon icon="sync" :spin="isFetching"></font-awesome-icon>
          <span>{{ t$('project1OnlineShoppingWebsiteApp.customerOrder.home.refreshListLabel') }}</span>
        </button>
        <router-link :to="{ name: 'CustomerOrderCreate' }" custom v-slot="{ navigate }">
          <button
            @click="navigate"
            id="jh-create-entity"
            data-cy="entityCreateButton"
            class="btn admin-orders-button admin-orders-button-primary create-customer-order"
          >
            <font-awesome-icon icon="plus"></font-awesome-icon>
            <span>{{ t$('project1OnlineShoppingWebsiteApp.customerOrder.home.createLabel') }}</span>
          </button>
        </router-link>
      </div>
    </header>

    <section class="admin-orders-summary" v-if="!isFetching || customerOrders?.length">
      <article class="admin-orders-summary-card admin-orders-summary-primary">
        <span class="admin-orders-summary-icon"><font-awesome-icon icon="receipt"></font-awesome-icon></span>
        <div>
          <span>{{ t$('project1OnlineShoppingWebsiteApp.customerOrder.home.totalOrders') }}</span>
          <strong>{{ totalItems || customerOrders?.length || 0 }}</strong>
        </div>
      </article>
      <article class="admin-orders-summary-card">
        <span class="admin-orders-summary-icon"><font-awesome-icon icon="tags"></font-awesome-icon></span>
        <div>
          <span>{{ t$('project1OnlineShoppingWebsiteApp.customerOrder.home.visibleValue') }}</span>
          <strong>{{ formatCurrency(visibleOrderValue) }}</strong>
        </div>
      </article>
      <article class="admin-orders-summary-card">
        <span class="admin-orders-summary-icon"><font-awesome-icon icon="tasks"></font-awesome-icon></span>
        <div>
          <span>{{ t$('project1OnlineShoppingWebsiteApp.customerOrder.home.activeOnPage') }}</span>
          <strong>{{ activeOrderCount }}</strong>
        </div>
      </article>
    </section>

    <div class="admin-orders-loading" v-if="isFetching && customerOrders?.length === 0">
      <div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>
    </div>

    <section class="admin-orders-empty" v-else-if="customerOrders?.length === 0">
      <span><font-awesome-icon icon="box-open"></font-awesome-icon></span>
      <h2>{{ t$('project1OnlineShoppingWebsiteApp.customerOrder.home.notFound') }}</h2>
      <p>{{ t$('project1OnlineShoppingWebsiteApp.customerOrder.home.emptySubtitle') }}</p>
    </section>

    <section class="admin-orders-table-card" v-else>
      <div class="table-responsive">
        <table class="table admin-orders-table" aria-describedby="customerOrders">
          <thead>
            <tr>
              <th scope="col" @click="changeOrder('id')">
                <span>{{ t$('project1OnlineShoppingWebsiteApp.customerOrder.home.order') }}</span>
                <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" field-name="id"></jhi-sort-indicator>
              </th>
              <th scope="col" @click="changeOrder('placedDate')">
                <span>{{ t$('project1OnlineShoppingWebsiteApp.customerOrder.placedDate') }}</span>
                <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" field-name="placedDate"></jhi-sort-indicator>
              </th>
              <th scope="col" @click="changeOrder('user.login')">
                <span>{{ t$('project1OnlineShoppingWebsiteApp.customerOrder.user') }}</span>
                <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" field-name="user.login"></jhi-sort-indicator>
              </th>
              <th scope="col" @click="changeOrder('status')">
                <span>{{ t$('project1OnlineShoppingWebsiteApp.customerOrder.status') }}</span>
                <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" field-name="status"></jhi-sort-indicator>
              </th>
              <th scope="col" @click="changeOrder('totalAmount')">
                <span>{{ t$('project1OnlineShoppingWebsiteApp.customerOrder.totalAmount') }}</span>
                <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" field-name="totalAmount"></jhi-sort-indicator>
              </th>
              <th scope="col" @click="changeOrder('shippingAddress.id')">
                <span>{{ t$('project1OnlineShoppingWebsiteApp.customerOrder.shippingAddress') }}</span>
                <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" field-name="shippingAddress.id"></jhi-sort-indicator>
              </th>
              <th scope="col" class="admin-orders-actions-heading">{{ t$('project1OnlineShoppingWebsiteApp.customerOrder.actions') }}</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="customerOrder in customerOrders" :key="customerOrder.id">
              <tr
                class="admin-order-row"
                data-cy="entityTable"
                role="button"
                @click="toggleOrderItems(customerOrder)"
                :aria-expanded="expandedOrderId === customerOrder.id"
              >
                <td>
                  <div class="admin-order-reference">
                    <button
                      type="button"
                      class="admin-order-expand"
                      @click.stop="toggleOrderItems(customerOrder)"
                      :aria-label="t$('project1OnlineShoppingWebsiteApp.customerOrder.toggleItems')"
                    >
                      <font-awesome-icon
                        icon="chevron-down"
                        :class="{ 'admin-order-chevron-open': expandedOrderId === customerOrder.id }"
                      ></font-awesome-icon>
                    </button>
                    <router-link :to="{ name: 'CustomerOrderView', params: { customerOrderId: customerOrder.id } }" @click.stop>
                      {{ formatOrderNumber(customerOrder.id) }}
                    </router-link>
                  </div>
                </td>
                <td class="admin-order-date">{{ formatDateShort(customerOrder.placedDate) || '—' }}</td>
                <td>
                  <div class="admin-order-customer">
                    <span class="admin-order-customer-avatar">{{ formatCustomer(customerOrder).charAt(0).toUpperCase() }}</span>
                    <div>
                      <strong>{{ formatCustomer(customerOrder) }}</strong>
                      <small v-if="customerOrder.user?.email">{{ customerOrder.user.email }}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="admin-order-status" :class="`admin-order-status-${customerOrder.status?.toLowerCase()}`">
                    {{ t$('project1OnlineShoppingWebsiteApp.OrderStatus.' + customerOrder.status) }}
                  </span>
                </td>
                <td class="admin-order-amount">{{ formatCurrency(customerOrder.totalAmount) }}</td>
                <td>
                  <router-link
                    v-if="customerOrder.shippingAddress"
                    class="admin-order-address"
                    :to="{ name: 'AddressView', params: { addressId: customerOrder.shippingAddress.id } }"
                    :title="formatAddress(customerOrder.shippingAddress)"
                    @click.stop
                  >
                    {{ formatAddress(customerOrder.shippingAddress) }}
                  </router-link>
                  <span v-else>—</span>
                </td>
                <td class="admin-order-actions" @click.stop>
                  <div class="admin-order-action-group">
                    <router-link
                      :to="{ name: 'CustomerOrderView', params: { customerOrderId: customerOrder.id } }"
                      custom
                      v-slot="{ navigate }"
                    >
                      <button
                        @click="navigate"
                        class="btn admin-order-action admin-order-action-view details"
                        :title="t$('entity.action.view')"
                        data-cy="entityDetailsButton"
                      >
                        <font-awesome-icon icon="eye"></font-awesome-icon>
                        <span class="visually-hidden">{{ t$('entity.action.view') }}</span>
                      </button>
                    </router-link>
                    <router-link
                      :to="{ name: 'CustomerOrderEdit', params: { customerOrderId: customerOrder.id } }"
                      custom
                      v-slot="{ navigate }"
                    >
                      <button
                        @click="navigate"
                        class="btn admin-order-action admin-order-action-edit edit"
                        :title="t$('entity.action.edit')"
                        data-cy="entityEditButton"
                      >
                        <font-awesome-icon icon="pencil-alt"></font-awesome-icon>
                        <span class="visually-hidden">{{ t$('entity.action.edit') }}</span>
                      </button>
                    </router-link>
                    <b-button
                      v-if="customerOrder.status !== 'DELIVERED'"
                      @click="prepareDelivery(customerOrder)"
                      :disabled="isMarkingDelivered"
                      class="btn admin-order-action admin-order-action-deliver"
                      :title="t$('project1OnlineShoppingWebsiteApp.customerOrder.delivered')"
                      data-cy="customerOrderDeliveredButton"
                    >
                      <font-awesome-icon icon="truck-fast"></font-awesome-icon>
                      <span class="visually-hidden">{{ t$('project1OnlineShoppingWebsiteApp.customerOrder.delivered') }}</span>
                    </b-button>
                    <b-button
                      @click="prepareRemove(customerOrder)"
                      class="btn admin-order-action admin-order-action-delete"
                      :title="t$('entity.action.delete')"
                      data-cy="entityDeleteButton"
                    >
                      <font-awesome-icon icon="times"></font-awesome-icon>
                      <span class="visually-hidden">{{ t$('entity.action.delete') }}</span>
                    </b-button>
                  </div>
                </td>
              </tr>
              <tr v-if="expandedOrderId === customerOrder.id" class="admin-order-items-row">
                <td colspan="7">
                  <div class="admin-order-items-panel">
                    <div class="admin-order-items-heading">
                      <div>
                        <strong>{{ t$('project1OnlineShoppingWebsiteApp.customerOrder.itemsTitle') }}</strong>
                        <span>{{ formatOrderNumber(customerOrder.id) }}</span>
                      </div>
                      <span v-if="orderItemsByOrderId[customerOrder.id]">
                        {{
                          t$('project1OnlineShoppingWebsiteApp.customerOrder.itemCount', {
                            count: orderItemsByOrderId[customerOrder.id].length,
                          })
                        }}
                      </span>
                    </div>
                    <div class="admin-order-items-loading" v-if="isLoadingItems && !orderItemsByOrderId[customerOrder.id]">
                      <div class="spinner-border spinner-border-sm" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                    </div>
                    <div
                      class="admin-order-items-empty"
                      v-else-if="orderItemsByOrderId[customerOrder.id] && orderItemsByOrderId[customerOrder.id].length === 0"
                    >
                      {{ t$('project1OnlineShoppingWebsiteApp.orderItem.home.notFound') }}
                    </div>
                    <ul class="admin-order-items-list" v-else-if="orderItemsByOrderId[customerOrder.id]">
                      <li class="admin-order-item" v-for="item in orderItemsByOrderId[customerOrder.id]" :key="item.id">
                        <div class="admin-order-item-media">
                          <img
                            v-if="item.product?.image"
                            :src="'data:' + item.product.imageContentType + ';base64,' + item.product.image"
                            :alt="item.product.name"
                          />
                          <div v-else class="admin-order-item-placeholder">
                            <font-awesome-icon icon="image"></font-awesome-icon>
                          </div>
                        </div>
                        <span class="admin-order-item-name">{{ item.product?.name }}</span>
                        <span class="admin-order-item-quantity">×{{ item.quantity }}</span>
                        <span class="admin-order-item-price">{{ formatCurrency(item.priceAtPurchase) }}</span>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </section>

    <div class="admin-orders-pagination" v-show="customerOrders?.length > 0">
      <jhi-item-count :page="page" :total="queryCount" :items-per-page="itemsPerPage"></jhi-item-count>
      <b-pagination size="md" :total-rows="totalItems" v-model="page" :per-page="itemsPerPage"></b-pagination>
    </div>

    <b-modal ref="deliverEntity" id="deliverEntity" title="Confirm delivery">
      <p>
        Mark order <strong>{{ formatOrderNumber(orderToDeliver?.id) }}</strong> for
        {{ orderToDeliver ? formatCustomer(orderToDeliver) : 'this customer' }} as delivered?
      </p>
      <template #footer>
        <div class="admin-orders-modal-actions">
          <button type="button" class="btn admin-orders-button admin-orders-button-secondary" @click="deliverEntity.hide()">Cancel</button>
          <button
            type="button"
            class="btn admin-orders-button admin-orders-button-primary"
            :disabled="isMarkingDelivered"
            @click="markDelivered(orderToDeliver)"
          >
            Mark delivered
          </button>
        </div>
      </template>
    </b-modal>

    <b-modal ref="removeEntity" id="removeEntity">
      <template #title>
        <span id="project1OnlineShoppingWebsiteApp.customerOrder.delete.question" data-cy="customerOrderDeleteDialogHeading">
          {{ t$('entity.delete.title') }}
        </span>
      </template>
      <div class="modal-body">
        <p id="jhi-delete-customerOrder-heading">
          Delete order <strong>{{ formatOrderNumber(orderToRemove?.id) }}</strong> for
          {{ orderToRemove ? formatCustomer(orderToRemove) : 'this customer' }}? This cannot be undone.
        </p>
      </div>
      <template #footer>
        <div class="admin-orders-modal-actions">
          <button type="button" class="btn admin-orders-button admin-orders-button-secondary" @click="closeDialog()">
            {{ t$('entity.action.cancel') }}
          </button>
          <button
            type="button"
            class="btn admin-orders-button admin-orders-button-danger"
            id="jhi-confirm-delete-customerOrder"
            data-cy="entityConfirmDeleteButton"
            @click="removeCustomerOrder"
          >
            {{ t$('entity.action.delete') }}
          </button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script lang="ts" src="./customer-order.component.ts"></script>
<style lang="scss" src="./customer-order.scss"></style>
