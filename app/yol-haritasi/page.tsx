import FooterLegal from '@/components/FooterLegal';
import Nav from '@/components/Nav';
import Roadmap from '@/components/Roadmap';
import StickyCTA from '@/components/StickyCTA';
import SubPageCTA from '@/components/subpage/SubPageCTA';
import SubPageHeader from '@/components/subpage/SubPageHeader';
import ViewContentTracker from '@/components/ViewContentTracker';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Yol Haritası — ClubBeans 2026-2027',
  description:
    'Nisan 2026 kapalı alfa, 2026 genel lansman — App Store ve Google Play\'de yayında. Sırada Türkiye geneli, 2027 yurt dışı. Takvim şeffaf, söz şeffaf.',
  openGraph: {
    title: 'Yol Haritası — ClubBeans 2026-2027',
    description: 'Gizli tutmuyoruz — her adım takvimde.',
    url: 'https://clubbeans.com/yol-haritasi',
  },
  alternates: { canonical: 'https://clubbeans.com/yol-haritasi' },
};

export default function YolHaritasiPage() {
  return (
    <>
      <Nav />
      <ViewContentTracker
        contentName="yol-haritasi"
        contentCategory="launch-roadmap"
      />
      <main>
        <SubPageHeader
          kicker="Yol haritası"
          title="Açık takvim — ne zaman, nerede?"
          subtitle="Gizli söz, gizli tarih yok. İstanbul pilot ile başladık (Karaköy, Cihangir, Moda). Sırada Türkiye geneli, sonra yurt dışı. Her aşama şeffaf."
        />
        <Roadmap />
        <SubPageCTA
          source="yol-haritasi"
          headline="Şehrinde ClubBeans'i başlat."
          subtitle="Uygulamayı indir; yakınındaki etkinliği bul ya da kendi kulübünü kur."
        />
      </main>
      <FooterLegal />
      <StickyCTA />
    </>
  );
}
