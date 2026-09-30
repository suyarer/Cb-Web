/**
 * @route /auth/callback
 * @governing_law PLATFORM_ANAYASASI, NAVIGASYON_ANAYASASI, KIMLIK_ANAYASASI
 *
 * Supabase sihirli bağlantı + şifre sıfırlama dönüşü (redirect_to https://clubbeans.com/auth/callback).
 * Uygulama yüklü ve App Link / Universal Link doğrulanmışsa bu sayfa HİÇ açılmaz — işletim sistemi
 * bağlantıyı doğrudan uygulamaya verir. Açıldıysa (doğrulama yok, farklı tarayıcı, masaüstü):
 *  1) otomatik deneme: clubbeans:// şemasına JS yönlendirmesi (tarayıcı dokunuşsuz olduğu için engelleyebilir)
 *  2) KULLANICI DOKUNUŞLU "ClubBeans'i aç" düğmesi — Android'de intent:// (uygulama yoksa Play'e düşer),
 *     diğerlerinde clubbeans:// . Chrome dokunuşsuz uygulama başlatmayı reddeder; düğme bunu aşar.
 *  3) mağaza bağlantıları.
 *
 * NEDEN (CB2026 İP-H, 2026-09-30): 21 Eyl'de gerçek bir kullanıcı şifre sıfırlama bağlantısına bastı, bu sayfada
 * kaldı (düğme yoktu, JS denemesi engellendi), vazgeçip Google ile girdi. Sorgu (?code, ?recovery) ve hash
 * (#error…) korunur; intent:// hash taşıyamadığı için hash parametreleri sorguya taşınır.
 * Sprint: SHARE-4 AUTH-CALLBACK (#392, 2026-06-07) · İP-H (2026-09-30)
 */

'use client';

import { useEffect, useState } from 'react';

const PLAY = 'https://play.google.com/store/apps/details?id=com.clubbeans';
const APP_STORE = 'https://apps.apple.com/app/id6778042472';

/** Hash parametrelerini sorguya katar (intent:// URI hash taşıyamaz). */
function sorguyaKat(search: string, hash: string): string {
  const q = new URLSearchParams(search);
  new URLSearchParams(hash.replace(/^#/, '')).forEach((v, k) => {
    if (!q.has(k)) q.set(k, v);
  });
  const s = q.toString();
  return s ? `?${s}` : '';
}

export default function AuthCallback() {
  const [acHref, setAcHref] = useState<string | null>(null);
  const [android, setAndroid] = useState(false);

  useEffect(() => {
    const { search, hash } = window.location;
    const semaUrl = `clubbeans://auth/callback${search}${hash}`;
    const androidMu = /android/i.test(navigator.userAgent);
    setAndroid(androidMu);
    setAcHref(
      androidMu
        ? `intent://auth/callback${sorguyaKat(search, hash)}#Intent;scheme=clubbeans;package=com.clubbeans;S.browser_fallback_url=${encodeURIComponent(PLAY)};end`
        : semaUrl
    );
    // Otomatik deneme (yedek): bazı tarayıcılar dokunuşsuz şema yönlendirmesini engeller.
    window.location.href = semaUrl;
  }, []);

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md text-center">
        <div className="text-xs uppercase tracking-[0.3em] text-acid mb-4 font-mono">ClubBeans</div>
        <h1 className="text-3xl font-semibold mb-3">ClubBeans&apos;e yönlendiriyoruz</h1>
        <p className="text-white/70 mb-6 text-sm leading-relaxed">
          Uygulama açılmadıysa aşağıdaki düğmeye dokun. Bağlantıyı, isteği yaptığın telefonda aç; bağlantı 10
          dakika geçerli.
        </p>

        {acHref && (
          <a
            href={acHref}
            className="block bg-acid text-black rounded-2xl px-6 py-4 font-semibold text-base hover:opacity-90 transition mb-6"
          >
            ClubBeans&apos;i aç
          </a>
        )}

        <div className="space-y-3 pt-4 border-t border-white/10">
          <p className="text-xs text-white/50 mb-3">Uygulama yüklü değilse:</p>
          <a
            href={APP_STORE}
            className={`block rounded-2xl px-6 py-3 font-medium text-sm hover:opacity-90 transition ${android ? 'bg-white/10 text-white' : 'bg-white text-black'}`}
            rel="noopener noreferrer"
          >
            App Store&apos;dan indir
          </a>
          <a
            href={PLAY}
            className={`block rounded-2xl px-6 py-3 font-medium text-sm hover:opacity-90 transition ${android ? 'bg-white text-black' : 'bg-white/10 text-white'}`}
            rel="noopener noreferrer"
          >
            Google Play&apos;den indir
          </a>
        </div>
      </div>
    </main>
  );
}
