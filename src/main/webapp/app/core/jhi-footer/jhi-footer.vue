<template>
  <footer id="footer" class="footer">
    <p>{{ t$('footer') }}</p>
    <router-link :to="{ name: 'Privacy' }">Privacy notice</router-link>
  </footer>
</template>

<script lang="ts" src="./jhi-footer.component.ts"></script>
