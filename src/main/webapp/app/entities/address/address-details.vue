<template>
  <div class="d-flex justify-content-center">
    <div class="col-8">
      <div v-if="address">
        <h2 class="jh-entity-heading" data-cy="addressDetailsHeading">
          <span>{{ t$('project1OnlineShoppingWebsiteApp.address.detail.title') }}</span> {{ address.id }}
        </h2>
        <dl class="row-md jh-entity-details">
          <dt>
            <span>{{ t$('project1OnlineShoppingWebsiteApp.address.addressLine1') }}</span>
          </dt>
          <dd>
            <span>{{ address.addressLine1 }}</span>
          </dd>
          <dt>
            <span>{{ t$('project1OnlineShoppingWebsiteApp.address.addressLine2') }}</span>
          </dt>
          <dd>
            <span>{{ address.addressLine2 }}</span>
          </dd>
          <dt>
            <span>{{ t$('project1OnlineShoppingWebsiteApp.address.city') }}</span>
          </dt>
          <dd>
            <span>{{ address.city }}</span>
          </dd>
          <dt>
            <span>{{ t$('project1OnlineShoppingWebsiteApp.address.state') }}</span>
          </dt>
          <dd>
            <span>{{ address.state }}</span>
          </dd>
          <dt>
            <span>{{ t$('project1OnlineShoppingWebsiteApp.address.postalCode') }}</span>
          </dt>
          <dd>
            <span>{{ address.postalCode }}</span>
          </dd>
          <dt>
            <span>{{ t$('project1OnlineShoppingWebsiteApp.address.country') }}</span>
          </dt>
          <dd>
            <span>{{ address.country }}</span>
          </dd>
        </dl>
        <button type="submit" @click.prevent="previousState()" class="btn btn-info" data-cy="entityDetailsBackButton">
          <font-awesome-icon icon="arrow-left"></font-awesome-icon>&nbsp;<span>{{ t$('entity.action.back') }}</span>
        </button>
        <router-link v-if="address.id" :to="{ name: 'AddressEdit', params: { addressId: address.id } }" custom v-slot="{ navigate }">
          <button @click="navigate" class="btn btn-primary">
            <font-awesome-icon icon="pencil-alt"></font-awesome-icon>&nbsp;<span>{{ t$('entity.action.edit') }}</span>
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./address-details.component.ts"></script>
