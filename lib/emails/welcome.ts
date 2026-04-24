// Welcome email — yeni aboneye hoş geldin + lansman beklentisi + unsubscribe link.
// HTML + plain text, Resend iki versiyonu da kabul ediyor.

type WelcomeProps = {
  email: string;
  position: number;
  unsubscribeUrl: string;
  baseUrl: string;
};

export function welcomeEmailSubject() {
  return 'Listede yerin hazır — Cumartesi akşamları için';
}

export function welcomeEmailHtml({ email, position, unsubscribeUrl, baseUrl }: WelcomeProps): string {
  return `<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Listede yerin hazır</title>
</head>
<body style="margin:0;padding:0;background:#050505;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#e4e4e7;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#050505;">
    <tr><td align="center" style="padding:48px 24px;">
      <table role="presentation" width="560" cellspacing="0" cellpadding="0" style="max-width:560px;width:100%;">
        <!-- Logo / brand -->
        <tr><td align="left" style="padding-bottom:32px;">
          <span style="font-size:18px;font-weight:700;color:#ffffff;letter-spacing:-0.02em;">
            <span style="color:#A8E600;">●</span> ClubBeans
          </span>
        </td></tr>

        <!-- Headline -->
        <tr><td style="padding-bottom:16px;">
          <h1 style="margin:0;font-size:32px;line-height:1.15;font-weight:700;color:#ffffff;letter-spacing:-0.02em;">
            Listede yerin hazır.
          </h1>
        </td></tr>

        <!-- Position -->
        <tr><td style="padding-bottom:24px;">
          <p style="margin:0;font-size:16px;line-height:1.6;color:#a1a1aa;">
            Sen <strong style="color:#A8E600;font-family:ui-monospace,monospace;">${position}.</strong> kişisin.
            Lansman olduğunda tek mail gelir — uygulama App Store ve Google Play'de senin için hazır.
          </p>
        </td></tr>

        <!-- Divider -->
        <tr><td style="padding:8px 0 24px;">
          <div style="height:1px;background:#1f1f1f;"></div>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding-bottom:20px;">
          <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#d4d4d8;">
            ClubBeans bir anti-platformdur. Dikkatini çalmak için değil, masaya çağırmak için çalışır.
          </p>
          <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#d4d4d8;">
            Sözümüz şu: <strong style="color:#ffffff;">spam yok</strong>, <strong style="color:#ffffff;">haftalık newsletter yok</strong>.
            Tek mail — lansman günü, uygulama kullanılabilir olduğunda.
          </p>
        </td></tr>

        <!-- CTA -->
        <tr><td style="padding-bottom:32px;">
          <a href="${baseUrl}/manifesto" style="display:inline-block;background:#A8E600;color:#050505;text-decoration:none;font-weight:700;padding:14px 24px;border-radius:999px;font-size:14px;">
            Manifestoyu oku →
          </a>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding-top:40px;border-top:1px solid #1f1f1f;">
          <p style="margin:0 0 8px;font-size:12px;line-height:1.6;color:#71717a;">
            Bu maili <strong style="color:#a1a1aa;">${email}</strong> adresinden kaydolduğun için alıyorsun.
          </p>
          <p style="margin:0 0 12px;font-size:12px;line-height:1.6;color:#71717a;">
            Fikrin değiştiyse tek tıkla çıkabilirsin:
            <a href="${unsubscribeUrl}" style="color:#a1a1aa;text-decoration:underline;">listeden çık</a>.
          </p>
          <p style="margin:0;font-size:11px;line-height:1.6;color:#52525b;font-family:ui-monospace,monospace;">
            ClubBeans · İstanbul · <a href="${baseUrl}/privacy" style="color:#71717a;">Gizlilik</a> · <a href="${baseUrl}/terms" style="color:#71717a;">Şartlar</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export function welcomeEmailText({ email, position, unsubscribeUrl, baseUrl }: WelcomeProps): string {
  return `Listede yerin hazır.

Sen ${position}. kişisin. Lansman olduğunda tek mail gelir —
uygulama App Store ve Google Play'de senin için hazır.

ClubBeans bir anti-platformdur. Dikkatini çalmak için değil,
masaya çağırmak için çalışır.

Sözümüz:
- Spam yok
- Haftalık newsletter yok
- Tek mail, lansman günü

Manifesto: ${baseUrl}/manifesto

---

Bu maili ${email} adresinden kaydolduğun için alıyorsun.
Fikrin değiştiyse tek tıkla çık: ${unsubscribeUrl}

ClubBeans · İstanbul
Gizlilik: ${baseUrl}/privacy
Şartlar: ${baseUrl}/terms
`;
}
