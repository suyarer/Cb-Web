'use client';

import { trackViewContent } from '@/lib/metaPixel';
import { useEffect } from 'react';

/**
 * ViewContent — yüksek niyetli sayfa girişlerini Meta Pixel'e
 * "ViewContent" olayı olarak bildirir.
 *
 * Standart PageView default Pixel script ile zaten gönderilir;
 * bu component sadece high-intent sayfalar (örn. /yol-haritasi,
 * /destek, /lansman-event) için ekstra sinyal verir. Custom Audience
 * "yol-haritasi okuyucuları" segmentasyonu yapılabilmesini sağlar.
 *
 * @governing_law clubbeans-privacy-v1
 */
export default function ViewContentTracker({
  contentName,
  contentCategory = 'page',
}: {
  contentName: string;
  contentCategory?: string;
}) {
  useEffect(() => {
    trackViewContent({ contentName, contentCategory });
  }, [contentName, contentCategory]);

  return null;
}
