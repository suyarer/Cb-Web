# SOSYAL OBEZİTE — Yapım Spesifikasyonu v2 (sentez, 2026-08-17)

Kaynak: `/Users/suyarer/Cb-Web/docs/sosyal-obezite-spec.md` (v1, karar 1-16 değiştirilemez) + 8 uzman raporu + çapraz eleştiri. Bu belge doğrudan kod yazmak içindir.

---

## 0. ATLANAN / DEĞİŞTİRİLEN BULGULAR (gerekçeli)

| Bulgu/öneri | Karar | Gerekçe |
|---|---|---|
| "Native scroll KULLANILAMAZ" (mutlak hali) | Kısmen atlandı | Çapraz eleştiri doğru: momentum yalnız `click`'i yutar, `pointerdown` iletilir. Ama custom akış BAŞKA gerekçelerle yine seçildi (bkz. §2 çelişki C2) |
| Yakalama anı hız bonusu +%25 | ATILDI | Hız istemci ölçümü, seed'le doğrulanamaz → hile yüzeyi (çapraz eleştiri bulgu-2) |
| Gerçek belirince akış %30 kalıcı yavaşlama | ATILDI (tutorial hariç) | İçeriğe bakmadan algılanan TELL — ayırt etme becerisini öldürür (çapraz eleştiri bulgu-5) |
| 400ms dokunma kilidi cezası | ATILDI | Gerçek belirdiği anda kilit aktifse dürüst oyuncuyu cezalandırır — "dokundum saymadı" his kırığını oyunun kendisi üretir |
| Bean-hızlanma cezası | ATILDI | Görünmez maliyet, öğrenilemez |
| Sunucu eşiği "dokunuş/gerçek ≤3" | GEVŞETİLDİ (≥10×) | 36 tap tavanı near-miss'e uzanan dürüst oyuncuyu keser; ceza istemci kuralı, sunucu yalnız uç keser |
| "8 kart/sn" sabit tavan sayısı | SPEC'E YAZILMADI | Kanıtsız; soft-launch p99 × 1.5 ile kalibre edilir (güvenlik uzmanı yöntemi). Provizyonel değer 8, kalibrasyonla değişir |
| "SE vs masaüstü skor farkı ≤%10" kabul ölçütü | ATILDI | Aynı-beceri kontrol grubu kurulamaz; vekil: girdi-türü etiketli skor dağılımlarının medyan farkı izlenir |
| Kişisel rekor anında mikro-toast paylaşım CTA'sı | ATILDI | 60 sn'lik yoğun dokunma oyununun ortasında ikinci dikkat hırsızı; paylaşım tetiği yalnız tur sonu |
| runId Redis hash'ine TTL | DEĞİŞTİRİLDİ: TTL'siz | Viral tweet 2 hafta sonra da görüntülenir; TTL dolunca OG kartı boşalır — tam kuyruk trafiğinde. Payload küçük, maliyet önemsiz |
| ref-landing→run_start "%40 eşiği" | Provizyonel işaretlendi | Kaynaksız; ilk hafta verisiyle kalibre edilir, sabit eşik değil |
| Yaş kapısı | KONMADI | KVKK uzmanının kendi reddi: doğrulanamaz + huni öldürür + ek veri toplar. Telafi: veri minimizasyonu (§9) |
| "k-faktörü 1'in altına KİLİTLENİR" | Abartı olarak not edildi | Ref mekanizması yine de uygulanır (davranışsal mekanizma sağlam), ama k>1 vaadi yok |

---

## 1. ÇELİŞKİLER VE SEÇİMLER (gizlenmedi)

**C1 — Viralite vs Karar 12 (oyun sonu asıl eylem: indirme).** Büyüme raporu: 1. koşuda store birincilse hem indirme gelmez (~düşük tek haneler) hem paylaşım düşer. Karar 12 değiştirilemez → çözüm karar-değişikliği gerektirir, "karar korunuyor" diye pazarlanamaz (çapraz eleştiri bulgu-5). **Kullanıcı onayına taşındı (§13, madde 1).** Onay gelmezse: store birincil, paylaşım kartı hemen altında — karar 12 harfiyen.

**C2 — Native scroll vs custom akış.** Çapraz eleştiri "önce native scroll + pointerdown dene" dedi (compositor jank-bağışıklığı). **Custom akış seçildi.** Gerekçe: (a) hız tavanı native momentum'da UYGULANAMAZ — tarayıcı fiziğine müdahale edilemez; (b) sabit seed'li spawn takvimi + duraklat + kart-birimi mesafe deterministik akış konumu gerektirir, scroll event'i Android'de 2-4 frame asenkron; (c) DOM havuzu geri dönüşümü zaten React dışı elle yazılacak — custom akışın ek maliyeti düşük. Ana-thread jank riski telafisi: oynanış sırasında React commit = 0, Bean = sprite, DOM sabit → ana thread neredeyse boş. Çapraz eleştirinin kabul testi custom mimariye AYNEN uygulanır: iOS Safari fling sırasında dokunulan gerçeğin **≥%99 kaydı** + Moto G/Redmi sınıfında 60 sn'de **long task >50ms sayısı ≤2**. Test geçmezse mimari kararı yeniden açılır.

**C3 — Yakalama hedef alanı: erişilebilirlik vs beceri.** A11y "tam-ekran tap sayılsın" dedi; oyun tasarımı hitbox hassasiyeti ima etti. **Tam-viewport yakalama benimsendi:** ekranda yakalanabilir gerçek varken HERHANGİ bir yere dokunmak yakalar (en yakını). Beceri "fark etme + zamanlama"dır, konum hassasiyeti değil. Bu aynı zamanda iOS hassasiyet sorununu ve WCAG 2.5.8'i çözer. Spam-tap'i -20 cezası dengeler (§3).

**C4 — Parodi jargonu vs brand-voice.** Parodi kartlar yasak jargonu GÖSTERMEK zorunda. Çözüm dosya-düzeyi karantina: `content/sosyal-obezite-feed.ts` brand-voice denetiminden MUAF; diğer her yüzey %100 tabi (§8).

**C5 — A11y ≥1.5 sn yakalanabilirlik vs skor eğrisinde hız artışı.** 1.5 sn taban SABİTTİR; hız hangi kademede olursa olsun gerçek nesnenin yakalanabilir kaldığı süre kısalamaz (spawn konumu + kartın ekranda kalma süresi ile sağlanır, yavaşlatmayla DEĞİL).

---

## 2. ÇEKİRDEK MEKANİK

### 2.1 Girdi mimarisi
- `overflow:hidden` viewport + Pointer Events (`pointerdown/move/up`) + tek rAF game-loop + kendi momentum fiziği + `transform:translate3d`. `touch-action:none` yalnız oyun alanına.
- `pointerdown` anında karar: 10px hareket eşiği altı = dokunma, üstü = kaydırma.
- Yakalama: dokunma anında ekranda yakalanabilir gerçek varsa = yakalandı (viewport-geneli, C3).
- framer-motion oynanışta YOK; yalnız intro/tur-sonu/paylaşım UI geçişleri. `domMax` yükseltmesi YASAK (MotionProvider.tsx:14-20 domAnimation kalır; `next build` sonrası shared chunk diff = 0).

### 2.2 Spawn (gerçek nesneler)
- Tur başına **tam 12 gerçek / 60 sn**, sunucu seed'inden türetilir: her 5 sn'lik pencerede 1 spawn, ±1.5 sn jitter.
- **İlk turda ilk spawn t=4-6 sn'ye sunucu tarafından sabitlenir** + güçlü affordance (#A8E600 halka + daralan süre çemberi) + yalnız-tutorial %50 yavaşlama. İlk gerçek kaçırılırsa 1 kez, ≤1 sn "az önce bir gerçek kaçırdın" mikro-mesajı (ceza yok).
- Her gerçek **≥1.5 sn yakalanabilir** kalır (her hız kademesinde, C5).
- Seed tur başında istemciye gider → headless bot mükemmel skor üretebilir. **Kabul edilmiş artık risk** (karar 10 sert replay istemiyor); sınır: skor matematiksel tavanla kapalıdır (§2.3), bot tavana oturur, tabloyu sonsuza kaçıramaz. Telafi: moderasyon endpoint'i (§6).

### 2.3 Skor formülü (lansmandan ÖNCE kilitli — sorted set kalıcı, sonradan değişemez)
| Bileşen | Değer |
|---|---|
| Mesafe | geçilen **kart** başına 1 puan (piksel DEĞİL — cihaz adaleti) |
| Yakalama | 50 × çarpan; çarpan merdiveni ×1.0 → ×1.5 → ×2.0 (tavan). Kaçırma çarpanı sıfırlar. **Yanlış dokunma çarpanı ETKİLEMEZ** (C4-etkileşim tanımı) |
| Yanlış dokunma (ekranda gerçek yokken) | **-20 puan**, taban 0; ilk yanlış dokunuşta görsel geri bildirim (öğretim) |
| Hız tavanı | efektif kaydırma tavan üstü skor üretmez; provizyonel 8 kart/sn, soft-launch p99×1.5 ile kalibre |

Teorik tavan: yakalama 50+75+100×10 = **1.125** + mesafe 8×60 = 480 → **~1.605**. Yakalama payı tavanda ~%70 (marka savunma hattı: "en çok kaydıran değil, en çok fark eden kazanır"). Beklenen eğri: tipik ~400-450, iyi ~800-900, olağanüstü ~1.500+.

### 2.4 Bean çözülme yayı (karar 6)
- **Tur-içi eşikler: t≈12 / 25 / 38 / 50 / 57 sn** — her tur tam yay yaşanır, paylaşım kartı her koşulda final-hal içerir. Kümülatif panel (karar 7) yalnız METNİ sertleştirir, yayı hızlandırmaz.
- Şişme fazı: **scale ≤1.15, en/boy oranı korunur** (BeanSprout.tsx morph'unda) — "tombul" okuması yasak; dönüşüm yükü renk solması + cam göz + pikselleşmede.
- "Yavaşlama" fazı **girdiye dokunmaz** — yalnız görsel (Bean animasyon hızı + renk solması).
- Uygulama: faz başına 6-12 kare WebP sprite sheet (build-time), geçişler opacity+transform crossfade. Pikselleşme: offscreen canvas `drawImage` küçült + `imageSmoothingEnabled=false` büyüt. SVG filter (feTurbulence vb.) YASAK. Kabul: morph geçişinde scripting <4ms/frame.
- **Flaş güvenliği:** pikselleşme frame değişimi ≤3/sn; pikselleşme fazı paletinden #A8E600 ÇIKAR (koyu-gri↔siyah aralığı). Yayın öncesi manuel PEAT koşusu release checklist'inde.

### 2.5 Akış içeriği (karar 5)
- Uzunluk merdiveni: anlamlı ≤90, klişe ≤60, boş ≤25 karakter, boş kutu = 0 (son eşikte tek '…').
- Metin havuzu: `content/sosyal-obezite-feed.ts` — copywriter'ın teslim ettiği setler tohum olarak girer; her metne 'arketip' etiketi (motivasyon-koçu, minnet-gurusu, kaydet-tuzağı...). Arketip parodisi serbest, birey parodisi yasak.
- Taklit-değil kontrol listesi (yayın-blokajlı): (1) kalp ikonu YASAK — soyut şekil; (2) #FF0050, #E1306C, IG gradyanı, #1DA1F2 dominant renk YASAK — parodi tamamen ClubBeans paletinde; (3) sağ-kenar dikey aksiyon sütunu + tam ekran dikey kombinasyonu YASAK; (4) gerçek handle'a Levenshtein ≤2 isim YASAK; (5) gerçek kitap/kişi sloganıyla 4+ kelime örtüşme YASAK; platform-özgü terim (bio, story, reels, RT, DM) YASAK; (6) ekip-dışı 5 kişiye 3 sn testi — 2+ kişi aynı gerçek platformu söylerse kart yeniden.

---

## 3. TUR AKIŞI / EKRANLAR

1. **Intro** (server component, statik CSS, anında boyanır): karar 3 cümlesi + KVKK mikro-link, tek dokunuş "BAŞLA", ≤2 satır, 2 sn'de geçilebilir. Oyun motoru `dynamic import` ile intro göründükten sonra arka planda yüklenir. **Takma ad SORULMAZ** (skor kaydına taşındı).
2. **Tur** (60 sn): Duraklat düğmesi ≥48px sağ üst + `visibilitychange` otomatik pause. Toplam-süre sayacı `aria-hidden`.
3. **Tur sonu** üç satır: (1) skor + "bugün üst %X'tesin" (ZRANK/ZCOUNT); (2) "N gerçek yanından aktı — Y puan kaçırdın" (near-miss yakıtı); (3) kademe mesajı (§8, akışa yönelik). Sonra: paylaşım kartı, "bir daha" + eşit ağırlıkta "bırak" seçeneği, store CTA (sıra: §13 kullanıcı kararı 1), en altta itiraf tekrarı ("Başta söylemiştik: ...").
4. **Takma ad**: yalnız skor kaydederken; alan sunucu-üretimi öneriyle dolu gelir ("SolgunBean42" tarzı) + tek satır aydınlatma + link.

Kabul ölçütü: yeni oyuncunun %90'ı ilk turda ≥1 yakalama (PostHog `run_end.run_index=1 & reals_caught>=1` funnel'ı ile ölçülür — ölçüm planı şemada, §11).

---

## 4. PERFORMANS MİMARİSİ

- **Route group:** `app/(game)/sosyal-obezite/` + kendi minimal `layout.tsx`. DAHİL DEĞİL: grain-overlay, LiveTicker, ClientExtras (CursorBean/ExitIntent/SerendipityBean/SilentHour), CosyMode, GutterSprout, ScrollManager. PostHog manuel-capture (`autocapture:false` bu route'ta), MetaPixel yok.
- **DOM havuzu:** görünür kart + 4-6 tampon = **12-16 sabit DOM elemanı**, hiç unmount/mount yok; çıkan kart yeni içerikle üste taşınır. Kabul: tur boyunca toplam DOM düğümü sabit (±0).
- **React commit = 0 oynanışta:** oyun durumu ref/plain-object, rAF DOM'a doğrudan yazar (textContent/transform/CSS var). React'e yalnız tur geçişlerinde commit. React DevTools Profiler ile doğrula.
- **Tur geçişi:** havuz + game-loop yaşar, yalnız state sıfırlanır (AnimatePresence exit patlaması yok). Ses: tek AudioContext + önceden decode 2-3 buffer. Kabul: 10 tur sonrası heap büyümesi <5MB, detached node = 0.
- **Bundle:** first-load JS ≤170KB gzip; intro LCP <2 sn (4G, Moto G sınıfı); ana sayfadaki oyun linkine `prefetch={false}`; ana sayfa first-load JS DEĞİŞMEZ (`next build` route tablosu diff'iyle doğrula). Ses ilk etkileşimden sonra fetch.

---

## 5. SKOR BÜTÜNLÜĞÜ (sunucu)

### 5.1 Oturum akışı
- `POST /api/game/start` → HMAC'li opak sessionId + RNG seed; Redis `SETNX sess:{id}` TTL 180 sn, tek kullanım.
- `POST /api/game/submit` → istemci **ham skoru değil olay özetini** gönderir (kart sayısı, yakalama timestamp'leri, yanlış-tap sayısı, girdi türü, pause toplamı). **Skoru SUNUCU formülden yeniden hesaplar.** Payload'da skor/rozet alanı HİÇ yok.
- Seed-bağlama: yakalama timestamp'leri seed'in spawn zamanlarıyla **±300 ms** eşleşmeli — jenerik trace-üretecini ve replay'i oturuma kilitler.
- Tavan-üstü submit: **sessizce kabul, tabloya YAZMA** (saldırgana bayrak yok).

### 5.2 Eşikler (soft-launch'ta ilk 200 gerçek oturumun p99 × 1.5 ile kalibre; başlangıç değerleri)
- Süre: sunucu-taraflı start→submit 58-300 sn (pause payı dahil); oyun-saati yakalama timestamp'leri [0,60] sn içinde.
- Dokunma: 60 sn'de toplam tap >120 (spawn×10) → reddet. Ardışık iki tap <30 ms → reddet.
- Yakalanan > seed spawn sayısı (12) → reddet.
- İvme: ardışık delta CV <0.05 (metronom) → bot işareti.
- Reddedilen oturum: kullanıcıya skor LOKAL gösterilir, tabloya yazılmaz; metin: "Bu skor akla yatmadı. Akış bile bu kadar hızlı akmaz."
- **Kabul edilmiş artık risk (yazılı):** heuristikler ~30 dk'lık scriptle atlatılabilir; tablo zirvesi garanti edilemez. "Hile korumamız var" diye pazarlanmaz.

### 5.3 Rate limit + kimlik
- IP: Vercel platform header'ından (`x-real-ip`) — `app/api/subscribe/route.ts:50-52`'deki soldan-XFF deseni KOPYALANMAZ (spoof'lanabilir).
- Katmanlar: start 15/dk/IP (CGNAT payı) · submit 1/oturum-token'ı · anonId 30 oturum/saat.
- anonId = httpOnly cookie'de UUID; sorted set member = **anonId** (takma ad ASLA anahtar değil); `ZADD GT` ile anonId başına en iyi skor. Günde IP başına en fazla 3 farklı anonId tabloya girer (cookie silme = yeni kimlik; kabul edilmiş artık risk).
- Takma ad: ayrı hash'te; normalize = NFKC + Türkçe casefold + zero-width strip + confusable skeleton → `SETNX nick:{skeleton}` günlük sahiplik. Rezerve liste (clubbeans, admin, bean, resmi...) — CB2026 `reserved_usernames` dersi porte edilir. Küfür filtresi: CB2026 substring-tier + FP-kapısı deseni + **ad-soyad deseni uyarısı** ("Gerçek adını yazma") aynı modülde.
- Doğrulanmış rozet: YALNIZ sunucuda Supabase oturumu doğrulanarak yazılır.

### 5.4 Günlük bucket
- Anahtar `Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Istanbul'})`; bucket **session start** anından seçilir; `EXPIRE 172800`.

---

## 6. MODERASYON + GÖZLEM (lansman blokajı)

- ZREM'li korumalı admin endpoint'i (CRON_SECRET-tarzı header) **lansmandan ÖNCE hazır**.
- PostHog: `game_score_rejected{threshold_name}`, `game_score_accepted`, `game_session_orphan`, `share_card_generated`, `quit_click`.
- İki alert: günlük red oranı >%20 (eşikler meşruları kesiyor) · kabul edilen skor > teorik maksimumun %90'ı (manuel incele + ZREM).
- Submit handler'daki her beklenmedik hata Sentry `captureError`.

---

## 7. PAYLAŞIM / VİRAL DÖNGÜ

- **Per-koşu dinamik OG:** `app/(game)/sosyal-obezite/s/[runId]/opengraph-image.tsx` — mevcut param-driven kalıba (app/user/[username]/opengraph-image.tsx + lib/ogImage.tsx) birebir uyarlama, yeni altyapı değil. runId hash'i Redis'te **TTL'siz**. `twitter:card=summary_large_image`.
- **Kart içeriği (sert kurallar):** Bean'in **şişme fazı ASLA render edilmez** — yalnız pikselleşme/çözülme karesi. Hiyerarşi: (1) kurtarılan gerçek sayısı BÜYÜK, (2) akışa verilen süre, (3) skor küçük. Tanım satırı ZORUNLU: **"Sosyal obezite: kilonun değil, zamanın yutulması."** Teslim metni: "SOSYAL OBEZİTE — 7 gerçeği kurtardım. 4 dakikamı akış aldı. Sen kaçını kurtarabilirsin?" (fiil "kurtar", "geç beni" değil).
- **Challenge:** paylaşım URL'si `?ref=runId`; ref'li gelen oyuncuda davet edenin skoru hayalet-hedef ("Ayşe 847'de bıraktı — sen?"). runId bulunamazsa **graceful degrade**: jenerik landing, yarı-boş ekran yok.
- **X format:** kart ayrıca PNG (aynı ImageResponse → Vercel Blob); "görseli kaydet/kopyala" seçeneği; Web Share Level 2 files destekli cihazda doğrudan görsel, fallback link (X harici-link cezası telafisi).
- **Tohum trafik (lansman tanımının parçası):** kurucu X thread'i (çözülme animasyonu video, link İLK REPLY'da; thread içine çelişki-itirafı tweet olarak) · x-radar madenciliği + 20-30 hedefli reply (linkli reply oranı düşük — spam filtresi) · 10-20 mikro hesaba ref'li link (kim kaç oyuncu getirdi ölçülür) · **oyun 8 Eylül push'undan 1-2 hafta önce çıkar** (bugün 17 Ağustos — pencere oturuyor; push başladıktan sonra çıkarsa anlatı tersine döner). Müdahale eşiği: D1 tekil oyuncu <200 → tohum planı devreye.
- Mağaza atıfı: iOS `ct=sosyal-obezite` kampanya token'ı, Play referrer paramı; `DownloadButtons.tsx`'e geçirilir.

---

## 8. METİN KATMANLARI (copy — teslim edilmiş, kullanılacak)

**Katman ayrımı:** parodi = `content/sosyal-obezite-feed.ts` (brand-voice MUAF, jenerik jargon serbest, platform-özgü terim yasak) · meta katman = %100 brand-voice tabi + farklı tipografik ağırlık (ekran görüntüsünde hangi ses ClubBeans, tartışmasız).

**UI sözlüğü (meta katman, sabit):** akış (feed değil) · kaydırma (scroll değil) · gerçek · tur · skor · takma ad (user değil) · Bugün / Tüm Zamanlar. "Success" alert başlığı, "Hemen/şimdi/kaçırma" aciliyet dili YASAK. İnsanlar için "şişman/kilo/obez/yağ" kelime ailesi TÜM yüzeylerde YASAK (lint-seviyesi sözlük kontrolü); dönüşüm fiilleri: doldun/uyuştun/soldun/karıştın.

**Tur mesajları (karar 7 — hedef düzen, oyuncu değil):**
1. "İlk tur. 60 saniye gitti. Fark ettin mi?"
2. "2. tur. Toplam 2 dakika. Akış tam da bunu istiyor."
3. "3. turun. Toplam 3 dakika. Hâlâ buradasın." (kullanıcının cümlesi — korunur)
4. "4. tur. Toplam 4 dakika. Sen kaydırmıyorsun; kaydırılıyorsun."
5. "5. tur. Toplam 5 dakika. Akış doymaz. Sen dolmazsın."
6. "6. tur. Toplam 6 dakika. Biz kapıyı açık bıraktık. Diğerleri bırakmaz."
Dönen oyuncu (oturum-ötesi): "Yine geldin. Dün X dakika, bugün Y. Akış seni hatırlıyor." — "hâlâ" yalnız aynı oturumda.

**Tur sonu CTA bloğu:** Başlık "60 saniye bitti." · gövde "[N] kart kaydırdın. [X] gerçeği yakaladın; [Y]'si akıp gitti." · köprü "Kaçırdığın gerçekler ekranda değil, dışarıda duruyor." · CTA üstü "ClubBeans: gerçeğin uygulaması. Akışı değil, buluşmayı açar." · butonlar ham "App Store" / "Google Play".

**"Onurlu çıkış":** "bırak" seçeneği tur sonunda "bir daha" ile eşit ağırlıkta; bırakan oyuncunun paylaşım kartında "Bırakabildin" göstergesi (kriz savunması: "oyunda en değerli hamle çıkmak"). — Yeni mekanik olduğu için §13'te onaya bağlı.

---

## 9. KVKK

- **PostHog rıza-öncesi cookieless:** init `persistence:'memory'` + `person_profiles:'never'`; rıza sonrası cookie'ye yükselt. Session replay + autocapture bu sayfada tamamen kapalı. Kabul (Playwright assert): rıza öncesi ph_* prefix'li 0 cookie + 0 localStorage anahtarı.
- **Aydınlatma:** takma ad girişinde tek satır "Takma adın ve skorun herkese açık listede görünür — detay" + `/sosyal-obezite/kvkk` tam metin (veri sorumlusu CLUBBEANS TEKNOLOJI LTD; veriler: takma ad, skor, IP, oyun telemetrisi; dayanak m.5/2-f; saklama; m.11 hakları; başvuru). Bir paragraf çocuk-anlaşılır dille. Skor için açık rıza İSTENMEZ (m.5/2-f yeterli); rıza yalnız analitik çereze.
- **Silme:** skor kaydında sunucu deletion-token üretir → localStorage; oyun-sonu "skorunu sil" self-service butonu; token kaybında info@clubbeans.com + IP/zaman eşleşmesi prosedürü yazılı.
- **Saklama (rakamla):** ham telemetri persist EDİLMEZ (request-anında bellekte hesap; debug gerekirse TTL ≤24 saat, IP'siz — kabul: `EXPIRE`'sız telemetri anahtarı 0 adet) · IP ≤7 gün · takma ad+skor kampanya bitişi + 6 ay → anonimleştirme (takma ad → "Bean_####"; Tüm Zamanlar sekmesi anonim adlarla yaşar, karar 9 bozulmaz).
- **Çocuk verisi:** e-posta/telefon/doğum tarihi ASLA istenmez; sunucu-üretimi öneri ad; ad-soyad deseni uyarısı (§5.3).
- **Hesap bağlama (karar 8):** bağlama butonunun altında "Skorun ve oyun geçmişin ClubBeans hesabınla eşleştirilir" + link; eşleşme tablosu hesap-silme zincirinin envanterine eklenir (user_id→takma ad ters-indeks, silmede ZREM); silme testine assertion "silinen kullanıcının oyun eşleşmesi + rozeti 0 kayıt". **Bu zincir hazır değilse rozet özelliği lansmanı BLOKLAMAZ, sonra açılır** (§13, madde 6).
- **Değiştirilemez madde:** skora bağlı hiçbir maddi ödül/bilet/indirim/çekiliş hukuk incelemesi olmadan eklenemez (MPİ kapsamına girer).

---

## 10. ERİŞİLEBİLİRLİK

- **Alternatif girdi:** (a) basılı-tut/tek-dokunuş "otomatik kaydırma" modu (2 hız kademesi); (b) klavye: Boşluk/Aşağı-ok = kaydır, Enter = yakala; (c) tam-viewport yakalama (C3). Otomatik mod AYNI puan havuzunda — ayrı lig yok.
- **Reduced-motion dalı:** otomatik akış hızı 0 (kullanıcı-tetikli adım adım ilerleme), geçişler ≤200ms opacity-only, pikselleşme tek-kare cross-fade, parallax/scale kapalı. `lib/motion.ts` RM helper'ı oyun bileşenlerinde zorunlu import.
- **Ekran okuyucu:** iki live region — `assertive` yalnız "gerçek belirdi / yakaladın / kaçırdın"; `polite` 10 sn throttle'lı skor özeti. SR modunda yanıt penceresi ≥3 sn + ses ipucu. Tur sonu `role="alert"` + odak panele. Süre sayacı `aria-hidden`, SR'a tur sonunda tek cümle.
- **Kontrast:** okunması beklenen her metin ≥4.5:1 (ghost #737373 gece üstünde 4.30:1 — okunacak metinde kullanma veya ≥#7A7A7A); solan gönderiler dekoratif → `aria-hidden` + SR'a tek satır özet; #A8E600 üstünde YALNIZ #050505 (13.6:1).
- **CI (axe yetmez):** üç ek Playwright senaryosu — (1) klavye-only tam tur (fail=merge blok), (2) `emulateMedia({reducedMotion:'reduce'})` + otomatik akış hızı 0 assert'i, (3) live-region anonsları DOM assert'i. axe color-contrast solmanın SON karesinde koşar. Manuel PEAT yayın öncesi checklist'te.

---

## 11. ANALİTİK ŞEMASI

`game_view` · `run_start{run_index}` · `run_end{score,duration_ms,run_index,reals_caught,reals_missed,wrong_taps,input_type}` · `share_click{channel,format}` · `ref_landing{ref}` · `download_click{store,run_index}` · `leaderboard_view` · `nickname_set` · `quit_click` · `share_card_generated` · `game_score_rejected{threshold_name}` · `game_score_accepted` · `game_session_orphan`.

k-proxy = (share_click/run_end) × (ref_landing/share_click) × (ref'li run_start/ref_landing). Hedefler: paylaşım oranı ≥%8 (provizyonel), ref-landing→oyun eşiği ilk hafta verisiyle kalibre (sabit %40 İDDİA DEĞİL). `download_click` run_index kırılımı C1 hipotezini test eder.

Skor tablosu UI: varsayılan sekme **Bugün**; mutlak sıra yerine yüzdelik ("üst %12'desin", ZCOUNT); girdi türü skor kaydında etiketli (masaüstü ayrımı veri sonrası, §13); ref zinciri "senin davet ettiklerin" mini-tablosu (challenge'dan bedava).

---

## 12. KRİZ HAZIRLIĞI (lansman tanımının parçası — "sonra" listesine düşemez)

- **Tanım sabitleme:** "obezite" kelimesinin geçtiği HER yüzeyde (açılış, meta-description, OG kartı) tek cümle: "Sosyal obezite: beslenmeden tüketmek. Bedenle değil, zamanla ilgili." (Manifesto.tsx:65 BrandTerm açıklamasıyla aynı hat.)
- **3 hazır metin lansman ÖNCESİ onaylı:** A (sağlık cephesi: kabul+niyet+diyalog) · B (gazeteci medya kiti "İsim neden bu?" paragrafı) · C (ED-duyarlılık tek satırı "Bu oyun ekran süren hakkında, bedenin hakkında değil" — feature-flag'li, 1 saatte açılır). Yanıt sahibi TEK kişi; ilk 24 saat onaylı metin dışı yanıt YASAK.
- **Kill-switch:** tek env/edge-config anahtarıyla sayfa "yakında"ya düşer, <5 dk.
- **Eskalasyon eşikleri:** isim/beden temalı negatif etkileşim toplam bahsin %20'si VEYA 50K+ takipçili tek negatif hesap → onaylı metin; %40 → kill-switch + isim revizyonu görüşmesi.
- Karar 3 itirafı son ekranda tekrar eder ("Başta söylemiştik:") — alıntılansa bile lehimize.

---

## 13. KALAN KULLANICI KARARLARI

1. **C1 — Tur sonu CTA sırası:** 1. koşuda paylaşım birincil + store ikincil ("Bu oyunu kapat. Gerçek bir masaya otur." kopyasıyla), `runs_count≥2`'de store birincil — karar 12'den bilinçli sapmadır, onay gerekli. Onaysız: karar 12 harfiyen.
2. **Karar 3'e ek satır:** "Fark şu: bunu yüzüne söylüyoruz." (varyant A) eklensin mi? Mevcut cümle korunur, yalnız ekleme.
3. **"Onurlu çıkış / Bırakabildin"** paylaşım kartı göstergesi — yeni mekanik, onay gerekli.
4. **Ses/haptik varsayılanı** (v1 açık noktası): öneri = ses açık (SR ipucu için gerekli) + tek dokunuşla sessize alma; haptik yalnız yakalamada.
5. **Masaüstü skorlarının gösterimi:** lansmanda tek havuz + girdi-türü etiketi toplanır; ayrı sekme/rozet kararı ilk hafta verisi sonrası.
6. **Doğrulanmış rozet zamanlaması:** KVKK silme-zinciri entegrasyonu lansmana yetişmezse rozet ertelenir — onay.
7. **Lansman tarihi:** 8 Eylül push'undan ≥1 hafta önce (hedef pencere ~25 Ağustos–1 Eylül) — takvim onayı.
8. **Hız tavanı nihai değeri:** soft-launch kalibrasyonu sonrası (provizyonel 8 kart/sn) — bilgi amaçlı onay.

---

## 14. DOSYA HARİTASI (uygulama)

- `app/(game)/sosyal-obezite/page.tsx` + `layout.tsx` (minimal) + `kvkk/page.tsx`
- `app/(game)/sosyal-obezite/s/[runId]/page.tsx` + `opengraph-image.tsx` (lib/ogImage.tsx kalıbı)
- `app/api/game/start/route.ts` · `submit/route.ts` · `delete-score/route.ts` · `moderate/route.ts` (korumalı ZREM)
- `content/sosyal-obezite-feed.ts` (parodi havuzu — brand-voice MUAF işaretli)
- Redis anahtarları: `sess:{id}` (TTL 180) · `run:{runId}` (TTL'siz) · `lb:all` (ZADD GT) · `lb:day:{YYYY-MM-DD}` (EXPIRE 172800) · `nick:{skeleton}` (günlük SETNX)
- Sprite varlıkları: `public/game/bean-phase-{1..5}.webp`