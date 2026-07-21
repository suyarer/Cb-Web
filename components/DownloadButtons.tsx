'use client';

import { motion } from '@/lib/motion';
import { APP_STORE_URL, PLAY_STORE_URL } from '@/lib/appLinks';
import { trackDownloadClick } from '@/lib/metaPixel';
import { trackEvent } from '@/lib/posthog';

/**
 * DownloadButtons — App Store + Google Play indirme modülü.
 *
 * App CANLI olduğundan sitenin BİRİNCİL CTA'sı. Tıklama:
 * - Meta Pixel `AppDownloadClick` (yüksek-niyet lookalike tohumu)
 * - PostHog `app_download_click`
 *
 * @governing_law clubbeans-privacy-v1
 */

interface Props {
  /** Pixel/analytics kaynağı: 'hero' | 'launch' | 'nav' vb. */
  source?: string;
  /** Ortalanmış mı (Launch bölümü) yoksa sola yaslı mı (hero) */
  align?: 'start' | 'center';
  className?: string;
}

export default function DownloadButtons({
  source = 'hero',
  align = 'start',
  className = '',
}: Props) {
  const handleClick = (platform: 'ios' | 'android') => {
    trackDownloadClick(platform, source);
    trackEvent('app_download_click', { platform, source });
  };

  return (
    <div
      className={`flex flex-col sm:flex-row gap-3 ${
        align === 'center' ? 'items-stretch sm:justify-center' : 'items-stretch'
      } ${className}`}
    >
      <StoreButton
        platform="apple"
        href={APP_STORE_URL}
        onClick={() => handleClick('ios')}
      />
      <StoreButton
        platform="google"
        href={PLAY_STORE_URL}
        onClick={() => handleClick('android')}
      />
    </div>
  );
}

function StoreButton({
  platform,
  href,
  onClick,
}: {
  platform: 'apple' | 'google';
  href: string;
  onClick: () => void;
}) {
  const isApple = platform === 'apple';
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      aria-label={`${isApple ? 'App Store' : 'Google Play'}'den indir`}
      className="group flex items-center gap-3 bg-white hover:bg-white rounded-2xl pl-5 pr-6 py-3.5 no-underline shadow-[0_8px_30px_rgba(0,0,0,0.35)] hover:shadow-[0_14px_44px_rgba(168,230,0,0.25)] transition-shadow duration-300 ring-1 ring-black/5"
    >
      <span className="flex-shrink-0 text-midnight">
        {isApple ? (
          <svg viewBox="0 0 24 24" className="w-7 h-7" fill="currentColor" aria-hidden>
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="w-7 h-7" aria-hidden>
            <path fill="#00D2FF" d="M3.1 2.6c-.3.3-.4.7-.4 1.3v16.2c0 .6.1 1 .4 1.3l.1.1L12 12.1v-.2L3.2 2.5l-.1.1z" />
            <path fill="#00F076" d="M14.8 9 3.2 2.5c-.3-.1-.6-.1-.9 0l9.7 9.6L14.8 9z" />
            <path fill="#FFD800" d="m14.8 9-2.8 3 2.8 3 3.8-2.2c1-.6 1-1.6 0-2.2L14.8 9z" />
            <path fill="#FF3A44" d="m12 12.1-9.7 9.6c.3.2.7.2 1 0L15 15l-3-2.9z" />
          </svg>
        )}
      </span>
      <span className="text-left leading-tight">
        <span className="block text-[10px] font-semibold uppercase tracking-wider text-midnight/55">
          {isApple ? "App Store'dan" : "Google Play'den"}
        </span>
        <span className="block text-[15px] font-bold text-midnight">
          İndir
        </span>
      </span>
    </motion.a>
  );
}
