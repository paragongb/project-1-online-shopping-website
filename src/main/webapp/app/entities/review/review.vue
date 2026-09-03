<template>
  <div>
    <h2 id="page-heading" data-cy="ReviewHeading">
      <span id="review">{{ t$('project1OnlineShoppingWebsiteApp.review.home.title') }}</span>
      <div class="d-flex justify-content-end">
        <button class="btn btn-info me-2" @click="handleSyncList" :disabled="isFetching">
          <font-awesome-icon icon="sync" :spin="isFetching"></font-awesome-icon>
          <span>{{ t$('project1OnlineShoppingWebsiteApp.review.home.refreshListLabel') }}</span>
        </button>
        <router-link :to="{ name: 'ReviewCreate' }" custom v-slot="{ navigate }">
          <button
            @click="navigate"
            id="jh-create-entity"
            data-cy="entityCreateButton"
            class="btn btn-primary jh-create-entity create-review"
          >
            <font-awesome-icon icon="plus"></font-awesome-icon>
            <span>{{ t$('project1OnlineShoppingWebsiteApp.review.home.createLabel') }}</span>
          </button>
        </router-link>
      </div>
    </h2>
    <br />
    <div class="alert alert-warning" v-if="!isFetching && reviews?.length === 0">
      <span>{{ t$('project1OnlineShoppingWebsiteApp.review.home.notFound') }}</span>
    </div>
    <div class="table-responsive" v-if="reviews?.length > 0">
      <table class="table table-striped" aria-describedby="reviews">
        <thead>
          <tr>
            <th scope="col" @click="changeOrder('id')">
              <span>{{ t$('global.field.id') }}</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'id'"></jhi-sort-indicator>
            </th>
            <th scope="col" @click="changeOrder('rating')">
              <span>{{ t$('project1OnlineShoppingWebsiteApp.review.rating') }}</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'rating'"></jhi-sort-indicator>
            </th>
            <th scope="col" @click="changeOrder('comment')">
              <span>{{ t$('project1OnlineShoppingWebsiteApp.review.comment') }}</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'comment'"></jhi-sort-indicator>
            </th>
            <th scope="col" @click="changeOrder('reviewDate')">
              <span>{{ t$('project1OnlineShoppingWebsiteApp.review.reviewDate') }}</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'reviewDate'"></jhi-sort-indicator>
            </th>
            <th scope="col" @click="changeOrder('product.name')">
              <span>{{ t$('project1OnlineShoppingWebsiteApp.review.product') }}</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'product.name'"></jhi-sort-indicator>
            </th>
            <th scope="col" @click="changeOrder('user.login')">
              <span>{{ t$('project1OnlineShoppingWebsiteApp.review.user') }}</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'user.login'"></jhi-sort-indicator>
            </th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="review in reviews" :key="review.id" data-cy="entityTable">
            <td>
              <router-link :to="{ name: 'ReviewView', params: { reviewId: review.id } }">{{ review.id }}</router-link>
            </td>
            <td>{{ review.rating }}</td>
            <td>{{ review.comment }}</td>
            <td>{{ formatDateShort(review.reviewDate) || '' }}</td>
            <td>
              <div v-if="review.product">
                <router-link :to="{ name: 'ProductView', params: { productId: review.product.id } }">{{ review.product.name }}</router-link>
              </div>
            </td>
            <td>
              {{ review.user ? review.user.login : '' }}
            </td>
            <td class="text-end">
              <div class="btn-group">
                <router-link :to="{ name: 'ReviewView', params: { reviewId: review.id } }" custom v-slot="{ navigate }">
                  <button @click="navigate" class="btn btn-info btn-sm details" data-cy="entityDetailsButton">
                    <font-awesome-icon icon="eye"></font-awesome-icon>
                    <span class="d-none d-md-inline">{{ t$('entity.action.view') }}</span>
                  </button>
                </router-link>
                <router-link :to="{ name: 'ReviewEdit', params: { reviewId: review.id } }" custom v-slot="{ navigate }">
                  <button @click="navigate" class="btn btn-primary btn-sm edit" data-cy="entityEditButton">
                    <font-awesome-icon icon="pencil-alt"></font-awesome-icon>
                    <span class="d-none d-md-inline">{{ t$('entity.action.edit') }}</span>
                  </button>
                </router-link>
                <b-button @click="prepareRemove(review)" variant="danger" class="btn btn-sm" data-cy="entityDeleteButton">
                  <font-awesome-icon icon="times"></font-awesome-icon>
                  <span class="d-none d-md-inline">{{ t$('entity.action.delete') }}</span>
                </b-button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <b-modal ref="removeEntity" id="removeEntity">
      <template #title>
        <span id="project1OnlineShoppingWebsiteApp.review.delete.question" data-cy="reviewDeleteDialogHeading">{{
          t$('entity.delete.title')
        }}</span>
      </template>
      <div class="modal-body">
        <p id="jhi-delete-review-heading">{{ t$('project1OnlineShoppingWebsiteApp.review.delete.question', { id: removeId }) }}</p>
      </div>
      <template #footer>
        <div>
          <button type="button" class="btn btn-secondary" @click="closeDialog()">{{ t$('entity.action.cancel') }}</button>
          <button
            type="button"
            class="btn btn-primary"
            id="jhi-confirm-delete-review"
            data-cy="entityConfirmDeleteButton"
            @click="removeReview"
          >
            {{ t$('entity.action.delete') }}
          </button>
        </div>
      </template>
    </b-modal>
    <div v-show="reviews?.length > 0">
      <div class="d-flex justify-content-center">
        <jhi-item-count :page="page" :total="queryCount" :items-per-page="itemsPerPage"></jhi-item-count>
      </div>
      <div class="d-flex justify-content-center">
        <b-pagination size="md" :total-rows="totalItems" v-model="page" :per-page="itemsPerPage"></b-pagination>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./review.component.ts"></script>
