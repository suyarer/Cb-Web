import FooterLegal from '@/components/FooterLegal';
import IndirButonlari from '@/components/indir/IndirButonlari';
import Nav from '@/components/Nav';
import ViewContentTracker from '@/components/ViewContentTracker';
import { platformBul } from '@/lib/platform';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { headers } from 'next/headers';

/**
 * @governing_law /indir — "uygulamayı nereden indiririm?" sorusunun tek link cevabı.
 *
 * Sunucu render + animasyonsuz: telefonda doğru mağaza ilk karede görünür (framer
 * `initial opacity:0` hidrasyona kadar içeriği gizlerdi). UA'ya göre sıralandığı için
 * sayfa dinamiktir. StickyCTA bilerek YOK — ana sayfaya yönlendirirdi.
 *
 * Metin gerçeğe bağlı (2026-09-17 doğrulandı): iki mağazada ücretsiz, iOS 15.1+,
 * Android 7.0+ (minSdk 24), kimlik kapısı açık (`kyc_gate_enforced`: bilet + kulübün ilk etkinliği).
 */
export const metadata: Metadata = {
  title: 'Uygulamayı İndir — ClubBeans',
  description:
    "ClubBeans App Store ve Google Play'de, ücretsiz. Telefonundan açarsan doğru mağaza gelir; bilgisayardaysan QR kodu okut.",
  openGraph: {
    title: 'ClubBeans uygulamasını indir',
    description: "App Store ve Google Play'de ücretsiz. Etkinliğe katıl ya da kulübünü kur.",
    url: 'https://clubbeans.com/indir',
  },
  // Kök layout'un twitter başlığı açıkça tanımlı → og'a düşmez; X kartı sayfanın kendi metnini göstersin.
  twitter: {
    card: 'summary_large_image',
    site: '@ClubBeansapp',
    title: 'ClubBeans uygulamasını indir',
    description: "App Store ve Google Play'de ücretsiz. Etkinliğe katıl ya da kulübünü kur.",
  },
  alternates: { canonical: 'https://clubbeans.com/indir' },
};

const YOLLAR = [
  {
    baslik: 'Etkinliğe katılacaksan',
    adimlar: [
      'Uygulamayı indir, hesabını aç.',
      'İlgi alanlarını seç; yakınındaki etkinlikler akışına gelsin.',
      'Yer ayır. İlk biletinde kimliğini bir kez doğrularsın; belgen bizde saklanmaz.',
    ],
    link: { href: '/urun', metin: 'Uygulamayı içeriden gör →' },
  },
  {
    baslik: 'Kulüp kuracaksan',
    adimlar: [
      'Uygulamayı indir, hesabını aç.',
      'Kulübünü kur: konu seç, isim ver, logo ekle.',
      'İlk etkinliğini açarken kimliğini bir kez doğrularsın. Sonra etkinliğinin linkini paylaş.',
    ],
    link: { href: '/club-kur', metin: 'Kurucular için ayrıntılar →' },
  },
];

export default async function IndirPage() {
  const platform = platformBul((await headers()).get('user-agent'));

  return (
    <>
      <ViewContentTracker contentName="indir" contentCategory="download-intent" />
      <Nav />
      <main data-platform={platform}>
        <section className="relative pt-28 md:pt-36 pb-14 md:pb-20 overflow-hidden">
          <div className="absolute inset-0 bg-radial-glow opacity-40 pointer-events-none" />
          <div className="container-x relative grid md:grid-cols-[1fr_auto] gap-12 md:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-acid mb-4 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-acid" aria-hidden />
                İndir · Ücretsiz
              </div>
              <h1 className="text-display font-bold tracking-tight text-white leading-tight mb-4">
                ClubBeans&apos;i <span className="text-gradient-acid">telefonuna</span> indir.
              </h1>
              <p className="text-lg md:text-xl text-zinc-400 max-w-xl leading-relaxed mb-8">
                Etkinliğe katılmak da kendi kulübünü kurmak da aynı uygulamadan.
              </p>

              <IndirButonlari platform={platform} />

              <ul className="mt-6 flex flex-wrap gap-x-3 gap-y-1 text-xs font-mono text-zinc-500 [&>li+li]:before:content-['·'] [&>li+li]:before:mr-3">
                <li>Ücretsiz</li>
                <li>iOS 15.1+</li>
                <li>Android 7.0+</li>
              </ul>
            </div>

            {platform === 'bilinmiyor' && (
              <figure className="hidden md:flex flex-col items-center gap-4 rounded-3xl border border-border bg-elevated p-6">
                <div className="rounded-2xl bg-white p-6">
                  <Image
                    src="/indir/qr.svg"
                    alt="clubbeans.com/indir adresine giden QR kod"
                    width={176}
                    height={176}
                    unoptimized
                    priority
                  />
                </div>
                <figcaption className="text-center">
                  <span className="block text-sm text-white font-medium">Telefonunun kamerasıyla okut</span>
                  <span className="block text-xs font-mono text-zinc-500 mt-1">clubbeans.com/indir</span>
                </figcaption>
              </figure>
            )}
          </div>
        </section>

        <section className="container-x pb-20 md:pb-28">
          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            {YOLLAR.map((yol) => (
              <div key={yol.baslik} className="rounded-3xl border border-border bg-elevated p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-5">{yol.baslik}</h2>
                <ol className="space-y-4 mb-6">
                  {yol.adimlar.map((adim, i) => (
                    <li key={adim} className="flex gap-4">
                      <span className="flex-shrink-0 w-7 h-7 rounded-full border border-acid/40 text-acid text-xs font-mono flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span className="text-zinc-300 leading-relaxed pt-0.5">{adim}</span>
                    </li>
                  ))}
                </ol>
                <Link
                  href={yol.link.href}
                  className="inline-flex items-center min-h-[44px] text-sm text-acid hover:text-white transition no-underline"
                >
                  {yol.link.metin}
                </Link>
              </div>
            ))}
          </div>

          <p className="mt-10 text-sm text-zinc-500">
            Takıldığın bir yer mi oldu?{' '}
            <Link href="/sss" className="text-zinc-300 hover:text-acid transition">
              Sık sorulan sorular
            </Link>{' '}
            ya da{' '}
            <Link href="/support" className="text-zinc-300 hover:text-acid transition">
              destek
            </Link>
            .
          </p>
        </section>
      </main>
      <FooterLegal />
    </>
  );
}
