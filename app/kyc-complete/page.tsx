/**
 * @route /kyc-complete
 * @governing_law KIMLIK_ANAYASASI V1.0, PLATFORM_ANAYASASI
 *
 * Universal Link target for Didit KYC verification callback.
 * Hash + query fragment (verificationSessionId, status) forwarded to
 * clubbeans://kyc-complete scheme — app handles finalize_verification.
 *
 * Pattern: identical to /auth/callback (SHARE-4 AUTH-CALLBACK #392).
 *
 * Sprint: SHARE-4 AUTH-CALLBACK (#392, 2026-06-07)
 */

'use client';

import { useEffect, useState } from 'react';

export default function KycCompleteCallback() {
  const [appOpenAttempted, setAppOpenAttempted] = useState(false);

  useEffect(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    const search = typeof window !== 'undefined' ? window.location.search : '';
    const schemeUrl = `clubbeans://kyc-complete${search}${hash}`;
    window.location.href = schemeUrl;
    setAppOpenAttempted(true);
  }, []);

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md text-center">
        <div className="text-xs uppercase tracking-[0.3em] text-acid mb-4 font-mono">
          Kimlik Doğrulama
        </div>
        <h1 className="text-3xl font-semibold mb-3">Sonucu uygulamaya aktarıyoruz</h1>
        <p className="text-white/70 mb-8 text-sm leading-relaxed">
          Kimlik doğrulama sonucunuz ClubBeans uygulamasına otomatik
          aktarılıyor. Eğer uygulama açılmazsa, lütfen tekrar deneyin.
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
