import FAQ from '@/components/FAQ';
import FooterLegal from '@/components/FooterLegal';
import GlossaryBox from '@/components/GlossaryBox';
import Nav from '@/components/Nav';
import StickyCTA from '@/components/StickyCTA';
import SubPageCTA from '@/components/subpage/SubPageCTA';
import SubPageHeader from '@/components/subpage/SubPageHeader';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SSS — Sık Sorulan Sorular',
  description:
    'ClubBeans hakkında 12 net cevap: lansman tarihi, ücretsizlik, iOS/Android, veri gizliliği, iptal kuralları, KVKK, ücretli Bean ve daha fazlası.',
  openGraph: {
    title: 'SSS — Sık Sorulan Sorular · ClubBeans',
    description: 'Aklındakine 12 net cevap. Bahaneye yer yok.',
    url: 'https://clubbeans.com/sss',
  },
  alternates: { canonical: 'https://clubbeans.com/sss' },
};

export default function SSSPage() {
  return (
    <>
      <Nav />
      <main>
        <SubPageHeader
          kicker="Sık sorulan sorular"
          title="Aklındakini sor."
          subtitle="Bahaneye yer bırakmıyoruz. 12 kritik soru + metinlerde bağlantılar."
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
