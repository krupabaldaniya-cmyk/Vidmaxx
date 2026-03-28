import { createClient } from '@supabase/supabase-js'
import { withRetry } from './fetch-utils'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

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

    console.log(`[ensureBucket] Checking for bucket: ${bucketName}`);

    try {
        const { data: buckets, error: listError } = await withRetry(async () => {
            return await supabaseAdmin.storage.listBuckets();
        });
        
        if (listError) {
            console.error(`[ensureBucket] Failed to list buckets after retries: ${listError.message}`);
            throw new Error(`Failed to list buckets: ${listError.message}`);
        }

        const bucketNames = buckets?.map((b) => b.name) ?? [];
        console.log(`[ensureBucket] Existing buckets: ${bucketNames.join(', ')}`);

        const fallbacks = [bucketName, "vidmaxx", "video-assets", "videos", "media"];
        const existingBucket = fallbacks.find((name) => bucketNames.includes(name));

        if (existingBucket) {
            console.log(`[ensureBucket] Using existing bucket: ${existingBucket}`);
            return existingBucket;
        }

        // Try to create the primary bucket first
        console.log(`[ensureBucket] Creating new bucket: ${bucketName}`);
        const { error: createError } = await withRetry(async () => {
            return await supabaseAdmin.storage.createBucket(bucketName, {
                public: true,
                fileSizeLimit: 52428800, // 50 MB
            });
        });

        if (createError) {
            console.error(`[ensureBucket] Failed to create bucket "${bucketName}": ${createError.message}`);
            throw new Error(`Failed to create bucket "${bucketName}": ${createError.message}`);
        }
        
        console.log(`[ensureBucket] Successfully created new bucket: "${bucketName}"`);
        return bucketName;
    } catch (error: any) {
        console.error(`[ensureBucket] Critical error in ensureBucket: ${error.message}`);
        throw error;
    }
}

/**
 * Uploads audio to Supabase Storage.
 * Accepts Buffer or ArrayBuffer — both are handled safely.
 */
export async function uploadAudio(
    buffer: Buffer | ArrayBuffer,
    fileName: string,
    bucketName: string = "video-assets"
): Promise<string> {
    if (!supabaseAdmin) throw new Error("Supabase Admin client not initialized");

    const targetBucket = await ensureBucket(bucketName);

    // Normalize to Buffer
    const normalized = Buffer.isBuffer(buffer)
        ? buffer
        : Buffer.from(buffer);

    const { data, error } = await withRetry(async () => {
        return await supabaseAdmin.storage
            .from(targetBucket)
            .upload(fileName, normalized, {
                contentType: "audio/mpeg",
                upsert: true,
            });
    });

    if (error) {
        console.error("Supabase Audio Upload Error:", error);
        throw error;
    }

    const { data: urlData } = await supabaseAdmin.storage
        .from(targetBucket)
        .getPublicUrl(data.path);

    return urlData.publicUrl;
}

/**
 * Uploads an image to Supabase Storage.
 * ✅ Accepts Buffer (from Cloudflare), ArrayBuffer, or Blob — all handled safely.
 * Previously only accepted Blob which crashed when Buffer was passed.
 */
export async function uploadImage(
    imageData: Buffer | ArrayBuffer | Blob,
    fileName: string,
    bucketName: string = "video-assets"
): Promise<string> {
    if (!supabaseAdmin) throw new Error("Supabase Admin client not initialized");

    const targetBucket = await ensureBucket(bucketName);

    let normalized: Buffer;

    if (Buffer.isBuffer(imageData)) {
        // ✅ From Cloudflare Workers AI — already a Node.js Buffer
        normalized = imageData;
    } else if (imageData instanceof ArrayBuffer) {
        // ✅ Raw ArrayBuffer from fetch().arrayBuffer()
        normalized = Buffer.from(imageData);
    } else if (imageData instanceof Blob || typeof (imageData as Blob).arrayBuffer === "function") {
        // ✅ Blob (e.g. old HuggingFace path or browser context)
        const ab = await (imageData as Blob).arrayBuffer();
        normalized = Buffer.from(ab);
    } else {
        throw new Error(
            `uploadImage: unsupported input type — ${Object.prototype.toString.call(imageData)}`
        );
    }

    const { data, error } = await withRetry(async () => {
        return await supabaseAdmin.storage
            .from(targetBucket)
            .upload(fileName, normalized, {
                contentType: "image/png",
                upsert: true,
            });
    });

    if (error) {
        console.error("Supabase Image Upload Error:", error);
        throw error;
    }

    const { data: urlData } = await supabaseAdmin.storage
        .from(targetBucket)
        .getPublicUrl(data.path);

    return urlData.publicUrl;
}

/**
 * Uploads a rendered MP4 video file to Supabase Storage.
 * Called by render-video.ts after Remotion finishes rendering.
 * Returns the public URL of the uploaded video.
 */
export async function uploadVideoFile(
  fileBuffer: Buffer,
  fileName: string,
  bucketName: string = "video-assets"
): Promise<string> {
  if (!supabaseAdmin) throw new Error("Supabase Admin client not initialized");

  const targetBucket = await ensureBucket(bucketName);

  const { data, error } = await withRetry(async () => {
    return await supabaseAdmin.storage
      .from(targetBucket)
      .upload(fileName, fileBuffer, {
        contentType: "video/mp4",
        upsert: true,               // Overwrite if re-rendering same video
        cacheControl: "3600",
      });
  });

  if (error) {
    console.error("Supabase Video Upload Error:", error);
    throw error;
  }

  const { data: urlData } = await supabaseAdmin.storage
    .from(targetBucket)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}