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
  title: 'ClubBeans — Etkinlik odaklı anti-platform topluluk',
  description:
    'Algoritma değil, sen seç. Yakınındaki Bean\'leri keşfet, vibe\'ına uyan tribe\'lara Jump In et. Yakında App Store ve Google Play\'de.',
  metadataBase: new URL('https://clubbeans.com'),
  keywords: ['etkinlik', 'topluluk', 'Bean', 'Tribe', 'vibe', 'radar', 'anti-platform'],
  authors: [{ name: 'ClubBeans' }],
  openGraph: {
    title: 'ClubBeans',
    description: 'Etkinlik odaklı anti-platform topluluk.',
    url: 'https://clubbeans.com',
    siteName: 'ClubBeans',
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ClubBeans',
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
