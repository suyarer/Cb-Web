import ClientExtras from '@/components/ClientExtras';
import { CompassProvider } from '@/components/compass/CompassContext';
import CompassTint from '@/components/compass/CompassTint';
import CookieConsent from '@/components/CookieConsent';
import CosyMode from '@/components/CosyMode';
import { FAQS } from '@/lib/faqs';
import GutterSprout from '@/components/GutterSprout';
import LiveTicker from '@/components/LiveTicker';
import MetaPixel from '@/components/MetaPixel';
import ScrollRoots from '@/components/ScrollRoots';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
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
    'ClubBeans bir anti-platformdur. Seni ekranda tutmak için değil, masaya çağırmak için çalışır. Yakındaki etkinliklere katıl ya da kendi etkinliğini bir dakikada kur. Algoritma yok, sonsuz feed yok, bildirim yağmuru yok. 29 Mayıs 2026 İstanbul lansman.',
  metadataBase: new URL('https://clubbeans.com'),
  keywords: [
    'ClubBeans',
    'anti-platform',
    'Beans',
    'Clubs',
    'TrustScore',
    'Compass Mode',
    'Katıl',
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
      'Anti-platform topluluk. Cumartesi akşamlarını geri al. Yakında Bul, Birlikte Yap, Kolay Kur.',
    url: 'https://clubbeans.com',
    siteName: 'ClubBeans',
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ClubBeans — Ekran süresi değil, yaşam süresi.',
    description:
      'Anti-platform topluluk. Cumartesi akşamlarını geri al. Yakında Bul, Birlikte Yap, Kolay Kur.',
  },
  robots: { index: true, follow: true },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/icon.svg',
  },
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
        'ClubBeans, şehrinde yakında olan fiziksel etkinliklere katılmanı ve kendi etkinliğini bir dakikada kurmanı sağlar. Anti-platform: algoritma değil sen seçersin.',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'TRY' },
      publisher: { '@id': 'https://clubbeans.com/#org' },
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://clubbeans.com/#faq',
      mainEntity: FAQS.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.a,
        },
      })),
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
        <CompassProvider>
          <CosyMode />
          <div className="grain-overlay" aria-hidden />
          <CompassTint />
          <ScrollRoots />
          <GutterSprout />
          {children}
          <LiveTicker />
          <ClientExtras />
          <CookieConsent />
        </CompassProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Analytics />
        <SpeedInsights />
        <MetaPixel />
      </body>
    </html>
  );
}
