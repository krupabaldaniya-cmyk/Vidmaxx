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
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' blob: https://js.clerk.dev https://*.clerk.dev https://*.clerk.accounts.dev https://challenges.cloudflare.com https://static.cloudflareinsights.com https://*.hcaptcha.com https://hcaptcha.com",
              "script-src-elem 'self' 'unsafe-inline' blob: https://js.clerk.dev https://*.clerk.dev https://*.clerk.accounts.dev https://*.hcaptcha.com https://hcaptcha.com",
              "worker-src 'self' blob:;",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://*.hcaptcha.com https://hcaptcha.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https: https://ik.imagekit.io https://*.hcaptcha.com https://hcaptcha.com",
              "media-src 'self' blob: https: https://ik.imagekit.io",
              "connect-src 'self' https://api.clerk.dev https://*.clerk.dev https://*.clerk.accounts.dev https://challenges.cloudflare.com https://cloudflareinsights.com https://*.hcaptcha.com https://hcaptcha.com",
              "frame-src 'self' https://challenges.cloudflare.com https://*.hcaptcha.com https://hcaptcha.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "upgrade-insecure-requests"
            ].join('; ')
          }
        ]
      }
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dqopagstfjwicphoyqtg.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
