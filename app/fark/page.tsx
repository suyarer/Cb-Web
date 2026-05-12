import Compare from '@/components/Compare';
import FooterLegal from '@/components/FooterLegal';
import Nav from '@/components/Nav';
import StickyCTA from '@/components/StickyCTA';
import SubPageCTA from '@/components/subpage/SubPageCTA';
import SubPageHeader from '@/components/subpage/SubPageHeader';
import ViewContentTracker from '@/components/ViewContentTracker';
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
      <ViewContentTracker
        contentName="fark"
        contentCategory="comparing-alternatives"
      />
      <Nav />
      <main>
        <SubPageHeader
          kicker="ClubBeans vs. diğerleri"
          title="Neden başka bir app değil."
          subtitle="Abonelikli akşam yemeği uygulamaları, global meetup platformları, flört odaklı IRL app'leri — beşikleri ayrı. ClubBeans'in onlardan ayrıştığı 5 kritik alan."
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
