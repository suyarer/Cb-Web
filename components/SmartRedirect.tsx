'use client';

/**
 * @component SmartRedirect
 * @governing_law NAVIGASYON_ANAYASASI, PLATFORM_ANAYASASI
 *
 * Mobile cihaz tespit → clubbeans:// deep link denemesi → 2s timeout
 * fallback App Store / Play Store. Desktop'ta hiçbir şey yapmaz (SSR fallback HTML).
 *
 * In-app browser (Instagram/Twitter WKWebView) Universal Link tetiklemez —
 * "Open in App" manuel button SSR HTML'de ayrıca render edilmeli.
 *
 * Sprint: share-2-alpha-web Commit 6
 */

import { useEffect, useRef } from 'react';

interface Props {
  deepLink: string;
  appStoreUrl?: string;
  playStoreUrl?: string;
}

const DEFAULT_APP_STORE = 'https://apps.apple.com/app/clubbeans/id6762319190';
const DEFAULT_PLAY_STORE =
  'https://play.google.com/store/apps/details?id=com.clubbeans.app';

export function SmartRedirect({
  deepLink,
  appStoreUrl = DEFAULT_APP_STORE,
  playStoreUrl = DEFAULT_PLAY_STORE,
}: Props) {
  const triggered = useRef(false);

  useEffect(() => {
    if (triggered.current) return;
    triggered.current = true;

    const ua = navigator.userAgent;
    const isIOS = /iPhone|iPad|iPod/.test(ua);
    const isAndroid = /Android/.test(ua);

    if (!isIOS && !isAndroid) return;

    const start = Date.now();

    // Try deep link
    window.location.href = deepLink;

    // Fallback if app not installed (2s window)
    const timer = setTimeout(() => {
      const elapsed = Date.now() - start;
      if (elapsed < 2500) {
        window.location.href = isIOS ? appStoreUrl : playStoreUrl;
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [deepLink, appStoreUrl, playStoreUrl]);

  return null;
}
