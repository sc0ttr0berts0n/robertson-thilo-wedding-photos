<script setup lang="ts">
import { computed, useTemplateRef, watch } from 'vue';
import { usePhotoUploads } from '../composables/usePhotoUploads';
const { viewerImage, photoUploads } = usePhotoUploads();
const closeButton = useTemplateRef<HTMLButtonElement>('close-button');
const seek = (offset: number) => {
    const current = photoUploads.value.findIndex((el) => {
        return el.photo.asset.url === viewerImage.value;
    });
    if (current === -1) return;
    const target = photoUploads.value.at(
        (current + offset) % photoUploads.value.length
    );
    if (!target) return;
    viewerImage.value = target.photo.asset.url;
};
const open = computed(() => {
    return viewerImage.value;
});

const close = () => (viewerImage.value = '');

watch(open, () => {
    if (!open) return;
    setTimeout(() => {
        if (!closeButton.value) return;
        closeButton.value.focus();
    }, 0);
});
</script>

<template>
    <section
        class="container"
        v-show="open"
        @keyup.left="seek(-1)"
        @keyup.right="seek(1)"
        @keyup.escape.delete="close()"
    >
        <div class="wrapper">
            <div class="image-wrapper">
                <img v-if="open" :src="viewerImage" alt="" />
            </div>
            <div class="controls">
                <button @click.prevent="seek(-1)">Prev</button>
                <button @click.prevent="close()" ref="close-button">
                    Close
                </button>
                <button @click.prevent="seek(1)">Next</button>
            </div>
        </div>
    </section>
</template>

<style lang="scss" scoped>
$controls-height: 4rem;

.container {
    position: absolute;
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.9);
}
.wrapper {
    position: absolute;
    inset: 0rem;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: 1rem;
}

.image-wrapper {
    max-height: calc(100% - #{$controls-height} - 1rem);
    align-self: center;
}

img {
    border-radius: 0.5rem;
    border: 1rem solid rgba(255, 255, 255, 0.8);
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
}

.controls {
    display: flex;
    justify-content: space-between;
}

button {
    display: block;
    font-family: 'Fraunces', Arial, 'Helvetica Neue', Helvetica, sans-serif;
    font-weight: bold;
    font-style: italic;
    font-size: 1.25rem;
    background-color: #071e21;
    color: #81c1a7;
    border: 0;
    border-radius: 1rem;
    height: 4rem;
    min-width: 4rem;
    cursor: pointer;
}
button:hover {
    background-color: #81c1a7;
    color: #071e21;
}
button:active {
    background-color: #b2d59e;
    color: #071e21;
}
</style>
