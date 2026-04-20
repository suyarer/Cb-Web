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
  title: 'ClubBeans — Algoritma değil, sen seç.',
  description:
    'Etkinlik odaklı anti-platform topluluk. Yakınındaki Bean\'leri keşfedersin, ruhuna uyan tribe\'lara Jump In edersin. Algoritma yok, takip yok, veri satışı yok. 2026 Q2\'de App Store ve Google Play\'de.',
  metadataBase: new URL('https://clubbeans.com'),
  keywords: [
    'etkinlik',
    'topluluk',
    'Bean',
    'Tribe',
    'Jump In',
    'Vibe',
    'Signal',
    'radar',
    'anti-platform',
    'kulüp',
    'meetup',
    'İstanbul etkinlik',
  ],
  authors: [{ name: 'ClubBeans' }],
  openGraph: {
    title: 'ClubBeans — Algoritma değil, sen seç.',
    description: 'Etkinlik odaklı anti-platform topluluk. Radar, tribe, Jump In.',
    url: 'https://clubbeans.com',
    siteName: 'ClubBeans',
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ClubBeans — Algoritma değil, sen seç.',
    description: 'Etkinlik odaklı anti-platform topluluk.',
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
