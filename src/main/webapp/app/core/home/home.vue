<template>
  <div class="home row" v-if="isAdmin">
    <div class="col-md-3">
      <span class="hipster img-fluid rounded"></span>
    </div>
    <div class="col-md-9">
      <h1 class="display-4">{{ t$('home.title') }}</h1>
      <p class="lead">{{ t$('home.subtitle') }}</p>

      <div>
        <div class="alert alert-success" v-if="authenticated">
          <span v-if="username">{{ t$('home.logged.message', { username }) }}</span>
        </div>

        <div class="alert alert-warning" v-if="!authenticated">
          <span>{{ t$('global.messages.info.authenticated.prefix') }}</span>
          <a class="alert-link" @click="showLogin()">{{ t$('global.messages.info.authenticated.link') }}</a
          ><span v-html="t$('global.messages.info.authenticated.suffix')"></span>
        </div>
        <div class="alert alert-warning" v-if="!authenticated">
          <span>{{ t$('global.messages.info.register.noaccount') }}</span
          >&nbsp;
          <router-link class="alert-link" to="/register">{{ t$('global.messages.info.register.link') }}</router-link>
        </div>
      </div>

      <p>{{ t$('home.question') }}</p>

      <ul>
        <li>
          <a href="https://www.jhipster.tech/" target="_blank" rel="noopener noreferrer">{{ t$('home.link.homepage') }}</a>
        </li>
        <li>
          <a href="https://stackoverflow.com/tags/jhipster/info" target="_blank" rel="noopener noreferrer">{{
            t$('home.link.stackoverflow')
          }}</a>
        </li>
        <li>
          <a href="https://github.com/jhipster/generator-jhipster/issues?state=open" target="_blank" rel="noopener noreferrer">{{
            t$('home.link.bugtracker')
          }}</a>
        </li>
        <li>
          <a href="https://gitter.im/jhipster/generator-jhipster" target="_blank" rel="noopener noreferrer">{{ t$('home.link.chat') }}</a>
        </li>
        <li>
          <a href="https://twitter.com/jhipster" target="_blank" rel="noopener noreferrer">{{ t$('home.link.follow') }}</a>
        </li>
      </ul>

      <p>
        <span>{{ t$('home.like') }}</span>
        <a href="https://github.com/jhipster/generator-jhipster" target="_blank" rel="noopener noreferrer">{{ t$('home.github') }}</a
        >!
      </p>
    </div>
  </div>

  <div class="landing-page" v-else>
    <section class="landing-hero">
      <div class="landing-hero-text">
        <span class="landing-hero-eyebrow">{{ t$('home.landing.eyebrow') }}</span>
        <h1 class="landing-hero-title">{{ t$('home.landing.title') }}</h1>
        <p class="landing-hero-subtitle">{{ t$('home.landing.subtitle') }}</p>
        <div class="landing-hero-actions">
          <router-link :to="{ name: 'Product' }" class="btn landing-btn-primary">
            {{ t$('home.landing.shopNow') }}
          </router-link>
          <a href="#landing-categories" class="btn landing-btn-secondary">
            {{ t$('home.landing.browseCategories') }}
          </a>
        </div>
      </div>
      <div class="landing-hero-visual">
        <font-awesome-icon icon="shirt"></font-awesome-icon>
      </div>
    </section>

    <section class="landing-trust">
      <div class="landing-trust-item">
        <font-awesome-icon icon="truck-fast"></font-awesome-icon>
        <span>{{ t$('home.landing.trust.shipping') }}</span>
      </div>
      <div class="landing-trust-item">
        <font-awesome-icon icon="shield-halved"></font-awesome-icon>
        <span>{{ t$('home.landing.trust.payment') }}</span>
      </div>
      <div class="landing-trust-item">
        <font-awesome-icon icon="arrows-rotate"></font-awesome-icon>
        <span>{{ t$('home.landing.trust.returns') }}</span>
      </div>
      <div class="landing-trust-item">
        <font-awesome-icon icon="tags"></font-awesome-icon>
        <span>{{ t$('home.landing.trust.pricing') }}</span>
      </div>
    </section>

    <section id="landing-categories" class="landing-section" v-if="categories.length > 0">
      <h2 class="landing-section-title">{{ t$('home.landing.categoriesTitle') }}</h2>
      <div class="landing-categories">
        <router-link :to="{ name: 'Product' }" class="landing-category-card" v-for="category in categories" :key="category.id">
          <font-awesome-icon icon="shirt"></font-awesome-icon>
          <span>{{ category.name }}</span>
        </router-link>
      </div>
    </section>

    <section class="landing-section">
      <div class="landing-section-header">
        <h2 class="landing-section-title">{{ t$('home.landing.featuredTitle') }}</h2>
        <router-link :to="{ name: 'Product' }" class="landing-view-all">{{ t$('home.landing.viewAll') }}</router-link>
      </div>

      <div class="landing-loading" v-if="isLoadingHome">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div class="landing-products" v-else>
        <div class="landing-product-card" v-for="product in featuredProducts" :key="product.id">
          <router-link :to="{ name: 'Product' }" class="landing-product-media">
            <img v-if="product.image" :src="'data:' + product.imageContentType + ';base64,' + product.image" :alt="product.name" />
            <div v-else class="landing-product-media-placeholder">
              <font-awesome-icon icon="shirt"></font-awesome-icon>
            </div>
          </router-link>
          <div class="landing-product-body">
            <span class="landing-product-name">{{ product.name }}</span>
            <div class="landing-product-footer">
              <span class="landing-product-price">{{ '$' + product.price }}</span>
              <button
                type="button"
                class="landing-btn-add-cart"
                :disabled="product.status === 'OUT_OF_STOCK' || addingToCartId === product.id"
                @click="addToCart(product)"
              >
                <font-awesome-icon icon="cart-plus"></font-awesome-icon>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="landing-cta">
      <h2>{{ t$('home.landing.ctaTitle') }}</h2>
      <p>{{ t$('home.landing.ctaSubtitle') }}</p>
      <router-link :to="{ name: 'Product' }" class="btn landing-btn-primary">
        {{ t$('home.landing.shopNow') }}
      </router-link>
    </section>
  </div>
</template>

<script lang="ts" src="./home.component.ts"></script>
<style lang="scss" src="./home.scss"></style>
