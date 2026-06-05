/**
 * @module Supabase club public fetch
 * @governing_law KULUP_ANAYASASI, KVKK_ANAYASASI K6
 *
 * is_active=true + cb-web column allowlist.
 * RLS gate: clubs_public_read_active_v2 (is_active=true zaten enforce eder).
 *
 * Sprint: share-2-alpha-web Commit 5
 */

import { supabaseAnon } from './client';

const UUID_RE = /^[0-9a-f-]{36}$/i;

export interface ClubPublic {
  id: string;
  name: string;
  description: string | null;
  avatar_url: string | null;
  member_count: number | null;
}

export async function fetchClubPublic(id: string): Promise<ClubPublic | null> {
  if (!UUID_RE.test(id)) return null;
  if (!supabaseAnon) return null;

  const { data, error } = await supabaseAnon
    .from('clubs')
    .select('id, name, description, avatar_url, member_count')
    .eq('id', id)
    .eq('is_active', true)
    .maybeSingle();

  if (error || !data) return null;
  return data as ClubPublic;
}
