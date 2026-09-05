/**
 * Next.js 15.3+/16: istemci Sentry başlatması bu dosyadan yüklenir.
 * `sentry.client.config.ts` tek başına artık OKUNMUYORDU → tarayıcıdaki JS hataları
 * (oyun dahil) Sentry'ye gitmiyordu (denetim performans-3/-4 skeptiği, CONFIRMED).
 */
import * as Sentry from '@sentry/nextjs';
import './sentry.client.config';

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
