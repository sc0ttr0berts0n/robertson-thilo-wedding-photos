<script setup lang="ts">
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
        <h2>Gallery {{ status }}</h2>
        <div class="photos">
            <button
                @click="onImageClick(photo.photo.asset.url)"
                class="photo-wrapper"
                v-for="photo in photoUploads"
                :key="photo.photo.asset.url"
            >
                <img class="photo" :src="photo.photo.asset.url" alt="" />
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

.photo-wrapper {
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
