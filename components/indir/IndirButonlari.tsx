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
 * Linkler kampanya atıflı (`indir` · `web`); tıklama Pixel + PostHog `source: 'indir'`.
 *
 * @governing_law clubbeans-privacy-v1
 */
export default function IndirButonlari({ platform }: { platform: Platform }) {
  const iosHref = magazaLinki('ios', 'indir', 'web');
  const androidHref = magazaLinki('android', 'indir', 'web');

  if (platform === 'bilinmiyor') {
    return (
      <div className="flex flex-col sm:flex-row items-stretch gap-3">
        <StoreButton platform="apple" href={iosHref} onClick={() => indirmeTiklandi('ios', 'indir')} />
        <StoreButton platform="google" href={androidHref} onClick={() => indirmeTiklandi('android', 'indir')} />
      </div>
    );
  }

  const ios = platform === 'ios';
  return (
    <div className="flex flex-col items-stretch sm:items-start gap-2">
      <StoreButton
        platform={ios ? 'apple' : 'google'}
        href={ios ? iosHref : androidHref}
        onClick={() => indirmeTiklandi(ios ? 'ios' : 'android', 'indir')}
      />
      <a
        href={ios ? androidHref : iosHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => indirmeTiklandi(ios ? 'android' : 'ios', 'indir')}
        className="inline-flex items-center min-h-[44px] text-sm text-zinc-400 hover:text-acid transition no-underline"
      >
        {ios ? "Android telefonun mu var? Google Play'den indir →" : "iPhone'un mu var? App Store'dan indir →"}
      </a>
    </div>
  );
}
