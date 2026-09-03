<template>
  <div class="d-flex justify-content-center">
    <div class="col-8">
      <form name="editForm" novalidate @submit.prevent="save()">
        <h2 id="project1OnlineShoppingWebsiteApp.review.home.createOrEditLabel" data-cy="ReviewCreateUpdateHeading">
          {{ t$('project1OnlineShoppingWebsiteApp.review.home.createOrEditLabel') }}
        </h2>
        <div>
          <div class="mb-3" v-if="review.id">
            <label for="id">{{ t$('global.field.id') }}</label>
            <input type="text" class="form-control" id="id" name="id" v-model="review.id" readonly />
          </div>
          <div class="mb-3">
            <label class="form-control-label" for="review-rating">{{ t$('project1OnlineShoppingWebsiteApp.review.rating') }}</label>
            <input
              type="number"
              class="form-control"
              name="rating"
              id="review-rating"
              data-cy="rating"
              :class="{ valid: !v$.rating.$invalid, invalid: v$.rating.$invalid }"
              v-model.number="v$.rating.$model"
              required
            />
            <div v-if="v$.rating.$anyDirty && v$.rating.$invalid">
              <small class="form-text text-danger" v-for="error of v$.rating.$errors" :key="error.$uid">{{ error.$message }}</small>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-control-label" for="review-comment">{{ t$('project1OnlineShoppingWebsiteApp.review.comment') }}</label>
            <textarea
              class="form-control"
              name="comment"
              id="review-comment"
              data-cy="comment"
              :class="{ valid: !v$.comment.$invalid, invalid: v$.comment.$invalid }"
              v-model="v$.comment.$model"
            ></textarea>
          </div>
          <div class="mb-3">
            <label class="form-control-label" for="review-reviewDate">{{ t$('project1OnlineShoppingWebsiteApp.review.reviewDate') }}</label>
            <div class="d-flex">
              <input
                id="review-reviewDate"
                data-cy="reviewDate"
                type="datetime-local"
                class="form-control"
                name="reviewDate"
                :class="{ valid: !v$.reviewDate.$invalid, invalid: v$.reviewDate.$invalid }"
                required
                :value="convertDateTimeFromServer(v$.reviewDate.$model)"
                @change="updateInstantField('reviewDate', $event)"
              />
            </div>
            <div v-if="v$.reviewDate.$anyDirty && v$.reviewDate.$invalid">
              <small class="form-text text-danger" v-for="error of v$.reviewDate.$errors" :key="error.$uid">{{ error.$message }}</small>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-control-label" for="review">{{ t$('project1OnlineShoppingWebsiteApp.review.product') }}</label>
            <select class="form-control" id="review-product" data-cy="product" name="product" v-model="review.product">
              <option :value="null"></option>
              <option
                :value="review.product && productOption.id === review.product.id ? review.product : productOption"
                v-for="productOption in products"
                :key="productOption.id"
              >
                {{ productOption.name }}
              </option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-control-label" for="review">{{ t$('project1OnlineShoppingWebsiteApp.review.user') }}</label>
            <select class="form-control" id="review-user" data-cy="user" name="user" v-model="review.user">
              <option :value="null"></option>
              <option
                :value="review.user && userOption.id === review.user.id ? review.user : userOption"
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
<script lang="ts" src="./review-update.component.ts"></script>
