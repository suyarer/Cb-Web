import crypto from 'node:crypto';

// HMAC-SHA256 imzalı unsubscribe token.
// Format: base64url(email) + "." + base64url(hmac)
// Secret: UNSUBSCRIBE_SECRET (Vercel env)
// Email'i değiştiren herhangi biri imzayı bozar → link geçersiz.

function getSecret(): string {
  const secret = process.env.UNSUBSCRIBE_SECRET;
  if (!secret) {
    throw new Error('UNSUBSCRIBE_SECRET env değişkeni tanımlı değil.');
  }
  return secret;
}

function base64url(input: Buffer | string): string {
  const buf = typeof input === 'string' ? Buffer.from(input) : input;
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64urlDecode(input: string): Buffer {
  const pad = input.length % 4 === 0 ? '' : '='.repeat(4 - (input.length % 4));
  const b64 = input.replace(/-/g, '+').replace(/_/g, '/') + pad;
  return Buffer.from(b64, 'base64');
}

export function signUnsubscribeToken(email: string): string {
  const secret = getSecret();
  const normalized = email.trim().toLowerCase();
  const mac = crypto.createHmac('sha256', secret).update(normalized).digest();
  return `${base64url(normalized)}.${base64url(mac)}`;
}

export function verifyUnsubscribeToken(token: string): string | null {
  try {
    const secret = getSecret();
    const [emailPart, macPart] = token.split('.');
    if (!emailPart || !macPart) return null;

    const email = base64urlDecode(emailPart).toString('utf8');
    const providedMac = base64urlDecode(macPart);
    const expectedMac = crypto.createHmac('sha256', secret).update(email).digest();

    // Timing-safe karşılaştırma
    if (providedMac.length !== expectedMac.length) return null;
    if (!crypto.timingSafeEqual(providedMac, expectedMac)) return null;

    return email;
  } catch {
    return null;
  }
}
