import FooterLegal from '@/components/FooterLegal';
import Nav from '@/components/Nav';
import Showcase from '@/components/Showcase';
import StickyCTA from '@/components/StickyCTA';
import SubPageCTA from '@/components/subpage/SubPageCTA';
import SubPageHeader from '@/components/subpage/SubPageHeader';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ürün — ClubBeans ekranları',
  description:
    'ClubBeans uygulamasının ekranları: Akış, Radar, Compass Mode, Bean detayı. Dört ekran — beşincisi senin hayatın.',
  openGraph: {
    title: 'Ürün — ClubBeans ekranları',
    description: 'Akış, Radar, Compass, Bean detayı — dört ana ekran',
    url: 'https://clubbeans.com/urun',
  },
  alternates: { canonical: 'https://clubbeans.com/urun' },
};

export default function UrunPage() {
  return (
    <>
      <Nav />
      <main>
        <SubPageHeader
          kicker="Ürün"
          title="ClubBeans'i içeriden gör."
          subtitle="Dört ana ekran: yakındaki etkinlikleri (Bean) keşfet, haritada gör, ruh haline göre filtrele, katılmadan önce kimin geleceğini öğren. Algoritma yerine senin filtrelerin."
        />
        <Showcase />
        <SubPageCTA
          source="urun"
          headline="Uygulamayı ilk sen dene."
          subtitle="Lansman günü App Store + Google Play. Listedekilerin davet kodu erken gelir."
        />
      </main>
      <FooterLegal />
      <StickyCTA />
    </>
  );
}
