import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.clerk.dev https://challenges.cloudflare.com https://static.cloudflareinsights.com https://working-moth-41.clerk.accounts.dev",
              "script-src-elem 'self' 'unsafe-inline' https://js.clerk.dev https://working-moth-41.clerk.accounts.dev",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https: https://ik.imagekit.io",
              "media-src 'self' blob: https: https://ik.imagekit.io",
              "connect-src 'self' https://api.clerk.dev https://clerk.your-domain.com https://challenges.cloudflare.com https://cloudflareinsights.com https://working-moth-41.clerk.accounts.dev",
              "frame-src 'self' https://challenges.cloudflare.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "upgrade-insecure-requests"
            ].join('; ')
          }
        ]
      }
    ];
  }
};

export default nextConfig;
