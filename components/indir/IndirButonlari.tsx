'use client';

import { indirmeTiklandi, StoreButton } from '@/components/DownloadButtons';
import { magazaLinki } from '@/lib/appLinks';
import type { Platform } from '@/lib/platform';

/**
 * /indir mağaza düğmeleri — sunucunun tespit ettiği platforma göre sıralanır.
 *
 * - ios / android: o mağaza tek büyük düğme; öbür mağaza altında metin linki
 *   (UA yanılırsa ya da ziyaretçi linki başkası için açtıysa yol kapanmasın).
 * - bilinmiyor: iki mağaza yan yana (masaüstü, iPadOS, önizleme botu).
 *
 * Linkler kampanya atıflı (URL'deki temizlenmiş `utm_campaign`, yoksa `indir` · `web`); tıklama Pixel + PostHog `source: kaynak`.
 * `kaynak`/`ortam` (2026-09-29, Masa Pilotu): /masa kendi tıklamasını /indir'den ayırsın; varsayılan eski davranış.
 *
 * @governing_law clubbeans-privacy-v1
 */
export default function IndirButonlari({
  platform,
  kampanya = 'indir',
  kaynak = 'indir',
  ortam = 'web',
}: {
  platform: Platform;
  kampanya?: string;
  kaynak?: string;
  ortam?: string;
}) {
  const iosHref = magazaLinki('ios', kampanya, ortam);
  const androidHref = magazaLinki('android', kampanya, ortam);

  if (platform === 'bilinmiyor') {
    return (
      <div className="flex flex-col sm:flex-row items-stretch gap-3">
        <StoreButton platform="apple" href={iosHref} onClick={() => indirmeTiklandi('ios', kaynak)} />
        <StoreButton platform="google" href={androidHref} onClick={() => indirmeTiklandi('android', kaynak)} />
      </div>
    );
  }

  const ios = platform === 'ios';
  return (
    <div className="flex flex-col items-stretch sm:items-start gap-2">
      <StoreButton
        platform={ios ? 'apple' : 'google'}
        href={ios ? iosHref : androidHref}
        onClick={() => indirmeTiklandi(ios ? 'ios' : 'android', kaynak)}
      />
      <a
        href={ios ? androidHref : iosHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => indirmeTiklandi(ios ? 'android' : 'ios', kaynak)}
        className="inline-flex items-center min-h-[44px] text-sm text-zinc-400 hover:text-acid transition no-underline"
      >
        {ios ? "Android telefonun mu var? Google Play'den indir →" : "iPhone'un mu var? App Store'dan indir →"}
      </a>
    </div>
  );
}
