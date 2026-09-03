<template>
  <div class="d-flex justify-content-center">
    <div class="col-8">
      <form name="editForm" novalidate @submit.prevent="save()">
        <h2 id="project1OnlineShoppingWebsiteApp.orderItem.home.createOrEditLabel" data-cy="OrderItemCreateUpdateHeading">
          {{ t$('project1OnlineShoppingWebsiteApp.orderItem.home.createOrEditLabel') }}
        </h2>
        <div>
          <div class="mb-3" v-if="orderItem.id">
            <label for="id">{{ t$('global.field.id') }}</label>
            <input type="text" class="form-control" id="id" name="id" v-model="orderItem.id" readonly />
          </div>
          <div class="mb-3">
            <label class="form-control-label" for="order-item-quantity">{{
              t$('project1OnlineShoppingWebsiteApp.orderItem.quantity')
            }}</label>
            <input
              type="number"
              class="form-control"
              name="quantity"
              id="order-item-quantity"
              data-cy="quantity"
              :class="{ valid: !v$.quantity.$invalid, invalid: v$.quantity.$invalid }"
              v-model.number="v$.quantity.$model"
              required
            />
            <div v-if="v$.quantity.$anyDirty && v$.quantity.$invalid">
              <small class="form-text text-danger" v-for="error of v$.quantity.$errors" :key="error.$uid">{{ error.$message }}</small>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-control-label" for="order-item-priceAtPurchase">{{
              t$('project1OnlineShoppingWebsiteApp.orderItem.priceAtPurchase')
            }}</label>
            <input
              type="number"
              class="form-control"
              name="priceAtPurchase"
              id="order-item-priceAtPurchase"
              data-cy="priceAtPurchase"
              :class="{ valid: !v$.priceAtPurchase.$invalid, invalid: v$.priceAtPurchase.$invalid }"
              v-model.number="v$.priceAtPurchase.$model"
              required
            />
            <div v-if="v$.priceAtPurchase.$anyDirty && v$.priceAtPurchase.$invalid">
              <small class="form-text text-danger" v-for="error of v$.priceAtPurchase.$errors" :key="error.$uid">{{
                error.$message
              }}</small>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-control-label" for="order-item">{{ t$('project1OnlineShoppingWebsiteApp.orderItem.product') }}</label>
            <select class="form-control" id="order-item-product" data-cy="product" name="product" v-model="orderItem.product">
              <option :value="null"></option>
              <option
                :value="orderItem.product && productOption.id === orderItem.product.id ? orderItem.product : productOption"
                v-for="productOption in products"
                :key="productOption.id"
              >
                {{ productOption.name }}
              </option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-control-label" for="order-item">{{ t$('project1OnlineShoppingWebsiteApp.orderItem.order') }}</label>
            <select class="form-control" id="order-item-order" data-cy="order" name="order" v-model="orderItem.order">
              <option :value="null"></option>
              <option
                :value="orderItem.order && customerOrderOption.id === orderItem.order.id ? orderItem.order : customerOrderOption"
                v-for="customerOrderOption in customerOrders"
                :key="customerOrderOption.id"
              >
                {{ customerOrderOption.id }}
              </option>
            </select>
          </div>
        </div>
        <div>
          <button type="button" id="cancel-save" data-cy="entityCreateCancelButton" class="btn btn-secondary" @click="previousState()">
            <font-awesome-icon icon="ban"></font-awesome-icon>&nbsp;<span>{{ t$('entity.action.cancel') }}</span>
          </button>
          <button
            type="submit"
            id="save-entity"
            data-cy="entityCreateSaveButton"
            :disabled="v$.$invalid || isSaving"
            class="btn btn-primary"
          >
            <font-awesome-icon icon="save"></font-awesome-icon>&nbsp;<span>{{ t$('entity.action.save') }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script lang="ts" src="./order-item-update.component.ts"></script>
