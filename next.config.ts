import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from 'next';

const securityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  // Next.js 16 + framer-motion inline style'lar gerektiriyor; JSON-LD inline script var.
  // Turnstile için challenges.cloudflare.com, Sentry için sentry.io izinli.
  // Meta Pixel (consent verilirse) için connect.facebook.net + *.facebook.com izinli.
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://connect.facebook.net",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://*.facebook.com https://www.facebook.com",
      "font-src 'self' data:",
      "connect-src 'self' https://*.ingest.sentry.io https://*.ingest.de.sentry.io https://challenges.cloudflare.com https://*.facebook.com https://www.facebook.com",
      "frame-src 'self' https://challenges.cloudflare.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      'upgrade-insecure-requests',
    ].join('; '),
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Framer Motion tree-shake — kullanılan exportları izole et, bundle %30-50 azalır
  experimental: {
    optimizePackageImports: ['framer-motion', '@sentry/nextjs'],
  },
  // Compile-time prod optimizasyonu — dev'de etki yok
  compiler: {
    // Production'da console.log otomatik silinir, console.error bırakılır
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

// Sentry wrap — build-time'da source map upload + runtime error capture.
// Auth token yoksa (preview/dev) build kırılmaz, sadece upload skip edilir.
export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG || 'clubbeans',
  project: process.env.SENTRY_PROJECT || 'cb-web',
  // Auth token yoksa sessizce geç
  authToken: process.env.SENTRY_AUTH_TOKEN,
  // Source maps'i Sentry'ye yükle, sonra client bundle'dan sil (güvenlik)
  sourcemaps: {
    disable: !process.env.SENTRY_AUTH_TOKEN,
  },
  // Build çıktılarını sessiz tut
  silent: !process.env.CI,
  // Tree-shaking için kullanılmayan Sentry kodunu kaldır
  disableLogger: true,
  // Vercel Cron'ları Sentry telemetry ile entegre et
  automaticVercelMonitors: true,
});
