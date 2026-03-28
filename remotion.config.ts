import { Config } from "@remotion/cli/config";

// Remotion configuration — placed at project root (same level as package.json)
Config.setVideoImageFormat("jpeg");   // Faster intermediate frame encoding
Config.setOverwriteOutput(true);       // Allow re-renders of same video
