'use client';

import dynamic from 'next/dynamic';

// Kritik olmayan etkileşim bileşenleri: sadece mount sonrası yüklensin.
// SSR kapalı — bunların hiçbiri initial paint için gerekli değil.
const CityEasterEgg = dynamic(() => import('@/components/CityEasterEgg'), { ssr: false });
const CursorBean = dynamic(() => import('@/components/CursorBean'), { ssr: false });
const ExitIntent = dynamic(() => import('@/components/ExitIntent'), { ssr: false });
const SerendipityBean = dynamic(() => import('@/components/SerendipityBean'), { ssr: false });
const SilentHour = dynamic(() => import('@/components/SilentHour'), { ssr: false });

export default function ClientExtras() {
  return (
    <>
      <CityEasterEgg />
      <CursorBean />
      <ExitIntent />
      <SerendipityBean />
      <SilentHour />
    </>
  );
}
