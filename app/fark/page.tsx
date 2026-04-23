import Compare from '@/components/Compare';
import FooterLegal from '@/components/FooterLegal';
import Nav from '@/components/Nav';
import StickyCTA from '@/components/StickyCTA';
import SubPageCTA from '@/components/subpage/SubPageCTA';
import SubPageHeader from '@/components/subpage/SubPageHeader';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Fark — ClubBeans vs. Diğerleri',
  description:
    'ClubBeans hangi alanlarda rakiplerinden ayrışıyor? Ücretsizlik, TrustScore, hiperlokal keşif, Türkiye odağı — beş kritik fark.',
  openGraph: {
    title: 'Fark — ClubBeans vs. Diğerleri',
    description:
      'Ücretsiz. TrustScore. Algoritma dayatmasız. Türkiye için tasarlandı.',
    url: 'https://clubbeans.com/fark',
  },
  alternates: { canonical: 'https://clubbeans.com/fark' },
};

export default function FarkPage() {
  return (
    <>
      <Nav />
      <main>
        <SubPageHeader
          kicker="Neden başka bir uygulama değil?"
          title="Yok, yok. Aynı raf değiliz."
          subtitle="Batılı abonelik modelleri, global meetup platformları, flört odaklı IRL — beşikleri ayrı. ClubBeans hangi beş kritik alanda onlardan uzağa oturuyor."
        />
        <Compare />
        <SubPageCTA
          source="fark"
          headline="Farkı gördün. Sırada sen varsın."
          subtitle="Lansman listesine katıl — aynı rafta olmayanların arasına."
        />
      </main>
      <FooterLegal />
      <StickyCTA />
    </>
  );
}
