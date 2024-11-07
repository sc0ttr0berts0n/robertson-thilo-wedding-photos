<script setup lang="ts">
import ObservablePhoto from './ObservablePhoto.vue';
import { computed } from 'vue';
import { usePhotoUploads } from '../composables/usePhotoUploads.ts';
const { viewerImage, photoUploads, loading, error } = usePhotoUploads();

const onImageClick = (src: string) => {
    viewerImage.value = src;
};

const status = computed(() => {
    if (error.value) {
        return error;
    } else if (loading.value) {
        return 'Loading...';
    } else {
        return '';
    }
});
</script>

<template>
    <section>
        <h2>Gallery</h2>
        <div class="status">{{ status }}</div>
        <div class="photos">
            <ObservablePhoto
                @click="onImageClick(photo.photo.asset.url)"
                v-for="(photo, index) in photoUploads"
                :key="index"
                :src="photo.photo.asset.url"
                :lqsrc="photo.photo.asset.metadata.lqip"
            />
        </div>
    </section>
</template>

<style scoped>
section {
    width: 100%;
}
.photos {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
}

.status {
    font-family: monospace;
    text-align: left;
    white-space: pre-line;
    max-width: 100%;
    overflow: scroll;
}
</style>
