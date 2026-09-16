<template>
  <b-navbar
    data-cy="navbar"
    toggleable="md"
    variant="dark"
    data-bs-theme="dark"
    :class="{
      'navbar-user-theme': !hasAnyAuthority('ROLE_ADMIN'),
      'navbar-admin-theme': hasAnyAuthority('ROLE_ADMIN'),
    }"
  >
    <b-navbar-brand class="logo" to="/">
      <span class="logo-img"></span>
      <span class="navbar-title">{{ t$('global.title') }}</span> <span class="navbar-version">{{ version }}</span>
    </b-navbar-brand>
    <b-navbar-toggle
      right
      class="jh-navbar-toggler d-lg-none"
      data-toggle="collapse"
      target="header-tabs"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <font-awesome-icon icon="bars" />
    </b-navbar-toggle>

    <b-collapse is-nav id="header-tabs">
      <b-navbar-nav class="ms-auto navbar-admin-nav" v-if="hasAnyAuthority('ROLE_ADMIN')">
        <b-nav-item to="/" exact>
          <span>
            <font-awesome-icon icon="fa-solid fa-home" />
            <span>{{ t$('global.menu.home') }}</span>
          </span>
        </b-nav-item>
        <b-nav-item :to="{ name: 'Category' }" v-if="authenticated" data-cy="adminCategory">
          <span>
            <font-awesome-icon icon="tags" />
            <span>{{ t$('global.menu.entities.category') }}</span>
          </span>
        </b-nav-item>
        <b-nav-item :to="{ name: 'Product' }" v-if="authenticated" data-cy="adminProduct">
          <span>
            <font-awesome-icon icon="shirt" />
            <span>{{ t$('global.menu.entities.product') }}</span>
          </span>
        </b-nav-item>
        <b-nav-item :to="{ name: 'CustomerOrder' }" v-if="authenticated" data-cy="adminCustomerOrder">
          <span>
            <font-awesome-icon icon="receipt" />
            <span>{{ t$('global.menu.entities.customerOrder') }}</span>
          </span>
        </b-nav-item>
        <b-nav-item :to="{ name: 'Review' }" v-if="authenticated" data-cy="adminReview">
          <span>
            <font-awesome-icon icon="star" />
            <span>{{ t$('global.menu.entities.review') }}</span>
          </span>
        </b-nav-item>
        <b-nav-item-dropdown
          right
          id="admin-menu"
          v-if="hasAnyAuthority('ROLE_ADMIN') && authenticated"
          :class="{ 'router-link-active': subIsActive('/admin') }"
          active-class="active"
          class="pointer"
          data-cy="adminMenu"
        >
          <template #button-content>
            <span class="navbar-dropdown-menu">
              <font-awesome-icon icon="users-cog" />
              <span class="no-bold">{{ t$('global.menu.admin.main') }}</span>
            </span>
          </template>
          <b-dropdown-item to="/admin/user-management" active-class="active">
            <font-awesome-icon icon="users" />
            <span>{{ t$('global.menu.admin.userManagement') }}</span>
          </b-dropdown-item>
          <b-dropdown-item to="/admin/metrics" active-class="active">
            <font-awesome-icon icon="tachometer-alt" />
            <span>{{ t$('global.menu.admin.metrics') }}</span>
          </b-dropdown-item>
          <b-dropdown-item :to="{ name: 'Address' }" active-class="active" data-cy="adminAddress">
            <font-awesome-icon icon="road" />
            <span>{{ t$('global.menu.entities.address') }}</span>
          </b-dropdown-item>
          <b-dropdown-item to="/admin/health" active-class="active">
            <font-awesome-icon icon="heart" />
            <span>{{ t$('global.menu.admin.health') }}</span>
          </b-dropdown-item>
          <b-dropdown-item to="/admin/configuration" active-class="active">
            <font-awesome-icon icon="cogs" />
            <span>{{ t$('global.menu.admin.configuration') }}</span>
          </b-dropdown-item>
          <b-dropdown-item to="/admin/logs" active-class="active">
            <font-awesome-icon icon="tasks" />
            <span>{{ t$('global.menu.admin.logs') }}</span>
          </b-dropdown-item>
          <b-dropdown-item v-if="openAPIEnabled" to="/admin/docs" active-class="active">
            <font-awesome-icon icon="book" />
            <span>{{ t$('global.menu.admin.apidocs') }}</span>
          </b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item-dropdown id="languagesnavBarDropdown" end v-if="languages && Object.keys(languages).length > 1">
          <template #button-content>
            <font-awesome-icon icon="flag" />
            <span class="no-bold">{{ t$('global.menu.language') }}</span>
          </template>
          <b-dropdown-item
            v-for="(value, key) in languages"
            :key="`lang-${key}`"
            @click="changeLanguage(key)"
            :class="{ active: isActiveLanguage(key) }"
          >
            {{ value.name }}
          </b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item-dropdown
          right
          id="account-menu"
          :class="{ 'router-link-active': subIsActive('/account') }"
          active-class="active"
          class="pointer"
          data-cy="accountMenu"
        >
          <template #button-content>
            <span class="navbar-dropdown-menu">
              <font-awesome-icon icon="user" />
              <span class="no-bold">{{ t$('global.menu.account.main') }}</span>
            </span>
          </template>
          <b-dropdown-item data-cy="settings" to="/account/settings" v-if="authenticated" active-class="active">
            <font-awesome-icon icon="wrench" />
            <span>{{ t$('global.menu.account.settings') }}</span>
          </b-dropdown-item>
          <b-dropdown-item data-cy="passwordItem" to="/account/password" v-if="authenticated" active-class="active">
            <font-awesome-icon icon="lock" />
            <span>{{ t$('global.menu.account.password') }}</span>
          </b-dropdown-item>
          <b-dropdown-item data-cy="logout" v-if="authenticated" @click="logout()" id="logout" active-class="active">
            <font-awesome-icon icon="sign-out-alt" />
            <span>{{ t$('global.menu.account.logout') }}</span>
          </b-dropdown-item>
          <b-dropdown-item data-cy="login" v-if="!authenticated" @click="showLogin()" id="login" active-class="active">
            <font-awesome-icon icon="sign-in-alt" />
            <span>{{ t$('global.menu.account.login') }}</span>
          </b-dropdown-item>
          <b-dropdown-item data-cy="register" to="/register" id="register" v-if="!authenticated" active-class="active">
            <font-awesome-icon icon="user-plus" />
            <span>{{ t$('global.menu.account.register') }}</span>
          </b-dropdown-item>
        </b-nav-item-dropdown>
        <button
          type="button"
          class="navbar-theme-toggle"
          :aria-label="darkTheme ? 'Switch to light mode' : 'Switch to dark mode'"
          :title="darkTheme ? 'Light mode' : 'Dark mode'"
          @click="toggleTheme"
        >
          <font-awesome-icon :icon="darkTheme ? 'sun' : 'moon'" />
        </button>
      </b-navbar-nav>

      <b-navbar-nav class="ms-auto navbar-user-nav" v-else>
        <b-nav-item to="/" exact>
          <span>
            <font-awesome-icon icon="fa-solid fa-home" />
            <span>{{ t$('global.menu.home') }}</span>
          </span>
        </b-nav-item>
        <b-nav-item :to="{ name: 'ShoppingCart' }" v-if="authenticated" data-cy="navbarCart" class="navbar-cart">
          <span>
            <font-awesome-icon icon="cart-shopping" />
            <span>{{ t$('global.menu.cart') }}</span>
            <span class="badge rounded-pill navbar-cart-badge" v-if="cartStore.totalItemCount > 0">
              {{ cartStore.totalItemCount }}
            </span>
          </span>
        </b-nav-item>
        <b-nav-item :to="{ name: 'Review' }" v-if="authenticated" data-cy="navbarReview">
          <span>
            <font-awesome-icon icon="star" />
            <span>{{ t$('global.menu.entities.review') }}</span>
          </span>
        </b-nav-item>
        <b-nav-item :to="{ name: 'OrderItem' }" v-if="authenticated" data-cy="navbarOrders">
          <span>
            <font-awesome-icon icon="receipt" />
            <span>{{ t$('global.menu.entities.orders') }}</span>
          </span>
        </b-nav-item>
        <b-nav-item :to="{ name: 'Wishlist' }" v-if="authenticated" data-cy="navbarWishlist">
          <span>
            <font-awesome-icon icon="heart" />
            <span>{{ t$('global.menu.entities.wishlist') }}</span>
            <span class="badge rounded-pill navbar-cart-badge" v-if="wishlistStore.products.length > 0">{{
              wishlistStore.products.length
            }}</span>
          </span>
        </b-nav-item>
        <button
          type="button"
          class="navbar-theme-toggle"
          :aria-label="darkTheme ? 'Switch to light mode' : 'Switch to dark mode'"
          :title="darkTheme ? 'Light mode' : 'Dark mode'"
          @click="toggleTheme"
        >
          <font-awesome-icon :icon="darkTheme ? 'sun' : 'moon'" />
        </button>
        <b-nav-item-dropdown
          right
          id="account-menu"
          :class="{ 'router-link-active': subIsActive('/account') }"
          active-class="active"
          class="pointer"
          data-cy="accountMenu"
        >
          <template #button-content>
            <span class="navbar-dropdown-menu">
              <font-awesome-icon icon="user" />
              <span class="no-bold">{{ t$('global.menu.account.main') }}</span>
            </span>
          </template>
          <b-dropdown-item data-cy="settings" to="/account/settings" v-if="authenticated" active-class="active">
            <font-awesome-icon icon="wrench" />
            <span>{{ t$('global.menu.account.settings') }}</span>
          </b-dropdown-item>
          <b-dropdown-item data-cy="passwordItem" to="/account/password" v-if="authenticated" active-class="active">
            <font-awesome-icon icon="lock" />
            <span>{{ t$('global.menu.account.password') }}</span>
          </b-dropdown-item>
          <b-dropdown-item data-cy="logout" v-if="authenticated" @click="logout()" id="logout" active-class="active">
            <font-awesome-icon icon="sign-out-alt" />
            <span>{{ t$('global.menu.account.logout') }}</span>
          </b-dropdown-item>
          <b-dropdown-item data-cy="login" v-if="!authenticated" @click="showLogin()" id="login" active-class="active">
            <font-awesome-icon icon="sign-in-alt" />
            <span>{{ t$('global.menu.account.login') }}</span>
          </b-dropdown-item>
          <b-dropdown-item data-cy="register" to="/register" id="register" v-if="!authenticated" active-class="active">
            <font-awesome-icon icon="user-plus" />
            <span>{{ t$('global.menu.account.register') }}</span>
          </b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
  <nav v-if="authenticated && !hasAnyAuthority('ROLE_ADMIN')" class="mobile-shop-nav" aria-label="Mobile shop navigation">
    <router-link to="/" exact-active-class="active"><font-awesome-icon icon="home" /><span>Home</span></router-link>
    <router-link :to="{ name: 'Product' }" active-class="active"><font-awesome-icon icon="shirt" /><span>Products</span></router-link>
    <router-link :to="{ name: 'Wishlist' }" active-class="active"
      ><font-awesome-icon icon="heart" /><span>Wishlist</span
      ><small v-if="wishlistStore.products.length">{{ wishlistStore.products.length }}</small></router-link
    >
    <router-link :to="{ name: 'ShoppingCart' }" active-class="active"
      ><font-awesome-icon icon="cart-shopping" /><span>Cart</span
      ><small v-if="cartStore.totalItemCount">{{ cartStore.totalItemCount }}</small></router-link
    >
    <router-link to="/account/settings" active-class="active"><font-awesome-icon icon="user" /><span>Account</span></router-link>
  </nav>
</template>

<script lang="ts" src="./jhi-navbar.component.ts"></script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* ==========================================================================
  Navbar
  ========================================================================== */
.navbar-version {
  font-size: 0.65em;
  color: #ccc;
}

.navbar .navbar-nav .nav-item {
  margin-right: 0.5rem;
}

@media screen and (min-width: 768px) {
  .jh-navbar-toggler {
    display: none;
  }
}

@media screen and (min-width: 768px) and (max-width: 1150px) {
  span span {
    display: none;
  }
}

.navbar-title {
  display: inline-block;
  color: white;
}

.navbar-cart-badge {
  font-size: 0.65rem;
  vertical-align: text-top;
  margin-left: 0.2rem;
}

.navbar-admin-nav :deep(.nav-link) {
  border-radius: 999px;
  padding: 0.4rem 0.72rem;
  transition: background-color 0.15s ease;
}

.navbar-admin-nav :deep(.nav-link:hover),
.navbar-admin-nav :deep(.nav-link.router-link-active) {
  background-color: rgba(255, 255, 255, 0.14);
}

.navbar-admin-nav :deep(.nav-link svg) {
  margin-right: 0.15rem;
}

.navbar .navbar-admin-nav :deep(.nav-item) {
  margin-right: 0.1rem;
}

/* ==========================================================================
  Logo styles
  ========================================================================== */
.navbar-brand.logo {
  padding: 0 7px;
}

.logo .logo-img {
  height: 45px;
  display: inline-block;
  vertical-align: middle;
  width: 45px;
}

.logo-img {
  height: 100%;
  background: url('/content/images/logo-jhipster.png') no-repeat center center;
  background-size: contain;
  width: 100%;
  filter: drop-shadow(0 0 0.05rem white);
  margin: 0 5px;
}

/* ==========================================================================
  Professional, minimalistic blue navbar themes.
  ========================================================================== */
.navbar-user-theme,
.navbar-admin-theme {
  background: linear-gradient(90deg, #1e3a8a, #1d4ed8) !important;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.15);
}

.navbar-user-nav :deep(.nav-link) {
  border-radius: 999px;
  padding: 0.4rem 0.9rem;
  transition: background-color 0.15s ease;
}

.navbar-user-nav :deep(.nav-link:hover),
.navbar-user-nav :deep(.nav-link.router-link-active) {
  background-color: rgba(255, 255, 255, 0.14);
}

.navbar-user-nav .navbar-cart-badge {
  background-color: #dbeafe !important;
  color: #1e3a8a;
}

.navbar-theme-toggle {
  display: grid;
  place-items: center;
  align-self: center;
  width: 34px;
  height: 34px;
  margin: 0 0.4rem;
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.mobile-shop-nav {
  display: none;
}

@media (max-width: 767px) {
  .mobile-shop-nav {
    position: fixed;
    inset: auto 0 0;
    z-index: 1050;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    padding: 0.45rem max(0.35rem, env(safe-area-inset-right)) max(0.45rem, env(safe-area-inset-bottom))
      max(0.35rem, env(safe-area-inset-left));
    border-top: 1px solid #bfdbfe;
    background: #fff;
    box-shadow: 0 -5px 20px rgba(30, 58, 138, 0.09);
  }
  .mobile-shop-nav a {
    position: relative;
    display: grid;
    justify-items: center;
    gap: 0.12rem;
    padding: 0.28rem 0;
    color: #64748b;
    text-decoration: none;
    font-size: 0.65rem;
    font-weight: 600;
  }
  .mobile-shop-nav a svg {
    font-size: 1.15rem;
  }
  .mobile-shop-nav a.active {
    color: #1d4ed8;
  }
  .mobile-shop-nav small {
    position: absolute;
    top: -0.1rem;
    right: 21%;
    min-width: 15px;
    height: 15px;
    border-radius: 50%;
    background: #1d4ed8;
    color: #fff;
    text-align: center;
    font-size: 0.6rem;
  }
}
</style>
