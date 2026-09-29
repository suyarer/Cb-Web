/**
 * @module Supabase Pazar programı fetch
 * @governing_law BEAN_ANAYASASI, KVKK_ANAYASASI K6
 *
 * Pazar Programı (2026-09-29): programdaki kulüplerin yaklaşan herkese açık etkinlikleri. Kolon allowlist; `description`
 * YALNIZ alkol süzgeci için çekilir, sayfada gösterilmez (pazarProgrami.ts). Katılımcı listesi çekilmez.
 * is_public=true (RLS zaten yalnız visibility='public' döndürür). Eşleme ve eleme `pazarProgrami()` içinde — orada test edilir.
 */

import * as Sentry from '@sentry/nextjs';
import { sorguAltSiniri, type EtkinlikSatiri } from '@/lib/pazarProgrami';
import { supabaseAnon } from './client';

export async function fetchPazarEtkinlikleri(kulupIdleri: string[], simdi: Date): Promise<EtkinlikSatiri[] | null> {
  if (kulupIdleri.length === 0) return [];
  if (!supabaseAnon) return null;

  const { data, error } = await supabaseAnon
    .from('beans')
    .select(
      'id, club_id, title, start_time, venue_name, max_capacity, current_attendees, is_cancelled, is_test, identity_required, description',
    )
    .in('club_id', kulupIdleri)
    .eq('is_public', true)
    .not('is_cancelled', 'is', true)
    .not('is_test', 'is', true)
    .gt('start_time', sorguAltSiniri(simdi).toISOString())
    .order('start_time', { ascending: true })
    .limit(30);

  if (error) {
    // Sayfa "yakında"ya düşer ama sessiz kalmaz: reklam parası boş karta akıyor olabilir.
    console.error('[pazar] program sorgusu başarısız:', error.code, error.message);
    Sentry.captureMessage('pazar: program sorgusu başarısız', {
      level: 'error',
      tags: { alan: 'pazar', rota: 'pazar' },
      extra: { pg_code: error.code, mesaj: error.message },
      fingerprint: ['pazar-program-sorgu'],
    });
    return null;
  }
  return (data ?? []) as EtkinlikSatiri[];
}
