<script setup lang="ts">
import { ref } from 'vue';

const MAX_FILE_SIZE = 5e6; // ~5.72mb
const uploadedFiles = ref<
    { name: string; size: number; preview: any; success: boolean }[]
>([]);
const isDragging = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);
const error = ref('');

// Handle drag events
const handleDragEnter = () => {
    isDragging.value = true;
};

const handleDragLeave = () => {
    isDragging.value = false;
};

const handleDrop = async (event: DragEvent) => {
    isDragging.value = false;
    if (event.dataTransfer?.files) {
        await addFiles(event.dataTransfer.files);
    }
};

// Handle file input change
const handleFileChange = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files) {
        await addFiles(target.files);
    }
};

// Trigger file input when button is clicked
const triggerFileInput = () => {
    fileInput.value?.click();
};

// Add files to the uploadedFiles list
const addFiles = async (files: FileList) => {
    for (let i = 0; i < files.length; i++) {
        const rawFile = files[i];
        const bestFile = await resizeImageToMaxSize(rawFile);
        const reader = new FileReader();

        reader.onload = (e) => {
            uploadedFiles.value.push({
                name: bestFile.name,
                size: bestFile.size,
                success: false,
                preview: e.target?.result, // Set the preview to the file reader result
            });
        };

        reader.readAsDataURL(bestFile); // Read file as a data URL for the preview

        await uploadFileToSanity(bestFile);
    }
};

const uploadFileToSanity = async (file: File) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
        const base64String = (e.target?.result as string).split(',')[1]; // Remove the data URL prefix

        if (base64String.length > MAX_FILE_SIZE) {
            error.value = `File too Large. ${(6e6 / 1024 / 1024).toFixed(
                2
            )}mb limit`;
            return;
        }
        // Send a POST request to your Netlify function
        const response = await fetch('/.netlify/functions/uploadImage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                file: base64String,
                filename: file.name,
            }),
        });

        const result = await response.json();
        console.log('Uploaded asset:', result);

        const fileInList = uploadedFiles.value.find(
            (el) => el.name === file.name
        );
        if (fileInList) {
            fileInList.success =
                result.message === 'Image uploaded successfully';
        }
    };

    const bestFile = (await resizeImageToMaxSize(file)) ?? file;
    reader.readAsDataURL(bestFile); // Read the file as a data URL
};

const resizeImageToMaxSize = async (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
        if (file.size < MAX_FILE_SIZE) {
            return resolve(file);
        }
        const reader = new FileReader();

        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target?.result as string;

            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                if (!ctx) {
                    reject(null);
                    return;
                }

                let { width, height } = img;
                const maxDimension = 2000; // Maximum width or height to scale down to

                // Scale down the image if it's too large
                if (width > maxDimension || height > maxDimension) {
                    if (width > height) {
                        height = (height * maxDimension) / width;
                        width = maxDimension;
                    } else {
                        width = (width * maxDimension) / height;
                        height = maxDimension;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                // Compress the image to fit within 10 MB
                let quality = 0.9; // Start with high quality
                let base64String = canvas.toDataURL('image/jpeg', quality);
                let fileSize = atob(base64String.split(',')[1]).length;

                // Gradually decrease quality until the file size is below 10 MB
                while (fileSize > MAX_FILE_SIZE && quality > 0.1) {
                    quality -= 0.1;
                    base64String = canvas.toDataURL('image/jpeg', quality);
                    fileSize = atob(base64String.split(',')[1]).length;
                }

                // Convert base64 back to a File object
                const byteString = atob(base64String.split(',')[1]);
                const mimeString = base64String
                    .split(',')[0]
                    .split(':')[1]
                    .split(';')[0];
                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);
                for (let i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }

                const compressedFile = new File([ab], file.name, {
                    type: mimeString,
                });
                resolve(compressedFile);
            };
        };

        reader.readAsDataURL(file);
    });
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
        <ul class="upload-list">
            <li
                class="list-item"
                v-for="(file, index) in uploadedFiles"
                :key="index"
            >
                <div class="preview-wrapper">
                    <img
                        v-if="file.preview"
                        :src="file.preview"
                        class="preview"
                    />
                    <div class="preview-status">
                        {{ file.success ? '✅' : '⏳' }}
                    </div>
                </div>
                <div class="photo-info">
                    <div class="filename">{{ file.name }}</div>
                    <div class="filename">
                        {{ (file.size / 1024 / 1024).toFixed(2) }}mb
                    </div>
                    <div v-if="error" class="filename">
                        {{ error }}
                    </div>
                </div>
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

.preview-wrapper {
    position: relative;
}

.preview {
    position: relative;
    display: block;
    width: 5rem;
    height: 5rem;
    object-fit: cover;
}

.preview-status {
    position: absolute;
    bottom: 0;
    right: 0;
    display: block;
    font-size: 1.25rem;
    padding: 0.25rem;
    margin: 0.125rem;
    border-radius: 0.25rem;
    background-color: rgba(0, 0, 0, 0.8);
    line-height: 1;
}

.upload-list {
    margin: 0;
    padding: 0;
}

.list-item {
    display: flex;
    align-items: center;
    background-color: rgba(129, 193, 167, 0.1);
    margin: 0.25rem;
    border-radius: 0.5rem;
    font-family: monospace;
    overflow: hidden;
    list-style: none;
}

.filename {
    word-break: break-all;
}
.photo-info {
    padding: 0.5rem;
    text-align: left;
}
</style>
