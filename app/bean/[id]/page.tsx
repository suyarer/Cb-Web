/**
 * @route /bean/[id]
 * @governing_law BEAN_ANAYASASI, KVKK_ANAYASASI K6, PLATFORM_ANAYASASI
 *
 * Public bean detay sayfası — mobile share link landing.
 * RLS gate: is_public=true. Private bean → 404 (notFound).
 * SmartRedirect mobile cihazlarda deep link denemesi yapar.
 *
 * Sprint: share-2-alpha-web Commit 7
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchBeanPublic } from '@/lib/supabase/bean';
import { SmartRedirect } from '@/components/SmartRedirect';
import { kampanyaTemiz, magazaLinki } from '@/lib/appLinks';

interface Props {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const bean = await fetchBeanPublic(id);

  if (!bean) {
    return {
      title: 'Etkinlik bulunamadı — ClubBeans',
      robots: { index: false, follow: false },
    };
  }

  const description =
    bean.description?.slice(0, 160) ??
    `${bean.venue_name ? `${bean.venue_name}'da ` : ''}etkinlik. ClubBeans'te keşfet.`;

  return {
    title: `${bean.title} — ClubBeans`,
    description,
    openGraph: {
      title: bean.title,
      description,
      url: `https://www.clubbeans.com/bean/${id}`,
      siteName: 'ClubBeans',
      images: [
        {
          url: `/bean/${id}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: bean.title,
        },
      ],
      type: 'website',
      locale: 'tr_TR',
    },
    twitter: {
      card: 'summary_large_image',
      title: bean.title,
      description,
    },
  };
}

export default async function BeanPage({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = (await searchParams) ?? {};
  const bean = await fetchBeanPublic(id);

  if (!bean) notFound();

  // Mağaza linkleri kampanya etiketli (2026-09-29): reklam utm_campaign'i ya da masa kimliği → App Store ct / Play referrer
  const kampanya = kampanyaTemiz(sp.utm_campaign, `masa_${id.slice(0, 8)}`);
  const ortam = sp.utm_source ? 'reklam' : 'web';

  const deepLink = `clubbeans://bean/${id}`;

  return (
    <main className="min-h-screen bg-midnight text-white px-6 py-12">
      <SmartRedirect deepLink={deepLink} />

      <div className="max-w-2xl mx-auto">
        <div className="text-acid font-mono text-xs uppercase tracking-widest mb-6">
          Etkinlik · ClubBeans
        </div>

        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
          {bean.title}
        </h1>

        {bean.description && (
          <p className="text-zinc-300 text-lg leading-relaxed mb-8">
            {bean.description}
          </p>
        )}

        {bean.venue_name && (
          <p className="text-zinc-400 mb-3">📍 {bean.venue_name}</p>
        )}

        <p className="text-zinc-400 mb-12">
          🕒 {new Date(bean.start_time).toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul', dateStyle: 'long', timeStyle: 'short' })}
        </p>

        {/* Manuel "Open in App" — in-app browser fallback */}
        <a
          href={deepLink}
          className="inline-block bg-acid text-midnight font-bold px-8 py-4 rounded-full no-underline hover:bg-acid-400 transition"
        >
          Uygulamada Aç →
        </a>

        <div className="mt-12 text-center text-zinc-500 text-sm">
          <a
            href={magazaLinki('ios', kampanya, ortam)}
            className="underline mr-4"
          >
            App Store
          </a>
          <a
            href={magazaLinki('android', kampanya, ortam)}
            className="underline"
          >
            Google Play
          </a>
        </div>
      </div>
    </main>
  );
}

export const dynamic = 'force-dynamic';
export const revalidate = 60;
