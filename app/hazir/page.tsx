/**
 * @route /hazir
 * @governing_law GUVENLIK_ANAYASASI, KVKK_ANAYASASI, KIMLIK_ANAYASASI
 * @sprint CB2026 hazir-hesap-giris-baglantisi-2026-10-06
 *
 * Hazır hesap giriş sayfası (görünüm). Mantık `useHazirGiris`, saf kararlar `lib/hazirGiris.ts`.
 * İzleyicisiz rota: PostHog · Meta Pikseli · çerez bandı · Vercel ölçümü KAPALI (`izleyicisizMi`).
 */
'use client';

import { APP_STORE, GIR_DUGMESI, PLAY } from '@/lib/hazirGiris';
import { useHazirGiris } from './useHazirGiris';

const DUGME = 'block w-full rounded-2xl px-6 py-4 text-base font-semibold transition hover:opacity-90';

export default function HazirSayfasi() {
  const { asama, cihaz, uygulamaIci, gir } = useHazirGiris();
  const telefon = cihaz !== 'masaustu';
  const girilebilir = telefon && (asama.tur === 'bekliyor' || (asama.tur === 'hata' && asama.tekrarDenenir));

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black p-6 text-white">
      <div className="w-full max-w-md text-center">
        <div className="mb-4 font-mono text-xs uppercase tracking-[0.3em] text-acid">ClubBeans</div>
        <h1 className="mb-3 text-3xl font-semibold">Hesabın hazır 🎉</h1>

        {asama.tur === 'hazirlaniyor' && <p className="text-sm text-white/50">Hazırlanıyor…</p>}

        {asama.tur === 'anahtarsiz' && (
          <p className="mb-6 text-sm leading-relaxed text-white/70">
            Bu sayfa yalnız sana gönderilen bağlantıyla çalışır. DM&apos;deki bağlantıya yeniden dokun.
          </p>
        )}

        {!telefon && asama.tur !== 'hazirlaniyor' && asama.tur !== 'anahtarsiz' && (
          <p className="mb-6 text-sm leading-relaxed text-white/70">
            ClubBeans telefonda çalışır. Bu bağlantıyı <strong>telefonundan</strong> aç ve orada &ldquo;{GIR_DUGMESI}&rdquo;
            düğmesine dokun.
          </p>
        )}

        {telefon && (asama.tur === 'bekliyor' || asama.tur === 'gonderiliyor') && (
          <p className="mb-6 text-sm leading-relaxed text-white/70">
            Aşağıdaki düğmeye dokun; ClubBeans açılır ve seni doğrudan hesabına alır. Uygulama yüklü değilse önce
            indir, sonra bu bağlantıya yeniden dokun.
          </p>
        )}

        {telefon && uygulamaIci && asama.tur !== 'anahtarsiz' && (
          <p className="mb-6 rounded-2xl border border-acid/40 bg-acid/10 p-4 text-left text-sm leading-relaxed text-white/90">
            Bağlantıyı bir uygulamanın içinden açtın. Düğme işe yaramazsa sağ üstteki <strong>⋯</strong> menüsünden
            <strong> &ldquo;Tarayıcıda aç&rdquo;</strong>ı seç ve orada yeniden dokun.
          </p>
        )}

        {asama.tur === 'hata' && (
          <p role="alert" className="mb-6 rounded-2xl border border-white/15 bg-white/5 p-4 text-left text-sm leading-relaxed">
            {asama.metin}
          </p>
        )}

        {girilebilir && (
          <button type="button" onClick={gir} className={`${DUGME} mb-6 bg-acid text-black`}>
            {asama.tur === 'hata' ? 'Yeniden dene' : GIR_DUGMESI}
          </button>
        )}

        {asama.tur === 'gonderiliyor' && (
          <button type="button" disabled className={`${DUGME} mb-6 bg-acid/60 text-black`}>
            Hesabın açılıyor…
          </button>
        )}

        {asama.tur === 'acildi' && (
          <>
            <p className="mb-6 text-sm leading-relaxed text-white/70">
              ClubBeans açılıyor. Açılmadıysa aşağıdaki düğmeye dokun. Uygulama yüklü değilse önce indir, sonra
              DM&apos;deki bağlantıya 30 dakika içinde yeniden dokun.
            </p>
            <a href={asama.adres} className={`${DUGME} mb-6 bg-acid text-black`}>
              Uygulamayı aç
            </a>
          </>
        )}

        <div className="space-y-3 border-t border-white/10 pt-4">
          <p className="mb-3 text-xs text-white/50">Uygulama yüklü değilse:</p>
          <a
            href={APP_STORE}
            rel="noopener noreferrer"
            className={`block rounded-2xl px-6 py-3 text-sm font-medium transition hover:opacity-90 ${cihaz === 'android' ? 'bg-white/10 text-white' : 'bg-white text-black'}`}
          >
            App Store&apos;dan indir
          </a>
          <a
            href={PLAY}
            rel="noopener noreferrer"
            className={`block rounded-2xl px-6 py-3 text-sm font-medium transition hover:opacity-90 ${cihaz === 'android' ? 'bg-white text-black' : 'bg-white/10 text-white'}`}
          >
            Google Play&apos;den indir
          </a>
          <p className="pt-2 text-xs text-white/40">Bu bağlantı yalnız senin için; kimseyle paylaşma.</p>
        </div>
      </div>
    </main>
  );
}
