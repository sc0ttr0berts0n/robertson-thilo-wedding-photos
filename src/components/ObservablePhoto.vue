<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, defineProps, computed } from 'vue';

const { src, lqsrc } = defineProps<{ src: string; lqsrc: string }>();
const emit = defineEmits(['visible']);
const imageContainer = ref<HTMLElement | null>(null);
const isImageVisible = ref(false);
const imageLoaded = ref(false);

const observer = ref<IntersectionObserver | null>(null);

const observeVisibility = () => {
    if (!imageContainer.value) return;

    observer.value = new IntersectionObserver(
        ([entry]) => {
            isImageVisible.value =
                entry.isIntersecting && entry.intersectionRatio >= 0.5;
            if (isImageVisible.value && !imageLoaded.value) {
                imageLoaded.value = true;
                observer.value?.disconnect();
            }
        },
        {
            threshold: 0.5,
        }
    );

    observer.value.observe(imageContainer.value);
};

const lazySrc = computed(() => {
    return imageLoaded.value ? src : lqsrc;
});

onMounted(observeVisibility);

onBeforeUnmount(() => {
    observer.value?.disconnect();
});
</script>

<template>
    <button class="photo-wrapper" ref="imageContainer">
        <img class="photo" :src="lazySrc" alt="" />
    </button>
</template>

<style scoped>
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
