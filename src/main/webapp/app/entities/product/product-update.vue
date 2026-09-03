<template>
  <div class="d-flex justify-content-center">
    <div class="col-8">
      <form name="editForm" novalidate @submit.prevent="save()">
        <h2 id="project1OnlineShoppingWebsiteApp.product.home.createOrEditLabel" data-cy="ProductCreateUpdateHeading">
          {{ t$('project1OnlineShoppingWebsiteApp.product.home.createOrEditLabel') }}
        </h2>
        <div>
          <div class="mb-3" v-if="product.id">
            <label for="id">{{ t$('global.field.id') }}</label>
            <input type="text" class="form-control" id="id" name="id" v-model="product.id" readonly />
          </div>
          <div class="mb-3">
            <label class="form-control-label" for="product-sku">{{ t$('project1OnlineShoppingWebsiteApp.product.sku') }}</label>
            <input
              type="text"
              class="form-control"
              name="sku"
              id="product-sku"
              data-cy="sku"
              :class="{ valid: !v$.sku.$invalid, invalid: v$.sku.$invalid }"
              v-model="v$.sku.$model"
              required
            />
            <div v-if="v$.sku.$anyDirty && v$.sku.$invalid">
              <small class="form-text text-danger" v-for="error of v$.sku.$errors" :key="error.$uid">{{ error.$message }}</small>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-control-label" for="product-name">{{ t$('project1OnlineShoppingWebsiteApp.product.name') }}</label>
            <input
              type="text"
              class="form-control"
              name="name"
              id="product-name"
              data-cy="name"
              :class="{ valid: !v$.name.$invalid, invalid: v$.name.$invalid }"
              v-model="v$.name.$model"
              required
            />
            <div v-if="v$.name.$anyDirty && v$.name.$invalid">
              <small class="form-text text-danger" v-for="error of v$.name.$errors" :key="error.$uid">{{ error.$message }}</small>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-control-label" for="product-description">{{
              t$('project1OnlineShoppingWebsiteApp.product.description')
            }}</label>
            <textarea
              class="form-control"
              name="description"
              id="product-description"
              data-cy="description"
              :class="{ valid: !v$.description.$invalid, invalid: v$.description.$invalid }"
              v-model="v$.description.$model"
              required
            ></textarea>
            <div v-if="v$.description.$anyDirty && v$.description.$invalid">
              <small class="form-text text-danger" v-for="error of v$.description.$errors" :key="error.$uid">{{ error.$message }}</small>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-control-label" for="product-price">{{ t$('project1OnlineShoppingWebsiteApp.product.price') }}</label>
            <input
              type="number"
              class="form-control"
              name="price"
              id="product-price"
              data-cy="price"
              :class="{ valid: !v$.price.$invalid, invalid: v$.price.$invalid }"
              v-model.number="v$.price.$model"
              required
            />
            <div v-if="v$.price.$anyDirty && v$.price.$invalid">
              <small class="form-text text-danger" v-for="error of v$.price.$errors" :key="error.$uid">{{ error.$message }}</small>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-control-label" for="product-stockQuantity">{{
              t$('project1OnlineShoppingWebsiteApp.product.stockQuantity')
            }}</label>
            <input
              type="number"
              class="form-control"
              name="stockQuantity"
              id="product-stockQuantity"
              data-cy="stockQuantity"
              :class="{ valid: !v$.stockQuantity.$invalid, invalid: v$.stockQuantity.$invalid }"
              v-model.number="v$.stockQuantity.$model"
              required
            />
            <div v-if="v$.stockQuantity.$anyDirty && v$.stockQuantity.$invalid">
              <small class="form-text text-danger" v-for="error of v$.stockQuantity.$errors" :key="error.$uid">{{ error.$message }}</small>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-control-label" for="product-status">{{ t$('project1OnlineShoppingWebsiteApp.product.status') }}</label>
            <select
              class="form-control"
              name="status"
              :class="{ valid: !v$.status.$invalid, invalid: v$.status.$invalid }"
              v-model="v$.status.$model"
              id="product-status"
              data-cy="status"
              required
            >
              <option
                v-for="productStatus in productStatusValues"
                :key="productStatus"
                :value="productStatus"
                :label="t$('project1OnlineShoppingWebsiteApp.ProductStatus.' + productStatus)"
              >
                {{ productStatus }}
              </option>
            </select>
            <div v-if="v$.status.$anyDirty && v$.status.$invalid">
              <small class="form-text text-danger" v-for="error of v$.status.$errors" :key="error.$uid">{{ error.$message }}</small>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-control-label" for="product-image">{{ t$('project1OnlineShoppingWebsiteApp.product.image') }}</label>
            <div>
              <img
                :src="'data:' + product.imageContentType + ';base64,' + product.image"
                style="max-height: 100px"
                v-if="product.image"
                alt="product"
              />
              <div v-if="product.image" class="form-text text-danger clearfix">
                <span class="pull-start">{{ product.imageContentType }}, {{ byteSize(product.image) }}</span>
                <button
                  type="button"
                  @click="clearInputImage('image', 'imageContentType', 'file_image')"
                  class="btn btn-secondary btn-xs pull-end"
                >
                  <font-awesome-icon icon="times"></font-awesome-icon>
                </button>
              </div>
              <label for="file_image" class="btn btn-primary pull-end">{{ t$('entity.action.addimage') }}</label>
              <input
                type="file"
                ref="file_image"
                id="file_image"
                style="display: none"
                data-cy="image"
                @change="setFileData($event, product, 'image', true)"
                accept="image/*"
              />
            </div>
            <input
              type="hidden"
              class="form-control"
              name="image"
              id="product-image"
              data-cy="image"
              :class="{ valid: !v$.image.$invalid, invalid: v$.image.$invalid }"
              v-model="v$.image.$model"
            />
            <input
              type="hidden"
              class="form-control"
              name="imageContentType"
              id="product-imageContentType"
              v-model="product.imageContentType"
            />
          </div>
          <div class="mb-3">
            <label class="form-control-label" for="product">{{ t$('project1OnlineShoppingWebsiteApp.product.category') }}</label>
            <select class="form-control" id="product-category" data-cy="category" name="category" v-model="product.category">
              <option :value="null"></option>
              <option
                :value="product.category && categoryOption.id === product.category.id ? product.category : categoryOption"
                v-for="categoryOption in categories"
                :key="categoryOption.id"
              >
                {{ categoryOption.name }}
              </option>
            </select>
          </div>
          <div class="mb-3">
            <label for="product">{{ t$('project1OnlineShoppingWebsiteApp.product.wishlist') }}</label>
            <select
              class="form-control"
              id="product-wishlists"
              data-cy="wishlist"
              multiple
              name="wishlist"
              v-if="product.wishlists !== undefined"
              v-model="product.wishlists"
            >
              <option
                :value="getSelected(product.wishlists, wishlistOption, 'id')"
                v-for="wishlistOption in wishlists"
                :key="wishlistOption.id"
              >
                {{ wishlistOption.id }}
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
<script lang="ts" src="./product-update.component.ts"></script>
