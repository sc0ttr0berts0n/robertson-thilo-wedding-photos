<script setup lang="ts">
import {computed, ref, useTemplateRef, watch} from 'vue';
import { useFetchImages } from '../composables/fetchImages';
const {viewerImage, images} = useFetchImages();
const closeButton = useTemplateRef<HTMLButtonElement>('close-button')
const seek = (offset: number) => {
    const current = images.value.indexOf(viewerImage.value);
    if (current === -1) return;
    const target = images.value.at((current + offset) % images.value.length);
    if (!target) return;
    viewerImage.value = target;
}
const open = computed(() => {
    return viewerImage.value && images.value.indexOf(viewerImage.value) !== -1
});

const close = () => viewerImage.value = '';

watch(open, () => {
    if (!open) return;
        setTimeout(() => {
            if (!closeButton.value) return;
            closeButton.value.focus();
        }, 0)
})

</script>

<template>
    <section>
        <div class="container" v-show="open" @keyup.left="seek(-1)" @keyup.right="seek(1)" @keyup.escape.delete="close()">
            <div class="wrapper">
                <div class="image-wrapper">
                    <img :src="viewerImage" alt="">
                </div>
                <div class="controls">
                    <button @click="seek(-1)">Prev</button>
                    <button @click="close()" ref="close-button">Close</button>
                    <button @click="seek(1)">Next</button>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.container {
    position: absolute;
    position: fixed;
    inset: 0;
    background-color: rgba(0,0,0, 0.9);
}
.wrapper   {
    position: absolute;
    inset: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 1rem;
}

.image-wrapper {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

img {
    border: 1rem solid rgba(255,255,255,0.8);
    border-radius: 0.5rem;
    width: 100%;
    height: auto;
}

.controls {
    display: flex;
    justify-content: space-between;
}

button {
    font-family: "Fraunces", Arial, "Helvetica Neue", Helvetica, sans-serif;
    font-weight: bold;
    font-style: italic;
    font-size: 1.25rem;
    background-color: #071e21;
    color: #81c1a7;
    border: 0;
    border-radius: 1rem;
    height: 4rem;
    width: 4rem;
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
