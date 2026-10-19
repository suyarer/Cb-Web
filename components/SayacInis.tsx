'use client';

/**
 * Reklam inişi sayımı — yalnız reklam izli açılışta (utm_source | fbclid; lib/appLinks reklamTrafigiMi) ve yalnız mağaza
 * tıklaması ölçülen sayfalarda (/, /indir, /pazar) sayfa başına bir kez sayar. Tık ölçülmeyen sayfada iniş sayılırsa sayaç sahte
 * bir "sitede kopuş" gösterirdi (CB2026 meta-magaza-tiklama-sayaci-2026-10-19, plan hasımı H2). Kişisel veri yok (lib/sayac).
 * WebOlcum içinde render edilir → izleyicisiz rotalarda (/hazir) hiç yüklenmez.
 *
 * @governing_law clubbeans-privacy-v1
 */
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { reklamTrafigiMi } from '@/lib/appLinks';
import { cihazPlatformu, magazaSay } from '@/lib/sayac';

const OLCULEN_SAYFALAR: Record<string, string> = { '/': 'ana', '/indir': 'indir', '/pazar': 'pazar' };

export default function SayacInis() {
  const pathname = usePathname();
  useEffect(() => {
    const kaynak = OLCULEN_SAYFALAR[pathname];
    if (!kaynak || !reklamTrafigiMi(window.location.search)) return;
    magazaSay('inis', cihazPlatformu(navigator.userAgent), kaynak);
  }, [pathname]);
  return null;
}
