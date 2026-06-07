/**
 * @route /auth/callback
 * @governing_law PLATFORM_ANAYASASI, NAVIGASYON_ANAYASASI, KIMLIK_ANAYASASI
 *
 * Universal Link target for Supabase Auth Magic Link + Password Reset callback.
 * On iOS/Android with app installed: AASA/assetlinks.json triggers auto-open
 * via /bean/* /club/* /user/* /post/* paths in AASA — auth/callback is NOT
 * in app-side paths list, so this route renders in browser AND forwards
 * hash fragment (#access_token=...) to clubbeans://auth/callback scheme.
 *
 * If app installed: scheme open succeeds → app handles tokens.
 * If app not installed: 2sn timeout → show App Store + Play Store CTA.
 *
 * Sprint: SHARE-4 AUTH-CALLBACK (#392, 2026-06-07)
 */

'use client';

import { useEffect, useState } from 'react';

export default function AuthCallback() {
  const [appOpenAttempted, setAppOpenAttempted] = useState(false);

  useEffect(() => {
    // Capture hash fragment (Supabase Magic Link tokens) + query string
    // (forgot-password recovery=1 flag).
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    const search = typeof window !== 'undefined' ? window.location.search : '';
    const schemeUrl = `clubbeans://auth/callback${search}${hash}`;

    // Forward to native scheme — browser security model: this attempt may
    // be blocked on iOS Safari without user gesture, but Universal Link
    // (AASA) auto-open path runs in parallel from the original click.
    window.location.href = schemeUrl;
    setAppOpenAttempted(true);
  }, []);

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md text-center">
        <div className="text-xs uppercase tracking-[0.3em] text-acid mb-4 font-mono">
          ClubBeans
        </div>
        <h1 className="text-3xl font-semibold mb-3">Bean&apos;inizi yönlendiriyoruz</h1>
        <p className="text-white/70 mb-8 text-sm leading-relaxed">
          ClubBeans uygulaması otomatik olarak açılıyor. Eğer açılmazsa,
          uygulamayı henüz yüklemediğiniz anlamına gelir.
        </p>

        {appOpenAttempted && (
          <div className="space-y-3 pt-4 border-t border-white/10">
            <p className="text-xs text-white/50 mb-3">Uygulama açılmadıysa:</p>
            <a
              href="https://apps.apple.com/app/clubbeans/id6762319190"
              className="block bg-white text-black rounded-2xl px-6 py-3 font-medium text-sm hover:opacity-90 transition"
              rel="noopener noreferrer"
            >
              App Store&apos;dan indir
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.clubbeans.app"
              className="block bg-acid text-black rounded-2xl px-6 py-3 font-medium text-sm hover:opacity-90 transition"
              rel="noopener noreferrer"
            >
              Google Play&apos;den indir
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
