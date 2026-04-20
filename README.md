# cb2026-web

> ClubBeans resmi web sitesi — app showcase + Play Console / App Store doğrulama sayfaları.

**Stack:** Next.js 15 · React 19 · TypeScript · Tailwind CSS · Framer Motion
**Dağıtım:** Vercel (önerilen) · Static export uyumlu (Netlify, GH Pages, Cloudflare Pages)
**Domain:** [clubbeans.com](https://clubbeans.com)

---

## Sayfa Envanteri

| Rota | Amaç |
|------|------|
| `/` | App showcase landing (Hero, Manifesto, Features, Showcase, Launch) |
| `/privacy` | KVKK + GDPR gizlilik politikası — **Play Console zorunlu** |
| `/terms` | Kullanım şartları |
| `/support` | Destek + FAQ — **App Store zorunlu** |
| `/delete-account` | Hesap silme runbook — **Play Policy Mayıs 2023 zorunlu** |
| `/.well-known/assetlinks.json` | Android App Links doğrulama |
| `/.well-known/apple-app-site-association` | iOS Universal Links |

---

## Lokal Geliştirme

```bash
npm install
npm run dev
# → http://localhost:3000
```

## Build

```bash
npm run build
# Static export → out/
```

## Typecheck

```bash
npm run typecheck
```

---

## Vercel Deploy (Önerilen)

1. Repo'yu GitHub'a push et
2. Vercel Dashboard → **Import Project** → repo seç
3. Build settings otomatik algılanır (`npm run build`)
4. Environment variables gerekmez (public static site)
5. **Domains** → `clubbeans.com` ekle
6. DNS ayarları (domain sağlayıcıda):
   - `A` record `@` → `76.76.21.21`
   - `CNAME` `www` → `cname.vercel-dns.com`
7. Vercel otomatik HTTPS (Let's Encrypt)

---

## Play Console Site Doğrulama

1. Deploy sonrası Play Console → **Account** → **Verify website**
2. Yöntem A (Search Console): clubbeans.com'u Google Search Console'a ekle → Play Console bağla
3. Yöntem B (Meta tag): Play Console'un verdiği meta tag'i `app/layout.tsx` içindeki `<head>`'e ekle → Deploy → Doğrula

---

## App Links / Universal Links

### Android App Links (`/.well-known/assetlinks.json`)

İlk production build'den sonra SHA-256 cert fingerprint gerekli:

```bash
cd ~/CB2026
npx eas-cli credentials
# iOS yerine Android seç → "View current credentials" → keystore SHA-256'yı kopyala
```

`public/.well-known/assetlinks.json` içindeki `REPLACE_WITH_EAS_FINGERPRINT_AFTER_FIRST_BUILD`
satırını güncelle.

Test:
```bash
curl https://clubbeans.com/.well-known/assetlinks.json
# Android Dashboard → Digital Asset Links API tester
```

### iOS Universal Links (`/.well-known/apple-app-site-association`)

Apple Team ID (`3FKY8YVC66`) ve bundle ID (`com.clubbeans.app`) ile önceden hazır.
Sadece domain'i `CB2026/app.json` `associatedDomains`'e eklemek gerekir:

```json
"ios": {
  "associatedDomains": ["applinks:clubbeans.com"]
}
```

---

## İçerik Güncelleme

Yasal sayfalar `app/privacy/`, `app/terms/`, `app/support/`, `app/delete-account/` altında.
FAQ güncellenmek istendiğinde `app/support/page.tsx` içindeki `faqs` array'i düzenle.

## Dil

Şu an yalnızca Türkçe. İngilizce için `app/en/` rotası eklenip `layout.tsx` lang switcher
ile genişletilebilir.
