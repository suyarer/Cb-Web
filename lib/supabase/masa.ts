/**
 * @module Supabase pilot masa fetch
 * @governing_law BEAN_ANAYASASI, KVKK_ANAYASASI K6
 *
 * Masa Ritüeli Pilotu (2026-09-29): resmi kulübün yaklaşan herkese açık "Perşembe Masası" adayları.
 * Kolon allowlist (açıklama ve katılımcı listesi ÇEKİLMEZ) + is_public=true (RLS zaten yalnız
 * visibility='public' döndürür). Son eleme `siradakiMasa()` içinde — orada test edilir.
 *
 * Önek: `ilike 'per_embe masa%'` — DB collation en_US.UTF-8; `_` ş/s'yi karşılar ve ı/İ harfi
 * desende hiç geçmez (Türkçe büyük/küçük harf farkı sorguyu sessizce boşaltmasın).
 */

import { RESMI_KULUP_ID, type MasaSatiri } from '@/lib/masaSecim';
import { supabaseAnon } from './client';

export async function fetchPilotMasalar(simdi: Date): Promise<MasaSatiri[] | null> {
  if (!supabaseAnon) return null;

  const { data, error } = await supabaseAnon
    .from('beans')
    .select('id, title, start_time, venue_name, max_capacity, current_attendees, is_cancelled, is_test')
    .eq('club_id', RESMI_KULUP_ID)
    .eq('is_public', true)
    .not('is_cancelled', 'is', true)
    .not('is_test', 'is', true)
    .gt('start_time', simdi.toISOString())
    .ilike('title', 'per_embe masa%')
    .order('start_time', { ascending: true })
    .limit(6);

  if (error) {
    // Vercel fonksiyon logu — sayfa "yakında"ya düşer ama sessiz kalmaz
    console.error('[masa] pilot masa sorgusu başarısız:', error.code, error.message);
    return null;
  }
  return (data ?? []) as MasaSatiri[];
}
