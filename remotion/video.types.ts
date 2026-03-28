export type CaptionStyle = "default" | "highlight" | "minimal" | "bold";
export type AnimationType = "fadeIn" | "zoomIn" | "slideUp" | "slideDown";

export interface CaptionWord {
  word: string;
  punctuated_word?: string;
  start: number;
  end: number;
  confidence?: number;
}

export interface CaptionChunk {
  text: string;
  startFrame: number;
  endFrame: number;
}

export const VIDEO_FPS = 30;
export const VIDEO_WIDTH = 2160;   // Vertical 4K
export const VIDEO_HEIGHT = 3840;  // Vertical 4K

export interface VideoCompositionProps {
  audioSrc: string;
  imageSrcs: string[];
  captionChunks: CaptionChunk[];
  captionStyle: CaptionStyle;
  durationInFrames: number;
  bgMusic: string; // MoodMusic but as string for easier prop handling
  bgMusicFile: string | null; // resolved file path passed from render-video.ts
}

/**
 * Groups Deepgram word-level output into caption chunks
 * based on both word count (max 3) and duration (max 1.5s).
 */
export function buildCaptionChunks(
  words: CaptionWord[],
  fps: number = VIDEO_FPS,
  maxWords: number = 3,
  maxDurationSeconds: number = 1.5
): CaptionChunk[] {
  if (!words || words.length === 0) return [];

  const chunks: CaptionChunk[] = [];
  let i = 0;

  while (i < words.length) {
    const chunkWords: CaptionWord[] = [];
    const chunkStart = words[i].start;

    while (i < words.length && chunkWords.length < maxWords) {
      const word = words[i];

      // Break chunk if this word starts more than maxDurationSeconds after chunk start
      if (word.start - chunkStart > maxDurationSeconds && chunkWords.length > 0) {
        break;
      }

      chunkWords.push(word);
      i++;
    }

    if (chunkWords.length === 0) { i++; continue; }

    const startSec = chunkWords[0].start;
    const endSec   = chunkWords[chunkWords.length - 1].end;

    // Add tiny buffer so caption doesn't disappear before word ends
    const startFrame = Math.max(0, Math.floor(startSec * fps) - 1);
    const endFrame   = Math.ceil(endSec * fps) + 2;  // +2 frame buffer

    chunks.push({
      text: chunkWords
        .map(w => w.punctuated_word ?? w.word)
        .join(" "),
      startFrame,
      endFrame,
    });
  }

  console.log(`[captions] Built ${chunks.length} chunks from ${words.length} words at ${fps}fps`);

  return chunks;
}
