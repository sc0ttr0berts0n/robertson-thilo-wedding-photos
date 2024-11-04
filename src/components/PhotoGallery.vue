<script setup lang="ts">
import { useFetchImages } from '../composables/fetchImages.ts';
const {images, viewerImage} = useFetchImages();

const onImageClick = (src: string) => {
  viewerImage.value = src;
  };
</script>

<template>
  <section>
    <h2>Gallery</h2>
    <div class="photos">
      <button
        @click="onImageClick(src)"
        class="photo-wrapper"
        v-for="src in images"
        key="image"
      >
        <img class="photo" :src alt="">
      </button>
    </div>
  </section>
</template>

<style scoped>
.photos {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.photo-wrapper  {
  font-size: 0;
  border: 0;
  padding: 0;
  background-color: transparent;
}


.photo {
  border-radius: 0.25rem;
  object-fit: cover;
  object-position: center;
  width: calc(25cqw - 3 * 0.25rem);
  height: calc(25cqw - 3 * 0.25rem);
  cursor: pointer;
}
</style>
