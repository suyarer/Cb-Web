import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';
import { SEQUENCE_MAILS } from '@/lib/emails/sequence';
import { MAIL_FROM, REPLY_TO, getResend } from '@/lib/resend';
import { signUnsubscribeToken } from '@/lib/unsubscribeToken';

/**
 * Günlük cron — 8-mail nurturing sequence.
 * Her abone için subscribe tarihini bakar, gün eşleşen mail'i gönderir.
 * Tekrar göndermeyi önlemek için subscriber:<email> hash'inde sent_<n>=ts saklar.
 */

const redis = Redis.fromEnv();
const SUBSCRIBERS_SET = 'subscribers';
const SUBSCRIBER_META = (email: string) => `subscriber:${email}`;

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export async function GET(req: NextRequest) {
  // Yetkilendirme
  const authHeader = req.headers.get('authorization');
  const expected = `Bearer ${process.env.CRON_SECRET}`;
  if (!process.env.CRON_SECRET) {
    return NextResponse.json({ ok: false, error: 'CRON_SECRET tanımlı değil.' }, { status: 500 });
  }
  if (authHeader !== expected) {
    return NextResponse.json({ ok: false, error: 'Yetkisiz.' }, { status: 401 });
  }

  const resend = getResend();
  if (!resend) {
    return NextResponse.json({ ok: false, error: 'Resend yapılandırılmamış.' }, { status: 500 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.clubbeans.com';
  const now = Date.now();

  const stats = {
    totalSubscribers: 0,
    mailsSent: 0,
    skippedAlreadySent: 0,
    skippedNotDue: 0,
    skippedUnsubscribed: 0,
    errors: 0,
    perMail: {} as Record<number, number>,
  };

  try {
    const emails = (await redis.smembers(SUBSCRIBERS_SET)) as string[];
    stats.totalSubscribers = emails.length;

    for (const email of emails) {
      try {
        const meta = (await redis.hgetall(SUBSCRIBER_META(email))) as Record<string, string | number> | null;
        if (!meta) continue;

        // Unsubscribed kontrol
        if (meta.unsubscribed_ts) {
          stats.skippedUnsubscribed++;
          continue;
        }

        const subscribeTs = typeof meta.ts === 'number' ? meta.ts : Number(meta.ts);
        if (!subscribeTs || isNaN(subscribeTs)) continue;

        const daysElapsed = Math.floor((now - subscribeTs) / ONE_DAY_MS);

        // Gönderilebilecek mail var mı? (en son uygun mail'i seç)
        // dayOffset <= daysElapsed olan en yüksek numaralı mail
        const eligible = SEQUENCE_MAILS.filter((m) => daysElapsed >= m.dayOffset);
        if (eligible.length === 0) {
          stats.skippedNotDue++;
          continue;
        }

        // En yeni eligible mail
        const candidate = eligible[eligible.length - 1];

        // Daha önce gönderildi mi?
        if (meta[`sent_${candidate.number}`]) {
          stats.skippedAlreadySent++;
          continue;
        }

        // Gönder
        const token = signUnsubscribeToken(email);
        const unsubscribeUrl = `${baseUrl}/api/unsubscribe?token=${token}`;
        const ctx = { email, unsubscribeUrl, baseUrl };

        await resend.emails.send({
          from: `${MAIL_FROM.name} <${MAIL_FROM.email}>`,
          to: email,
          replyTo: REPLY_TO,
          subject: candidate.subject,
          html: candidate.buildHtml(ctx),
          text: candidate.buildText(ctx),
          headers: {
            'List-Unsubscribe': `<${unsubscribeUrl}>, <mailto:${REPLY_TO}?subject=unsubscribe>`,
            'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
          },
        });

        // Send timestamp kaydet
        await redis.hset(SUBSCRIBER_META(email), {
          [`sent_${candidate.number}`]: now,
        });

        stats.mailsSent++;
        stats.perMail[candidate.number] = (stats.perMail[candidate.number] || 0) + 1;
      } catch (err) {
        stats.errors++;
        if (process.env.NODE_ENV !== 'production') {
          console.error('[cron-sequence] error for', email, err);
        }
      }
    }

    return NextResponse.json({ ok: true, stats });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Bilinmeyen hata' },
      { status: 500 }
    );
  }
}
