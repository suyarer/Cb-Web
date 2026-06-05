/**
 * @module Supabase bean public fetch
 * @governing_law BEAN_ANAYASASI, KVKK_ANAYASASI K6
 *
 * Defense-in-depth: column allowlist + is_public=true (SHARE-1 RLS gate'i
 * zaten enforce eder ama belt+suspenders).
 *
 * Sprint: share-2-alpha-web Commit 5
 */

import { supabaseAnon } from './client';

const UUID_RE = /^[0-9a-f-]{36}$/i;

export interface BeanPublic {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string | null;
  venue_name: string | null;
  category: string | null;
  club_id: string;
}

export async function fetchBeanPublic(id: string): Promise<BeanPublic | null> {
  if (!UUID_RE.test(id)) return null;
  if (!supabaseAnon) return null;

  const { data, error } = await supabaseAnon
    .from('beans')
    .select(
      'id, title, description, start_time, end_time, venue_name, category, club_id',
    )
    .eq('id', id)
    .eq('is_public', true)
    .maybeSingle();

  if (error || !data) return null;
  return data as BeanPublic;
}
