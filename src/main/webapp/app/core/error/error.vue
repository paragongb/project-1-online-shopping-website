<template>
  <main class="error-page" aria-labelledby="error-page-title">
    <div class="error-card">
      <span class="error-code" aria-hidden="true">{{ error403 ? '403' : error404 ? '404' : '!' }}</span>
      <div class="error-icon" aria-hidden="true">
        <font-awesome-icon :icon="error403 ? 'shield-halved' : 'search'"></font-awesome-icon>
      </div>
      <h1 id="error-page-title">
        {{ error403 ? t$('error.forbiddenTitle') : error404 ? t$('error.notFoundTitle') : t$('error.title') }}
      </h1>
      <p v-if="errorMessage" role="alert">{{ errorMessage }}</p>
      <p v-else-if="error403">{{ t$('error.http.403') }}</p>
      <p v-else-if="error404">{{ t$('error.http.404') }}</p>
      <p v-else>{{ t$('error.http.500') }}</p>
      <div class="error-actions">
        <router-link :to="{ name: 'Home' }" class="btn error-primary-action">
          <font-awesome-icon icon="home"></font-awesome-icon>
          {{ t$('error.home') }}
        </router-link>
        <button type="button" class="btn error-secondary-action" @click="previousState">
          <font-awesome-icon icon="arrow-left"></font-awesome-icon>
          {{ t$('error.back') }}
        </button>
      </div>
    </div>
  </main>
</template>

<script lang="ts" src="./error.component.ts"></script>
<style lang="scss" src="./error.scss"></style>
