<script setup lang="ts">
import NavBarLayout from '../components/NavBarLayout.vue'
</script>
<template>
  <div>
    <NavBarLayout>
      <template #nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/notes">Notes</RouterLink>
      </template>
      <template #main></template>
    </NavBarLayout>
  </div>
</template>
