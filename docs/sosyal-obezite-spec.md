# SOSYAL OBEZİTE — oyun spesifikasyonu v1 (karar kaydı)

> Kullanıcı kararları 2026-08-17, 16 soruyla netleştirildi. Bu belge uzman
> eleştirisine girecek TAM tanımdır. Eleştiri sonrası v2 yazılacak.

## Amaç

**Birincil:** dikkat çekmek / viral olmak. ClubBeans'e ilgi yaratmak.
**İkincil:** uygulama indirme.
Kampanya, ClubBeans'in anti-platform tezini bir oyun üzerinden **gösterir**, anlatmaz.

## Ürün bağlamı

- ClubBeans: etkinlik odaklı topluluk uygulaması, "anti-platform". Kullanıcı = **Bean**.
- App CANLI (App Store + Google Play). Ana lansman push: 8 Eylül–25 Ekim.
- Site: `clubbeans.com` = `/Users/suyarer/Cb-Web` (Next.js 16.2.4, React 19, App Router)
- Palet: asit yeşili `#A8E600`, gece `#050505`, elevated `#0A0A0A`, ghost `#737373`
- Font: Inter + JetBrains Mono
- Mevcut Bean maskotu **kod olarak var**: `components/BeanSprout.tsx`,
  `SerendipityBean.tsx`, `CursorBean.tsx` — SVG, Framer Motion ile morphlanabilir
- Kurulu altyapı: Upstash Redis + Ratelimit, Supabase, Vercel Blob, PostHog,
  Sentry, Zod, dinamik OG görsel (`opengraph-image.tsx`), Playwright + axe
- Site dili: kısa, şiirsel, hafif gizemli. Örnek: "Sen bizi gördün. Biz de seni görüyoruz."
- Marka yasakları (`.claude/rules/brand-voice.md`): Tribe, Jump In, Signal, Followers,
  Event (UI'da), User (UI'da), Join (UI'da), Admin (UI'da), Success (Alert). "Vibe" izinli.

## Kararlar (değiştirilemez girdi — eleştir ama gerekçeli)

| # | Karar |
|---|---|
| 1 | **Mekanik:** sonsuz kaydırma simülatörü. Skor = kat edilen mesafe + yakalanan gerçekler |
| 2 | **Beceri katmanı:** boş gönderiler arasında ara ara GERÇEK bir şey belirir (buluşma/insan/davet); yakalamak için dokunmak gerekir, kaçırırsan gider. İroni mekanikte yaşar: *kaydırırken gerçek fırsatlar yanından akıp gidiyor* |
| 3 | **İroni çözümü:** çelişkiyi açıkça sahiplen. Oyun başında: "Bu oyun seni burada tutmak için tasarlandı. Tıpkı diğerleri gibi." |
| 4 | **Mesajın hedefi:** platformlar/sonsuz akış düzeni — **oyuncu değil**. Oyuncu kurban ve bizimle aynı tarafta |
| 5 | **Akış içeriği:** parodi gönderiler, giderek boşalan (anlamlı → klişe → boş → boş kutu). Hiçbir gerçek platformun arayüzü/logosu taklit EDİLMEYECEK (marka hakkı) |
| 6 | **Bean dönüşümü:** çözülme yayı. şişme (1-2. eşik) → renk solması → cam gözler → yavaşlama → **ekrana karışma/pikselleşme**. Anlam kiloda değil uyuşma ve yok olmada |
| 7 | **Süre:** 60 saniyelik turlar. Panel TÜM turların toplam süresini sayar, mesaj her turda sertleşir: "3. turun. Toplam 3 dakika. Hâlâ buradasın." |
| 8 | **Kimlik:** takma ad, giriş yok. Opsiyonel ClubBeans hesabı bağı → doğrulanmış rozet |
| 9 | **Skor tablosu:** Bugün + Tüm zamanlar (iki sekme). Upstash Redis sorted set |
| 10 | **Hile:** sunucu taraflı akla-yatkınlık kontrolü (süre/ivme/dokunma sayısı tutarlılığı). Sert replay doğrulama YOK |
| 11 | **Ödül:** yok. Skor ve gurur |
| 12 | **Oyun sonu asıl eylem:** uygulama indirme (App Store/Play). Paylaşım kartı her koşulda var |
| 13 | **İsim:** SOSYAL OBEZİTE. Beden/kilo iması yok, tartı yok, insan silueti yok; metafor yalnız zaman ve tüketim üstüne |
| 14 | **Kapsam:** Türkçe, mobil-öncelikli (masaüstü çalışır, ikincil) |
| 15 | **URL:** `clubbeans.com/sosyal-obezite` |
| 16 | **Takvim:** mümkün olan en kısa sürede. Kapsam sert tutulur, canlıda öğrenilir |

## Bilinen açık noktalar (eleştiride ele alınmalı)

- Paylaşım kartında ne görünecek (skor, Bean'in son hâli, toplam süre?)
- Ses/haptik varsayılanı
- Erişilebilirlik: kaydırma tabanlı oyun motor kısıtlı kullanıcıyı dışlar — alternatif girdi?
- KVKK: takma ad saklama süresi, silme talebi yolu, 18 yaş altı
- Takma ad küfür filtresi (uygulamada mevcut sistem var, web'e taşınmalı)
- Skor eğrisi dengesi: 60 saniyede tipik/iyi/olağanüstü skor nedir
- "Gerçek" nesnelerin belirme sıklığı ve puan ağırlığı
- Reklam hissi riski (karar 12 nedeniyle) nasıl telafi edilir
- Düşük-tier Android'de 60fps: sonsuz liste sanallaştırma stratejisi
