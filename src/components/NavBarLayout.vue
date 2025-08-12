<script setup lang="ts"></script>

<template>
  <div id="layout">
    <nav>
      <slot name="nav"></slot>
    </nav>
    <main>
      <slot name="main"></slot>
    </main>
  </div>
</template>

<style scoped>
#layout {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-areas: 'nav' 'main';
}
nav {
  grid-area: nav;
}

main {
  grid-area: main;
}
</style>
