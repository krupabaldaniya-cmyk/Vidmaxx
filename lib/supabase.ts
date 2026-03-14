import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Helper to safely create client
export const supabase = (supabaseUrl && supabaseAnonKey)
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

export const supabaseAdmin = (supabaseUrl && supabaseServiceKey)
    ? createClient(supabaseUrl, supabaseServiceKey)
    : null

if (!supabase) {
    console.warn('Supabase client failed to initialize: Missing URL or Anon Key.')
}

if (!supabaseAdmin) {
    console.warn('Supabase Admin client failed to initialize: Missing URL or Service Key.')
}

/**
 * Ensures a bucket exists, creating it if necessary.
 */
async function ensureBucket(bucketName: string): Promise<string> {
    if (!supabaseAdmin) throw new Error("Supabase Admin client not initialized");

    const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();
    if (listError) throw new Error(`Failed to list buckets: ${listError.message}`);

    const bucketNames = buckets?.map((b) => b.name) ?? [];

    // Fallback logic
    const fallbacks = [bucketName, "vidmaxx", "video-assets", "videos", "media"];
    const existingBucket = fallbacks.find((name) => bucketNames.includes(name));

    if (existingBucket) {
        return existingBucket;
    }

    // Create if none found
    const { error: createError } = await supabaseAdmin.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 52428800, // 50 MB
    });

    if (createError) throw new Error(`Failed to create bucket "${bucketName}": ${createError.message}`);
    console.log(`Created new bucket: "${bucketName}"`);
    return bucketName;
}

/**
 * Uploads an audio buffer to Supabase Storage and returns the public URL.
 */
export async function uploadAudio(
    buffer: ArrayBuffer,
    fileName: string,
    bucketName: string = "video-assets"
): Promise<string> {
    if (!supabaseAdmin) throw new Error("Supabase Admin client not initialized");

    const targetBucket = await ensureBucket(bucketName);

    const { data, error } = await supabaseAdmin.storage
        .from(targetBucket)
        .upload(fileName, buffer, {
            contentType: "audio/mpeg",
            upsert: true,
        });

    if (error) {
        console.error("Supabase Storage Upload Error:", error);
        throw error;
    }

    const { data: urlData } = await supabaseAdmin.storage
        .from(targetBucket)
        .getPublicUrl(data.path);

    return urlData.publicUrl;
}

/**
 * Uploads an image (Blob) to Supabase Storage and returns the public URL.
 */
export async function uploadImage(
    imageBlob: Blob,
    fileName: string,
    bucketName: string = "video-assets"
): Promise<string> {
    if (!supabaseAdmin) throw new Error("Supabase Admin client not initialized");

    const targetBucket = await ensureBucket(bucketName);
    const buffer = Buffer.from(await imageBlob.arrayBuffer());

    const { data, error } = await supabaseAdmin.storage
        .from(targetBucket)
        .upload(fileName, buffer, {
            contentType: "image/png",
            upsert: true,
        });

    if (error) {
        console.error("Supabase Storage Image Upload Error:", error);
        throw error;
    }

    const { data: urlData } = await supabaseAdmin.storage
        .from(targetBucket)
        .getPublicUrl(data.path);

    return urlData.publicUrl;
}
