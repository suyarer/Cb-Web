/**
 * @route /club/[id]
 * @governing_law KULUP_ANAYASASI, KVKK_ANAYASASI K6, PLATFORM_ANAYASASI
 *
 * Public kulüp detay sayfası — mobile share link landing.
 * RLS gate: is_active=true. Inactive club → 404.
 *
 * Sprint: share-2-alpha-web Commit 8
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchClubPublic } from '@/lib/supabase/club';
import { SmartRedirect } from '@/components/SmartRedirect';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const club = await fetchClubPublic(id);

  if (!club) {
    return {
      title: 'Kulüp bulunamadı — ClubBeans',
      robots: { index: false, follow: false },
    };
  }

  const description =
    club.description?.slice(0, 160) ??
    `${club.name} kulübü ve etkinliklerini ClubBeans'te keşfet.`;

  return {
    title: `${club.name} — ClubBeans`,
    description,
    openGraph: {
      title: club.name,
      description,
      url: `https://www.clubbeans.com/club/${id}`,
      siteName: 'ClubBeans',
      images: [
        {
          url: `/club/${id}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: club.name,
        },
      ],
      type: 'website',
      locale: 'tr_TR',
    },
    twitter: {
      card: 'summary_large_image',
      title: club.name,
      description,
    },
  };
}

export default async function ClubPage({ params }: Props) {
  const { id } = await params;
  const club = await fetchClubPublic(id);

  if (!club) notFound();

  const deepLink = `clubbeans://club/${id}`;

  return (
    <main className="min-h-screen bg-midnight text-white px-6 py-12">
      <SmartRedirect deepLink={deepLink} />

      <div className="max-w-2xl mx-auto">
        <div className="text-acid font-mono text-xs uppercase tracking-widest mb-6">
          Kulüp · ClubBeans
        </div>

        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
          {club.name}
        </h1>

        {club.description && (
          <p className="text-zinc-300 text-lg leading-relaxed mb-8">
            {club.description}
          </p>
        )}

        {club.member_count !== null && club.member_count > 0 && (
          <p className="text-zinc-400 mb-12">
            👥 {club.member_count.toLocaleString('tr-TR')} üye
          </p>
        )}

        <a
          href={deepLink}
          className="inline-block bg-acid text-midnight font-bold px-8 py-4 rounded-full no-underline hover:bg-acid-400 transition"
        >
          Uygulamada Aç →
        </a>

        <div className="mt-12 text-center text-zinc-500 text-sm">
          <a
            href="https://apps.apple.com/app/clubbeans/id6762319190"
            className="underline mr-4"
          >
            App Store
          </a>
          <a
            href="https://play.google.com/store/apps/details?id=com.clubbeans.app"
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
