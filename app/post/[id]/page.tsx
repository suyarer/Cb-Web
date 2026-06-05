/**
 * @route /post/[id]
 * @governing_law KULLANICI_ANAYASASI M21, KVKK_ANAYASASI K6, PLATFORM_ANAYASASI
 *
 * Public post detay sayfası — mobile share link landing.
 * RLS gate: posts_privacy_select karmaşık (private/follow/club/blok) +
 * cb-web defense-in-depth: author profile is_private=false + is_deleted=false.
 *
 * Sprint: share-2-alpha-web Commit 10
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchPostPublic } from '@/lib/supabase/post';
import { SmartRedirect } from '@/components/SmartRedirect';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = await fetchPostPublic(id);

  if (!post) {
    return {
      title: 'Post bulunamadı — ClubBeans',
      robots: { index: false, follow: false },
    };
  }

  const description =
    post.caption?.slice(0, 160) ??
    `@${post.author?.username ?? 'Bean'} ClubBeans'ta paylaştı.`;

  return {
    title: `@${post.author?.username ?? 'Bean'} — ClubBeans`,
    description,
    openGraph: {
      title: post.caption?.slice(0, 80) ?? 'ClubBeans paylaşımı',
      description,
      url: `https://www.clubbeans.com/post/${id}`,
      siteName: 'ClubBeans',
      images: [
        {
          url: `/post/${id}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: post.caption?.slice(0, 80) ?? 'ClubBeans paylaşımı',
        },
      ],
      type: 'article',
      locale: 'tr_TR',
    },
    twitter: {
      card: 'summary_large_image',
      title: post.caption?.slice(0, 80) ?? 'ClubBeans paylaşımı',
      description,
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { id } = await params;
  const post = await fetchPostPublic(id);

  if (!post) notFound();

  const deepLink = `clubbeans://post/${id}`;

  return (
    <main className="min-h-screen bg-midnight text-white px-6 py-12">
      <SmartRedirect deepLink={deepLink} />

      <div className="max-w-2xl mx-auto">
        <div className="text-acid font-mono text-xs uppercase tracking-widest mb-6">
          Post · ClubBeans
        </div>

        {post.author && (
          <p className="text-zinc-300 text-lg mb-4">@{post.author.username}</p>
        )}

        {post.caption && (
          <p className="text-white text-2xl leading-relaxed mb-8">
            {post.caption}
          </p>
        )}

        <p className="text-zinc-500 text-sm mb-12">
          {new Date(post.created_at).toLocaleString('tr-TR')}
        </p>

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
