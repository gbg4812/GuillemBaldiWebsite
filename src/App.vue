<script setup lang="ts">
import NavBarLayout from './components/NavBarLayout.vue'
import TabButton from './components/TabButton.vue'
</script>

<template>
  <NavBarLayout class="padding">
    <template #nav>
      <div class="flrw flal-c-s padding bgdk">
        <h1 class="margin padding">Guillem Baldi</h1>
        <TabButton class="padding margin button" name="maintabs" value="home">
          <RouterLink class="nodec margin padding" to="/">Home</RouterLink>
        </TabButton>
        <TabButton class="padding margin button" name="maintabs" value="notes">
          <RouterLink class="nodec margin padding" to="/notes">Notes</RouterLink>
        </TabButton>
      </div>
    </template>
    <template #main>
      <RouterView class="bglh"></RouterView>
    </template>
  </NavBarLayout>
</template>

<style lang="css">
@import './style.css';
</style>
