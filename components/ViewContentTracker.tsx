'use client';

import { sendCapi, trackViewContent } from '@/lib/metaPixel';
import { useEffect } from 'react';

/**
 * ViewContent — yüksek niyetli sayfa girişlerini Meta Pixel + CAPI'ye
 * "ViewContent" olayı olarak bildirir.
 *
 * Standart PageView default Pixel script ile zaten gönderilir;
 * bu component sadece high-intent sayfalar (örn. /yol-haritasi,
 * /destek, /lansman-event) için ekstra sinyal verir. Custom Audience
 * "yol-haritasi okuyucuları" segmentasyonu yapılabilmesini sağlar.
 *
 * Pixel + CAPI çift kanal gönderim — iOS 17+ ATT etkisini telafi.
 *
 * @governing_law clubbeans-privacy-v1
 */
export default function ViewContentTracker({
  contentName,
  contentCategory = 'page',
  contentType = 'page',
}: {
  contentName: string;
  contentCategory?: string;
  contentType?: string;
}) {
  useEffect(() => {
    const eventId = trackViewContent({ contentName, contentCategory, contentType });
    if (eventId) {
      void sendCapi({
        eventName: 'ViewContent',
        eventId,
        customData: {
          content_name: contentName,
          content_category: contentCategory,
          content_type: contentType,
        },
      });
    }
  }, [contentName, contentCategory, contentType]);

  return null;
}
