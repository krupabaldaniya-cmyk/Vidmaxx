/** @type {import('next').NextConfig} */
const nextConfig = {
  // ── Turbopack config (Next.js 16 default bundler) ──────────────────────
  // Remotion and esbuild contain native binaries that must never be
  // processed by any bundler. Mark them as external so Turbopack
  // skips them entirely and Node.js loads them directly at runtime.
  turbopack: {},

  // ── Tell Next.js these are pure server-side Node.js packages ───────────
  // This works for both Turbopack and webpack and is the correct way
  // to handle native binary packages in Next.js 15+/16+.
  serverExternalPackages: [
    "@remotion/renderer",
    "@remotion/bundler",
    "@remotion/compositor-linux-x64-gnu",
    "@remotion/compositor-linux-x64-musl",
    "@remotion/compositor-linux-arm64-gnu",
    "@remotion/compositor-linux-arm64-musl",
    "@remotion/compositor-darwin-x64",
    "@remotion/compositor-darwin-arm64",
    "@remotion/compositor-win32-x64-msvc",
    "esbuild",
  ],

  // Increase the timeout for server actions and API routes
  experimental: {
    serverActionsBodySizeLimit: "10mb",
  },

  // Add longer HTTP timeout for outbound requests from server
  httpAgentOptions: {
    keepAlive: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dqopagstfjwicphoyqtg.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },

  // ── Remove the webpack block entirely ──────────────────────────────────
  // The previous webpack() function with node-loader and null-loader
  // is what triggered the Turbopack conflict error. Delete it completely.
  // serverExternalPackages above handles the same concern correctly
  // for Turbopack without needing any webpack configuration.
};

module.exports = nextConfig;
