import * as Sentry from '@sentry/nextjs';
import { olayMaskele } from '@/lib/hazirGiris';

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
    // Gizli parametre maskesi (CB2026 hazir-hesap-giris-baglantisi): /hazir#k=<anahtar>, uygulamayı açan
    // adresteki access_token/refresh_token ve çıplak JWT — URL, işlem adı, gezinme izleri dahil her alanda.
    beforeSend: (olay) => olayMaskele(olay),
    beforeSendTransaction: (olay) => olayMaskele(olay),
  });
}
