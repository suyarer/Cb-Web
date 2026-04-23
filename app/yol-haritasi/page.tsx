import FooterLegal from '@/components/FooterLegal';
import Nav from '@/components/Nav';
import Roadmap from '@/components/Roadmap';
import StickyCTA from '@/components/StickyCTA';
import SubPageCTA from '@/components/subpage/SubPageCTA';
import SubPageHeader from '@/components/subpage/SubPageHeader';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Yol Haritası — ClubBeans 2026-2027',
  description:
    'Nisan 2026 alfa, Mayıs 2026 beta, Haziran 2026 genel lansman. 2026 Q3 Türkiye geneli, 2027 yurt dışı. Takvim şeffaf, söz şeffaf.',
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
      <main>
        <SubPageHeader
          kicker="Yol haritası"
          title="Açık takvim — ne zaman, nerede?"
          subtitle="Gizli söz, gizli tarih yok. 2026 Q2'de İstanbul-Ankara-İzmir ile başlıyoruz, Q3'te Türkiye'ye yayılıyor, 2027'de yurt dışı. Her aşama şeffaf."
        />
        <Roadmap />
        <SubPageCTA
          source="yol-haritasi"
          headline="Şehrini yazarsan, ilk sen haberdar olursun."
          subtitle="Hangi mahalle/şehir olduğunu mail'e ekle; sıra ulaşınca sana tek mail gelir."
        />
      </main>
      <FooterLegal />
      <StickyCTA />
    </>
  );
}
