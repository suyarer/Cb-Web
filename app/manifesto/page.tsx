import FooterLegal from '@/components/FooterLegal';
import Manifesto from '@/components/Manifesto';
import Nav from '@/components/Nav';
import StickyCTA from '@/components/StickyCTA';
import SubPageCTA from '@/components/subpage/SubPageCTA';
import SubPageHeader from '@/components/subpage/SubPageHeader';
import ViewContentTracker from '@/components/ViewContentTracker';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Manifesto — ClubBeans',
  description:
    'Biz bir uygulama değil, bir anti-platformuz. Dikkat ekonomisine, Sosyal Obezite\'ye ve dijital yalnızlığa karşı ne yapıyoruz, neden böyle yapıyoruz — tam manifesto.',
  openGraph: {
    title: 'Manifesto — ClubBeans',
    description:
      'Anti-platform ClubBeans\'in felsefesi. Sosyal Obezite\'ye karşı dalgakıran.',
    url: 'https://clubbeans.com/manifesto',
  },
  alternates: { canonical: 'https://clubbeans.com/manifesto' },
};

export default function ManifestoPage() {
  return (
    <>
      <ViewContentTracker
        contentName="manifesto"
        contentCategory="ideology-resonance"
      />
      <Nav />
      <main>
        <SubPageHeader
          kicker="Manifesto · yavaş oku"
          title="Bir uygulama değil, anti-platform."
          subtitle="Seni ekranda tutmak için tasarlanmış sosyal medyaların tersine — ClubBeans seni ekrandan kaldırmak için tasarlandı. Neden böyle yapıyoruz, nasıl yapıyoruz, ne söz veriyoruz."
        />
        <Manifesto />
        <SubPageCTA
          source="manifesto"
          headline="Aynı sözü paylaşıyor musun?"
          subtitle="Lansman listesi — sana benzer düşünenlerin masasına ilk sen otur."
        />
      </main>
      <FooterLegal />
      <StickyCTA />
    </>
  );
}
