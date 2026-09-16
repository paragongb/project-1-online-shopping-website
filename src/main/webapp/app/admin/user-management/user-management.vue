<template>
  <div class="user-management-page">
    <h2>
      <span id="user-management-page-heading" data-cy="UserManagementHeading">{{ t$('userManagement.home.title') }}</span>

      <div class="d-flex justify-content-end">
        <button class="btn btn-info me-2" @click="handleSyncList" :disabled="isLoading">
          <font-awesome-icon icon="sync" :spin="isLoading"></font-awesome-icon>
          <span>{{ t$('userManagement.home.refreshListLabel') }}</span>
        </button>
        <router-link custom v-slot="{ navigate }" :to="{ name: 'JhiUserCreate' }">
          <button @click="navigate" class="btn btn-primary jh-create-entity" data-cy="entityCreateButton">
            <font-awesome-icon icon="plus"></font-awesome-icon> <span>{{ t$('userManagement.home.createLabel') }}</span>
          </button>
        </router-link>
      </div>
    </h2>
    <div class="table-responsive" v-if="users">
      <table class="table table-striped user-management-table" aria-describedby="Users">
        <thead>
          <tr>
            <th scope="col" @click="changeOrder('id')">
              <span>{{ t$('global.field.id') }}</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'id'"></jhi-sort-indicator>
            </th>
            <th scope="col" @click="changeOrder('login')">
              <span>{{ t$('userManagement.login') }}</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'login'"></jhi-sort-indicator>
            </th>
            <th scope="col" @click="changeOrder('email')">
              <span>{{ t$('userManagement.email') }}</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'email'"></jhi-sort-indicator>
            </th>
            <th scope="col"></th>
            <th scope="col" @click="changeOrder('langKey')">
              <span>{{ t$('userManagement.langKey') }}</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'langKey'"></jhi-sort-indicator>
            </th>
            <th scope="col">
              <span>{{ t$('userManagement.profiles') }}</span>
            </th>
            <th scope="col" @click="changeOrder('createdDate')">
              <span>{{ t$('userManagement.createdDate') }}</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'createdDate'"></jhi-sort-indicator>
            </th>
            <th scope="col" @click="changeOrder('lastModifiedBy')">
              <span>{{ t$('userManagement.lastModifiedBy') }}</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'lastModifiedBy'"></jhi-sort-indicator>
            </th>
            <th scope="col" id="modified-date-sort" @click="changeOrder('lastModifiedDate')">
              <span>{{ t$('userManagement.lastModifiedDate') }}</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'lastModifiedDate'"></jhi-sort-indicator>
            </th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody v-if="users">
          <tr v-for="user in users" :key="user.id" :id="user.login" data-cy="entityTable">
            <td :data-label="t$('global.field.id')">
              <router-link :to="{ name: 'JhiUserView', params: { userId: user.login } }">{{ user.id }}</router-link>
            </td>
            <td :data-label="t$('userManagement.login')">{{ user.login }}</td>
            <td class="jhi-user-email" :data-label="t$('userManagement.email')">{{ user.email }}</td>
            <td :data-label="t$('userManagement.activated')">
              <button class="btn btn-danger btn-sm deactivated" @click="setActive(user, true)" v-if="!user.activated">
                {{ t$('userManagement.deactivated') }}
              </button>
              <button
                class="btn btn-success btn-sm"
                @click="setActive(user, false)"
                v-if="user.activated"
                :disabled="username === user.login"
              >
                {{ t$('userManagement.activated') }}
              </button>
            </td>
            <td :data-label="t$('userManagement.langKey')">{{ user.langKey }}</td>
            <td :data-label="t$('userManagement.profiles')">
              <div v-for="authority of user.authorities" :key="authority">
                <span class="badge bg-info">{{ authority }}</span>
              </div>
            </td>
            <td :data-label="t$('userManagement.createdDate')">{{ formatDate(user.createdDate) || '—' }}</td>
            <td :data-label="t$('userManagement.lastModifiedBy')">{{ user.lastModifiedBy || '—' }}</td>
            <td :data-label="t$('userManagement.lastModifiedDate')">{{ formatDate(user.lastModifiedDate) || '—' }}</td>
            <td class="text-end" :data-label="t$('project1OnlineShoppingWebsiteApp.product.admin.actions')">
              <div class="btn-group">
                <router-link :to="{ name: 'JhiUserView', params: { userId: user.login } }" custom v-slot="{ navigate }">
                  <button @click="navigate" class="btn btn-info btn-sm details" data-cy="entityDetailsButton">
                    <font-awesome-icon icon="eye"></font-awesome-icon>
                    <span class="d-none d-md-inline">{{ t$('entity.action.view') }}</span>
                  </button>
                </router-link>
                <router-link :to="{ name: 'JhiUserEdit', params: { userId: user.login } }" custom v-slot="{ navigate }">
                  <button @click="navigate" class="btn btn-primary btn-sm edit" data-cy="entityEditButton">
                    <font-awesome-icon icon="pencil-alt"></font-awesome-icon>
                    <span class="d-none d-md-inline">{{ t$('entity.action.edit') }}</span>
                  </button>
                </router-link>
                <b-button
                  @click="prepareRemove(user)"
                  variant="danger"
                  class="btn btn-sm delete"
                  :disabled="username === user.login"
                  data-cy="entityDeleteButton"
                >
                  <font-awesome-icon icon="times"></font-awesome-icon>
                  <span class="d-none d-md-inline">{{ t$('entity.action.delete') }}</span>
                </b-button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <b-modal
        ref="removeUser"
        id="removeUser"
        :title="t$('entity.delete.title')"
        @ok="deleteUser()"
        data-cy="userManagementDeleteDialogHeading"
      >
        <div class="modal-body">
          <p id="jhi-delete-user-heading">{{ t$('userManagement.delete.question', { login: removeId }) }}</p>
        </div>
        <template #footer>
          <div>
            <button type="button" class="btn btn-secondary" @click="closeDialog()">{{ t$('entity.action.cancel') }}</button>
            <button
              type="button"
              class="btn btn-primary"
              id="confirm-delete-user"
              @click="deleteUser()"
              data-cy="entityConfirmDeleteButton"
            >
              {{ t$('entity.action.delete') }}
            </button>
          </div>
        </template>
      </b-modal>
    </div>
    <div v-show="users?.length > 0">
      <div class="d-flex justify-content-center">
        <jhi-item-count :page="page" :total="queryCount" :items-per-page="itemsPerPage"></jhi-item-count>
      </div>
      <div class="d-flex justify-content-center">
        <b-pagination size="md" :total-rows="totalItems" v-model="page" :per-page="itemsPerPage" :change="loadPage(page)"></b-pagination>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./user-management.component.ts"></script>

<style lang="scss">
@media (max-width: 767px) {
  .user-management-page {
    > h2 {
      font-size: 1.65rem;

      .d-flex {
        display: grid !important;
        width: 100%;
        gap: 0.5rem;
        margin-top: 0.75rem;
        justify-content: stretch !important;
      }

      .btn {
        width: 100%;
        min-height: 44px;
        margin: 0 !important;
      }
    }

    .table-responsive {
      overflow: visible;
    }

    .user-management-table {
      display: block;
      min-width: 0;

      thead {
        display: block;
        overflow-x: auto;
        scrollbar-width: thin;
      }

      thead tr {
        display: flex;
        width: max-content;
        min-width: 100%;
        gap: 0.35rem;
        padding: 0.5rem 0;
      }

      th {
        display: block;
        border: 1px solid #dbeafe;
        border-radius: 999px;
        padding: 0.55rem 0.7rem;
        background: #eff6ff;
        color: #1e3a8a;
        font-size: 0.72rem;
        white-space: nowrap;

        &:empty {
          display: none;
        }
      }

      tbody {
        display: grid;
        gap: 0.75rem;
        padding: 0.5rem 0;
      }

      tbody tr {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.75rem;
        min-width: 0;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 0.85rem;
        background: #fff;
      }

      td {
        display: flex;
        min-width: 0;
        flex-direction: column;
        align-items: flex-start;
        gap: 0.25rem;
        border: 0;
        padding: 0;
        background: transparent;
        box-shadow: none;
        font-size: 0.82rem;
        overflow-wrap: anywhere;

        &::before {
          content: attr(data-label);
          color: #64748b;
          font-size: 0.68rem;
          font-weight: 700;
        }

        &:nth-child(3),
        &:nth-child(4),
        &:last-child {
          grid-column: 1 / -1;
        }

        &:last-child {
          padding-top: 0.65rem;
          border-top: 1px solid #e2e8f0;
        }
      }

      td:nth-child(4) .btn,
      td:last-child .btn {
        min-height: 44px;
      }

      td:last-child .btn-group {
        gap: 0.5rem;
      }

      td:last-child .btn {
        min-width: 44px;
        border-radius: 8px !important;
      }
    }
  }
}
</style>
