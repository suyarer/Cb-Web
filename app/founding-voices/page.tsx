import FooterLegal from '@/components/FooterLegal';
import Nav from '@/components/Nav';
import StickyCTA from '@/components/StickyCTA';
import SubPageCTA from '@/components/subpage/SubPageCTA';
import SubPageHeader from '@/components/subpage/SubPageHeader';
import ViewContentTracker from '@/components/ViewContentTracker';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Founding Voices — ClubBeans',
  description:
    'ClubBeans\'in ilk 10 sesi. Kendi alanlarında gerçek bir topluluk kurmuş kişiler. Para tabanlı bir affiliate değil — kapalı bir ortaklık.',
  openGraph: {
    title: 'Founding Voices — ClubBeans',
    description:
      'On ses. Bir manifesto. Anti-platform topluluğun ilk kurucuları.',
    url: 'https://clubbeans.com/founding-voices',
  },
  alternates: { canonical: 'https://clubbeans.com/founding-voices' },
};

export default function FoundingVoicesPage() {
  return (
    <>
      <ViewContentTracker
        contentName="founding-voices"
        contentCategory="founder-program"
      />
      <Nav />
      <main>
        <SubPageHeader
          kicker="Founding Voices"
          title="On ses. Bir manifesto."
          subtitle="ClubBeans'in pre-launch döneminde inşasına söz sahibi olan 10 kişi. Kendi alanlarında gerçek bir topluluk kurmuş kişiler. Para tabanlı bir affiliate değil — kapalı bir ortaklık."
        />

        <section className="mx-auto max-w-3xl px-6 py-12 md:py-16">
          <div className="prose prose-invert prose-lg max-w-none">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">
              Bu program ne değildir
            </h2>
            <ul className="space-y-2 text-zinc-300 mb-12">
              <li>Affiliate programı değil — kayıt başına ücret yok</li>
              <li>Influencer kampanyası değil — paid post talep etmiyoruz</li>
              <li>Brand ambassador yapısı değil — sponsorlu hashtag yok</li>
              <li>Lead farming değil — quantity hedefi yok</li>
            </ul>

            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">
              Nedir
            </h2>
            <p className="text-zinc-300 mb-4">
              Anti-platform bir ürünün anti-platform şekilde lansmanı.
            </p>
            <p className="text-zinc-300 mb-12">
              On kişi seçiyoruz. Onlara ürünün hem alıcısı hem yol göstericisi
              olma fırsatı sunuyoruz. Lansmandan önce, sırasında ve sonrasında
              ClubBeans&apos;in nasıl şekilleneceğine söz hakkı veriyoruz.
            </p>

            <p className="text-zinc-300 mb-12">
              Karşılığında onlardan kendi seslerini, kendi audience&apos;larını,
              kendi ortak gerçekliklerini istiyoruz — sponsorlu değil, organic.
              Bir arkadaşa yeni keşfettiğin bir yerden bahsetmek gibi.
            </p>

            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">
              Founding Voices&apos;lara sunulan
            </h2>

            <h3 className="text-xl font-semibold mb-3 text-acid">Statü</h3>
            <ul className="space-y-1 text-zinc-300 mb-6">
              <li>&quot;Founding Voice @ ClubBeans&quot; rozeti</li>
              <li>Bu sayfada profil — foto + bio</li>
              <li>Press kit&apos;te isim mention</li>
              <li>30 Mayıs lansman event&apos;inde sahne anonsu</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-acid">Erişim</h3>
            <ul className="space-y-1 text-zinc-300 mb-6">
              <li>Kurucu ile aylık 1:1 Zoom (ilk 3 ay)</li>
              <li>10 kişilik private grup</li>
              <li>Beta erişim — uygulama canlı olmadan önce</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-acid">Ürün</h3>
            <ul className="space-y-1 text-zinc-300 mb-6">
              <li>Lifetime ClubBeans Pro üyelik</li>
              <li>Kendi kulübünü kurma önceliği</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-acid">Gelecek</h3>
            <ul className="space-y-1 text-zinc-300 mb-12">
              <li>Q1 2027 advisory board oluşumunda ilk teklif</li>
            </ul>

            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">
              Beklediğimiz
            </h2>
            <ul className="space-y-2 text-zinc-300 mb-12">
              <li>17-29 Mayıs arasında kendi sesinle, kendi kanalında bir paylaşım</li>
              <li>30 Mayıs lansman event&apos;inde fiziksel varlık</li>
              <li>Private grupta haftalık etkileşim</li>
              <li>Lansman sonrası kendi topluluğunu ClubBeans&apos;e taşımayı değerlendirmek</li>
            </ul>

            <div className="rounded-2xl border border-acid/30 bg-acid/[0.06] p-6 md:p-8 mb-12">
              <h3 className="text-xl font-bold mb-3 text-acid">Kapalı çağrı</h3>
              <p className="text-zinc-300 mb-2">
                Founding Voices programı <strong>davetiye ile</strong> alınır.
                Başvuru kabul edilmez.
              </p>
              <p className="text-zinc-300">
                On kişiyi Selahattin (kurucu) kişisel olarak değerlendirir.
                Adaylar program çağrısına yanıt verirler.
              </p>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">
              Mevcut Founding Voices
            </h2>
            <p className="text-zinc-400 italic mb-12">
              On isim 22 Mayıs 2026 itibarıyla bu sayfada açıklanacak.
              Davetler 13-17 Mayıs arasında iletilmektedir.
            </p>
          </div>
        </section>

        <SubPageCTA
          source="founding-voices"
          headline="Sen de listede miydin?"
          subtitle="Bu sayfa davet alanlar için bir hatırlatma. Sen değilsen — lansman listesi yine açık. 30 Mayıs Cumartesi Moda'da masaya otur."
        />
      </main>
      <FooterLegal />
      <StickyCTA />
    </>
  );
}
