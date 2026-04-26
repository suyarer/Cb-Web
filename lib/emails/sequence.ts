/**
 * 8-Mail Pre-Launch Email Sequence
 * Mail #1 = welcome (welcome.ts'de) → subscribe anında
 * Mail #2-8 = bu dosyadaki sequence → cron tarafından gönderilir
 */

type SequenceMail = {
  number: number;
  dayOffset: number; // subscribe'tan sonra kaç gün
  subject: string;
  preheader: string;
  buildHtml: (ctx: { email: string; unsubscribeUrl: string; baseUrl: string }) => string;
  buildText: (ctx: { email: string; unsubscribeUrl: string; baseUrl: string }) => string;
};

// Ortak footer
const footer = (email: string, unsubscribeUrl: string, baseUrl: string) => `
<tr><td style="padding-top:40px;border-top:1px solid #1f1f1f;">
  <p style="margin:0 0 8px;font-size:12px;line-height:1.6;color:#71717a;">
    Bu maili <strong style="color:#a1a1aa;">${email}</strong> adresinden kaydolduğun için alıyorsun.
  </p>
  <p style="margin:0 0 12px;font-size:12px;line-height:1.6;color:#71717a;">
    İstemiyorsan tek tık çık: <a href="${unsubscribeUrl}" style="color:#a1a1aa;">listeden çık</a>.
  </p>
  <p style="margin:0;font-size:11px;line-height:1.6;color:#52525b;font-family:ui-monospace,monospace;">
    ClubBeans · İstanbul · <a href="${baseUrl}/privacy" style="color:#71717a;">Gizlilik</a> · <a href="${baseUrl}/terms" style="color:#71717a;">Şartlar</a>
  </p>
</td></tr>`;

const wrap = (preheader: string, body: string) => `<!doctype html>
<html lang="tr"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/></head>
<body style="margin:0;padding:0;background:#050505;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#e4e4e7;">
<div style="display:none;max-height:0;overflow:hidden;">${preheader}</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#050505;"><tr><td align="center" style="padding:48px 24px;">
<table role="presentation" width="560" cellspacing="0" cellpadding="0" style="max-width:560px;width:100%;">
<tr><td align="left" style="padding-bottom:32px;">
<span style="font-size:18px;font-weight:700;color:#fff;letter-spacing:-0.02em;">
<span style="color:#A8E600;">●</span> ClubBeans
</span>
</td></tr>
${body}
</table></td></tr></table></body></html>`;

// ─── MAIL #2: Sosyal Obezite ───
const MAIL_2: SequenceMail = {
  number: 2,
  dayOffset: 7,
  subject: 'Sosyal Obezite var mı, varsa nasıl anlarız?',
  preheader: '5 belirti — kendinde tanı, kendin karar ver.',
  buildHtml: ({ email, unsubscribeUrl, baseUrl }) =>
    wrap(
      'Sosyal Obezite — 5 belirti.',
      `<tr><td style="padding-bottom:16px;">
<h1 style="margin:0;font-size:28px;line-height:1.2;color:#fff;letter-spacing:-0.02em;">Sosyal Obezite var mı?</h1>
</td></tr>
<tr><td style="padding-bottom:24px;">
<p style="margin:0;font-size:15px;line-height:1.7;color:#d4d4d8;">Geçen Cumartesi akşamı 23:47'de ne yapıyordun? Eğer telefon elindeyse — bu mailin doğru kişisi sensin.</p>
<p style="margin:16px 0 0;font-size:15px;line-height:1.7;color:#d4d4d8;"><strong style="color:#fff;">5 belirti:</strong></p>
<ol style="padding-left:20px;color:#d4d4d8;font-size:14px;line-height:1.8;">
<li>Cumartesi akşamı yorgun ama uyuyamama</li>
<li>Telefonu açıp 30 saniye sonra suçluluk hissi</li>
<li>Plan yapmaktan zihinsel yorgunluk</li>
<li>"Kim varmı bu akşam" sorusunun cevapsız kalması</li>
<li>Yüz yüze görüşmenin "olay" haline gelmesi</li>
</ol>
<p style="margin:16px 0 0;font-size:14px;line-height:1.7;color:#a1a1aa;">3 veya fazlası → yalnız değilsin. Türkiye'de %62 sende.</p>
</td></tr>
<tr><td style="padding-bottom:32px;">
<a href="${baseUrl}/manifesto" style="display:inline-block;background:#A8E600;color:#050505;text-decoration:none;font-weight:700;padding:14px 24px;border-radius:999px;font-size:14px;">Manifesto'yu oku →</a>
</td></tr>
${footer(email, unsubscribeUrl, baseUrl)}`
    ),
  buildText: ({ email, unsubscribeUrl, baseUrl }) => `Sosyal Obezite var mı, varsa nasıl anlarız?

Geçen Cumartesi 23:47'de ne yapıyordun?

5 belirti:
1. Cumartesi akşamı yorgun ama uyuyamama
2. Telefonu açıp 30 saniye sonra suçluluk hissi
3. Plan yapmaktan zihinsel yorgunluk
4. "Kim varmı bu akşam" sorusunun cevapsız kalması
5. Yüz yüze görüşmenin "olay" haline gelmesi

3+ → yalnız değilsin. Türkiye'de %62 sende.

Manifesto: ${baseUrl}/manifesto

—
${email} adresinden kaydolduğun için. Çıkış: ${unsubscribeUrl}
ClubBeans · İstanbul`,
};

// ─── MAIL #3: Cumartesi akşamlarını kim çaldı? ───
const MAIL_3: SequenceMail = {
  number: 3,
  dayOffset: 14,
  subject: 'Cumartesi akşamlarını kim çaldı?',
  preheader: 'Bir hipotez — okuyup sen karar ver.',
  buildHtml: ({ email, unsubscribeUrl, baseUrl }) =>
    wrap(
      'Cumartesi gecesi paradoksu.',
      `<tr><td style="padding-bottom:16px;"><h1 style="margin:0;font-size:28px;line-height:1.2;color:#fff;letter-spacing:-0.02em;">Cumartesi akşamlarını kim çaldı?</h1></td></tr>
<tr><td style="padding-bottom:24px;">
<p style="margin:0;font-size:15px;line-height:1.7;color:#d4d4d8;">Bir Cumartesi akşamı: 1000 takipçin var ama plan yok. Bu paradoks tesadüf değil — sistemin tasarım kararı.</p>
<p style="margin:16px 0 0;font-size:15px;line-height:1.7;color:#d4d4d8;">Algoritma seni "ekranda tut" emri ile çalışır. Ekrandayken seni para kazandıran sensin. Ama "ekranda tutarken" sosyal ihtiyaçların pasif izlemeyle yatışmıyor — daha çok büyüyor. <strong style="color:#fff;">Ne kadar Instagram, o kadar yalnızlık.</strong></p>
<p style="margin:16px 0 0;font-size:14px;line-height:1.7;color:#a1a1aa;">ClubBeans bu döngüyü kıracak şekilde tasarlandı. Lansmana 6 hafta var.</p>
</td></tr>
<tr><td style="padding-bottom:32px;">
<a href="${baseUrl}/manifesto" style="display:inline-block;background:#A8E600;color:#050505;text-decoration:none;font-weight:700;padding:14px 24px;border-radius:999px;font-size:14px;">Tam manifesto →</a>
</td></tr>
${footer(email, unsubscribeUrl, baseUrl)}`
    ),
  buildText: ({ email, unsubscribeUrl, baseUrl }) => `Cumartesi akşamlarını kim çaldı?

1000 takipçin var ama plan yok. Bu paradoks tesadüf değil — sistemin tasarım kararı.

Algoritma "ekranda tut" emri ile çalışır. Ama sosyal ihtiyaçların pasif izlemeyle yatışmıyor, büyüyor. Ne kadar Instagram, o kadar yalnızlık.

ClubBeans bu döngüyü kıracak şekilde tasarlandı.

Manifesto: ${baseUrl}/manifesto

—
${email} · Çıkış: ${unsubscribeUrl}`,
};

// ─── MAIL #4: Sneak peek ───
const MAIL_4: SequenceMail = {
  number: 4,
  dayOffset: 21,
  subject: 'Geliyoruz — sneak peek',
  preheader: 'Hangi özellik en çok ilgini çekiyor?',
  buildHtml: ({ email, unsubscribeUrl, baseUrl }) =>
    wrap(
      'ClubBeans sneak peek.',
      `<tr><td style="padding-bottom:16px;"><h1 style="margin:0;font-size:28px;line-height:1.2;color:#fff;letter-spacing:-0.02em;">Sneak peek</h1></td></tr>
<tr><td style="padding-bottom:24px;">
<p style="margin:0;font-size:15px;line-height:1.7;color:#d4d4d8;">Bu hafta sana 4 ekran göstereceğiz:</p>
<ul style="padding-left:20px;color:#d4d4d8;font-size:14px;line-height:1.8;">
<li><strong style="color:#fff;">Radar</strong> — yakındaki Bean'leri görme (Karaköy'de bu akşam 19:00)</li>
<li><strong style="color:#fff;">Bean detay</strong> — kim katılıyor, mekanı, atmosferi</li>
<li><strong style="color:#fff;">Profil</strong> — TrustScore + ilgi etiketleri</li>
<li><strong style="color:#fff;">Club kurma</strong> — 3 dakikada kendi topluluğun</li>
</ul>
<p style="margin:16px 0 0;font-size:15px;line-height:1.7;color:#d4d4d8;">"Bunlardan hangisi en çok ilgini çekti?" sorusuna doğrudan yanıtla — biz okuyoruz, ürünü o yönde geliştiriyoruz.</p>
</td></tr>
<tr><td style="padding-bottom:32px;">
<a href="${baseUrl}/urun" style="display:inline-block;background:#A8E600;color:#050505;text-decoration:none;font-weight:700;padding:14px 24px;border-radius:999px;font-size:14px;">Ürünü gör →</a>
</td></tr>
${footer(email, unsubscribeUrl, baseUrl)}`
    ),
  buildText: ({ email, unsubscribeUrl, baseUrl }) => `Geliyoruz — sneak peek

4 ekran:
1. Radar — yakındaki Bean'ler
2. Bean detay — kim, nerede, atmosfer
3. Profil — TrustScore + ilgi
4. Club kurma — 3 dakikada

Hangisi en çok ilgini çekti? Mail'e doğrudan yanıtla.

Detay: ${baseUrl}/urun

—
${email} · Çıkış: ${unsubscribeUrl}`,
};

// ─── MAIL #5: Hosts hikayeleri ───
const MAIL_5: SequenceMail = {
  number: 5,
  dayOffset: 28,
  subject: 'Hosts hakkında 3 hikaye',
  preheader: 'Lansmanda kim sana ev sahipliği yapacak?',
  buildHtml: ({ email, unsubscribeUrl, baseUrl }) =>
    wrap(
      '50 erken host — 3 hikaye.',
      `<tr><td style="padding-bottom:16px;"><h1 style="margin:0;font-size:28px;line-height:1.2;color:#fff;letter-spacing:-0.02em;">Hosts</h1></td></tr>
<tr><td style="padding-bottom:24px;">
<p style="margin:0;font-size:15px;line-height:1.7;color:#d4d4d8;">50 erken host'umuz var. ClubBeans lansmanda boş bir uygulama olmayacak — onların Bean'leriyle dolu olacak. Üç hikaye:</p>
<p style="margin:16px 0 0;font-size:15px;line-height:1.7;color:#d4d4d8;"><strong style="color:#fff;">Karaköy'de yazılım meetup'ı kuran kurucu</strong> — 8 kişilik aylık tasarım sohbeti.</p>
<p style="margin:8px 0 0;font-size:15px;line-height:1.7;color:#d4d4d8;"><strong style="color:#fff;">Cihangir'de kitap kulübü yöneten yazar</strong> — Cumartesi akşamı 6 kişilik okuma akşamı.</p>
<p style="margin:8px 0 0;font-size:15px;line-height:1.7;color:#d4d4d8;"><strong style="color:#fff;">Moda'da yürüyüş grubu kurmuş bir tasarımcı</strong> — sahil 90 dakikalık yürüyüş + kahve.</p>
<p style="margin:16px 0 0;font-size:14px;line-height:1.7;color:#a1a1aa;">Sen de host olmak istersen — yanıtla, konuşalım.</p>
</td></tr>
<tr><td style="padding-bottom:32px;">
<a href="${baseUrl}/club-kur" style="display:inline-block;background:#A8E600;color:#050505;text-decoration:none;font-weight:700;padding:14px 24px;border-radius:999px;font-size:14px;">Kulüp aç →</a>
</td></tr>
${footer(email, unsubscribeUrl, baseUrl)}`
    ),
  buildText: ({ email, unsubscribeUrl, baseUrl }) => `Hosts hakkında 3 hikaye

50 erken host'umuz var. Lansmanda boş app olmayacak.

- Karaköy'de yazılım meetup'ı kuran kurucu
- Cihangir'de kitap kulübü yöneten yazar
- Moda'da yürüyüş grubu kurmuş tasarımcı

Sen de host olmak istersen yanıtla.

Kulüp aç: ${baseUrl}/club-kur

—
${email} · Çıkış: ${unsubscribeUrl}`,
};

// ─── MAIL #6: 1 hafta kaldı ───
const MAIL_6: SequenceMail = {
  number: 6,
  dayOffset: 49,
  subject: 'Bir hafta kaldı',
  preheader: 'App Store son kontroller. Hazırız.',
  buildHtml: ({ email, unsubscribeUrl, baseUrl }) =>
    wrap(
      'Bir hafta kaldı.',
      `<tr><td style="padding-bottom:16px;"><h1 style="margin:0;font-size:28px;line-height:1.2;color:#fff;letter-spacing:-0.02em;">Bir hafta kaldı</h1></td></tr>
<tr><td style="padding-bottom:24px;">
<p style="margin:0;font-size:15px;line-height:1.7;color:#d4d4d8;">Aylar önce yazdığımız manifesto + ilk Bean'ler + ilk basın yayını — hepsi yarın bu zamanlar.</p>
<p style="margin:16px 0 0;font-size:15px;line-height:1.7;color:#d4d4d8;">Sana: gün gelince App Store + Google Play link mail'ine düşecek.</p>
<p style="margin:8px 0 0;font-size:14px;line-height:1.7;color:#a1a1aa;">Önceden hazırlanmak istersen Twitter'da gün gün takip edebilirsin.</p>
</td></tr>
${footer(email, unsubscribeUrl, baseUrl)}`
    ),
  buildText: ({ email, unsubscribeUrl, baseUrl }) => `Bir hafta kaldı

Aylar önce yazdığımız manifesto + ilk Bean'ler — yarın bu zamanlar.

Sana: gün gelince App Store + Google Play link gelecek.

—
${email} · Çıkış: ${unsubscribeUrl}`,
};

// ─── MAIL #7: Yarın ───
const MAIL_7: SequenceMail = {
  number: 7,
  dayOffset: 55,
  subject: 'Yarın',
  preheader: 'App Store linki — yarın bu saatte canlı.',
  buildHtml: ({ email, unsubscribeUrl, baseUrl }) =>
    wrap(
      'Yarın geliyoruz.',
      `<tr><td style="padding-bottom:16px;"><h1 style="margin:0;font-size:28px;line-height:1.2;color:#fff;letter-spacing:-0.02em;">Yarın</h1></td></tr>
<tr><td style="padding-bottom:24px;">
<p style="margin:0;font-size:15px;line-height:1.7;color:#d4d4d8;">Yarın saat 08:00'de ClubBeans App Store + Google Play'de.</p>
<p style="margin:16px 0 0;font-size:15px;line-height:1.7;color:#d4d4d8;">İndir → ilk Bean'i bul ya da Club kur → Cumartesi akşamı uygulamayı kapatıp gerçek bir buluşmaya git.</p>
<p style="margin:16px 0 0;font-size:14px;line-height:1.7;color:#a1a1aa;">Görüşürüz.</p>
</td></tr>
${footer(email, unsubscribeUrl, baseUrl)}`
    ),
  buildText: ({ email, unsubscribeUrl, baseUrl }) => `Yarın

Yarın 08:00'de App Store + Google Play.

İndir → ilk Bean → Cumartesi telefonu kapat.

—
${email} · Çıkış: ${unsubscribeUrl}`,
};

// ─── MAIL #8: Lansman ───
const MAIL_8: SequenceMail = {
  number: 8,
  dayOffset: 56,
  subject: 'Geldik — App Store ve Google Play\'de',
  preheader: 'Mayıs Cumartesi akşamlarına hoş geldin.',
  buildHtml: ({ email, unsubscribeUrl, baseUrl }) =>
    wrap(
      'Geldik. App Store + Google Play.',
      `<tr><td style="padding-bottom:16px;"><h1 style="margin:0;font-size:32px;line-height:1.2;color:#fff;letter-spacing:-0.02em;">Geldik.</h1></td></tr>
<tr><td style="padding-bottom:24px;">
<p style="margin:0;font-size:15px;line-height:1.7;color:#d4d4d8;">İlk indirenler "Erken Member" rozeti alır.</p>
<p style="margin:16px 0 0;font-size:15px;line-height:1.7;color:#d4d4d8;"><strong style="color:#fff;">İlk 5 dakikada ne yapacaksın:</strong></p>
<ol style="padding-left:20px;color:#d4d4d8;font-size:14px;line-height:1.8;">
<li>Email + isim ile kayıt</li>
<li>İlgi alanlarını seç (3-5)</li>
<li>Yakındaki Bean'leri keşfet</li>
<li>Bir Bean'e katıl ya da kendi Club'ını kur</li>
</ol>
</td></tr>
<tr><td style="padding-bottom:16px;">
<a href="${baseUrl}/#launch" style="display:inline-block;background:#A8E600;color:#050505;text-decoration:none;font-weight:700;padding:14px 24px;border-radius:999px;font-size:14px;margin-right:8px;">App Store →</a>
<a href="${baseUrl}/#launch" style="display:inline-block;background:#A8E600;color:#050505;text-decoration:none;font-weight:700;padding:14px 24px;border-radius:999px;font-size:14px;">Google Play →</a>
</td></tr>
<tr><td style="padding-bottom:32px;">
<p style="margin:0;font-size:14px;line-height:1.7;color:#71717a;">Bu maili 8 hafta okuduğun için teşekkürler. Telefonu kapat → hayatın başlasın.</p>
</td></tr>
${footer(email, unsubscribeUrl, baseUrl)}`
    ),
  buildText: ({ email, unsubscribeUrl, baseUrl }) => `Geldik.

App Store: ${baseUrl}/#launch
Google Play: ${baseUrl}/#launch

İlk 5 dakika:
1. Kayıt
2. İlgi alanları
3. Yakındaki Bean'leri keşfet
4. Bean'e katıl ya da Club kur

İlk indirenler "Erken Member" rozeti alır.

Bu maili 8 hafta okuduğun için teşekkürler.

—
${email} · Çıkış: ${unsubscribeUrl}`,
};

export const SEQUENCE_MAILS: SequenceMail[] = [MAIL_2, MAIL_3, MAIL_4, MAIL_5, MAIL_6, MAIL_7, MAIL_8];
