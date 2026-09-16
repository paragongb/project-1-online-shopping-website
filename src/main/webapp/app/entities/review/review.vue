<template>
  <div class="admin-reviews-page" v-if="isAdmin">
    <header class="admin-reviews-header">
      <div>
        <span class="admin-reviews-eyebrow">{{ t$('project1OnlineShoppingWebsiteApp.review.admin.eyebrow') }}</span>
        <h1 id="page-heading" data-cy="ReviewHeading">{{ t$('project1OnlineShoppingWebsiteApp.review.home.title') }}</h1>
        <p>{{ t$('project1OnlineShoppingWebsiteApp.review.admin.subtitle') }}</p>
      </div>
      <button type="button" class="btn admin-reviews-refresh" @click="handleSyncList" :disabled="isFetching">
        <font-awesome-icon icon="sync" :spin="isFetching"></font-awesome-icon>
        <span>{{ t$('project1OnlineShoppingWebsiteApp.review.home.refreshListLabel') }}</span>
      </button>
    </header>

    <section class="admin-reviews-summary" aria-label="Review summary">
      <article>
        <span><font-awesome-icon icon="star"></font-awesome-icon></span>
        <div>
          <strong>{{ totalItems }}</strong>
          <p>{{ t$('project1OnlineShoppingWebsiteApp.review.admin.totalReviews') }}</p>
        </div>
      </article>
      <article>
        <span><font-awesome-icon icon="tachometer-alt"></font-awesome-icon></span>
        <div>
          <strong>{{ adminReviewSummary.averageRating }}</strong>
          <p>{{ t$('project1OnlineShoppingWebsiteApp.review.admin.averageShown') }}</p>
        </div>
      </article>
      <article>
        <span><font-awesome-icon icon="check"></font-awesome-icon></span>
        <div>
          <strong>{{ adminReviewSummary.fiveStarCount }}</strong>
          <p>{{ t$('project1OnlineShoppingWebsiteApp.review.admin.fiveStarShown') }}</p>
        </div>
      </article>
      <article>
        <span><font-awesome-icon icon="box-open"></font-awesome-icon></span>
        <div>
          <strong>{{ adminReviewSummary.productsShown }}</strong>
          <p>{{ t$('project1OnlineShoppingWebsiteApp.review.admin.productsShown') }}</p>
        </div>
      </article>
    </section>

    <section class="admin-review-filters">
      <div class="admin-review-filters-heading">
        <div>
          <h2>{{ t$('project1OnlineShoppingWebsiteApp.review.admin.filtersTitle') }}</h2>
          <p>{{ t$('project1OnlineShoppingWebsiteApp.review.admin.filtersSubtitle') }}</p>
        </div>
        <span v-if="activeFilterCount">{{
          t$('project1OnlineShoppingWebsiteApp.review.admin.activeFilters', { count: activeFilterCount })
        }}</span>
      </div>
      <div class="admin-review-filter-grid">
        <div class="admin-review-filter-field">
          <label for="review-product-filter">{{ t$('project1OnlineShoppingWebsiteApp.review.admin.productFilter') }}</label>
          <select id="review-product-filter" class="form-select" v-model="selectedProductId" data-cy="reviewProductFilter">
            <option value="">{{ t$('project1OnlineShoppingWebsiteApp.review.admin.allProducts') }}</option>
            <option v-for="product in adminProducts" :key="product.id" :value="String(product.id)">{{ product.name }}</option>
          </select>
        </div>
        <div class="admin-review-filter-field">
          <label for="review-date-from">{{ t$('project1OnlineShoppingWebsiteApp.review.admin.dateFrom') }}</label>
          <input id="review-date-from" class="form-control" type="date" v-model="reviewedFrom" :max="reviewedTo || undefined" />
        </div>
        <div class="admin-review-filter-field">
          <label for="review-date-to">{{ t$('project1OnlineShoppingWebsiteApp.review.admin.dateTo') }}</label>
          <input id="review-date-to" class="form-control" type="date" v-model="reviewedTo" :min="reviewedFrom || undefined" />
        </div>
        <div class="admin-review-filter-field">
          <label for="review-date-order">{{ t$('project1OnlineShoppingWebsiteApp.review.admin.organizeByDate') }}</label>
          <select id="review-date-order" class="form-select" v-model="dateOrder" @change="changeDateOrder">
            <option value="newest">{{ t$('project1OnlineShoppingWebsiteApp.review.admin.newestFirst') }}</option>
            <option value="oldest">{{ t$('project1OnlineShoppingWebsiteApp.review.admin.oldestFirst') }}</option>
          </select>
        </div>
      </div>
      <div class="admin-review-filter-actions">
        <button type="button" class="btn admin-review-clear" :disabled="!activeFilterCount" @click="clearAdminFilters">
          {{ t$('project1OnlineShoppingWebsiteApp.review.admin.clearFilters') }}
        </button>
        <button type="button" class="btn admin-review-apply" :disabled="isFetching" data-cy="applyReviewFilters" @click="applyAdminFilters">
          <font-awesome-icon icon="search"></font-awesome-icon>
          {{ t$('project1OnlineShoppingWebsiteApp.review.admin.applyFilters') }}
        </button>
      </div>
    </section>

    <div class="admin-reviews-loading" v-if="isFetching && reviews?.length === 0">
      <div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>
    </div>

    <section class="admin-reviews-empty" v-else-if="reviews?.length === 0">
      <span><font-awesome-icon icon="star"></font-awesome-icon></span>
      <h2>{{ t$('project1OnlineShoppingWebsiteApp.review.home.notFound') }}</h2>
      <p>{{ t$('project1OnlineShoppingWebsiteApp.review.admin.emptySubtitle') }}</p>
    </section>

    <section class="admin-review-grid" v-else aria-describedby="reviews">
      <article class="admin-review-card" v-for="review in reviews" :key="review.id" data-cy="entityTable">
        <div class="admin-review-product-image">
          <img
            v-if="review.product?.image"
            :src="'data:' + review.product.imageContentType + ';base64,' + review.product.image"
            :alt="review.product.name"
          />
          <font-awesome-icon icon="image" v-else></font-awesome-icon>
          <span>#{{ review.id }}</span>
        </div>
        <div class="admin-review-card-body">
          <div class="admin-review-card-heading">
            <div>
              <span>{{ t$('project1OnlineShoppingWebsiteApp.review.product') }}</span>
              <h2>{{ review.product?.name || t$('project1OnlineShoppingWebsiteApp.review.admin.unknownProduct') }}</h2>
            </div>
            <time :datetime="String(review.reviewDate || '')">{{ formatDateShort(review.reviewDate) || '' }}</time>
          </div>
          <div class="admin-review-rating-row">
            <div class="admin-review-stars" :aria-label="`${review.rating} out of 5 stars`">
              <font-awesome-icon
                v-for="star in 5"
                :key="star"
                icon="star"
                :class="{ 'admin-review-star-filled': star <= (review.rating ?? 0) }"
              />
            </div>
            <strong>{{ review.rating }}/5</strong>
          </div>
          <blockquote>{{ review.comment || t$('project1OnlineShoppingWebsiteApp.review.admin.noComment') }}</blockquote>
          <div class="admin-review-card-footer">
            <div class="admin-review-author">
              <span><font-awesome-icon icon="user"></font-awesome-icon></span>
              <div>
                <small>{{ t$('project1OnlineShoppingWebsiteApp.review.admin.reviewedBy') }}</small>
                <strong>{{ review.user?.login || t$('project1OnlineShoppingWebsiteApp.review.admin.unknownUser') }}</strong>
              </div>
            </div>
            <div class="admin-review-actions">
              <router-link :to="{ name: 'ReviewView', params: { reviewId: review.id } }" custom v-slot="{ navigate }">
                <button
                  type="button"
                  @click="navigate"
                  class="btn admin-review-action admin-review-view details"
                  data-cy="entityDetailsButton"
                  :title="t$('entity.action.view')"
                  :aria-label="t$('entity.action.view')"
                >
                  <font-awesome-icon icon="eye"></font-awesome-icon>
                </button>
              </router-link>
              <router-link :to="{ name: 'ReviewEdit', params: { reviewId: review.id } }" custom v-slot="{ navigate }">
                <button
                  type="button"
                  @click="navigate"
                  class="btn admin-review-action admin-review-edit edit"
                  data-cy="entityEditButton"
                  :title="t$('entity.action.edit')"
                  :aria-label="t$('entity.action.edit')"
                >
                  <font-awesome-icon icon="pencil-alt"></font-awesome-icon>
                </button>
              </router-link>
              <b-button
                @click="prepareRemove(review)"
                class="btn admin-review-action admin-review-delete"
                data-cy="entityDeleteButton"
                :title="t$('entity.action.delete')"
                :aria-label="t$('entity.action.delete')"
                ><font-awesome-icon icon="times"></font-awesome-icon
              ></b-button>
            </div>
          </div>
        </div>
      </article>
    </section>

    <b-modal ref="removeEntity" id="removeAdminReviewModal">
      <template #title>
        <span class="admin-review-delete-title" data-cy="reviewDeleteDialogHeading">{{ t$('entity.delete.title') }}</span>
      </template>
      <div class="admin-review-delete-message">
        <span><font-awesome-icon icon="times-circle"></font-awesome-icon></span>
        <div>
          <strong>{{ t$('project1OnlineShoppingWebsiteApp.review.admin.deleteTitle') }}</strong>
          <p id="jhi-delete-review-heading">
            Remove the {{ reviewToRemove?.rating }}-star review of <strong>{{ reviewToRemove?.product?.name || 'this product' }}</strong> by
            {{ reviewToRemove?.user?.login || 'this customer' }}? This cannot be undone.
          </p>
        </div>
      </div>
      <template #footer>
        <div class="admin-review-modal-actions">
          <button type="button" class="btn admin-review-modal-cancel" @click="closeDialog()">{{ t$('entity.action.cancel') }}</button>
          <button
            type="button"
            class="btn admin-review-modal-delete"
            id="jhi-confirm-delete-review"
            data-cy="entityConfirmDeleteButton"
            @click="removeReview"
          >
            {{ t$('entity.action.delete') }}
          </button>
        </div>
      </template>
    </b-modal>
    <div v-show="reviews?.length > 0" class="admin-reviews-pagination">
      <div>
        <jhi-item-count :page="page" :total="queryCount" :items-per-page="itemsPerPage"></jhi-item-count>
      </div>
      <div>
        <b-pagination size="md" :total-rows="totalItems" v-model="page" :per-page="itemsPerPage"></b-pagination>
      </div>
    </div>
  </div>

  <div class="my-reviews-page" v-else>
    <div class="my-reviews-header">
      <div>
        <span class="my-reviews-eyebrow">{{ t$('project1OnlineShoppingWebsiteApp.review.myReviews.eyebrow') }}</span>
        <h1 class="my-reviews-title">{{ t$('project1OnlineShoppingWebsiteApp.review.myReviews.title') }}</h1>
        <p class="my-reviews-subtitle">{{ t$('project1OnlineShoppingWebsiteApp.review.myReviews.subtitle') }}</p>
      </div>
    </div>

    <div class="my-reviews-loading" v-if="isFetching">
      <div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>
    </div>

    <div class="my-reviews-empty" v-else-if="reviews.length === 0">
      <font-awesome-icon icon="star" class="my-reviews-empty-icon"></font-awesome-icon>
      <h2>{{ t$('project1OnlineShoppingWebsiteApp.review.myReviews.emptyTitle') }}</h2>
      <p>{{ t$('project1OnlineShoppingWebsiteApp.review.myReviews.empty') }}</p>
      <router-link :to="{ name: 'Product' }" class="btn my-reviews-btn-primary">
        {{ t$('project1OnlineShoppingWebsiteApp.review.myReviews.shopProducts') }}
      </router-link>
    </div>

    <ul class="my-reviews-list" v-else>
      <li class="my-review-card" v-for="review in reviews" :key="review.id" data-cy="myReviewCard">
        <div class="my-review-product-media">
          <img
            v-if="review.product?.image"
            :src="'data:' + review.product.imageContentType + ';base64,' + review.product.image"
            :alt="review.product.name"
          />
          <font-awesome-icon v-else icon="image"></font-awesome-icon>
        </div>
        <div class="my-review-body">
          <div class="my-review-heading">
            <div>
              <span class="my-review-product-label">{{ t$('project1OnlineShoppingWebsiteApp.review.product') }}</span>
              <h2 class="my-review-product-name">{{ review.product?.name }}</h2>
            </div>
            <span class="my-review-date">{{ formatDateShort(review.reviewDate) || '' }}</span>
          </div>
          <div class="my-review-stars" :aria-label="`${review.rating} out of 5 stars`">
            <font-awesome-icon
              v-for="star in 5"
              :key="star"
              icon="star"
              :class="{ 'my-review-star-filled': star <= (review.rating ?? 0) }"
            />
          </div>
          <p class="my-review-comment">{{ review.comment || t$('project1OnlineShoppingWebsiteApp.review.myReviews.noComment') }}</p>
          <router-link :to="{ name: 'ReviewEdit', params: { reviewId: review.id } }" class="my-review-edit-link">
            <font-awesome-icon icon="pencil-alt"></font-awesome-icon>
            {{ t$('entity.action.edit') }}
          </router-link>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" src="./review.component.ts"></script>
<style lang="scss" src="./review.scss"></style>
<style lang="scss" src="./review-admin.scss"></style>
