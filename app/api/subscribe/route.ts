import { NextRequest, NextResponse } from 'next/server';

// Basit in-memory store. Production'da Resend/Formspree/ConvertKit'e yönlendirilecek.
// (Vercel serverless yeniden mount'ta sıfırlanır — geçici çözüm; kalıcı için KV/Postgres/servis.)
const subscribers = new Set<string>();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
    const source = typeof body?.source === 'string' ? body.source.slice(0, 32) : 'unknown';

    // Temel doğrulama
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ ok: false, error: 'Geçersiz e-posta.' }, { status: 400 });
    }

    subscribers.add(email);

    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.log(`[subscribe] +${email} (source: ${source}) total: ${subscribers.size}`);
    }

    // Üretime geçince:
    // await fetch('https://api.resend.com/emails', {...})  veya
    // Formspree/ConvertKit webhook buraya.

    return NextResponse.json({
      ok: true,
      position: subscribers.size,
    });
  } catch {
    return NextResponse.json({ ok: false, error: 'Bir şey ters gitti.' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ count: subscribers.size });
}
