/**
 * @module Supabase user public profile fetch
 * @governing_law KULLANICI_ANAYASASI M21, KVKK_ANAYASASI K6
 *
 * Defense-in-depth: is_private=false + is_deleted=false explicit filter
 * (profiles_public_safe_select Sprint 5'e kadar bu cb-web filter belt korur).
 * Column allowlist ile PII leak engelle (birth_date, location, vibe_vector vb. YOK).
 *
 * Sprint: share-2-alpha-web Commit 5
 */

import { supabaseAnon } from './client';

const USERNAME_RE = /^[a-z0-9_]{3,30}$/i;

export interface UserPublic {
  id: string;
  username: string;
  avatar_url: string | null;
  bio: string | null;
  trust_score: number | null;
  is_verified: boolean | null;
}

export async function fetchUserPublic(
  username: string,
): Promise<UserPublic | null> {
  if (!USERNAME_RE.test(username)) return null;

  const { data, error } = await supabaseAnon
    .from('profiles')
    .select('id, username, avatar_url, bio, trust_score, is_verified')
    .ilike('username', username)
    .eq('is_private', false)
    .eq('is_deleted', false)
    .maybeSingle();

  if (error || !data) return null;
  return data as UserPublic;
}
