<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/" class="mr-2">Home</RouterLink>|
        <RouterLink to="/upload">upload</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>
