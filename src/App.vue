<script setup lang="ts">
import PhotoGallery from './components/PhotoGallery.vue';
import Uploader from './components/Uploader.vue';
import Viewer from './components/Viewer.vue';
</script>

<template>
    <div>
        <main>
            <h1>Ryan & Scott&rsquo;s Wedding<br />💍</h1>
            <Uploader />
            <PhotoGallery />
        </main>
        <Viewer />
    </div>
</template>

<style scoped>
h1 {
    font-style: italic;
    font-weight: 900;
}
main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
</style>
