<template>
  <div class="d-flex justify-content-center">
    <div class="col-8">
      <form name="editForm" novalidate @submit.prevent="save()">
        <h2 id="project1OnlineShoppingWebsiteApp.cartItem.home.createOrEditLabel" data-cy="CartItemCreateUpdateHeading">
          {{ t$('project1OnlineShoppingWebsiteApp.cartItem.home.createOrEditLabel') }}
        </h2>
        <div>
          <div class="mb-3" v-if="cartItem.id">
            <label for="id">{{ t$('global.field.id') }}</label>
            <input type="text" class="form-control" id="id" name="id" v-model="cartItem.id" readonly />
          </div>
          <div class="mb-3">
            <label class="form-control-label" for="cart-item-quantity">{{
              t$('project1OnlineShoppingWebsiteApp.cartItem.quantity')
            }}</label>
            <input
              type="number"
              class="form-control"
              name="quantity"
              id="cart-item-quantity"
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
            <label class="form-control-label" for="cart-item">{{ t$('project1OnlineShoppingWebsiteApp.cartItem.product') }}</label>
            <select class="form-control" id="cart-item-product" data-cy="product" name="product" v-model="cartItem.product">
              <option :value="null"></option>
              <option
                :value="cartItem.product && productOption.id === cartItem.product.id ? cartItem.product : productOption"
                v-for="productOption in products"
                :key="productOption.id"
              >
                {{ productOption.name }}
              </option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-control-label" for="cart-item">{{ t$('project1OnlineShoppingWebsiteApp.cartItem.cart') }}</label>
            <select class="form-control" id="cart-item-cart" data-cy="cart" name="cart" v-model="cartItem.cart">
              <option :value="null"></option>
              <option
                :value="cartItem.cart && shoppingCartOption.id === cartItem.cart.id ? cartItem.cart : shoppingCartOption"
                v-for="shoppingCartOption in shoppingCarts"
                :key="shoppingCartOption.id"
              >
                {{ shoppingCartOption.id }}
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
<script lang="ts" src="./cart-item-update.component.ts"></script>
