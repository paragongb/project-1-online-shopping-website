<template>
  <div class="review-form-page">
    <div class="review-form-card">
      <div class="review-form-loading" v-if="isLoading">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div class="review-already" v-else-if="alreadyReviewed">
        <font-awesome-icon icon="star" class="review-already-icon"></font-awesome-icon>
        <h2>{{ t$('project1OnlineShoppingWebsiteApp.review.alreadyReviewed.title') }}</h2>
        <p>{{ t$('project1OnlineShoppingWebsiteApp.review.alreadyReviewed.message') }}</p>
        <button type="button" class="btn review-btn-primary" @click="previousState()">
          {{ t$('entity.action.back') }}
        </button>
      </div>

      <form name="editForm" novalidate @submit.prevent="save()" v-else>
        <h1 class="review-form-title">
          {{
            isEditing
              ? t$('project1OnlineShoppingWebsiteApp.review.home.createOrEditLabel')
              : t$('project1OnlineShoppingWebsiteApp.review.writeReview')
          }}
        </h1>
        <p class="review-form-subtitle" v-if="review.product">{{ review.product.name }}</p>

        <div class="mb-4" v-if="!review.product">
          <label class="form-control-label review-form-label" for="review-product">{{
            t$('project1OnlineShoppingWebsiteApp.review.product')
          }}</label>
          <select class="form-control review-form-input" id="review-product" data-cy="product" name="product" v-model="review.product">
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

        <div class="mb-4">
          <label class="form-control-label review-form-label">{{ t$('project1OnlineShoppingWebsiteApp.review.rating') }}</label>
          <div class="review-star-picker" data-cy="rating">
            <button
              type="button"
              class="review-star-btn"
              v-for="star in 5"
              :key="star"
              @click="setRating(star)"
              :aria-label="`${star} star`"
            >
              <font-awesome-icon icon="star" :class="{ 'review-star-filled': star <= (v$.rating.$model ?? 0) }"></font-awesome-icon>
            </button>
          </div>
          <div v-if="v$.rating.$anyDirty && v$.rating.$invalid">
            <small class="form-text text-danger" v-for="error of v$.rating.$errors" :key="error.$uid">{{ error.$message }}</small>
          </div>
        </div>

        <div class="mb-4">
          <label class="form-control-label review-form-label" for="review-comment">{{
            t$('project1OnlineShoppingWebsiteApp.review.comment')
          }}</label>
          <textarea
            class="form-control review-form-input"
            name="comment"
            id="review-comment"
            data-cy="comment"
            rows="4"
            :placeholder="t$('project1OnlineShoppingWebsiteApp.review.commentPlaceholder')"
            v-model="v$.comment.$model"
          ></textarea>
        </div>

        <div class="review-form-actions">
          <button
            type="button"
            id="cancel-save"
            data-cy="entityCreateCancelButton"
            class="btn review-btn-secondary"
            @click="previousState()"
          >
            {{ t$('entity.action.cancel') }}
          </button>
          <button
            type="submit"
            id="save-entity"
            data-cy="entityCreateSaveButton"
            :disabled="v$.$invalid || isSaving"
            class="btn review-btn-primary"
          >
            <font-awesome-icon icon="save"></font-awesome-icon>&nbsp;<span>{{ t$('entity.action.save') }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts" src="./review-update.component.ts"></script>
<style lang="scss" src="./review-update.scss"></style>
