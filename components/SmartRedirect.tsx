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
import { APP_STORE_URL, PLAY_STORE_URL } from '@/lib/appLinks';

interface Props {
  deepLink: string;
  appStoreUrl?: string;
  playStoreUrl?: string;
}

export function SmartRedirect({
  deepLink,
  appStoreUrl = APP_STORE_URL,
  playStoreUrl = PLAY_STORE_URL,
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
