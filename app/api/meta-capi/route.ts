/**
 * POST /api/meta-capi
 *
 * Client-side'dan tetiklenen Pixel olaylarına paralel olarak,
 * sunucudan Meta Conversion API'ye event gönderir.
 *
 * Aynı event_id ile çift kanal — Meta otomatik dedupe yapar.
 *
 * @governing_law clubbeans-privacy-v1
 */

import {
  type CapiEventInput,
  extractUserDataFromRequest,
  sendCapiEvent,
} from '@/lib/metaCapi';
import { type NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type ClientPayload = {
  eventName: 'Lead' | 'ViewContent' | 'PageView' | 'Subscribe';
  eventId: string;
  eventSourceUrl: string;
  email?: string;
  customData?: CapiEventInput['customData'];
};

export async function POST(req: NextRequest) {
  try {
    const payload = (await req.json()) as ClientPayload;

    // Temel doğrulama
    if (!payload?.eventName || !payload?.eventId || !payload?.eventSourceUrl) {
      return NextResponse.json(
        { ok: false, error: 'eventName, eventId, eventSourceUrl zorunlu' },
        { status: 400 },
      );
    }

    // Server tarafında otomatik çıkarılan kullanıcı verisi
    const headerUserData = extractUserDataFromRequest(req);

    const result = await sendCapiEvent({
      eventName: payload.eventName,
      eventId: payload.eventId,
      eventSourceUrl: payload.eventSourceUrl,
      actionSource: 'website',
      userData: {
        email: payload.email,
        ...headerUserData,
      },
      customData: payload.customData,
    });

    if (!result.success) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      eventsReceived: result.eventsReceived,
    });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: errMsg }, { status: 500 });
  }
}
