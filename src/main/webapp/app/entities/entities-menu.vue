<template>
  <div>
    <b-dropdown-item to="/category">
      <font-awesome-icon icon="asterisk" />
      <span>{{ t$('global.menu.entities.category') }}</span>
    </b-dropdown-item>
    <b-dropdown-item to="/product">
      <font-awesome-icon icon="asterisk" />
      <span>{{ t$('global.menu.entities.product') }}</span>
    </b-dropdown-item>
    <b-dropdown-item to="/shopping-cart">
      <font-awesome-icon icon="asterisk" />
      <span>{{ t$('global.menu.entities.shoppingCart') }}</span>
    </b-dropdown-item>
    <b-dropdown-item to="/cart-item">
      <font-awesome-icon icon="asterisk" />
      <span>{{ t$('global.menu.entities.cartItem') }}</span>
    </b-dropdown-item>
    <b-dropdown-item to="/customer-order">
      <font-awesome-icon icon="asterisk" />
      <span>{{ t$('global.menu.entities.customerOrder') }}</span>
    </b-dropdown-item>
    <b-dropdown-item to="/order-item">
      <font-awesome-icon icon="asterisk" />
      <span>{{ t$('global.menu.entities.orderItem') }}</span>
    </b-dropdown-item>
    <b-dropdown-item to="/address">
      <font-awesome-icon icon="asterisk" />
      <span>{{ t$('global.menu.entities.address') }}</span>
    </b-dropdown-item>
    <b-dropdown-item to="/review">
      <font-awesome-icon icon="asterisk" />
      <span>{{ t$('global.menu.entities.review') }}</span>
    </b-dropdown-item>
    <b-dropdown-item to="/wishlist">
      <font-awesome-icon icon="asterisk" />
      <span>{{ t$('global.menu.entities.wishlist') }}</span>
    </b-dropdown-item>
    <!-- jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here -->
  </div>
</template>

<script lang="ts" src="./entities-menu.component.ts"></script>
