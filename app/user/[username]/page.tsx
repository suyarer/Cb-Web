/**
 * @route /user/[username]
 * @governing_law KULLANICI_ANAYASASI M21, KVKK_ANAYASASI K6, PLATFORM_ANAYASASI
 *
 * Public Bean profili sayfası — mobile share link landing.
 * RLS gate (Sprint 5'e kadar defense-in-depth): is_private=false + is_deleted=false.
 * Column allowlist PII leak engelle (birth_date, location vb. YOK).
 *
 * Sprint: share-2-alpha-web Commit 9
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchUserPublic } from '@/lib/supabase/user';
import { SmartRedirect } from '@/components/SmartRedirect';

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const user = await fetchUserPublic(username);

  if (!user) {
    return {
      title: 'Bean bulunamadı — ClubBeans',
      robots: { index: false, follow: false },
    };
  }

  const description =
    user.bio?.slice(0, 160) ?? `@${user.username} ClubBeans'ta.`;

  return {
    title: `@${user.username} — ClubBeans`,
    description,
    openGraph: {
      title: `@${user.username}`,
      description,
      url: `https://www.clubbeans.com/user/${user.username}`,
      siteName: 'ClubBeans',
      images: [
        {
          url: `/user/${user.username}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: `@${user.username}`,
        },
      ],
      type: 'profile',
      locale: 'tr_TR',
    },
    twitter: {
      card: 'summary_large_image',
      title: `@${user.username}`,
      description,
    },
  };
}

export default async function UserPage({ params }: Props) {
  const { username } = await params;
  const user = await fetchUserPublic(username);

  if (!user) notFound();

  const deepLink = `clubbeans://user/${user.username}`;

  return (
    <main className="min-h-screen bg-midnight text-white px-6 py-12">
      <SmartRedirect deepLink={deepLink} />

      <div className="max-w-2xl mx-auto">
        <div className="text-acid font-mono text-xs uppercase tracking-widest mb-6">
          Bean Profili · ClubBeans
        </div>

        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-2">
          @{user.username}
        </h1>

        {user.is_verified && (
          <div className="text-acid text-sm mb-4">✓ Doğrulanmış Bean</div>
        )}

        {user.bio && (
          <p className="text-zinc-300 text-lg leading-relaxed mb-8">
            {user.bio}
          </p>
        )}

        {user.trust_score !== null && user.trust_score >= 50 && (
          <p className="text-zinc-400 mb-12">
            🌱 Trust Score: {user.trust_score}
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
export const revalidate = 300;
