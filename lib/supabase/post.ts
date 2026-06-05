/**
 * @module Supabase post public fetch
 * @governing_law KULLANICI_ANAYASASI M21, KVKK_ANAYASASI K6
 *
 * Defense-in-depth: posts_privacy_select RLS karmaşık (private/follow/club/blok)
 * — anon için sadece public profile'lara ait post'lar görünür.
 * Column allowlist + 2-layer profile join filter.
 *
 * Sprint: share-2-alpha-web Commit 5
 */

import { supabaseAnon } from './client';

const UUID_RE = /^[0-9a-f-]{36}$/i;

export interface PostPublic {
  id: string;
  caption: string | null;
  created_at: string;
  media_url: string | null;
  author: {
    username: string;
    avatar_url: string | null;
  } | null;
}

export async function fetchPostPublic(id: string): Promise<PostPublic | null> {
  if (!UUID_RE.test(id)) return null;

  const { data, error } = await supabaseAnon
    .from('posts')
    .select(
      'id, caption, created_at, media_url, author:profiles!user_id(username, avatar_url, is_private, is_deleted)',
    )
    .eq('id', id)
    .maybeSingle();

  if (error || !data) return null;

  // Supabase relation array → first element (profiles!user_id 1:1)
  type RawAuthor = {
    username: string;
    avatar_url: string | null;
    is_private: boolean;
    is_deleted: boolean;
  };
  const authorRaw = (data as unknown as { author: RawAuthor[] | RawAuthor | null }).author;
  const author = Array.isArray(authorRaw) ? authorRaw[0] : authorRaw;

  // Defense-in-depth: post author private/deleted ise post'u gizle
  if (!author || author.is_private || author.is_deleted) return null;

  return {
    id: data.id,
    caption: data.caption,
    created_at: data.created_at,
    media_url: data.media_url,
    author: { username: author.username, avatar_url: author.avatar_url },
  };
}
