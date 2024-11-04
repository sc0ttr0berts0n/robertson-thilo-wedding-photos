import { ref } from 'vue';

const viewerImage = ref('lol');
const randomNumber = (min: number, range: number) => {
    return Math.floor(Math.random() * range) + min;
};
const randomSeed = () => Math.random();
const images = ref<string[]>(
    new Array(30).fill(0).map(() => {
        const seed = randomSeed();
        const width = randomNumber(600, 1000);
        const height = randomNumber(600, 1000);
        return `https://picsum.photos/seed/${seed}/${width}/${height}`;
    })
);

export const useFetchImages = () => {
    return { images, viewerImage };
};
