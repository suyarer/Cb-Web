import FAQ from '@/components/FAQ';
import FooterLegal from '@/components/FooterLegal';
import GlossaryBox from '@/components/GlossaryBox';
import Nav from '@/components/Nav';
import StickyCTA from '@/components/StickyCTA';
import SubPageCTA from '@/components/subpage/SubPageCTA';
import SubPageHeader from '@/components/subpage/SubPageHeader';
import ViewContentTracker from '@/components/ViewContentTracker';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SSS — Sık Sorulan Sorular',
  description:
    'ClubBeans hakkında 11 net cevap: ClubBeans nedir, neden anti-platform, ücretsizlik, kimin için, lansman tarihi, Trust Score, kulüp kurma, ücretli etkinlik ve daha fazlası.',
  openGraph: {
    title: 'SSS — Sık Sorulan Sorular · ClubBeans',
    description: 'Aklındakine 11 net cevap. Bahaneye yer yok.',
    url: 'https://clubbeans.com/sss',
  },
  alternates: { canonical: 'https://clubbeans.com/sss' },
};

export default function SSSPage() {
  return (
    <>
      <ViewContentTracker
        contentName="sss"
        contentCategory="support-research"
      />
      <Nav />
      <main>
        <SubPageHeader
          kicker="Sık sorulan sorular"
          title="Aklındakini sor."
          subtitle="Karar aşamasındakine net cevaplar. Felsefe değil, bilgi."
        />
        <GlossaryBox />
        <FAQ />
        <SubPageCTA
          source="sss"
          headline="Cevabı aldın. Listedeki yerin seni bekliyor."
          subtitle="Lansman günü tek mail. Sözümüz bu kadar."
        />
      </main>
      <FooterLegal />
      <StickyCTA />
    </>
  );
}
