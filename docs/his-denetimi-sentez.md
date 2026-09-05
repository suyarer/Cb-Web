## 0. ÇÜRÜTÜLENLER / KAPSAM DÜZELTMELERİ — tek satır gerekçe

- **"Boşalma yayını oyuncu ancak 38. sn'de fark eder"** → yanlış: 25 sn klise→bos geçişi görünür (ust 1→0.25, alt→0, metin ≤25 kr); kırık olan yalnız İLK basamak (12 sn, tek fark alt-satır 0.5→0.25) — bulgu o basamağa daraltıldı.
- **"Fren dokunuşu HER seferinde -20 yiyor"** → abartı: yalnız <12px + <280ms "dab"lar; ama doğal fren tam da dab olduğu için mekanizma geçerli, düzeltme listede.
- **"Hızlı fling'de oyuncu gerçeği HİÇ görmedi"** → spawn anında 0.1-0.3 sn ekranda parlar; 2000+ px/sn akışta algılanamaz olduğundan öz geçerli, mutlaklık düzeltildi.
- **"Ses ekle — spec §13-4 zaten öneriyor"** → çürütüldü: §13-4 ONAY BEKLEYEN maddedir (öneri ≠ onay); ses bu turda EKLENMEZ (bkz. §5).
- **"Kaçırılan kart griye düşüp hızlanarak aksın"** → çürütüldü: kartlar `index*KART_H - offset` ile konumlanır (SosyalObezite.tsx:158), bağımsız hareket EDEMEZ; imza İŞARET çerçevesine taşındı.
- **"Yakalamada '+50' rozeti"** → çürütüldü: gerçek değer çarpanla 50/75/100 (engine.ts:143-147); sabit +50 skor ekranıyla çelişip güven kırar — rozet gerçek puanı yazar.
- **"İşareti `floor(offset/188)+2`'ye yeniden ata"** → çürütüldü: viewport ORTASINA ışınlar + sürekli fling'de stroboskopik yanıp sönme; alttan-giren slota atanır (bkz. değişiklik 4).
- **"React commit=0 iddiası"** → dosya başlığındaki iddia (satır 27) fiilen tutmuyor (setHud 4/sn + setAnons); çürütme değil doğrulama — düşük öncelikli fix §2 sonunda.

---

## 1. HİSSİ EN ÇOK DÜZELTECEK 5 DEĞİŞİKLİK (etki sırasıyla)

**1) Parmak sahipliği + devir (çok-parmak kaydırma)**
- Dosya: `components/game/SosyalObezite.tsx:236-275`
- Ne değişecek: `S.current`'a `aktifPointerId` ekle. `onDown`: sürükleme yokken sahiplen; sürükleme VARKEN gelen ikinci down = DEVİR — `sonY = e.clientY` eşitle, `basY/basT`'yi tap değerlendirmesine SOKMA, `ornekler = [{t, y}]` sıfırla (karışık örnek fırlatmayı bozar). `onMove/onUp`: `e.pointerId !== aktifPointerId` ise return. `onUp`'ta başka pointer hâlâ basılıysa `surukleniyor` KAPANMAZ, sahiplik o pointer'a geçer.
- Oyuncu farkı: dönüşümlü çift-başparmak (reel'in güç jesti) artık ışınlanma + donma + rastgele -20 üretmez; ilk 10 saniyedeki "oyun bozuk" yargısının en güçlü tek kaynağı kapanır.
- Değerler: yoksayma DEĞİL devretme (yalnız yoksayma B parmağını ölü bırakır — hasım doğrulama şartı).

**2) "Durdur → oku → bırak" ritüeli: fren dokunuşu bedava + hortlak fling ölür**
- Dosyalar: `SosyalObezite.tsx:236-246, 262-275` + `lib/game/fizik.ts:33-44` + `:129`
- Ne değişecek: (a) `onDown`'da `hiz = 0` yazmadan ÖNCE `s.hizOnDown = s.hiz` kaydet; `onUp` tap dalında `|hizOnDown| > 200 px/sn` VE `aktifGercek` yoksa ceza yazma, `yakalamaDene` çağırma (gerçek varsa yine yakala). (b) `firlatmaHizi` başına: `simdi - ornekler[ornekler.length-1].t > HIZ_PENCERESI_MS` ise `return 0`. (c) Satır 129: `hiz = 0` yalnız `hiz <= 0` iken — pozitif hızla lastikten çıkan fling yutulmaz.
- Oyuncu farkı: reel'in en evrensel ritmi (fırlat → dokunup durdur → oku → devam) artık ne puan yakar ne parmak kalkınca içerik hortlak gibi kaçar; üst sınır "yapışkan el" hissi biter.
- Değerler: fren eşiği 200 px/sn (DURMA_ESIGI=12'nin çok üstü — durmuş feed bahane üretemez); fizik fix'i tek satır + test vakası. Suistimal kapalı: ilk dab hızı sıfırladığından ikinci dab normal ceza yer.

**3) Olay imzaları: yakalama / kaçırma / ceza görünür olsun (tek dopamin anı)**
- Dosya: `SosyalObezite.tsx:223-233, 373-384` — hepsi rAF-DOM, React'siz
- Ne değişecek: Yakalamada işaret çerçevesi 150ms scale 1→1.06 pop + parlama, üstünde rozet: **gerçek puan** (`YAKALAMA_TABAN × mevcut çarpan` → "+75 ×1.5"). Kaçırmada işaret griye sönüp hafif küçülerek 250ms'de kaybolur (kart değil — bkz. §0). Yanlış dokunmada dokunulan noktada 600ms yüzen "-20" + skor çipinde 150ms kırmızı flash + İLK seferde bir kez "Gerçek yokken dokunmak 20 puan yakar" (spec §2.3'ün kodlanmamış ZORUNLU şartı). `navigator.vibrate` 14→50ms (Android; iOS'ta API yok, görsel imza asıl kanal). Tap kapısı `TAP_ESIGI_PX 12→18`, `TAP_SURESI_MS 280→500`; else dalında mesafe<28px VE fırlatma hızı<250 px/sn ise fling yerine `yakalamaDene`.
- Oyuncu farkı: yakaladın mı kaçtı mı 250ms sonra skordan çıkarım yapmak yerine ANINDA bilirsin; ceza öğrenilebilir hale gelir; aceleci yakalama dokunuşu sessizce sürüklemeye dönüşmez.

**4) Gerçek işareti asla görünmez ölmesin**
- Dosya: `SosyalObezite.tsx:137, 177-186`
- Ne değişecek: rAF'ta işaretin hedef y'si viewport dışına taştıysa (İKİ yön kontrol) kartIndex'i akış yönünde EKRANA GİREN slota yeniden ata: aşağı akışta `floor(s.offset/KART_H) + ceil(viewportH/KART_H)`, yukarıda `floor(s.offset/KART_H)+1`; frame başına en fazla 1 atama; `basladi` DEĞİŞMEZ (pencere/determinizm/sunucu dokunulmaz). İkincil sinyal: `aktifGercek` varken HUD Bean'inin çevresinde asit-yeşili halka (rAF'ta opacity; yönlü "▲ yukarıda" oku YOK — bkz. §4).
- Oyuncu farkı: hızlı kaydıran (hedef kitlenin ta kendisi) gerçeği hep önünde belirirken görür; "hiç görmediğim şey için Kaçtı + çarpan sıfırlandı" piyango hissi biter.
- Değerler: YAKALAMA_PENCERESI_MS 1800 aynen; spec C5 garantisi artık GÖRÜŞTE de tutar.

**5) GERÇEK'in kendi içeriği: yeşil hitbox değil, sıcak davet**
- Dosyalar: `content/sosyal-obezite-feed.ts` + `SosyalObezite.tsx:370-384`
- Ne değişecek: `GERCEK_DAVETLER` havuzu (8-10 metin, ≤90 karakter, somut: "Perşembe 19.00 sahil yürüyüşü — 3 kişi eksik, gel" tarzı). İşaret elemanına OPAK zemin (#0A0A0A — alttaki parodi metniyle üst üste binmesin, şart) + mini düzen: avatar + davet metni. Spawn'da rAF içinde tek `textContent` yazımı.
- Oyuncu farkı: neyi kurtardığını GÖRÜR; parodi çölünün ortasında sıcak bir şey belirir — kontrast tezi kendisi anlatır, tur sonu "kurtardığın gerçek 4/12" ilk kez duygusal karşılık bulur. Karar 2'nin uygulanmamış içerik yarısı kapanır.
- Kısıt: bu metinler feed.ts karantina muafiyetinin DIŞINDA — brand-voice tabi ("katıl/etkinlik" sözlüğü, jargon yasak).

---

## 2. GÖRSEL: "gerçek akış" hissi için eksikler

Mantıksal slot 188px ve skor/determinizm HİÇ değişmez; hepsi kart İÇİ, deterministik rng ile:

1. **3 kart varyantı** (`kartVerisi()` içinde seed'li seçim): (a) metin-only, (b) 64-72px yuvarlatılmış medya bloğu (seed'den 2-renkli koyu gradyan, marka paleti) + KISA metinle eşleştir (90 karakterlik anlamli metni sığmaz — hasım şartı), (c) kısa metin büyük punto. Medya bloğu boşalma yayına DAHİL (bos/boskutu'da o da söner).
2. **Canlı avatar**: `hsl(hash(ad)%360, 25%, 22%)` zemin + adın ilk harfi (span'e flex-center gerekir); `ADLAR` 8→20-25 sahici takma ad (deniz_04 tarzı; gerçek handle'a Levenshtein ≤2 MANUEL denetim — spec §2.5(4) yayın-blokajlı). Klise kademesinde doygunluk düşer → çürüme dipten değil zirveden başlar.
3. **♥ kaldır — YAYIN BLOKAJI** (spec-v2:75 madde 1): "◆ 188  ◇ 12  ↗ 3" üç span; JSX iskeleti (:363-366) VE yazıcı (:168) BİRLİKTE güncellenir, yoksa 2-3. span ölü kalır. Kademelerde teker teker söner.
4. **Boşkutu = iskelet, siyah boşluk değil**: boş halka + 2 gri çubuk #1A1A1A; önceki kademelerde opacity 0'da GİZLİ. Çubuklar daha parlak YAPILMAZ (boşalmanın "sönme" yönü tersine döner).
5. **İlk basamağı görünür kıl**: klise'de avatar-doygunluk düşüşü + metin white/80→white/60 (white/55 kontrastta sınırda, axe CI riski); bos'ta ad satırı 0.4 + kenarlık silik. Hepsi :171-174 mevcut yazım noktasına 3-4 satır.
6. **Recycle ≠ crossfade**: geri dönüşümde `transition:'none'` ile yaz, YALNIZ aynı index'te kademe değişiminde 400ms geçiş (anahtar `index:kademe` ayrımı zaten var). Hayalet belirme/pelte hissi + frame maliyeti birlikte ölür.
7. **Üst fade maskesi**: HUD arkasına `inset-x-0 top-0 h-24`, `linear-gradient(#050505 30%, transparent)`, pointer-events-none; `backdrop-blur` çiplerden KALDIRILIR (scroll altında her frame GPU blur — düşük-tier Android'de 40-50fps'in ana suçlularından).
8. **Zaman damgası**: rng'den "şimdi/2dk/14dk/1sa" üçüncü span; boskutu'da hep "şimdi".
9. **Wordmark**: alt mesaj satırının üstüne silik "SOSYAL OBEZİTE · clubbeans.com" (10-11px mono text-ghost) — viral ekran görüntüsü kimliksiz kalmasın.
10. **Masaüstü**: `ilkIndex-1` ofseti → `ilkIndex`; `HAVUZ = max(10, ceil(viewportH/188)+2)` mount'ta.

Perf temizliği (aynı dosya, his-koruyucu): sayaç çubuğu `width` → `scaleX` (:184); kademe eşiğinde 10-kart yeniden yazımına frame başına 2-3 kart bütçesi; `HAVUZLAR` haritasını modül seviyesinde bir kez kur (FEED.filter rAF'tan çıkar); setHud'u yalnız değer değişince çağır; offset değişmemişse transform yazma; BeanCozulme'de 66 rect'i baştan mount edip opacity ile sür.

---

## 3. GERİ BİLDİRİM anları (tam liste)

| An | Görünen |
|---|---|
| Yakalama | İşaret pop + parlama, "+{gerçek puan} ×{çarpan}" rozeti, HUD "gerçek 3/12" sayacı pulse, seri noktaları dolar, vibrate 50ms |
| Kaçırma | İşaret griye sönüp küçülerek 250ms'de gider; seri noktaları kısa titreşimle boşalır (çarpanın öldüğü GÖRÜNÜR) |
| Yanlış dokunma | Dokunulan noktada 600ms "-20" + skor çipi 150ms kırmızı flash; ilk seferde tek mikro-mesaj |
| Skor değişimi | Sayıya 100ms scale-tick (yön ve an hissedilir; 250ms throttle kalır) |
| Bean faz geçişi | 300ms scale-pop + kartlar 200ms hafif soluklaşma (5 kez, dikkat köprüsü; `reduced`'da atla) |
| İlk tur ölü başlangıç | İlk yakalamaya kadar HUD altında kalıcı "Yeşil çerçeve belirince dokun" |
| HUD | Skorun yanına kalıcı "gerçek n/12" + 2 seri noktası (×1.5/×2.0) — skorun ~%70'ini üreten mekanik ilk kez görünür |
| Tur sonu | "bir tur daha" ≥48px İKİNCİL buton + "rekorun: 430" / 2.+ turda "rekoru geç: 430" (oturum-içi ref); itiraf ekranı yalnız `turNo===1` (OyunKabuk.tsx:120-133 remount'ta prop zaten var) |
| Tur mesajı | Oyun içi 11px satır tur SONUNA taşınır (zaman kipi "gitti" ancak orada doğru); `donenOyuncuMesaji` localStorage `{tarih, toplamSaniye}` ile bağlanır + KVKK sayfasına yerel-saklama notu |

---

## 4. ÇELİŞKİLER — seçimler ve gerekçeler

1. **Kademe geçişinde metin swap'ı: crossfade mi, spawn-mühürleme mi?** İki rapor çatışıyor. Seçim: **crossfade** (yalnız viewport-içi kartlarda 120ms opacity-out → yaz → in; ekran dışı anında). Mühürleme RED: duran oyuncunun yayı görmesi dosyanın bilinçli sözleşmesi (SosyalObezite.tsx:24-25) — mühürleme yayı yalnız yeni kartlara taşır, duran oyuncu için tez ölür.
2. **Görünmez işaret sinyali: ekran-sabit bant / yönlü ok / slot-atama / HUD halka?** Seçim: **slot yeniden-atama (birincil) + HUD halka (ikincil)**. Ekran-sabit bant RED: işaret içerik-uzayından kopunca "akışın içinden çıkan gönderi" yanılsaması ve değişiklik 5'in davet kartı bozulur. Yönlü ok RED: oyuncuyu geri kaydırmaya kışkırtır; C3 gereği dokunuş zaten viewport-geneli yakalar — sinyal "dokun" demeli, "yukarı git" değil.
3. **Kademe/Bean eşik çakışması (12/25/38 sn tek-frame yükü): eşikleri ±300ms kaydır mı, yazımı bütçele mi?** Seçim: **frame başına 2-3 kart bütçesi**. Kaydırma RED: dramaturji senkronu (akış boşalırken Bean solar) bilinçli; bütçe + crossfade zaten maliyeti 3-4 frame'e yayar.
4. **400ms transition**: görsel rapor kademede geçiş istiyor, perf raporu recycle'da mirası kapatıyor — çelişki YOK, `index:kademe` anahtarı iki durumu ayırıyor (recycle=geçişsiz, kademe=geçişli).
5. **Tap eşiği 18px mi 24px mi?** 18px (24, kısa kaydırmayı tap'a çevirip fren-fix'iyle etkileşir).
6. **Fren-dokunuşu vs spam-tap cezası**: fren muafiyeti cezayı öldürmez — duran feed'e boşa dokunan yine -20 yer; spec §2.3'ün amacı (kör spam caydırma) korunur. Sunucu tarafı etkilenmez (`aklaYatkin` yanlisDokunma'yı yalnız tutarlılıkla denetler, kaynağını değil).

---

## 5. KARARLARA (1-16) AYKIRI / ONAY GEREKTİRENLER

- **SES: EKLENMEZ.** Spec-v2 §13 madde 4 açık kullanıcı onayı bekleyen madde; oyun-tasarım raporunun "tık sesi ekle" önerisi onay olmadan uygulanamaz. Görsel+haptik imzalar (değişiklik 3) onaysız yapılabilir.
- **"bir tur daha" büyütme — karar 12 sınırında**: store CTA'ları BİRİNCİL kalır, "bir tur daha" ikincil buton olur; sapma değil ama kullanıcı görsün.
- **İtirafın yalnız 1. turda gösterilmesi — karar 3 yorumu**: karar "oyun başında" der, "her turda" demez; tur sonundaki geri dönüş (OyunKabuk.tsx:255-260) zaten var. Aykırılık yok ama davranış değişikliği — işaretli.
- **Yeni kart görselleri + yeni ADLAR + GERCEK_DAVETLER**: spec §2.5 madde 6 "3-saniye testi" (ekip-dışı 5 kişi) ve madde 4 Levenshtein denetimi YAYIN-BLOKAJLI — yeni görsel/isim setiyle bu testler yayın öncesi TEKRAR koşulmalı.
- **Engine sabitleri (skor formülü, spawn, pencere) HİÇBİR öneride değişmiyor** — lansman kilidi (engine.ts:7-9) korunur; rozetler değeri engine'den OKUR, yeniden tanımlamaz.