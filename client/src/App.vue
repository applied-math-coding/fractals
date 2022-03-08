<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <header>
    <nav>
      <!-- TODO <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink> -->
    </nav>
  </header>
  <div class="app-content">
    <RouterView />
  </div>
</template>

<style lang="scss">
body {
  margin: 0;
  padding: 20px;
  font-family: var(--font-family);
  color: var(--text-color);
}

.app-content {
  max-width: 1000px;
  margin: 0 auto;
}

.secondary-text-color {
  color: var(--text-color-secondary);
}

a {
  color: var(--primary-color);
  text-decoration: none;
  &.router-link-exact-active {
    text-decoration: underline;
  }
}
</style>
