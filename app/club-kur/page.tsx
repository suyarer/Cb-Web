import FooterLegal from '@/components/FooterLegal';
import ForHosts from '@/components/ForHosts';
import Nav from '@/components/Nav';
import StickyCTA from '@/components/StickyCTA';
import SubPageCTA from '@/components/subpage/SubPageCTA';
import SubPageHeader from '@/components/subpage/SubPageHeader';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Club Aç — Kurucular için ClubBeans',
  description:
    'Kendi kulübünü bir dakikada kur. Bean aç, kabileni yönet, masana kim oturur sen seç. WhatsApp grup, Instagram, Eventbrite karmaşası son bulsun.',
  openGraph: {
    title: 'Club Aç — Kurucular için ClubBeans',
    description:
      'Topluluğunu tek ekranda yönet. Ücretsiz, komisyonsuz, sürtünmesiz.',
    url: 'https://clubbeans.com/club-kur',
  },
  alternates: { canonical: 'https://clubbeans.com/club-kur' },
};

export default function ClubKurPage() {
  return (
    <>
      <Nav />
      <main>
        <SubPageHeader
          kicker="Club kurucular için"
          title="Masaya oturmak kadar, masayı kurmak da kolay."
          subtitle="Topluluk yönetmenin dağıtıcı yüzüne son. ClubBeans tek ekranda açar, davet eder, korur — artık yorucu bir proje değil, kurucu bir iş."
        />
        <ForHosts />
        <SubPageCTA
          source="club-kur"
          headline="Kulübünü kurmak istiyorsan önce sen haberdar ol."
          subtitle="Beta'da kurucular için özel erişim. Lansman günü Club'ın yayında."
        />
      </main>
      <FooterLegal />
      <StickyCTA />
    </>
  );
}
