/**
 * @module app/hazir/useHazirGiris
 * @governing_law GUVENLIK_ANAYASASI, KVKK_ANAYASASI, KIMLIK_ANAYASASI
 * @sprint CB2026 hazir-hesap-giris-baglantisi-2026-10-06
 *
 * /hazir mantığı. Yüklemede ağ çağrısı YOK; "Hesabına gir" dokunuşu anahtarı CB2026 edge `hazir-giris`'e
 * gönderir (anon, POST gövdesinde — URL'de değil). Dönen jetonlar dokunuşun hemen ardından uygulamayı açan
 * adrese verilir (Chrome dokunuşsuz uygulama başlatmayı reddeder; kısa fetch etkinleşme penceresi içinde
 * kalır) ve ayrıca "Uygulamayı aç" düğmesine konur. Jeton/anahtar Sentry'ye gitmez: yalnız durum + kod etiketi.
 */
'use client';

import * as Sentry from '@sentry/nextjs';
import { useCallback, useEffect, useRef, useState } from 'react';
import { type Cihaz, cihazSinifi, hataBilgisi, jetonlariAl, oturumAdresi, uygulamaIciMi } from '@/lib/hazirGiris';

declare global {
  interface Window {
    __hazirK?: string | null;
  }
}

export type Asama =
  | { tur: 'hazirlaniyor' }
  | { tur: 'anahtarsiz' }
  | { tur: 'bekliyor' }
  | { tur: 'gonderiliyor' }
  | { tur: 'acildi'; adres: string }
  | { tur: 'hata'; metin: string; tekrarDenenir: boolean };

const ZAMAN_ASIMI_MS = 15_000;

async function hazirGirisCagir(anahtar: string): Promise<{ durum: number; veri: unknown }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return { durum: 500, veri: { kod: 'YAPILANDIRMA_EKSIK' } };
  const iptal = new AbortController();
  const zamanlayici = setTimeout(() => iptal.abort(), ZAMAN_ASIMI_MS);
  try {
    const r = await fetch(`${url}/functions/v1/hazir-giris`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: anon },
      body: JSON.stringify({ anahtar }),
      cache: 'no-store',
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
      signal: iptal.signal,
    });
    return { durum: r.status, veri: await r.json().catch(() => null) };
  } catch {
    return { durum: 0, veri: null };
  } finally {
    clearTimeout(zamanlayici);
  }
}

/** Beklenen redler (410/400/403/429) değil, yalnız sunucu/ağ/biçim sorunları Sentry'ye — etiketler PII'siz. */
function izle(durum: number, kod: unknown): void {
  if (durum !== 0 && durum < 500 && durum !== 200) return;
  Sentry.captureMessage('hazir-giris: hesap açılamadı', {
    level: 'warning',
    tags: { alan: 'hazir', hazir_durum: String(durum), hazir_kod: typeof kod === 'string' ? kod.slice(0, 40) : 'yok' },
  });
}

export function useHazirGiris() {
  const [asama, setAsama] = useState<Asama>({ tur: 'hazirlaniyor' });
  const [cihaz, setCihaz] = useState<Cihaz>('masaustu');
  const [uygulamaIci, setUygulamaIci] = useState(false);
  const anahtar = useRef<string | null>(null);
  const mesgul = useRef(false);

  useEffect(() => {
    anahtar.current = window.__hazirK ?? null;
    setCihaz(cihazSinifi(navigator.userAgent, navigator.maxTouchPoints ?? 0));
    setUygulamaIci(uygulamaIciMi(navigator.userAgent));
    setAsama(anahtar.current ? { tur: 'bekliyor' } : { tur: 'anahtarsiz' });
  }, []);

  const gir = useCallback(async () => {
    const k = anahtar.current;
    if (!k || mesgul.current) return;
    mesgul.current = true;
    setAsama({ tur: 'gonderiliyor' });
    const { durum, veri } = await hazirGirisCagir(k);
    mesgul.current = false;
    const jetonlar = durum === 200 ? jetonlariAl(veri) : null;
    if (jetonlar) {
      const adres = oturumAdresi(cihaz, jetonlar);
      setAsama({ tur: 'acildi', adres });
      window.location.href = adres;
      return;
    }
    const kod = veri && typeof veri === 'object' ? (veri as { kod?: unknown }).kod : undefined;
    izle(durum, durum === 200 ? 'BOZUK_YANIT' : kod);
    setAsama({ tur: 'hata', ...hataBilgisi(durum === 200 ? 500 : durum, kod) });
  }, [cihaz]);

  return { asama, cihaz, uygulamaIci, gir };
}
