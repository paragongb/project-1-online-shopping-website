<template>
  <div class="d-flex justify-content-center">
    <div class="col-8">
      <div v-if="review">
        <h2 class="jh-entity-heading" data-cy="reviewDetailsHeading">
          <span>{{ t$('project1OnlineShoppingWebsiteApp.review.detail.title') }}</span> {{ review.id }}
        </h2>
        <dl class="row-md jh-entity-details">
          <dt>
            <span>{{ t$('project1OnlineShoppingWebsiteApp.review.rating') }}</span>
          </dt>
          <dd>
            <span>{{ review.rating }}</span>
          </dd>
          <dt>
            <span>{{ t$('project1OnlineShoppingWebsiteApp.review.comment') }}</span>
          </dt>
          <dd>
            <span>{{ review.comment }}</span>
          </dd>
          <dt>
            <span>{{ t$('project1OnlineShoppingWebsiteApp.review.reviewDate') }}</span>
          </dt>
          <dd>
            <span v-if="review.reviewDate">{{ formatDateLong(review.reviewDate) }}</span>
          </dd>
          <dt>
            <span>{{ t$('project1OnlineShoppingWebsiteApp.review.product') }}</span>
          </dt>
          <dd>
            <div v-if="review.product">
              <router-link :to="{ name: 'ProductView', params: { productId: review.product.id } }">{{ review.product.name }}</router-link>
            </div>
          </dd>
          <dt>
            <span>{{ t$('project1OnlineShoppingWebsiteApp.review.user') }}</span>
          </dt>
          <dd>
            {{ review.user ? review.user.login : '' }}
          </dd>
        </dl>
        <button type="submit" @click.prevent="previousState()" class="btn btn-info" data-cy="entityDetailsBackButton">
          <font-awesome-icon icon="arrow-left"></font-awesome-icon>&nbsp;<span>{{ t$('entity.action.back') }}</span>
        </button>
        <router-link v-if="review.id" :to="{ name: 'ReviewEdit', params: { reviewId: review.id } }" custom v-slot="{ navigate }">
          <button @click="navigate" class="btn btn-primary">
            <font-awesome-icon icon="pencil-alt"></font-awesome-icon>&nbsp;<span>{{ t$('entity.action.edit') }}</span>
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./review-details.component.ts"></script>
