<script setup lang="ts">
import { computed, ref } from 'vue';
import PhotoGallery from './components/PhotoGallery.vue';
import Uploader from './components/Uploader.vue';
import Viewer from './components/Viewer.vue';

const getEmojiSet = () => {
    const bank = [
        '🔔',
        '🎩',
        '💐',
        '👫',
        '👰‍♀️',
        '🤵‍♂️',
        '🎉',
        '🙌',
        '🎊',
        '🍾',
        '🥂',
        '📷',
        '😁',
    ];
    const item = () => Math.floor(Math.random() * bank.length);
    return `${bank.splice(item(), 1)}${bank.splice(item(), 1)}${bank.splice(
        item(),
        1
    )}`;
};
const emojiSet = ref(getEmojiSet());
setInterval(() => {
    emojiSet.value = getEmojiSet();
}, 3000);
</script>

<template>
    <div>
        <main>
            <h1>Ryan & Scott&rsquo;s Wedding<br /></h1>
            <div class="emoji-set-wrapper">
                <Transition>
                    <div :key="emojiSet" class="emoji-set">{{ emojiSet }}</div>
                </Transition>
            </div>
            <div class="headline">Share your Photos!</div>
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
    margin: 0;
}
main {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.headline {
    font-size: 1.25rem;
    font-weight: bold;
    font-family: 'Fraunces';
    font-style: italic;
}

.emoji-set-wrapper {
    position: relative;
    width: 100%;
    text-align: center;
    height: 3rem;
}

.emoji-set {
    position: absolute;
    top: 0;
    left: 50%;
    font-size: 2rem;
    letter-spacing: 0.25rem;
    transition: 1s;
    transform: translateX(-50%) scale(1);
    opacity: 1;
}

.v-enter-from {
    opacity: 0;
    transform: translateX(-50%) scale(0.75);
}
.v-leave-to {
    opacity: 0;
    transform: translateX(-50%) scale(1.5);
}
</style>
