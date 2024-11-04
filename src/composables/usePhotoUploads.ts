// usePhotoUploads.ts
import { ref, onMounted, onUnmounted } from 'vue';
import { createClient } from '@sanity/client';
import { z } from 'zod';

// Initialize the Sanity client
const client = createClient({
    projectId: 'vuutgd36',
    dataset: 'production',
    useCdn: false, // set to `false` to bypass the edge cache
    apiVersion: '2024-11-04', // use current date (YYYY-MM-DD) to target the latest API version
});

// Zod schema definitions
const photoSchema = z.object({
    _createdAt: z.string(),
    show: z.boolean().optional().nullable(),
    photo: z.object({
        asset: z.object({
            metadata: z.object({
                dimensions: z.object({
                    width: z.number(),
                    height: z.number(),
                }),
            }),
            url: z.string(),
        }),
        attribution: z.string().nullable(),
        caption: z.string().nullable(),
    }),
});

const photoQuerySchema = z.array(photoSchema);
export type PhotoQuerySchema = z.infer<typeof photoQuerySchema>;

const photosQuery = `
*[_type == "photo_upload" && show != false] | order(_createdAt desc) {
  photo{
    caption,
    attribution,
    asset->{
      url,
      metadata {
        dimensions {
          width,
          height
        }
      }
    }
  },
  _createdAt
}
`;

const getPhotoById = (id: string) => {
    return `
   *[_type == "photo_upload" && show != false && _id=="${id}"] | order(_createdAt desc) {
     photo{
       caption,
       attribution,
       asset->{
         url,
         metadata {
           dimensions {
             width,
             height
           }
         }
       }
     },
     _createdAt
   }`;
};

// Singleton state
let isInitialized = false;
const viewerImage = ref('');
const photoUploads = ref<PhotoQuerySchema>([]);
const loading = ref(true);
const error = ref<string | unknown>(null);
let subscription: ReturnType<typeof setupSubscription> | null = null;

// Fetch photo uploads function
const fetchPhotoUploads = async () => {
    loading.value = true;
    try {
        const raw = await client.fetch(photosQuery);
        const results: PhotoQuerySchema = photoQuerySchema.parse(raw);
        photoUploads.value = results;
    } catch (err) {
        error.value = err;
    } finally {
        loading.value = false;
    }
};

// Real-time subscription setup
const setupSubscription = () => {
    return client.listen(photosQuery).subscribe({
        next: async (update) => {
            if (update.result) {
                try {
                    const raw = await client.fetch(
                        getPhotoById(update.result._id)
                    );
                    const newPhoto = photoQuerySchema.safeParse(raw);
                    if (newPhoto.success && newPhoto.data.length) {
                        photoUploads.value.unshift(...newPhoto.data);
                    }
                } catch (parseError) {
                    console.error('Error parsing the update:', parseError);
                }
            }
        },
        error: (listenError) => {
            console.error('Subscription error:', listenError);
            error.value = listenError;
        },
    });
};

// Singleton composable function
export function usePhotoUploads() {
    if (!isInitialized) {
        // Fetch data and set up subscription only once
        fetchPhotoUploads();
        subscription = setupSubscription();
        isInitialized = true;
    }

    onMounted(() => {
        if (!subscription) {
            subscription = setupSubscription();
        }
    });

    onUnmounted(() => {
        if (subscription) {
            subscription.unsubscribe();
            subscription = null;
        }
    });

    return {
        photoUploads,
        loading,
        error,
        viewerImage,
    };
}
