import FooterLegal from '@/components/FooterLegal';
import IndirButonlari from '@/components/indir/IndirButonlari';
import Nav from '@/components/Nav';
import PazarKarti, { PazarKartiKucuk } from '@/components/pazar/PazarKarti';
import ViewContentTracker from '@/components/ViewContentTracker';
import { aramaDizesi, reklamTrafigiMi, sayfaKampanyasi } from '@/lib/appLinks';
import { PAZAR_PROGRAMI, pazarProgrami } from '@/lib/pazarProgrami';
import { platformBul } from '@/lib/platform';
import { fetchPazarEtkinlikleri } from '@/lib/supabase/pazar';
import type { Metadata } from 'next';
import { headers } from 'next/headers';

/**
 * @route /pazar
 * @governing_law BEAN_ANAYASASI, KVKK_ANAYASASI K6, clubbeans-privacy-v1
 *
 * Pazar Programı (2026-09-29) — reklamın SABİT iniş sayfası: "Her Pazar bir etkinlik". Sayfaya yalnız `PAZAR_PROGRAMI`
 * girdisi çıkar (insan onayı); girdi DB'deki etkinlikle eşlenir, yoksa "kayıtlar yakında". Ev sahibinin açıklaması
 * gösterilmez. SmartRedirect YOK: reklamdan gelen kişi etkinliği okur, kendi seçer. /masa buraya 308 ile yönlenir.
 */
export const dynamic = 'force-dynamic';

const ACIKLAMA =
  "Her Pazar, ClubBeans'teki bir kulübün etkinliği. Tanımadığın insanlarla yeni bir şey yaparak bir Pazar; yerini uygulamadan ayır.";

export const metadata: Metadata = {
  title: 'Her Pazar bir etkinlik — ClubBeans',
  description: ACIKLAMA,
  openGraph: { title: 'Her Pazar bir etkinlik', description: ACIKLAMA, url: 'https://www.clubbeans.com/pazar', locale: 'tr_TR' },
  twitter: { card: 'summary_large_image', site: '@ClubBeansapp', title: 'Her Pazar bir etkinlik', description: ACIKLAMA },
  alternates: { canonical: 'https://www.clubbeans.com/pazar' },
};

const ADIMLAR = [
  'Uygulamayı indir, hesabını aç.',
  'Kurduktan sonra bu sayfaya dön, "Uygulamada aç"a dokun ve yerini ayır.',
  // Onay sorusu: DB `send_confirmation_pulses` etkinlik günü sorar, 1 saat pencere, cevapsız yer açılır (2026-09-29 canlı okundu).
  'Etkinlik günü uygulama "geliyor musun?" diye sorar. Bildirimleri açık tut ve 1 saat içinde onayla; onaylanmayan yer başkasına açılır.',
  'Etkinliğe gel. Biletin telefonunda; girişte okutulur.',
];

export default async function PazarPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const platform = platformBul((await headers()).get('user-agent'));
  const qs = aramaDizesi((await searchParams) ?? {});
  const kampanya = sayfaKampanyasi(qs, 'pazar');
  const ortam = reklamTrafigiMi(qs) ? 'reklam' : 'web';
  const simdi = new Date();
  const kulupler = [...new Set(PAZAR_PROGRAMI.map((g) => g.kulupId))];
  const { buPazar, sonrakiler } = pazarProgrami(PAZAR_PROGRAMI, (await fetchPazarEtkinlikleri(kulupler, simdi)) ?? [], simdi);
  const durum = !buPazar ? 'yok' : !buPazar.etkinlik ? 'yakinda' : buPazar.dolu ? 'dolu' : 'acik';

  return (
    <>
      <ViewContentTracker contentName="pazar" contentCategory="pazar-programi" />
      <Nav />
      <main
        data-platform={platform}
        data-pazar={durum}
        data-pazar-kulup={buPazar?.girdi.kulupAdi}
        data-pazar-tarih={buPazar?.girdi.tarih}
        data-pazar-etkinlik={buPazar?.etkinlik?.id}
      >
        <section className="relative pt-28 md:pt-36 pb-14 md:pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-radial-glow opacity-40 pointer-events-none" />
          <div className="container-x relative">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-acid mb-4 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-acid" aria-hidden />
              Her Pazar · İstanbul
            </div>
            <h1 className="text-display font-bold tracking-tight text-white leading-tight mb-4">
              Her Pazar, <span className="text-gradient-acid">bir kulüp</span>, bir etkinlik.
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 max-w-xl leading-relaxed mb-8">
              ClubBeans&apos;teki kulüplerin Pazar etkinlikleri. Tanımadığın insanlarla, yeni bir şey yaparak.
            </p>

            {buPazar ? (
              <PazarKarti kalem={buPazar} />
            ) : (
              <p className="text-zinc-300 max-w-xl mb-8">
                Sıradaki Pazar etkinliği yakında burada. Uygulamayı şimdiden indir, açılınca buradan yerini ayır.
              </p>
            )}

            <p className="text-sm text-zinc-500 mb-3">Uygulama telefonunda yoksa önce indir:</p>
            <IndirButonlari platform={platform} kampanya={kampanya} kaynak="pazar" ortam={ortam} />
          </div>
        </section>

        {sonrakiler.length > 0 && (
          <section className="container-x pb-12">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-5">Sonraki Pazarlar</h2>
            <ul className="grid gap-4 md:grid-cols-3 max-w-4xl">
              {sonrakiler.map((k) => (
                <PazarKartiKucuk key={k.girdi.tarih + k.girdi.kulupId} kalem={k} />
              ))}
            </ul>
          </section>
        )}

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
      {/* Kapanış satırı "En iyi test: önümüzdeki Cumartesi" Pazar sayfasında çelişik */}
      <FooterLegal kapanis={false} />
    </>
  );
}
