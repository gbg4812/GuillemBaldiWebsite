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
nav {
  position: absolute;
  top: 0%;
  left: 0%;
  width: 100%;
  height: 2rem;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: left;
}
</style>
