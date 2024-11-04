import type { Handler } from '@netlify/functions';
import { createClient } from '@sanity/client';
import 'dotenv/config';
import { Readable } from 'stream';
const client = createClient({
    projectId: 'vuutgd36',
    dataset: 'production',
    useCdn: false, // set to `false` to bypass the edge cache
    apiVersion: '2024-11-04', // use current date (YYYY-MM-DD) to target the latest API version
    token: process.env.SANITY_SECRET_TOKEN, // Only if you want to update content with the client
});

// Helper function to convert a Buffer to a Readable stream
const bufferToStream = (buffer: Buffer) => {
    const readable = new Readable();
    readable._read = () => {}; // No-op
    readable.push(buffer);
    readable.push(null);
    return readable;
};

// The Netlify function handler
const handler: Handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: 'Method Not Allowed',
        };
    }

    try {
        // Parse the request body
        const { file, filename, caption, attribution } = JSON.parse(
            event.body || '{}'
        );

        // Ensure file and filename are provided
        if (!file || !filename) {
            return {
                statusCode: 400,
                body: 'File and filename are required',
            };
        }

        // Decode the base64 file to a Buffer
        const fileBuffer = Buffer.from(file, 'base64');

        // Upload the file to Sanity
        const asset = await client.assets.upload(
            'image',
            bufferToStream(fileBuffer),
            {
                filename: filename,
            }
        );

        // Create the document with the uploaded image reference
        const doc = {
            _id: `photo-${asset.sha1hash}`,
            _type: 'photo_upload',
            // Add the image reference to your document
            // Add the photo field with image reference, caption, and attribution
            photo: {
                _type: 'image',
                asset: {
                    _type: 'reference',
                    _ref: asset._id,
                },
                caption: caption ?? '', // Add caption if provided
                attribution: attribution ?? '', // Add attribution if provided
            },
        };

        // Create or replace the document in Sanity
        const result = await client.createOrReplace(doc);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Image uploaded successfully',
                result,
            }),
        };
    } catch (error) {
        console.error('Error uploading image:', error);
        return {
            statusCode: 500,
            body: 'Failed to upload image',
        };
    }
};

export { handler };
