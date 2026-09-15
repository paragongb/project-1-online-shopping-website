<template>
  <div class="admin-product-editor-page">
    <form name="editForm" novalidate @submit.prevent="save()">
      <header class="admin-product-editor-header">
        <div class="admin-product-editor-heading">
          <button type="button" class="btn admin-product-editor-back" :aria-label="t$('entity.action.back')" @click="previousState()">
            <font-awesome-icon icon="arrow-left"></font-awesome-icon>
          </button>
          <div>
            <span class="admin-product-editor-eyebrow">{{ t$('project1OnlineShoppingWebsiteApp.product.admin.editorEyebrow') }}</span>
            <h1 id="project1OnlineShoppingWebsiteApp.product.home.createOrEditLabel" data-cy="ProductCreateUpdateHeading">
              {{
                product.id
                  ? t$('project1OnlineShoppingWebsiteApp.product.admin.editTitle')
                  : t$('project1OnlineShoppingWebsiteApp.product.admin.createTitle')
              }}
            </h1>
            <p>{{ t$('project1OnlineShoppingWebsiteApp.product.admin.editorSubtitle') }}</p>
          </div>
        </div>
        <span class="admin-product-editor-id" v-if="product.id">#{{ product.id }}</span>
      </header>

      <div class="admin-product-editor-layout">
        <main class="admin-product-editor-main">
          <section class="admin-product-editor-card">
            <div class="admin-product-editor-card-heading">
              <span><font-awesome-icon icon="pencil-alt"></font-awesome-icon></span>
              <div>
                <h2>{{ t$('project1OnlineShoppingWebsiteApp.product.admin.basicInfoTitle') }}</h2>
                <p>{{ t$('project1OnlineShoppingWebsiteApp.product.admin.basicInfoSubtitle') }}</p>
              </div>
            </div>

            <div class="admin-product-form-grid">
              <div class="admin-product-field" v-if="product.id">
                <label for="id">{{ t$('global.field.id') }}</label>
                <input type="text" class="form-control" id="id" name="id" v-model="product.id" readonly />
              </div>

              <div class="admin-product-field">
                <label class="form-control-label" for="product-sku">
                  {{ t$('project1OnlineShoppingWebsiteApp.product.sku') }} <span>*</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  name="sku"
                  id="product-sku"
                  data-cy="sku"
                  :class="{ valid: !v$.sku.$invalid, invalid: v$.sku.$invalid }"
                  v-model="v$.sku.$model"
                  :placeholder="t$('project1OnlineShoppingWebsiteApp.product.admin.skuPlaceholder')"
                  required
                />
                <div class="admin-product-field-errors" v-if="v$.sku.$anyDirty && v$.sku.$invalid">
                  <small v-for="error of v$.sku.$errors" :key="error.$uid">{{ error.$message }}</small>
                </div>
              </div>

              <div class="admin-product-field" :class="{ 'admin-product-field-wide': !product.id }">
                <label class="form-control-label" for="product-name">
                  {{ t$('project1OnlineShoppingWebsiteApp.product.name') }} <span>*</span>
                </label>
                <input
                  type="text"
                  class="form-control"
                  name="name"
                  id="product-name"
                  data-cy="name"
                  :class="{ valid: !v$.name.$invalid, invalid: v$.name.$invalid }"
                  v-model="v$.name.$model"
                  :placeholder="t$('project1OnlineShoppingWebsiteApp.product.admin.namePlaceholder')"
                  required
                />
                <div class="admin-product-field-errors" v-if="v$.name.$anyDirty && v$.name.$invalid">
                  <small v-for="error of v$.name.$errors" :key="error.$uid">{{ error.$message }}</small>
                </div>
              </div>

              <div class="admin-product-field admin-product-field-wide">
                <label class="form-control-label" for="product-description">
                  {{ t$('project1OnlineShoppingWebsiteApp.product.description') }} <span>*</span>
                </label>
                <textarea
                  class="form-control"
                  name="description"
                  id="product-description"
                  data-cy="description"
                  rows="5"
                  :class="{ valid: !v$.description.$invalid, invalid: v$.description.$invalid }"
                  v-model="v$.description.$model"
                  :placeholder="t$('project1OnlineShoppingWebsiteApp.product.admin.descriptionPlaceholder')"
                  required
                ></textarea>
                <div class="admin-product-field-errors" v-if="v$.description.$anyDirty && v$.description.$invalid">
                  <small v-for="error of v$.description.$errors" :key="error.$uid">{{ error.$message }}</small>
                </div>
              </div>

              <div class="admin-product-field">
                <label class="form-control-label" for="product-category">{{
                  t$('project1OnlineShoppingWebsiteApp.product.category')
                }}</label>
                <select class="form-select" id="product-category" data-cy="category" name="category" v-model="product.category">
                  <option :value="null">{{ t$('project1OnlineShoppingWebsiteApp.product.admin.noCategory') }}</option>
                  <option
                    :value="product.category && categoryOption.id === product.category.id ? product.category : categoryOption"
                    v-for="categoryOption in categories"
                    :key="categoryOption.id"
                  >
                    {{ categoryOption.name }}
                  </option>
                </select>
              </div>

              <div class="admin-product-field">
                <label class="form-control-label" for="product-status">
                  {{ t$('project1OnlineShoppingWebsiteApp.product.status') }} <span>*</span>
                </label>
                <select
                  class="form-select"
                  name="status"
                  :class="{ valid: !v$.status.$invalid, invalid: v$.status.$invalid }"
                  v-model="v$.status.$model"
                  id="product-status"
                  data-cy="status"
                  :disabled="Number(product.stockQuantity ?? 0) > 0"
                  required
                >
                  <option
                    v-for="productStatus in productStatusValues"
                    :key="productStatus"
                    :value="productStatus"
                    :label="t$('project1OnlineShoppingWebsiteApp.ProductStatus.' + productStatus)"
                  >
                    {{ t$('project1OnlineShoppingWebsiteApp.ProductStatus.' + productStatus) }}
                  </option>
                </select>
                <div class="admin-product-field-errors" v-if="v$.status.$anyDirty && v$.status.$invalid">
                  <small v-for="error of v$.status.$errors" :key="error.$uid">{{ error.$message }}</small>
                </div>
                <small class="admin-product-field-help">{{
                  t$('project1OnlineShoppingWebsiteApp.product.admin.automaticStatusHelp')
                }}</small>
              </div>
            </div>
          </section>

          <section class="admin-product-editor-card">
            <div class="admin-product-editor-card-heading">
              <span><font-awesome-icon icon="database"></font-awesome-icon></span>
              <div>
                <h2>{{ t$('project1OnlineShoppingWebsiteApp.product.admin.commerceTitle') }}</h2>
                <p>{{ t$('project1OnlineShoppingWebsiteApp.product.admin.commerceSubtitle') }}</p>
              </div>
            </div>

            <div class="admin-product-form-grid">
              <div class="admin-product-field">
                <label class="form-control-label" for="product-price">
                  {{ t$('project1OnlineShoppingWebsiteApp.product.price') }} <span>*</span>
                </label>
                <div class="admin-product-input-prefix">
                  <span>$</span>
                  <input
                    type="number"
                    class="form-control"
                    name="price"
                    id="product-price"
                    data-cy="price"
                    min="0"
                    step="0.01"
                    :class="{ valid: !v$.price.$invalid, invalid: v$.price.$invalid }"
                    v-model.number="v$.price.$model"
                    required
                  />
                </div>
                <div class="admin-product-field-errors" v-if="v$.price.$anyDirty && v$.price.$invalid">
                  <small v-for="error of v$.price.$errors" :key="error.$uid">{{ error.$message }}</small>
                </div>
              </div>

              <div class="admin-product-field">
                <label class="form-control-label" for="product-stockQuantity">
                  {{ t$('project1OnlineShoppingWebsiteApp.product.stockQuantity') }} <span>*</span>
                </label>
                <input
                  type="number"
                  class="form-control"
                  name="stockQuantity"
                  id="product-stockQuantity"
                  data-cy="stockQuantity"
                  min="0"
                  step="1"
                  :class="{ valid: !v$.stockQuantity.$invalid, invalid: v$.stockQuantity.$invalid }"
                  v-model.number="v$.stockQuantity.$model"
                  required
                />
                <div class="admin-product-field-errors" v-if="v$.stockQuantity.$anyDirty && v$.stockQuantity.$invalid">
                  <small v-for="error of v$.stockQuantity.$errors" :key="error.$uid">{{ error.$message }}</small>
                </div>
              </div>
            </div>
          </section>

          <section class="admin-product-editor-card">
            <div class="admin-product-editor-card-heading">
              <span><font-awesome-icon icon="heart"></font-awesome-icon></span>
              <div>
                <h2>{{ t$('project1OnlineShoppingWebsiteApp.product.admin.relationshipsTitle') }}</h2>
                <p>{{ t$('project1OnlineShoppingWebsiteApp.product.admin.relationshipsSubtitle') }}</p>
              </div>
            </div>
            <div class="admin-product-field admin-product-field-wide">
              <label for="product-wishlists">{{ t$('project1OnlineShoppingWebsiteApp.product.wishlist') }}</label>
              <select
                class="form-select admin-product-multiple-select"
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
                  {{ t$('project1OnlineShoppingWebsiteApp.product.admin.wishlistNumber', { id: wishlistOption.id }) }}
                </option>
              </select>
              <small class="admin-product-field-help">{{ t$('project1OnlineShoppingWebsiteApp.product.admin.wishlistHelp') }}</small>
            </div>
          </section>
        </main>

        <aside class="admin-product-image-card">
          <div class="admin-product-editor-card-heading">
            <span><font-awesome-icon icon="image"></font-awesome-icon></span>
            <div>
              <h2>{{ t$('project1OnlineShoppingWebsiteApp.product.admin.imageTitle') }}</h2>
              <p>{{ t$('project1OnlineShoppingWebsiteApp.product.admin.imageSubtitle') }}</p>
            </div>
          </div>

          <div class="admin-product-image-preview" :class="{ 'admin-product-image-empty': !product.image }">
            <img
              v-if="product.image"
              :src="'data:' + product.imageContentType + ';base64,' + product.image"
              :alt="product.name || 'Product'"
            />
            <div v-else>
              <font-awesome-icon icon="image"></font-awesome-icon>
              <span>{{ t$('project1OnlineShoppingWebsiteApp.product.admin.noImage') }}</span>
            </div>
          </div>

          <p class="admin-product-image-meta" v-if="product.image">{{ product.imageContentType }} · {{ byteSize(product.image) }}</p>

          <div class="admin-product-image-actions">
            <label for="file_image" class="btn admin-product-upload-button">
              <font-awesome-icon icon="image"></font-awesome-icon>
              {{ product.image ? t$('project1OnlineShoppingWebsiteApp.product.admin.replaceImage') : t$('entity.action.addimage') }}
            </label>
            <button
              v-if="product.image"
              type="button"
              @click="clearInputImage('image', 'imageContentType', 'file_image')"
              class="btn admin-product-remove-image"
            >
              <font-awesome-icon icon="times"></font-awesome-icon>
              {{ t$('project1OnlineShoppingWebsiteApp.product.admin.removeImage') }}
            </button>
          </div>
          <input
            type="file"
            ref="file_image"
            id="file_image"
            class="visually-hidden"
            data-cy="image"
            @change="setFileData($event, product, 'image', true)"
            accept="image/*"
          />
          <input
            type="hidden"
            class="form-control"
            name="image"
            id="product-image"
            data-cy="imageValue"
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
          <small class="admin-product-field-help">{{ t$('project1OnlineShoppingWebsiteApp.product.admin.imageHelp') }}</small>
        </aside>
      </div>

      <footer class="admin-product-editor-footer">
        <p><span>*</span> {{ t$('project1OnlineShoppingWebsiteApp.product.admin.requiredHelp') }}</p>
        <div>
          <button
            type="button"
            id="cancel-save"
            data-cy="entityCreateCancelButton"
            class="btn admin-product-cancel"
            @click="previousState()"
          >
            {{ t$('entity.action.cancel') }}
          </button>
          <button
            type="submit"
            id="save-entity"
            data-cy="entityCreateSaveButton"
            :disabled="v$.$invalid || isSaving"
            class="btn admin-product-save"
          >
            <span class="spinner-border spinner-border-sm" v-if="isSaving" role="status"></span>
            <font-awesome-icon icon="save" v-else></font-awesome-icon>
            <span>{{ isSaving ? t$('project1OnlineShoppingWebsiteApp.product.admin.saving') : t$('entity.action.save') }}</span>
          </button>
        </div>
      </footer>
    </form>
  </div>
</template>

<script lang="ts" src="./product-update.component.ts"></script>
<style lang="scss" src="./product-update.scss"></style>
