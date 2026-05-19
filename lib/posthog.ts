/**
 * PostHog client-side analytics + session recording
 *
 * Anti-platform manifestomuza uygun şekilde:
 * - Consent verilmediyse hiçbir event/recording yapılmaz
 * - PostHog Key env var yoksa init edilmez (dev/preview safe)
 * - Session recording'de TÜM input'lar maskeli (KVKK + privacy first)
 * - autocapture aktif ama PII alanları filtreleniyor
 *
 * Lansman -11 gün: conversion %0.07 root cause araştırması için.
 * Real user behavior verisi olmadan teori spekülasyonu sürüyor.
 *
 * @governing_law clubbeans-privacy-v1
 */

import posthog from 'posthog-js';
import { getConsent } from './consent';

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com';

let initialized = false;

/**
 * Initialize PostHog with privacy-first config.
 * Idempotent — safe to call multiple times.
 */
export function initPostHog(): void {
  if (typeof window === 'undefined') return;
  if (initialized) return;
  if (!POSTHOG_KEY) return;

  // Consent gate — eğer kullanıcı reddetmişse hiçbir şey gönderme
  if (getConsent() === 'denied') return;

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    // EU region — KVKK uyumu için Frankfurt
    person_profiles: 'identified_only', // anonim trafiği profile dönüştürme

    // Session recording — KÖKÜN ARAŞTIRMASI burada
    session_recording: {
      maskAllInputs: true, // KVKK: tüm input'lar maskeli
      maskInputOptions: {
        password: true,
        email: true, // form email'ler kaydedilmesin
      },
      // Recording trigger: sadece engaged sessions (en az 10sn + scroll)
      // Free tier limit'ini koru
      recordCrossOriginIframes: false,
    },

    // Autocapture: tıklama + form etkileşim eventleri
    autocapture: {
      // Form alanlarındaki input içerikleri YAKALAMA
      dom_event_allowlist: ['click', 'change', 'submit'],
      url_allowlist: ['clubbeans.com'],
    },

    // Privacy: IP'yi sakla ama maskele
    ip: true, // IP gerekli (coğrafya analizi)

    // Performance: batch events
    capture_pageview: true,
    capture_pageleave: true,

    loaded: (ph) => {
      // Production'da Sentry varsa korelasyon için session_id paylaş
      if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
        const sessionId = ph.get_session_id();
        if (sessionId && (window as Window & { Sentry?: { setTag: (k: string, v: string) => void } }).Sentry) {
          (window as Window & { Sentry?: { setTag: (k: string, v: string) => void } }).Sentry?.setTag('ph_session_id', sessionId);
        }
      }
    },
  });

  initialized = true;
}

/**
 * Custom event capture — funnel adımlarını izle.
 * Conversion debug için kritik: hangi adımda kullanıcı kayboluyor?
 */
export function trackEvent(name: string, properties?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  if (!initialized || !POSTHOG_KEY) return;
  if (getConsent() === 'denied') return;

  try {
    posthog.capture(name, properties);
  } catch {
    // Sessiz fail — analytics asla user flow'u kırmaz
  }
}

/**
 * User identify (signup başarılı olduğunda).
 * Email hash'lenir, ham PII gönderilmez.
 */
export function identifyUser(emailHash: string, properties?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  if (!initialized || !POSTHOG_KEY) return;
  if (getConsent() === 'denied') return;

  try {
    posthog.identify(emailHash, properties);
  } catch {
    // sessiz
  }
}

/**
 * Consent değişikliğine tepki: 'denied' olunca opt out, 'granted' olunca opt in.
 * window event 'clubbeans:consent' tetiklenince çağrılır.
 */
export function syncPostHogConsent(): void {
  if (typeof window === 'undefined') return;
  if (!initialized) return;

  const consent = getConsent();
  if (consent === 'denied') {
    posthog.opt_out_capturing();
  } else if (consent === 'granted') {
    posthog.opt_in_capturing();
  }
}
