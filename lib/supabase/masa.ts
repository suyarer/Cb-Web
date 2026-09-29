/**
 * @module Supabase pilot masa fetch
 * @governing_law BEAN_ANAYASASI, KVKK_ANAYASASI K6
 *
 * Masa Ritüeli Pilotu (2026-09-29): resmi kulübün yaklaşan herkese açık pilot masası (`PILOT_BASLIK_ONEKI`) adayları.
 * Kolon allowlist (açıklama ve katılımcı listesi ÇEKİLMEZ) + is_public=true (RLS zaten yalnız
 * visibility='public' döndürür). Son eleme `siradakiMasa()` içinde — orada test edilir.
 *
 * Önek: `ilikeDeseni(PILOT_BASLIK_ONEKI)` ('pazar masas%') — Türkçe harf ve i desende `%` olur; DB collation
 * en_US.UTF-8'in Türkçe büyük/küçük harf farkı sorguyu sessizce boşaltmasın.
 */

import * as Sentry from '@sentry/nextjs';
import { ilikeDeseni, PILOT_BASLIK_ONEKI, RESMI_KULUP_ID, type MasaSatiri } from '@/lib/masaSecim';
import { supabaseAnon } from './client';

export async function fetchPilotMasalar(simdi: Date): Promise<MasaSatiri[] | null> {
  if (!supabaseAnon) return null;

  const { data, error } = await supabaseAnon
    .from('beans')
    .select('id, title, start_time, venue_name, max_capacity, current_attendees, is_cancelled, is_test, identity_required')
    .eq('club_id', RESMI_KULUP_ID)
    .eq('is_public', true)
    .not('is_cancelled', 'is', true)
    .not('is_test', 'is', true)
    .gt('start_time', simdi.toISOString())
    .ilike('title', ilikeDeseni(PILOT_BASLIK_ONEKI))
    .order('start_time', { ascending: true })
    .limit(6);

  if (error) {
    // Sayfa "yakında"ya düşer ama sessiz kalmaz: reklam parası boş sayfaya akıyor olabilir.
    console.error('[masa] pilot masa sorgusu başarısız:', error.code, error.message);
    Sentry.captureMessage('masa: pilot masa sorgusu başarısız', {
      level: 'error',
      tags: { alan: 'masa', rota: 'masa' },
      extra: { pg_code: error.code, mesaj: error.message },
      fingerprint: ['masa-pilot-sorgu'],
    });
    return null;
  }
  return (data ?? []) as MasaSatiri[];
}
