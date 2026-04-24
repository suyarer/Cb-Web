import * as Sentry from '@sentry/nextjs';

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    // Performance izleme — pre-launch'ta %100, trafik arttıkça %10'a düşür
    tracesSampleRate: 0.2,
    // Replay sadece hatada tetiklenen oturum için
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1.0,
    // PII'yi varsayılan olarak gönderme
    sendDefaultPii: false,
    // Debug kapalı (production)
    debug: false,
    // Integrations
    integrations: [
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    // Brand tutarlı
    environment: process.env.NODE_ENV,
  });
}
