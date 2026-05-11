import * as Sentry from '@sentry/nextjs';

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    // Performance izleme MINIMAL — pre-launch landing için %2 yeterli, bundle aza indirgemek için
    tracesSampleRate: 0.02,
    // Replay KAPALI — 70-100KB bundle save (post-launch ihtiyaç olursa geri aç)
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    // PII'yi varsayılan olarak gönderme
    sendDefaultPii: false,
    // Debug kapalı (production)
    debug: false,
    // Integrations — minimal (Replay kaldırıldı performans için)
    integrations: [],
    // Brand tutarlı
    environment: process.env.NODE_ENV,
  });
}
