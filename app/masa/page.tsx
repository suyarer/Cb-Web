import FooterLegal from '@/components/FooterLegal';
import IndirButonlari from '@/components/indir/IndirButonlari';
import Nav from '@/components/Nav';
import ViewContentTracker from '@/components/ViewContentTracker';
import { reklamTrafigiMi, sayfaKampanyasi } from '@/lib/appLinks';
import {
  istanbulTarihSaat,
  kalanYer,
  kimlikGerekirMi,
  PILOT,
  PILOT_BASLIK_ONEKI,
  pilotSaatindeMi,
  siradakiMasa,
  type SeciliMasa,
} from '@/lib/masaSecim';
import { platformBul } from '@/lib/platform';
import { fetchPilotMasalar } from '@/lib/supabase/masa';
import type { Metadata } from 'next';
import { headers } from 'next/headers';

/**
 * @route /masa
 * @governing_law BEAN_ANAYASASI, KVKK_ANAYASASI K6, clubbeans-privacy-v1
 *
 * Masa Ritüeli Pilotu (2026-09-29) — reklamın SABİT iniş sayfası. Resmi kulübün sıradaki
 * pilot masasını (`PILOT`, 2026-09-29'dan beri Pazar 15:00) her istekte kendisi bulur (`siradakiMasa`); masa dolunca/geçince bir
 * sonrakini gösterir → reklam adresi hiç değişmez. Masa açıklaması bilerek gösterilmez (serbest metin).
 * SmartRedirect YOK: reklamdan gelen kişi masayı okur, kendi seçer.
 */
export const dynamic = 'force-dynamic';

// Gün/saat metinleri PILOT'tan türer; saat eksiz yazılır (Türkçe ek saate göre değişir).
const BASLIK = `${PILOT_BASLIK_ONEKI} — ClubBeans`;
const ACIKLAMA = `Her ${PILOT.gun}, saat ${PILOT.saat}: 8 kişilik bir masa. Tanımadığın insanlarla aynı masada; katılım ücretsiz, herkes kendi hesabını öder.`;

export const metadata: Metadata = {
  title: BASLIK,
  description: ACIKLAMA,
  openGraph: { title: PILOT_BASLIK_ONEKI, description: ACIKLAMA, url: 'https://www.clubbeans.com/masa', locale: 'tr_TR' },
  twitter: { card: 'summary_large_image', site: '@ClubBeansapp', title: PILOT_BASLIK_ONEKI, description: ACIKLAMA },
  alternates: { canonical: 'https://www.clubbeans.com/masa' },
};

/** Pilotun davet kodu — "ClubBeans Masa" profili açılınca yazılır; boşken satır gizli. */
const DAVET_KODU = '';

const ADIMLAR = [
  'Uygulamayı indir, hesabını aç.',
  'Kurduktan sonra bu sayfaya dön, "Uygulamada aç"a dokun ve yerini ayır.',
  // Onay sorusu: DB `send_confirmation_pulses` masa günü sorar, 1 saat cevap penceresi, cevapsız yer açılır (2026-09-29
  // canlı okundu). Saati masa saatinden türer (`pulse_soru_zamani`) → metinde saat YOK, yalnız davranış.
  'Masa günü uygulama "geliyor musun?" diye sorar. Bildirimleri açık tut ve 1 saat içinde onayla; onaylanmayan yer başkasına açılır.',
  `Masaya gel (${PILOT.gun} ${PILOT.saat}). Biletin telefonunda; masada okutulur.`,
];

function aramaDizesi(sp: Record<string, string | string[] | undefined>): string {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    const d = Array.isArray(v) ? v[0] : v;
    if (d) p.set(k, d);
  }
  return p.toString();
}

function MasaKarti({ secili }: { secili: SeciliMasa }) {
  const { masa, dolu } = secili;
  const kalan = kalanYer(masa);
  return (
    <div className="rounded-3xl border border-acid/30 bg-elevated p-6 md:p-8 mb-8 max-w-xl">
      <p className="text-xs uppercase tracking-[0.3em] text-acid font-mono mb-3">Sıradaki masa</p>
      <p className="text-2xl md:text-3xl font-bold text-white mb-2">{istanbulTarihSaat(masa.start_time)}</p>
      {masa.venue_name && <p className="text-lg text-zinc-300 mb-4">{masa.venue_name}</p>}
      {dolu ? (
        <p className="text-zinc-400">Bu masa doldu. Sıradaki {PILOT_BASLIK_ONEKI} açılınca burada.</p>
      ) : (
        kalan != null && <p className="text-acid font-medium mb-6">{kalan} yer kaldı</p>
      )}
      {!dolu && kimlikGerekirMi(masa) && (
        <p className="text-sm text-zinc-400 -mt-3 mb-6">İlk biletinde kimliğini bir kez doğrularsın; belgen bizde saklanmaz.</p>
      )}
      {!dolu && (
        <a
          href={`clubbeans://bean/${masa.id}`}
          className="inline-flex items-center justify-center min-h-[48px] px-6 rounded-full bg-acid text-midnight font-semibold no-underline hover:opacity-90 transition"
        >
          Uygulamada aç
        </a>
      )}
    </div>
  );
}

export default async function MasaPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const platform = platformBul((await headers()).get('user-agent'));
  const qs = aramaDizesi((await searchParams) ?? {});
  const kampanya = sayfaKampanyasi(qs, 'masa');
  const ortam = reklamTrafigiMi(qs) ? 'reklam' : 'web';
  const simdi = new Date();
  const secili = siradakiMasa((await fetchPilotMasalar(simdi)) ?? [], simdi);

  return (
    <>
      <ViewContentTracker contentName="masa" contentCategory="masa-pilot" />
      <Nav />
      <main
        data-platform={platform}
        data-masa={secili ? (secili.dolu ? 'dolu' : 'acik') : 'yok'}
        data-pilot-saat={secili ? (pilotSaatindeMi(secili.masa.start_time) ? 'uyumlu' : 'uyumsuz') : undefined}
      >
        <section className="relative pt-28 md:pt-36 pb-14 md:pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-radial-glow opacity-40 pointer-events-none" />
          <div className="container-x relative">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-acid mb-4 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-acid" aria-hidden />
              Her {PILOT.gun} · {PILOT.saat}
            </div>
            <h1 className="text-display font-bold tracking-tight text-white leading-tight mb-4">
              {PILOT.zamanIfadesi}, <span className="text-gradient-acid">8 kişilik</span> bir masa.
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 max-w-xl leading-relaxed mb-8">
              Tanımadığın insanlarla aynı masada, sakin bir sohbet. Katılım ücretsiz, herkes kendi hesabını öder.
            </p>

            {secili ? (
              <MasaKarti secili={secili} />
            ) : (
              <p className="text-zinc-300 max-w-xl mb-8">
                Sıradaki {PILOT_BASLIK_ONEKI} henüz açılmadı. Her hafta bu sayfada; uygulamayı şimdiden indir, masa açılınca
                buradan yerini ayır.
              </p>
            )}

            <p className="text-sm text-zinc-500 mb-3">Uygulama telefonunda yoksa önce indir:</p>
            <IndirButonlari platform={platform} kampanya={kampanya} kaynak="masa" ortam={ortam} />
            {DAVET_KODU && (
              <p className="mt-4 text-sm text-zinc-400">
                Kayıttan sonra davet kodu adımında <span className="font-mono text-acid">{DAVET_KODU}</span> yaz.
              </p>
            )}
          </div>
        </section>

        <section className="container-x pb-20 md:pb-28">
          <div className="rounded-3xl border border-border bg-elevated p-6 md:p-8 max-w-xl">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-5">Nasıl işliyor</h2>
            <ol className="space-y-4">
              {ADIMLAR.map((adim, i) => (
                <li key={adim} className="flex gap-4">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full border border-acid/40 text-acid text-xs font-mono flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="text-zinc-300 leading-relaxed pt-0.5">{adim}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>
      {/* Kapanış satırı "En iyi test: önümüzdeki Cumartesi" Pazar masası sayfasında çelişik (7b bulgusu) */}
      <FooterLegal kapanis={false} />
    </>
  );
}
