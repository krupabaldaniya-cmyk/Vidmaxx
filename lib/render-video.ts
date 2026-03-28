// ─────────────────────────────────────────────────────────────────────────────
// render-video.ts — server-side only, called by Inngest
//
// KEY RULE: This file must NEVER import from any file that imports remotion.
// - ✅ Import from remotion/video.types.ts  (pure types, zero remotion imports)
// - ❌ Never import from remotion/CaptionOverlay.tsx  (has remotion imports)
// - ❌ Never import from remotion/Root.tsx             (has remotion imports)
// - ❌ Never import from remotion/VideoComposition.tsx (has remotion imports)
// ─────────────────────────────────────────────────────────────────────────────
import path from "path";
import fs from "fs";
import https from "https";
import http from "http";
import os from "os";
import express from "express";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

// ✅ Safe — video.types.ts has ZERO remotion imports
import {
  buildCaptionChunks,
  VIDEO_FPS,
  type CaptionStyle,
  type CaptionWord,
  type CaptionChunk,
} from "../remotion/video.types";
import { VISUAL_STYLE_TO_MUSIC, MUSIC_FILE_MAP, type MoodMusic } from "./constants";
import { fetchWithRetry, withRetry } from "./fetch-utils";
import { supabaseAdmin } from "./supabase";

export interface RenderVideoInput {
  videoId: string;
  audioUrl: string;
  imageUrls: string[];
  captions: CaptionWord[];
  captionStyle: CaptionStyle;
  audioDurationSeconds: number;
  bgMusic: MoodMusic;
}

export interface RenderVideoOutput {
  videoUrl: string;
  localPath: string;
}

// ── Download helper ───────────────────────────────────────────────────────
async function downloadFile(url: string, destPath: string): Promise<string> {
  const response = await fetchWithRetry(url, {
    timeoutMs:  60000,
    maxRetries: 5,
    baseDelayMs: 2000,
  });
  if (!response.ok) {
    throw new Error(`Download failed: ${response.status} for ${url}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  fs.writeFileSync(destPath, Buffer.from(arrayBuffer));
  return destPath;
}

// ── Find a free port ──────────────────────────────────────────────────────
async function getFreePort(): Promise<number> {
  return new Promise((resolve, reject) => {
    const server = require("net").createServer();
    server.listen(0, "127.0.0.1", () => {
      const port = (server.address() as { port: number }).port;
      server.close(() => resolve(port));
    });
    server.on("error", reject);
  });
}

async function startAssetServer(
  tmpDir: string
): Promise<{ server: http.Server; baseUrl: string }> {
  const port = await getFreePort();
  const app = express();

  // Serve render temp files (audio, images)
  app.use("/", express.static(tmpDir));

  // Serve public/ folder so music files work in Remotion headless Chrome
  app.use("/music", express.static(path.join(process.cwd(), "public", "music")));

  return new Promise((resolve, reject) => {
    const server = app.listen(port, "127.0.0.1", () => {
      console.log(`[render-video] Asset server: http://127.0.0.1:${port}`);
      resolve({ server, baseUrl: `http://127.0.0.1:${port}` });
    });
    server.on("error", reject);
  });
}

function stopAssetServer(server: http.Server): void {
  server.close((err) => {
    if (err) console.warn("[render-video] Asset server close error:", err.message);
    else console.log("[render-video] Asset server stopped.");
  });
}

function cleanupDir(dirPath: string): void {
  try { fs.rmSync(dirPath, { recursive: true, force: true }); }
  catch { console.warn(`[render-video] Could not clean up: ${dirPath}`); }
}

async function getAudioDurationSeconds(audioPath: string): Promise<number> {
  try {
    const { stdout } = await execFileAsync("ffprobe", [
      "-v", "quiet",
      "-show_entries", "format=duration",
      "-of", "csv=p=0",
      audioPath,
    ]);
    const duration = parseFloat(stdout.trim());
    if (!duration || isNaN(duration) || duration <= 0) {
      throw new Error(`FFprobe returned invalid duration: "${stdout.trim()}"`);
    }
    return duration;
  } catch (err: any) {
    if (err.code === "ENOENT") {
      throw new Error(`FFprobe not found. Make sure FFmpeg is installed.`);
    }
    throw new Error(`FFprobe failed for ${audioPath}: ${err.message}`);
  }
}

export async function renderVideo(input: RenderVideoInput): Promise<RenderVideoOutput> {
  const { videoId, audioUrl, imageUrls, captions, captionStyle, audioDurationSeconds, bgMusic } = input;

  console.log(`[render-video] Starting render: ${videoId}`);

  // Dynamic imports — never bundled by Next.js/Turbopack
  const { bundle } = await import("@remotion/bundler");
  const { renderMedia, selectComposition } = await import("@remotion/renderer");

  const tmpDir = path.join("/tmp", `vidmaxx-${videoId}`);
  fs.mkdirSync(tmpDir, { recursive: true });

  // Step 3B — Validate music files exist on disk at startup
  const musicFiles = ["bg-calm.mp3", "bg-upbeat.mp3", "bg-dramatic.mp3"];
  const musicDir = path.join(process.cwd(), "public", "music");

  for (const file of musicFiles) {
    const fullPath = path.join(musicDir, file);
    if (!fs.existsSync(fullPath)) {
      console.warn(`[render-video] WARNING: Music file missing: ${fullPath}`);
    } else {
      const size = fs.statSync(fullPath).size;
      console.log(`[render-video] Music file OK: ${file} (${(size/1024).toFixed(0)}KB)`);
    }
  }

  let assetServer: http.Server | null = null;

  try {
    // Download audio to /tmp
    const audioLocalPath = path.join(tmpDir, "audio.mp3");
    await downloadFile(audioUrl, audioLocalPath);
    console.log("[render-video] Audio downloaded");

    const audioStats = fs.statSync(audioLocalPath);
    if (audioStats.size < 1000) {
      throw new Error(`Downloaded audio file is too small (${audioStats.size} bytes)`);
    }

    const resolvedDuration =
      audioDurationSeconds && !isNaN(audioDurationSeconds) && audioDurationSeconds > 0
        ? audioDurationSeconds
        : await getAudioDurationSeconds(audioLocalPath);

    console.log(`[render-video] Using audio duration: ${resolvedDuration}s`);

    // Download images
    const imageLocalPaths = await Promise.all(
      imageUrls.map((url, i) =>
        downloadFile(url, path.join(tmpDir, `image-${i}.png`))
      )
    );

    // ── START LOCAL ASSET SERVER ─────────────────────────────────────────
    const { server, baseUrl } = await startAssetServer(tmpDir);
    assetServer = server;

    // Build HTTP URLs
    const audioHttpUrl = `${baseUrl}/audio.mp3`;
    const imageHttpUrls = imageLocalPaths.map((_, i) => `${baseUrl}/image-${i}.png`);

    // Resolve bgMusic to an HTTP URL
    const musicFilePath = MUSIC_FILE_MAP[bgMusic ?? "calm"];
    const bgMusicHttpUrl = musicFilePath ? `${baseUrl}${musicFilePath}` : null;

    console.log(`[render-video] Music URL: ${bgMusicHttpUrl ?? "none"}`);

    const totalFrames = Math.ceil((resolvedDuration + 0.5) * VIDEO_FPS);
    const captionChunks = buildCaptionChunks(captions, VIDEO_FPS);

    // Bundle
    const bundleLocation = await bundle({
      entryPoint: path.resolve(process.cwd(), "remotion/index.ts"),
      webpackOverride: (config) => config,
    });

    const inputProps = {
      audioSrc: audioHttpUrl,
      imageSrcs: imageHttpUrls,
      captionChunks,
      captionStyle,
      durationInFrames: totalFrames,
      bgMusic: bgMusic ?? "calm",
      bgMusicFile: bgMusicHttpUrl,
    };

    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: "VidmaxxVideo",
      inputProps,
    });
    composition.durationInFrames = totalFrames;

    // Render
    const outputPath = path.join(tmpDir, `video-${videoId}.mp4`);
    await renderMedia({
      composition,
      serveUrl: bundleLocation,
      codec: "h264",
      outputLocation: outputPath,
      inputProps,
      crf: 23,
      concurrency: Math.max(1, Math.floor(os.cpus().length / 2)),
      onProgress: ({ progress }) => {
        const pct = Math.round(progress * 100);
        if (pct % 10 === 0) console.log(`[render-video] ${pct}%`);
      },
    });

    // Upload
    if (!supabaseAdmin) throw new Error("Supabase Admin client not initialized");
    const videoBuffer = fs.readFileSync(outputPath);
    const { data: uploadData, error: uploadError } = await withRetry(async () => {
      if (!supabaseAdmin) throw new Error("Supabase Admin client not initialized");
      return await supabaseAdmin.storage
        .from("video-assets")
        .upload(`videos/${videoId}/final.mp4`, videoBuffer, {
          contentType: "video/mp4",
          upsert: true,
        });
    });

    if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

    const { data: urlData } = await supabaseAdmin.storage
      .from("video-assets")
      .getPublicUrl(uploadData.path);

    console.log(`[render-video] Done: ${urlData.publicUrl}`);
    return { videoUrl: urlData.publicUrl, localPath: outputPath };

  } finally {
    if (assetServer) stopAssetServer(assetServer);
    cleanupDir(tmpDir);
  }
}
