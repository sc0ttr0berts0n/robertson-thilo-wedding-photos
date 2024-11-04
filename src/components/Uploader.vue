<script setup lang="ts">
import { ref } from 'vue';

const uploadedFiles = ref<{ name: string; preview: any }[]>([]);
const isDragging = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

// Handle drag events
const handleDragEnter = () => {
    isDragging.value = true;
};

const handleDragLeave = () => {
    isDragging.value = false;
};

const handleDrop = (event: DragEvent) => {
    isDragging.value = false;
    if (event.dataTransfer?.files) {
        addFiles(event.dataTransfer.files);
    }
};

// Handle file input change
const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files) {
        addFiles(target.files);
    }
};

// Trigger file input when button is clicked
const triggerFileInput = () => {
    fileInput.value?.click();
};

// Add files to the uploadedFiles list
const addFiles = (files: FileList) => {
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        reader.onload = (e) => {
            uploadedFiles.value.push({
                name: file.name,
                preview: e.target?.result, // Set the preview to the file reader result
            });
        };

        reader.readAsDataURL(file); // Read file as a data URL for the preview
    }
};
</script>

<template>
    <div
        class="wrapper"
        @dragover.prevent="handleDragEnter"
        @dragenter.prevent="handleDragEnter"
        @dragleave="handleDragLeave"
        @drop.prevent="handleDrop"
        :class="{ 'drag-over': isDragging }"
    >
        <p class="instructions">
            Upload pictures you want to share. Remain on page until all uploads
            complete
        </p>
        <p v-if="!isDragging">Drag & drop files here or</p>
        <p v-else>Drop your files</p>
        <button @click="triggerFileInput">Browse Files</button>
        <input
            type="file"
            ref="fileInput"
            @change="handleFileChange"
            multiple
            hidden
        />
        <p v-if="uploadedFiles.length > 0">Uploads:</p>
        <ul>
            <li v-for="(file, index) in uploadedFiles" :key="index">
                <img v-if="file.preview" :src="file.preview" class="preview" />
                <div class="filename">{{ file.name }}</div>
            </li>
        </ul>
    </div>
</template>

<style scoped>
.wrapper {
    max-width: 1200px;
    margin: 1rem;
    border: 4px dashed #81c1a7;
    border-radius: 1rem;
    padding: 1rem;
}

.wrapper.drag-over {
    background-color: rgba(129, 193, 167, 0.1);
}

button {
    background-color: #81c1a7;
    border: 0;
    padding: 0.5rem;
    border-radius: 0.5rem;
    color: #071e21;
    font-weight: bold;
    font-family: 'Fraunces';
    text-transform: uppercase;
    font-style: italic;
}

.instructions {
    font-size: 1.25rem;
}

.preview {
    width: 3rem;
    height: 3rem;
    object-fit: cover;
}

ul {
    margin: 0;
    padding: 0;
}

li {
    display: flex;
    background-color: rgba(129, 193, 167, 0.1);
    margin: 0.25rem;
    border-radius: 0.5rem;
    font-family: monospace;
    overflow: hidden;
    list-style: none;
}

.filename {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.5rem;
    word-break: break-all;
}
</style>
