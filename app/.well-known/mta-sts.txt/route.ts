/**
 * @route /.well-known/mta-sts.txt
 * @governing_law GUVENLIK_ANAYASASI, BILDIRIM_ANAYASASI
 *
 * MTA-STS policy (RFC 8461) — SMTP servers connecting to clubbeans.com
 * must use TLS (enforce mode). Prevents TLS downgrade attacks.
 *
 * Companion DNS TXT record: `_mta-sts.clubbeans.com  v=STSv1; id=20260607`
 * (Cloudflare zone managed via API — see DEEP-MAIL sprint 2026-06-07).
 *
 * Mode levels:
 *   - enforce: TLS required, fail closed (prod-grade)
 *   - testing: monitor only, fall back to non-TLS if needed (soft launch)
 *   - none: disable MTA-STS
 *
 * MX values must match clubbeans.com MX DNS record (mx1+mx2.hostinger.com).
 * Sprint: DEEP-MAIL FORENSIC FIX (#457, 2026-06-07)
 */

import { NextResponse } from 'next/server';

const POLICY = `version: STSv1
mode: enforce
mx: mx1.hostinger.com
mx: mx2.hostinger.com
max_age: 86400
`;

export const dynamic = 'force-static';
export const revalidate = false;

export function GET() {
  return new NextResponse(POLICY, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
