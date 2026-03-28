/**
 * Single source of truth for caption style IDs.
 * These must match the CHECK constraint in the Supabase 'series' table.
 */
export const VALID_CAPTION_STYLES = [
  "hormozi",
  "mrbeast",
  "minimalist",
  "neon",
  "red-highlight",
  "modern",
] as const;

export type CaptionStyleId = (typeof VALID_CAPTION_STYLES)[number];

/**
 * Validates if a string is a valid caption style ID.
 */
export function isValidCaptionStyle(style: any): style is CaptionStyleId {
  return VALID_CAPTION_STYLES.includes(style);
}
