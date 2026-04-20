import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ClubBeans — Ekran süresi değil, yaşam süresi.',
  description:
    'ClubBeans bir anti-platformdur: seni ekranda tutmak için değil, sokağa çıkarmak için çalışır. Yakınındaki Beans\'leri keşfet, ruhuna uyan Clubs\'a Jump In et, kendi Club\'ını dakikalar içinde kur. Sosyal Obezite\'ye karşı, TrustScore ile curated network.',
  metadataBase: new URL('https://clubbeans.com'),
  keywords: [
    'ClubBeans',
    'anti-platform',
    'Beans',
    'Clubs',
    'TrustScore',
    'Compass Mode',
    'Jump In',
    'Signal',
    'Vibe',
    'Radar',
    'curated network',
    'sosyal obezite',
    'yerel etkinlik',
    'kulüp kurma',
    'topluluk uygulaması',
    'girişimci buluşma',
    'freelancer network',
    'İstanbul meetup',
    'Timeleft alternatifi',
    'Meetup Türkiye',
    'yerel topluluk',
    'hyperlocal etkinlik',
  ],
  authors: [{ name: 'ClubBeans' }],
  openGraph: {
    title: 'ClubBeans — Ekran süresi değil, yaşam süresi.',
    description:
      'Anti-platform topluluk. Yakında Bul, Birlikte Yap, Kolay Kur. Sosyal Obezite\'ye karşı dalgakıran.',
    url: 'https://clubbeans.com',
    siteName: 'ClubBeans',
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ClubBeans — Ekran süresi değil, yaşam süresi.',
    description: 'Anti-platform topluluk. Yakında Bul, Birlikte Yap, Kolay Kur.',
  },
  robots: { index: true, follow: true },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#050505',
  width: 'device-width',
  initialScale: 1,
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://clubbeans.com/#org',
      name: 'ClubBeans',
      url: 'https://clubbeans.com',
      logo: 'https://clubbeans.com/icon.svg',
      description:
        'Anti-platform topluluk uygulaması. Yakındaki fiziksel buluşmaları (Beans) keşfet, kendi Club\'ını dakikalar içinde kur.',
      slogan: 'Ekran süresi değil, yaşam süresi.',
    },
    {
      '@type': 'SoftwareApplication',
      '@id': 'https://clubbeans.com/#app',
      name: 'ClubBeans',
      operatingSystem: 'iOS, Android',
      applicationCategory: 'SocialNetworkingApplication',
      description:
        'ClubBeans, şehrinde yakında olan fiziksel buluşmaları (Beans) keşfetmeni ve kendi Club\'ını kurmanı sağlar. TrustScore ile curated network.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'TRY' },
      publisher: { '@id': 'https://clubbeans.com/#org' },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://clubbeans.com/#web',
      url: 'https://clubbeans.com',
      name: 'ClubBeans',
      inLanguage: 'tr-TR',
      publisher: { '@id': 'https://clubbeans.com/#org' },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${inter.variable} ${jetbrains.variable}`}>
      <body>
        <div className="grain-overlay" aria-hidden />
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
