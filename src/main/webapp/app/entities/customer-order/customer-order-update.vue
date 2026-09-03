<template>
  <div class="d-flex justify-content-center">
    <div class="col-8">
      <form name="editForm" novalidate @submit.prevent="save()">
        <h2 id="project1OnlineShoppingWebsiteApp.customerOrder.home.createOrEditLabel" data-cy="CustomerOrderCreateUpdateHeading">
          {{ t$('project1OnlineShoppingWebsiteApp.customerOrder.home.createOrEditLabel') }}
        </h2>
        <div>
          <div class="mb-3" v-if="customerOrder.id">
            <label for="id">{{ t$('global.field.id') }}</label>
            <input type="text" class="form-control" id="id" name="id" v-model="customerOrder.id" readonly />
          </div>
          <div class="mb-3">
            <label class="form-control-label" for="customer-order-placedDate">{{
              t$('project1OnlineShoppingWebsiteApp.customerOrder.placedDate')
            }}</label>
            <div class="d-flex">
              <input
                id="customer-order-placedDate"
                data-cy="placedDate"
                type="datetime-local"
                class="form-control"
                name="placedDate"
                :class="{ valid: !v$.placedDate.$invalid, invalid: v$.placedDate.$invalid }"
                required
                :value="convertDateTimeFromServer(v$.placedDate.$model)"
                @change="updateInstantField('placedDate', $event)"
              />
            </div>
            <div v-if="v$.placedDate.$anyDirty && v$.placedDate.$invalid">
              <small class="form-text text-danger" v-for="error of v$.placedDate.$errors" :key="error.$uid">{{ error.$message }}</small>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-control-label" for="customer-order-status">{{
              t$('project1OnlineShoppingWebsiteApp.customerOrder.status')
            }}</label>
            <select
              class="form-control"
              name="status"
              :class="{ valid: !v$.status.$invalid, invalid: v$.status.$invalid }"
              v-model="v$.status.$model"
              id="customer-order-status"
              data-cy="status"
              required
            >
              <option
                v-for="orderStatus in orderStatusValues"
                :key="orderStatus"
                :value="orderStatus"
                :label="t$('project1OnlineShoppingWebsiteApp.OrderStatus.' + orderStatus)"
              >
                {{ orderStatus }}
              </option>
            </select>
            <div v-if="v$.status.$anyDirty && v$.status.$invalid">
              <small class="form-text text-danger" v-for="error of v$.status.$errors" :key="error.$uid">{{ error.$message }}</small>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-control-label" for="customer-order-totalAmount">{{
              t$('project1OnlineShoppingWebsiteApp.customerOrder.totalAmount')
            }}</label>
            <input
              type="number"
              class="form-control"
              name="totalAmount"
              id="customer-order-totalAmount"
              data-cy="totalAmount"
              :class="{ valid: !v$.totalAmount.$invalid, invalid: v$.totalAmount.$invalid }"
              v-model.number="v$.totalAmount.$model"
              required
            />
            <div v-if="v$.totalAmount.$anyDirty && v$.totalAmount.$invalid">
              <small class="form-text text-danger" v-for="error of v$.totalAmount.$errors" :key="error.$uid">{{ error.$message }}</small>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-control-label" for="customer-order">{{
              t$('project1OnlineShoppingWebsiteApp.customerOrder.shippingAddress')
            }}</label>
            <select
              class="form-control"
              id="customer-order-shippingAddress"
              data-cy="shippingAddress"
              name="shippingAddress"
              v-model="customerOrder.shippingAddress"
            >
              <option :value="null"></option>
              <option
                :value="
                  customerOrder.shippingAddress && addressOption.id === customerOrder.shippingAddress.id
                    ? customerOrder.shippingAddress
                    : addressOption
                "
                v-for="addressOption in addresses"
                :key="addressOption.id"
              >
                {{ addressOption.id }}
              </option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-control-label" for="customer-order">{{
              t$('project1OnlineShoppingWebsiteApp.customerOrder.billingAddress')
            }}</label>
            <select
              class="form-control"
              id="customer-order-billingAddress"
              data-cy="billingAddress"
              name="billingAddress"
              v-model="customerOrder.billingAddress"
            >
              <option :value="null"></option>
              <option
                :value="
                  customerOrder.billingAddress && addressOption.id === customerOrder.billingAddress.id
                    ? customerOrder.billingAddress
                    : addressOption
                "
                v-for="addressOption in addresses"
                :key="addressOption.id"
              >
                {{ addressOption.id }}
              </option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-control-label" for="customer-order">{{ t$('project1OnlineShoppingWebsiteApp.customerOrder.user') }}</label>
            <select class="form-control" id="customer-order-user" data-cy="user" name="user" v-model="customerOrder.user">
              <option :value="null"></option>
              <option
                :value="customerOrder.user && userOption.id === customerOrder.user.id ? customerOrder.user : userOption"
                v-for="userOption in users"
                :key="userOption.id"
              >
                {{ userOption.login }}
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
<script lang="ts" src="./customer-order-update.component.ts"></script>
