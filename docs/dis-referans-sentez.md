## 0. UYDURMA/ELENEN

| Elenen iddia | Neden | Doğrusu |
|---|---|---|
| Eiserloh "MAX_TRANSLATION=20px, MAX_ANGLE=10°, 'dikkat dağıtmayacak kadar düşük'" | GDC 2016 slayt OCR'ında bu sayılar ve alıntı YOK; maxAngle/maxOffset değişken olarak var, değersiz | Sarsıntı px/derece değerleri kendi tasarım seçimimiz olarak yazılır (6-8px ceza, 10-12px seri-kaybı), Eiserloh'a atfedilmez |
| "shake = trauma²" + %3/%22 örnekleri | Örnekler trauma KÜPÜNE ait (0.3³=%2.7, 0.6³=%21.6); formül-örnek karışmış | Eiserloh ikisini de önerir: trauma² VEYA trauma³; %3/%22/%73 örnekleri trauma³'e ait — uygulamada trauma³ kullan |
| Vlambeer "ÜÇ kademeli sarsıntı merdiveni" | Talk özetlerinde bu netlikte yok | İlke geçerli: küçük olaya küçük, büyüğe büyük — "üçlü merdiven" atfı yapılmaz |
| Swink "100ms korreksiyon döngüsü" sabiti | Kitaptan birincil alıntı doğrulanamadı | "İnsan algı-tepki döngüsü kısıtı" olarak yazılır; sayısal dayanak M3 250ms/bezier |
| Vlambeer hitstop "0.2 sn" uygulanacak değer olarak | İkincil özet kaynaklı + masaüstü aksiyon bağlamı; web'de uzun | Web değeri 60-80ms (valdemird) |
| framer-motion yolu "motion-dom/.../constraints.ts" | Yanlış yol | packages/framer-motion/src/gestures/drag/utils/constraints.ts:195 (defaultElastic=0.35 doğru) |
| hammer.js "src/input.js" | Eski/derlenmiş dosya | src/inputjs/input-consts.js:14 (COMPUTE_INTERVAL=25 doğru) |
| Swiper free-mode ":111-112" | Eski sürüm satırı | src/modules/free-mode/free-mode.ts:189-192 (mekanizma doğru) |
| "Nordic Game Jam 2012" | Yanlış etkinlik adı | Nordic Game Indie Night 2012 (Jonasson & Purho) |
| Android IMPULSE = dokunmatik kaydırma stratejisi okuma riski | AXIS_SCROLL tekerlek/rotary eksenidir | Dokunmatik X/Y varsayılanı LSQ2 |
| "0.998 yanlış değer" okuması | Değer iOS-normal ile birebir doğru | Sorun MOD seçimi (normal vs fast+paging); fix turunda 0.998'in "bozuk sabit" diye değil "yanlış mod" diye değiştirildiği kayda geçer |
| Sanal liste kütüphanesine geçiş + MainLoop.js + iOS haptik hack'i | Mimari doğrulandı (10-kart havuz, kapalı-form fizik); iOS checkbox-hack'i 26.5'te Apple tarafından kapatıldı | Üçü de ALINMAZ — karar kapalı |

## 1. FIZIK SABITLERI TABLOSU

| Parametre | Bizim değer | Dış referans | Kaynak | KARAR |
|---|---|---|---|---|
| SONUM_MS (fizik.ts:18) | 0.998 (iOS normal; 2000px/sn → 2.56sn, ~999px coast) | iOS/RN **fast = 0.99** (→0.51sn, ~199px); ariya tc=325ms→0.9969 | reactnative.dev/docs/scrollview; ariya.io kinetic-2 | **DEĞİŞTİR: 0.99** (snap ile birlikte; §6-1) |
| Coast sonu snap | YOK — DURMA_ESIGI altında rastgele yarım kartta durur | Swiper freeMode `sticky:true`; iOS pagingEnabled | swiperjs.com/swiper-api#free-mode | **EKLE**: durma ofseti = offset + (hiz/1000)/\|ln(SONUM_MS)\|, en yakın KART_H=188 katına son ~200ms ease |
| Bayat-örnek eşiği (fizik.ts:41) | 90ms (HIZ_PENCERESI_MS ile aynı sabit) | Android ASSUME_POINTER_STOPPED_TIME = **40ms** | AOSP VelocityTracker.cpp | **DEĞİŞTİR**: yeni sabit BAYAT_ESIGI_MS=40; satır 41 onu kullanır |
| HIZ_PENCERESI_MS + kestirim yöntemi (fizik.ts:24, 33-51) | 90ms İLK-SON düz ortalama (≈45ms önceki anlık hız) | Android LSQ2 + HORIZON=100ms + HISTORY_SIZE=20; hammer 25ms; ariya low-pass v=0.8·yeni+0.2·eski | AOSP VelocityTracker.cpp/.h; hammer input-consts.js:14 | **DEĞİŞTİR**: son-ağırlıklı — max(son 2 örneğin anlık hızı, 90ms ortalaması); tam LSQ2 portu YAPILMAZ (§6-2) |
| Min. fırlatma kapısı | YOK (13-50 px/sn mikro-kayma) | Android MINIMUM_FLING_VELOCITY = **50 dp/sn**; Swiper 0.02 px/ms = 20 px/sn | AOSP ViewConfiguration.java; free-mode.ts:129,193 | **EKLE**: MIN_FIRLATMA=50 px/sn, altı → 0 |
| Maks. fırlatma clamp | YOK (dt~1-8ms kötü çift → 20000+ px/sn) | Android MAXIMUM_FLING_VELOCITY = **8000 dp/sn** | AOSP ViewConfiguration.java | **EKLE**: MAX_FIRLATMA=8000 px/sn clamp (görsel-tavan yasağı ihlal edilmez — bu ölçüm hijyeni) |
| Momentum min. mesafe | YOK | better-scroll momentumLimitDistance = **15px** | better-scroll docs base-scroll-options | **EKLE**: onUp'ta \|toplam mesafe\|<15px → hiz=0 |
| LASTIK (fizik.ts:22, 63-68) | 0.35 DOĞRUSAL (direnç mesafeyle artmaz) | iOS asimptotik (x·d·c)/(d+c·x), **c=0.55**, d=viewport; use-gesture varsayılan c=0.15; framer doğrusal 0.35 | gist originell/6961057 (chpwn); use-gesture maths.ts | **DEĞİŞTİR**: asimptotik formül, c=0.55, d=viewportH parametre; doğrusal sabit silinir |
| geriYayla (fizik.ts:73) | 0.985^ms (tc≈66ms, ~200ms'de biter) | better-scroll swipeBounceTime=**500ms**; framer bounce stiffness=200/damping=40 | better-scroll docs; VisualElementDragControls.ts | **DEĞİŞTİR**: 0.985→**0.994** (tc≈166ms, yerleşme ~500ms); hız-devralan yay (200/40) TEST ET (§6-4) |
| DURMA_ESIGI (fizik.ts:20) | 12 px/sn | Swiper eşdeğeri 20 px/sn; 0.99'da süresel etki ihmal | free-mode.ts | **BIRAK** |
| Örnek toplama (SosyalObezite.tsx:353) | Yalnız ana pointermove, buffer 12, performance.now() | Chrome pointermove'u frame başına 1'e coalesce eder; kaçanlar getCoalescedEvents() | MDN PointerEvent.getCoalescedEvents | **DEĞİŞTİR**: coalesced döngüsü + c.timeStamp, buffer 12→32 |
| dt kırpma 50ms, kapalı-form sönüm, touch-action:none, will-change 11 katman, DOM ~180 | mevcut | MainLoop.js sınıf hatası bizde yok; passive-listener sınıfı yapısal yok; ~25MB GPU tavan; Lighthouse eşik 800 | MainLoop.js; Chrome passive-listeners; mspk will-change; Lighthouse dom-size | **BIRAK** — bekçi: HAVUZ≤12, kart-içi çocuğa will-change yasak, oyun yüzeyi <400 düğüm |

## 2. HIS ICIN 5 EN YUKSEK ETKILI DEGISIKLIK

1. **Reel modu: SONUM_MS 0.998→0.99 + kart snap** — fizik.ts:18 + SosyalObezite.tsx rAF. 2000 px/sn fırlatma 2.56sn/999px başıboş coast yerine 0.51sn/199px + en yakın 188px katına oturma. Gerçek reel = pagingEnabled+fast (RN docs); "serbest liste" hissini "reel" hissine çeviren tek en büyük değişiklik. Snap fling BİTTİKTEN sonra devreye girer → "hareket asla kırpılmaz" kuralı (fizik.ts:4) ihlal edilmez; kart sayacı floor tabanlı → skor determinizmi bozulmaz.
2. **Yakalamada 80ms hitstop + 1.12 overshoot pop** — SosyalObezite.tsx yakalamaDene (:280-316). `hitstopBitisT = t+80`; süresince offset/sönüm ilerlemez (s.hiz korunur), tur saati ve spawn takvimi değişmez (12×80ms=960ms < aklaYatkin ±2sn, engine.ts:195). Pop: scale 1→**1.12**→1, çıkış 90ms cubic-bezier(0.05,0.7,0.1,1), dönüş 160ms (M3 medium1=250ms) — mevcut 1.06/150ms tek-yönlü ease-out yerine. arXiv 2208.06155'in 3 belirleyici kanalından (hitstop/ses/kamera) ses kilitliyken 2'sini açar. reduced'da atla.
3. **GERÇEK spawn girişi salience** — SosyalObezite.tsx:507. Mevcut `opacity 120ms linear` + anlık scale=1 yerine: scale **0.9→1.03→1, 250ms, cubic-bezier(0.05,0.7,0.1,1)** + ilk 400ms'de boxShadow alpha 0.34→0.55→0.34 tek pulse (rAF). 2000+ px/sn akışta 0.1-0.3sn parlayan işaret şu an algılanamıyor — "kaçan gerçek = piyango" hissinin ve kullanıcı yargısının en doğrudan kaynağı. Human Benchmark medyan reaksiyon 273ms TAM-EKRAN uyaranla; 1800ms pencere doğru, kırık olan algılama girdisi.
4. **Fırlatma kestirim paketi** — fizik.ts + SosyalObezite.tsx:353: BAYAT_ESIGI_MS=40 (Android 40ms; 40-89ms dur-bırak hayalet fling'i kapanır) + son-ağırlıklı hız (max(son-2-örnek, 90ms-ortalama); düz ortalama tepe hızı sistematik düşük tahmin ediyor = "melas") + MIN_FIRLATMA=50 + MAX_FIRLATMA=8000 clamp + getCoalescedEvents (90ms pencerede örnek 5-6→12-15). Aynı jestin aynı hızı vermesi = fling tutarlılığı.
5. **Negatif olay şiddet merdiveni: trauma sarsıntısı** — SosyalObezite.tsx oyun kök div'i, rAF translate. shake = trauma³ (Eiserloh; 0.3→%2.7, 0.6→%21.6): yanlış dokunma trauma 0.3 / max 6-8px / ~200ms sönüm; seri>0'dayken kaçırma (skorun ~%70'ini yöneten olay) trauma 0.5 / max 10-12px + işaret 300ms'de 14px düşerek sönme. Sarsıntı YALNIZ negatif olaylara — yakalama kanalı hitstop+pop. Yalnız transform, reduced'da kapalı. Haptik düzeltmesi aynı commit'te: vibrate(50)→yakalama `[18,50,22]`, ceza `12` (Android <20ms tık bandı), kaçırmaya haptik yok, iOS hack'i yok.

## 3. YARISMA VE VIRALITE

| Mekanik | Somut tanım | Kaynak | Karar 1-16 çelişkisi |
|---|---|---|---|
| Günlük ortak seed | `gunlukSeed = 'so-' + YYYY-MM-DD` (UTC); "Bugün" tablosuna yazan tur bu seed'le oynanır — spawnTakvimi(seed) zaten deterministik, yalnız seed kaynağı değişir | GeoGuessr Daily (herkese aynı 5 lokasyon); Wordle ortak-bulmaca | YOK — formül kilidi (engine.ts:7-9) korunur, sabit değişmez |
| Spoiler'sız emoji satırı | Tur-sonu kopyala butonu: `SOSYAL OBEZİTE #<günNo>` + 12'lik 🟢/⚫ yakala-kaçır dizisi + `9/12 ×2` + URL; olay listesi engine.ts:135'te hazır, sıfır ek veri; Web Share API + pano | Wordle 90→300.000+ oyuncu 2 ayda; 16 Ara 2021 paylaş butonu; format düz METİN olduğu için yayıldı | YOK — kilit paylaşım metnini kapsamıyor; lansman öncesi format değişikliği serbest |
| Günün Turu 1 resmi hak + Antrenman sınırsız | Resmi deneme: localStorage `soGunlukDeneme:<tarih>` + sunucuda anon-id/IP ile aynı gün 2. yazım red; Antrenman tabloya yazmaz, "rekoru geç" oturum-içi | Wordle kıtlık + Flappy Bird rage-loop; GeoGuessr ikisini birlikte kullanır | Kararlarda deneme-sınırı maddesi yok → YENİ mekanik, kullanıcı onayı ile |
| Near-miss satırı | Tur-sonu: hemen üstteki ad + fark ("deniz_04'ü geçmek için 12 puan") + bugünkü sıra; fark <50 (=YAKALAMA_TABAN, tek yakalama) ise vurgulu; Redis ZRANK+ZRANGE | Clark 2009 (Neuron): near-miss gerçek kazançla aynı ödül devresi; ~%30 oran devam-etme tepesi | YOK |
| Yüzdelik dilim | "bugün oyuncuların %X'inden önde" (ZCOUNT/ZCARD, 1 sorgu); ilk 10'da ham sıra; emoji satırına da girer | Octalysis: "#42.372" çaresizlik, "en iyi %24" ilerleme | YOK |
| Rövanş linki | `?seed=<seed>&d=<davet-id>`; davet edenin skoru 24 saat Redis hash'te; gelen aynı takvimi oynar, sonuçta iki skor yan yana + "cevabını gönder"; login yok | Zynga arkadaş-tablosu; K-faktör hedefi 0.15-0.25 (reteno) | YOK |
| Gün serisi | localStorage `soSeri:{sonTarih, gun}`; tur-sonu + paylaşım metnine "🔥 4. gün"; sunucu değişikliği yok | Duolingo: 7+ gün seri = 2.4× retention | YOK — donenOyuncuMesaji localStorage deseniyle aynı KVKK notu kapsar |
| Anında restart | "bir tur daha" tek dokunuş → ilk kart ≤1000ms; itiraf/istatistik yalnız turNo===1 | Super Hexagon: ~59sn ortalama tur, <1sn restart | Karar 12 SINIRINDA: store CTA'lar birincil KALIR (sentez §5 ile aynı çizgi) |
| Skor kırılımı gösterimi | Tur-sonu 3 satır: "kaydırma: X · yakalama: Y · ceza: -Z" — SkorKirilimi hazır; "kaydırmak kazandırmaz" tezini sayı söyler | LD57 DoomScrolling zıt-kutup; Bogost procedural rhetoric | YOK — sunum, engine değişmez |
| Varsayılan sekme + kendi satır | Bugün varsayılan; oyuncunun satırı altta sabit ("sen: 430 — %24"); `so:lb:weekly:<ISO-hafta>` şeması hazırlanır | Adrian Crook/Trophy: all-time = kapalı yarış | YOK |
| Tohum test | Yayın öncesi emoji formatı 2-3 gerçek WhatsApp grubunda 1 hafta; ölçüt cevap/paylaşım ≥0.5 + link tıklaması | Wordle formatı kapalı grubun icadı (thespinoff) | YOK — süreç, kod değil |

## 4. OSS REPO KAZANIMLARI

| Repo | Alınan teknik (kod değil) | Uygulama yeri |
|---|---|---|
| nolimits4web/swiper (free-mode.ts) | sticky snap davranışı: momentum bitince en yakın slide sınırına yapışma (~30 satır port) + minimumVelocity kapısı deseni | fizik.ts snap + MIN_FIRLATMA |
| pmndrs/use-gesture (maths.ts) | rubberbandIfOutOfBounds asimptotik formülü (x·d·c)/(d+c·x) | fizik.ts konumIlerlet, c=0.55 |
| AOSP VelocityTracker (.cpp/.h) | 40ms pointer-stopped sıfırlama + son-ağırlıklı kestirim ilkesi (LSQ2'nin basitleştirilmiş hedefi) + 50/8000 fling kapıları (ViewConfiguration.java) | fizik.ts firlatmaHizi |
| ariya/kinetic (Part 2) | 0.8·yeni + 0.2·eski low-pass hız filtresi; tc=325ms kapalı-form referansı | firlatmaHizi alternatif filtre; sönüm A/B |
| motiondivision/motion | hız-devralan sonumlu yay (bounceStiffness=200, bounceDamping=40) — sınıra hızlı çarpışta hızlı dönüş | fizik.ts geriYayla (test-et aşaması) |
| better-scroll | swipeBounceTime=500ms hedef yerleşme + momentumLimitDistance=15px | geriYayla 0.994 kalibrasyonu + onUp min-mesafe |
| hammerjs (input-consts.js) | 25ms hesap aralığı — kestirim penceresi kısaltma gerekçesi | firlatmaHizi pencere kararı |
| TanStack/virtual, MainLoop.js, doom-scroll repoları, iOS haptik hack'leri | **ALINMAZ** — havuz mimarisi, kapalı-form döngü ve skor deseni (Upstash sorted-set ile birebir) doğrulandı | karar kapalı, yeniden açılmaz |

## 5. OLCUM PLANI

**Ölçümden önce kapatılacak bilinen frame-bütçe ihlalleri** (ölçümü kirletmesin): süre çubuğu her-frame `style.width` → `transform: scaleX()` + transform-origin:left (SosyalObezite.tsx:239 — 1.8sn yakalama penceresinde her frame layout); ceza elemanı left/top → translate3d (:300); kademe sınırında 10-kart toplu yazımına frame başına 3 kart kotası (:181-221).

| Ne | API / kod | Eşik: üstü "kötü" |
|---|---|---|
| Uzun frame'ler + suçlu script | `PerformanceObserver` type:'long-animation-frame' (Chrome 123+, sabit 50ms eşik); entry.blockingDuration + scripts[0].invoker | **>2 LoAF / 60sn tur** |
| 17-49ms düşen frame'ler (LoAF GÖRMEZ) | rAF-delta histogramı: kovalara 16/33/50-/50+ ayır, tur sonunda `__fps` | **33ms+ kova toplamı ≥ %5** |
| Dokunma gecikmesi | Event Timing: `observe({type:'event', durationThreshold:16})`; processingStart−startTime = input delay | tek frame kaçıran dokunuş (≥17ms duration) yakalama penceresinde tekrarlıyorsa kötü |
| Fling tutarlılığı | Aynı jest 10 tekrar (DevTools ile veya elle), firlatmaHizi çıktı varyansı logla | varyasyon katsayısı >%20 = kestirim hâlâ gürültülü |
| Düşük-tier temsilcisi | DevTools Performance: CPU **6x throttle** + "low-tier mobile" preset, 60sn tam tur | yukarıdaki iki eşik throttled koşuda da tutmalı (P75 küresel cihaz ≈ ~200$ Android — infrequently.org 2024) |
| Kalıcı telemetri | Tur sonunda histogram + LoAF sayısı skor POST'una eklenir (sunucuda alan var, PII yok) | dağılımın p75'i eşik üstüne çıkarsa alarm |

Ritüel: her his değişikliği bu üçlü sonda açıkken koşulur; eşikler docs/his-denetimi-sentez.md'ye ölçüm protokolü olarak eklenir.

## 6. CELISKILER

1. **Sönüm: 0.99 (RN fast) vs 0.9969 (ariya tc=325ms) vs 0.998 kalsın.** Seçim: **0.99 + snap birlikte.** Gerekçe: hedef "reel" hissi = paging davranışı (RN docs: iOS paging fast kullanır); 0.9969 snap'siz akış için orta yol olurdu ama snap ekleniyor — snap varken uzun coast (0.998/0.9969) hedef kartı geçip geri dönme üretir. Snap gecikirse tek başına 0.997 geçici orta yol.
2. **Kestirim: tam LSQ2 portu vs 50ms pencere vs son-iki-olay/2 (Swiper) vs 0.8/0.2 low-pass (ariya).** Seçim: **max(son-2-örnek anlık hızı, 90ms ortalaması) + coalesced örnekler.** Gerekçe: LSQ2 portu maliyet/fayda düşük (Android bile scroll ekseninde farklı strateji kullanıyor); Swiper'ın çıplak son-iki-olay'ı tek kötü çifte teslim (bu yüzden /2 ile yamalı); max() hem ivmeli flick'in tepe hızını yakalar hem gürültüye ortalama zemini bırakır. MAX_FIRLATMA=8000 clamp gürültü riskini kapatır.
3. **Lastik c=0.55 (iOS) vs c=0.15 (use-gesture varsayılanı) vs doğrusal 0.35 (framer).** Seçim: **c=0.55.** Gerekçe: tüm fizik iOS taklidi üzerine kurulu (SONUM_MS yorumu dahil) — karışık kaynak yerine tek platformun bütün sabitleri; doğrusal 0.35 zaten mevcut ve "ucuz his"in kaynağı; 0.15 iOS'tan sert.
4. **Geri yaylanma: hız-devralan yay (framer 200/40) vs üstel 0.994 (better-scroll 500ms).** Seçim: **ilk commit 0.994, yay test-et.** Gerekçe: tek sabit değişimi riski sıfıra yakın ve algılanan süreyi 66ms→~500ms yerleşmeye taşır; yay entegrasyonu yeni durum (hız devri) gerektirir — üst sınır oyunda nadir olduğundan yatırım ölçümden sonra.
5. **Hitstop 0.2sn (Vlambeer) vs 60-80ms (valdemird).** Seçim: **80ms.** Gerekçe: 0.2sn ikincil-kaynaklı masaüstü değeri; 60sn'lik skorlu turda 12×200ms=2.4sn aklaYatkin ±2sn toleransını AŞAR — 12×80ms=960ms güvenli.
6. **Sarsıntı yakalamaya da mı?** Hayır — **yalnız negatif olaylara.** Gerekçe: Vlambeer ilkesi kanal ayrımı; yakalama pozitif kanalı hitstop+pop; her olaya sarsıntı = şiddet merdiveninin (bulgu: seri-kaybı ≠ sıradan kaçırma) düzleşmesi.
7. **Snap vs "hareket ASLA kırpılmaz" (fizik.ts:4).** Çelişki YOK sayıldı: kural parmak-takibi ve fling sırasındaki kırpma yasağı; snap fling öldükten sonra hedefleme. Doğrulama raporu determinizm ve kart sayacı etkisini ayrıca onayladı; yine de deploy öncesi teorikTavan testleri koşulur.
8. **Günde-1 (Wordle) vs sınırsız retry (Flappy Bird).** Seçim: **ikisi birden, ayrı modlarda** (GeoGuessr emsali): Günün Turu = kıtlık + ortak seed + tablo; Antrenman = rage-loop + ≤1sn restart. Tek moda indirgemek iki viral mekanizmadan birini öldürür.
9. **Ham sıra vs yüzdelik.** İkisi koşullu: ilk 10 ham sıra (prestij), gerisi yüzdelik (Octalysis %90-demotivasyon bulgusu).
10. **Pencere 90ms kısalt vs koru.** Koru (Android HORIZON=100ms normu) — kısaltma yerine son-ağırlık + coalesced; BAYAT_ESIGI_MS=40 ayrı sabit olarak pencereden koparılır (iki farklı kavramın tek sabitte birleşmesi asıl bug'dı).

Dosya yolları: /Users/suyarer/Cb-Web/lib/game/fizik.ts · /Users/suyarer/Cb-Web/lib/game/engine.ts (değişiklik YOK — kilit korunur; yalnız seed kaynağı + gunlukSeed helper) · /Users/suyarer/Cb-Web/components/game/SosyalObezite.tsx · /Users/suyarer/Cb-Web/components/game/OyunKabuk.tsx (tur-sonu: emoji satırı, near-miss, kırılım, restart) · /Users/suyarer/Cb-Web/docs/his-denetimi-sentez.md (ölçüm protokolü eklenecek).