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

  // Defense-in-depth: post author private/deleted ise post'u gizle
  const author = (data as { author: { is_private: boolean; is_deleted: boolean } | null }).author;
  if (!author || author.is_private || author.is_deleted) return null;

  return {
    id: data.id,
    caption: data.caption,
    created_at: data.created_at,
    media_url: data.media_url,
    author: { username: (author as unknown as { username: string }).username, avatar_url: (author as unknown as { avatar_url: string | null }).avatar_url },
  };
}
