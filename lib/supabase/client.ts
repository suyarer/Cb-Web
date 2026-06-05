/**
 * @module Supabase web anon client
 * @governing_law KVKK_ANAYASASI K6, GUVENLIK_ANAYASASI
 *
 * Anon SELECT-only Supabase client. Persist session KAPALI (web public read).
 * Cb-web RLS doğrulayıcı: column allowlist + explicit WHERE filter zorunlu.
 *
 * Sprint: share-2-alpha-web Commit 5
 */

import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Build-safe: env eksikse null döndür. Routes notFound() yapacak.
// Vercel ENV ekleyene kadar build crash etmez.
export const supabaseAnon: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createBrowserClient(supabaseUrl, supabaseAnonKey)
    : null;

if (!supabaseAnon && typeof window === 'undefined') {
  console.warn(
    '[Supabase] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY missing. Public routes will 404 until env vars set.',
  );
}
