<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <main class="app">
    <header class="header">
      <!-- <h1 class="title">🇫🇷</h1> -->
    </header>

    <RouterView />

    <footer class="footer">
    </footer>
  </main>
</template>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  background-color: #202224;
}
.app {
  min-height: 90vh;
  background-color: #202224;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  padding: 1rem;
}

.title {
  font-size: 2rem;
  color: #4A70A9;
  margin-bottom: 3rem;
}

.subtitle {
  color: #457b9d;
  font-style: italic;
  margin-bottom: 1rem;
}

.footer {
  margin-top: 2rem;
  font-size: 0.9rem;
  color: #888;
}
</style>
