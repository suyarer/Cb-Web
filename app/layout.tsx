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
    'Jump In',
    'Signal',
    'Vibe',
    'Radar',
    'sosyal obezite',
    'yerel etkinlik',
    'kulüp kurma',
    'topluluk uygulaması',
    'girişimci buluşma',
    'freelancer network',
    'İstanbul meetup',
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${inter.variable} ${jetbrains.variable}`}>
      <body>
        <div className="grain-overlay" aria-hidden />
        {children}
      </body>
    </html>
  );
}
