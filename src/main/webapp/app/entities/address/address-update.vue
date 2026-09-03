<template>
  <div class="d-flex justify-content-center">
    <div class="col-8">
      <form name="editForm" novalidate @submit.prevent="save()">
        <h2 id="project1OnlineShoppingWebsiteApp.address.home.createOrEditLabel" data-cy="AddressCreateUpdateHeading">
          {{ t$('project1OnlineShoppingWebsiteApp.address.home.createOrEditLabel') }}
        </h2>
        <div>
          <div class="mb-3" v-if="address.id">
            <label for="id">{{ t$('global.field.id') }}</label>
            <input type="text" class="form-control" id="id" name="id" v-model="address.id" readonly />
          </div>
          <div class="mb-3">
            <label class="form-control-label" for="address-addressLine1">{{
              t$('project1OnlineShoppingWebsiteApp.address.addressLine1')
            }}</label>
            <input
              type="text"
              class="form-control"
              name="addressLine1"
              id="address-addressLine1"
              data-cy="addressLine1"
              :class="{ valid: !v$.addressLine1.$invalid, invalid: v$.addressLine1.$invalid }"
              v-model="v$.addressLine1.$model"
              required
            />
            <div v-if="v$.addressLine1.$anyDirty && v$.addressLine1.$invalid">
              <small class="form-text text-danger" v-for="error of v$.addressLine1.$errors" :key="error.$uid">{{ error.$message }}</small>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-control-label" for="address-addressLine2">{{
              t$('project1OnlineShoppingWebsiteApp.address.addressLine2')
            }}</label>
            <input
              type="text"
              class="form-control"
              name="addressLine2"
              id="address-addressLine2"
              data-cy="addressLine2"
              :class="{ valid: !v$.addressLine2.$invalid, invalid: v$.addressLine2.$invalid }"
              v-model="v$.addressLine2.$model"
            />
          </div>
          <div class="mb-3">
            <label class="form-control-label" for="address-city">{{ t$('project1OnlineShoppingWebsiteApp.address.city') }}</label>
            <input
              type="text"
              class="form-control"
              name="city"
              id="address-city"
              data-cy="city"
              :class="{ valid: !v$.city.$invalid, invalid: v$.city.$invalid }"
              v-model="v$.city.$model"
              required
            />
            <div v-if="v$.city.$anyDirty && v$.city.$invalid">
              <small class="form-text text-danger" v-for="error of v$.city.$errors" :key="error.$uid">{{ error.$message }}</small>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-control-label" for="address-state">{{ t$('project1OnlineShoppingWebsiteApp.address.state') }}</label>
            <input
              type="text"
              class="form-control"
              name="state"
              id="address-state"
              data-cy="state"
              :class="{ valid: !v$.state.$invalid, invalid: v$.state.$invalid }"
              v-model="v$.state.$model"
              required
            />
            <div v-if="v$.state.$anyDirty && v$.state.$invalid">
              <small class="form-text text-danger" v-for="error of v$.state.$errors" :key="error.$uid">{{ error.$message }}</small>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-control-label" for="address-postalCode">{{
              t$('project1OnlineShoppingWebsiteApp.address.postalCode')
            }}</label>
            <input
              type="text"
              class="form-control"
              name="postalCode"
              id="address-postalCode"
              data-cy="postalCode"
              :class="{ valid: !v$.postalCode.$invalid, invalid: v$.postalCode.$invalid }"
              v-model="v$.postalCode.$model"
              required
            />
            <div v-if="v$.postalCode.$anyDirty && v$.postalCode.$invalid">
              <small class="form-text text-danger" v-for="error of v$.postalCode.$errors" :key="error.$uid">{{ error.$message }}</small>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-control-label" for="address-country">{{ t$('project1OnlineShoppingWebsiteApp.address.country') }}</label>
            <input
              type="text"
              class="form-control"
              name="country"
              id="address-country"
              data-cy="country"
              :class="{ valid: !v$.country.$invalid, invalid: v$.country.$invalid }"
              v-model="v$.country.$model"
              required
            />
            <div v-if="v$.country.$anyDirty && v$.country.$invalid">
              <small class="form-text text-danger" v-for="error of v$.country.$errors" :key="error.$uid">{{ error.$message }}</small>
            </div>
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
<script lang="ts" src="./address-update.component.ts"></script>
