<script setup lang="ts">
import PhotoGallery from './components/PhotoGallery.vue'
import Uploader from './components/Uploader.vue'
import Viewer from './components/Viewer.vue'
</script>

<template>
  <div>
    <main>
      <h1>Ryan & Scott&rsquo;s Wedding 💍</h1>
      <Uploader />
      <PhotoGallery />
    </main>
    <Viewer />
  </div>

</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
