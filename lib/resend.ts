import { Resend } from 'resend';

// Resend API key yoksa lazy init (dev/preview için build kırılmaz)
let cached: Resend | null = null;

export function getResend(): Resend | null {
  if (cached) return cached;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  cached = new Resend(apiKey);
  return cached;
}

// Brand gönderici kimliği
export const MAIL_FROM = {
  name: 'ClubBeans',
  // send.clubbeans.com otomatik subdomain'de gönderim
  email: 'lansman@send.clubbeans.com',
} as const;

export const REPLY_TO = 'hello@clubbeans.com';
