import { NextResponse } from 'next/server';

// Bülten kapandı (2026-11-17, hukuk T1 KARAR-205): İYS kaydı ve teyit bağlantısı olmadan
// tanıtım e-postası gönderilmez. Yeni abone alınmaz, hoş geldin e-postası gitmez.
// Eski akış git geçmişinde (b424baa öncesi). Abonelikten çıkış ucu (/api/unsubscribe) çalışır.
export async function POST() {
  return NextResponse.json({ ok: false, error: 'Bülten kapandı.' }, { status: 410 });
}
