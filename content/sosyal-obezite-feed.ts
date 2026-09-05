/**
 * SOSYAL OBEZİTE — parodi akış havuzu + oyun metinleri
 *
 * ⚠️ BRAND-VOICE MUAF DOSYA (sentez §C4 — dosya-düzeyi karantina).
 * Buradaki parodi metinler sosyal medya jargonunu BİLEREK kullanır çünkü
 * "alıntılanan düşman" konumundadır. Bu muafiyet YALNIZ `FEED` havuzu içindir.
 * ClubBeans-sesli her yüzey (UI, skor paneli, tur sonu, paylaşım kartı)
 * brand-voice.md'ye %100 tabidir ve aşağıdaki UI_SOZLUK'ü kullanır.
 *
 * İki mutlak kural (metin yazarı uzmanı, KRITIK bulgu):
 *  a) Hiçbir metin gerçek bir kitap/kurs/kişi sloganıyla 4+ kelime örtüşemez.
 *     → arketip parodisi SERBEST, birey parodisi YASAK. Her metnin arketipi etiketli.
 *  b) Platform-özgü terim (bio, story, reels, RT, DM) geçemez.
 *
 * Uzunluk merdiveni kademe geçişinin HİSSEDİLMESİ için zorunludur; kaydırma
 * hızında 1 saniyeden kısa görünen kartta 120 karakter okunmaz ve boşalma yayı çöker.
 */

/** ClubBeans-sesli yüzeylerde kullanılacak SABİT sözlük. Jargon burada yasak. */
export const UI_SOZLUK = {
  akis: 'akış', // "feed" DEĞİL
  kaydirma: 'kaydırma', // "scroll" DEĞİL
  gercek: 'gerçek',
  tur: 'tur',
  skor: 'skor',
  takmaAd: 'takma ad', // "kullanıcı adı" DEĞİL
  bugun: 'Bugün',
  tumZamanlar: 'Tüm Zamanlar',
} as const;

/**
 * "Obezite" kelimesinin geçtiği HER yüzeye sabitlenir — açılış, tur sonu,
 * paylaşım kartı, OG görseli. Bağlamsız ekran görüntüsü riskinin metin telafisi.
 * (üç uzmanın 1 numaralı riski)
 */
export const TANIM_SATIRI = 'Sosyal obezite: kilonun değil, zamanın yutulması.';

/**
 * Kısa tanım — X ve meydan okuma METİNLERİ için (spec §12: "obezite" geçen HER yüzey).
 * Linksiz X gönderisinde OG önizlemesi olmadığı için tanım metnin kendisinde taşınır;
 * 280 karakter bütçesine sığsın diye kısa varyant.
 */
export const TANIM_KISA = 'Sosyal obezite: bedenle değil, zamanla ilgili.';

/** Açılış itirafı — karar 3. Tek dokunuşla geçilebilir, son ekranda geri döner. */
export const ITIRAF = {
  satir1: 'Bu oyun seni burada tutmak için yapıldı.',
  satir2: 'Fark şu: bunu yüzüne söylüyoruz.',
  sonEkranOnek: 'Başta söylemiştik:',
} as const;

export type Kademe = 'anlamli' | 'klise' | 'bos' | 'boskutu';

export type FeedKarti = {
  kademe: Kademe;
  metin: string;
  /** Parodi arketipi — birey parodisi yasağının denetim etiketi */
  arketip?: string;
};

/** Uzunluk tavanları (karakter). Yayın öncesi test bunu doğrular. */
export const UZUNLUK_TAVANI: Record<Kademe, number> = {
  anlamli: 90,
  klise: 60,
  bos: 25,
  boskutu: 0,
};

export const FEED: FeedKarti[] = [
  // ── ANLAMLI: gerçek hayat, somut, kokusu olan şeyler ────────────────────
  { kademe: 'anlamli', metin: 'Babaannemin el yazısı tarif defterinden ilk deneme: yandı ama mutluyum.' },
  { kademe: 'anlamli', metin: 'Bu sabah denize girdim. Kimse yoktu. Her şey duruyordu.' },
  { kademe: 'anlamli', metin: 'Komşumla ilk kez konuştuk. Aynı kitabı okuyormuşuz.' },
  { kademe: 'anlamli', metin: 'Üç yıldır ertelediğim çömlek kursuna yazıldım. Elim titriyor, iyi anlamda.' },
  { kademe: 'anlamli', metin: 'Arkadaşım taşındı; mektuplaşmaya başladık. Kâğıt kokusu iyi geliyor.' },
  { kademe: 'anlamli', metin: 'Balkona domates ektim. İki tane oldu. İkisini de bekleyerek yedim.' },
  { kademe: 'anlamli', metin: 'Yürüyüşte tanımadığım biri saati sordu. On dakika konuştuk.' },

  // ── KLİŞE: arketip parodisi. Birey/marka parodisi YOK. ──────────────────
  { kademe: 'klise', metin: 'Enerjini koru. Herkes seni hak etmiyor.', arketip: 'motivasyon-koçu' },
  { kademe: 'klise', metin: 'Bugün de minnettarlıkla uyandım. Evren fazlasını verecek.', arketip: 'minnet-gurusu' },
  { kademe: 'klise', metin: 'Kimse sana bir şey borçlu değil. Işığını kendin yak.', arketip: 'motivasyon-koçu' },
  { kademe: 'klise', metin: 'Vazgeçme. En karanlık an şafağa en yakın andır.', arketip: 'motivasyon-koçu' },
  { kademe: 'klise', metin: 'Disiplin, motivasyonun bittiği yerde başlar.', arketip: 'verimlilik-vaizi' },
  { kademe: 'klise', metin: 'Sessiz kalanlar kazanır. Gerisi gürültü.', arketip: 'stoacı-poz' },
  { kademe: 'klise', metin: 'Konfor alanın, hayallerinin mezarı.', arketip: 'motivasyon-koçu' },

  // ── BOŞ: içeriksiz onay sesleri ─────────────────────────────────────────
  { kademe: 'bos', metin: 'bunu herkes görmeli' },
  { kademe: 'bos', metin: 'aynen öyle' },
  { kademe: 'bos', metin: 'kaydet, sonra lazım olur' },
  { kademe: 'bos', metin: 'yorumlar altın' },
  { kademe: 'bos', metin: 'bu kadar.' },
  { kademe: 'bos', metin: 'işte bu' },
  { kademe: 'bos', metin: 'kim bilir' },

  // ── BOŞ KUTU: metin yok. Son eşikte tek karakter. ───────────────────────
  { kademe: 'boskutu', metin: '' },
  { kademe: 'boskutu', metin: '' },
  { kademe: 'boskutu', metin: '…' },
];

/**
 * GERÇEK davetleri — yakalanan nesnenin İÇERİĞİ.
 *
 * Denetim bulgusu: oyuncu "gerçek"in ne olduğunu hiç görmüyordu; yakaladığı şey
 * içi yine parodi metniyle dolu bir yeşil çerçeveydi. Böyle olunca ClubBeans tezi
 * ("kaydırırken gerçek buluşmalar yanından akıp gidiyor") mekanikte değil yalnız
 * tur-sonu metinlerinde yaşıyordu.
 *
 * ⚠️ Bu havuz feed karantinasının DIŞINDA — brand-voice'a TAM tabi:
 * jargon yok, "katıl / yer ayır / etkinlik" sözlüğü, sade Türkçe.
 * Somut olacak: gün + saat + yer + insani bir sebep. ≤90 karakter.
 */
export const GERCEK_DAVETLER: string[] = [
  'Perşembe 19.00 sahil yürüyüşü. Üç kişi eksiğiz, sen de gel.',
  'Cumartesi 11.00 Moda’da kahve. Masada iki yer boş.',
  'Yarın akşam kitap kulübü. Kimseyi tanımıyorsan tam sana göre.',
  'Pazar sabahı Belgrad’da koşu. Tempo yavaş, sohbet bol.',
  'Çarşamba 20.00 kutu oyunu gecesi. Yeni gelenler bekleniyor.',
  'Bu akşam 18.30 Kadıköy’de sergi turu. Tek başına gelme.',
  'Salı 19.30 yoga. İlk kez deneyene yer ayrıldı.',
  'Cuma 21.00 canlı müzik. Yanında biri olsun diye yazıyoruz.',
  'Pazar 10.00 bisiklet turu. Yokuş yok, söz veriyoruz.',
  'Perşembe 18.00 seramik atölyesi. Elin kirlensin.',
];

/** Akıştaki sahte hesap adları — hiçbiri gerçek bir hesabı işaret etmez. */
export const AKIS_ADLARI: string[] = [
  'deniz_04', 'sabah_kahvesi', 'yorgun_bulut', 'ucuncu_kat', 'gece_vardiyasi',
  'sessiz_okur', 'kirmizi_bisiklet', 'pazartesi_hali', 'yalniz_kaktus',
  'sisli_pencere', 'eski_kaset', 'kahve_molasi', 'bos_defter', 'uzak_komsu',
  'gec_kalan', 'ilk_otobus', 'kayip_kalem', 'dar_sokak', 'mavi_perde',
  'kis_gunesi', 'son_sayfa', 'acik_radyo', 'bahce_kati', 'rutubetli_ev',
];

/**
 * Kümülatif tur mesajları (karar 7).
 * Sertleşme OYUNCUYA değil DÜZENE yönelir — karar 4 (mesaj hedefi = platformlar).
 * "hâlâ" yalnız aynı oturumda kullanılır; dönen oyuncu için ayrı kalıp var.
 */
export const TUR_MESAJLARI = [
  'İlk tur. 60 saniye gitti. Fark ettin mi?',
  '2. tur. Toplam 2 dakika. Akış tam da bunu istiyor.',
  '3. turun. Toplam 3 dakika. Hâlâ buradasın.',
  '4. tur. Toplam 4 dakika. Sen kaydırmıyorsun; kaydırılıyorsun.',
  '5. tur. Toplam 5 dakika. Akış doymaz. Sen dolmazsın.',
  '6. tur. Toplam 6 dakika. Biz kapıyı açık bıraktık. Diğerleri bırakmaz.',
] as const;

/** Dönen oyuncu (farklı gün) — "hâlâ" kullanılmaz. */
export function donenOyuncuMesaji(dunDk: number, bugunDk: number): string {
  return `Yine geldin. Dün ${dunDk} dakika, bugün ${bugunDk}. Akış seni hatırlıyor.`;
}

export function turMesaji(turNo: number, toplamSaniye: number): string {
  const i = Math.min(turNo, TUR_MESAJLARI.length) - 1;
  if (i < TUR_MESAJLARI.length - 1) return TUR_MESAJLARI[Math.max(0, i)];
  // 6+ turdan sonra son mesaj kalır ama süre gerçek değeri gösterir
  const dk = Math.max(1, Math.round(toplamSaniye / 60));
  return `${turNo}. tur. Toplam ${dk} dakika. Biz kapıyı açık bıraktık. Diğerleri bırakmaz.`;
}

/**
 * Oyun SIRASINDA alt satır. Tur mesajı ("60 saniye gitti") tur bitmeden görünüyordu
 * (denetim oyun-11 / gorsel-10 / etkilesim-14); karar-7 metni tur SONUNA taşındı,
 * oyun içinde yalnız yönlendirme ya da tur sayacı kalır.
 */
export function oyunIciSatir(turNo: number, toplamSaniyeOnce: number): string {
  if (turNo <= 1) return 'Kaydır. Yeşil çerçeve bir davet — dokun.';
  const dk = Math.max(1, Math.round(toplamSaniyeOnce / 60));
  return `${turNo}. tur · akışa toplam ${dk} dk verdin`;
}

/**
 * Tur sonu bloğu — CTA oyunun mekanik diline bağlanır.
 * "Hemen / şimdi / kaçırma" YASAK: aciliyet dili, eleştirdiğimiz düzenin dilidir.
 */
export const TUR_SONU = {
  baslik: '60 saniye bitti.',
  kopruSatiri: 'Kaçırdığın gerçekler ekranda değil, dışarıda duruyor.',
  // Near-miss ile mağaza düğmesi arasında köprü: akıştaki davetler uydurmaydı, uygulamadakiler değil.
  ctaUstu: 'Akıştaki davetler uydurmaydı. ClubBeans’tekiler değil.',
  storeAppleEtiket: 'App Store',
  storeGoogleEtiket: 'Google Play',
  kvkkSatiri: 'Takma adın ve skorun herkese açık tabloda ve paylaşım kartında görünür.',
  kvkkLink: 'Hangi veriler işleniyor?',
} as const;

/**
 * Tur sonu gövdesi — EKSİZ kalıp. Önceki `${kacan}'i` sayıların 13'te 9'unda yanlıştı
 * ("7'i" → "7'si", "12'i" → "12'si"); ünlü uyumlu ek üreteci yerine kalıp değiştirildi
 * (denetim viral-5 / dogruluk-11).
 */
export function turSonuGovde(kartSayisi: number, yakalanan: number, kacan: number): string {
  const kart = `${kartSayisi} kart kaydırdın.`;
  if (yakalanan === 0) return `${kart} Hiçbirini yakalamadın; ${kacan} davet akıp gitti.`;
  if (kacan === 0) return `${kart} ${yakalanan} gerçeğin hepsini yakaladın.`;
  return `${kart} ${yakalanan} gerçeği yakaladın; ${kacan} tanesi akıp gitti.`;
}

/** Rakip hükmü — ad ek almaz. */
export function rakipHukmu(rakipAd: string, benimSkor: number, rakipSkor: number): string {
  if (benimSkor > rakipSkor) return `${rakipAd} geçildi.`;
  const fark = rakipSkor - benimSkor + 1;
  if (fark <= 100) return `${rakipAd} ile arana ${Math.max(1, Math.ceil(fark / 50))} yakalama kaldı.`;
  return `${rakipAd} önde.`;
}

/**
 * Paylaşım kartı metni.
 * Hiyerarşi ZORUNLU: (1) kurtarılan gerçek BÜYÜK, (2) akışa verilen süre, (3) skor küçük.
 * Meydan okuma fiili "geç beni" DEĞİL "kurtar" — rekabet tezi desteklemek zorunda.
 */
export function paylasimMetni(yakalanan: number, toplamDk: number): string {
  return `SOSYAL OBEZİTE — ${yakalanan} gerçeği kurtardım. ${toplamDk} dakikamı akış aldı. Sen kaçını kurtarabilirsin?`;
}

/** Kart sayfasının OG açıklaması — başlıkla aynı ses (3. şahıs); ad ek almaz. */
export function kartAciklamasi(ad: string, yakalanan: number, toplam: number, toplamDk: number): string {
  return `${ad}, ${toplam} gerçeğin ${yakalanan} tanesini kurtardı; akış ${toplamDk} dakikasını aldı. ${TANIM_SATIRI} Sen kaçını kurtarabilirsin?`;
}

/**
 * Wordle biçimi paylaşım satırı — dış referans araştırmasının en yüksek
 * değerli/en ucuz kazanımı (72 kaynaklı sentez §3).
 *
 * Wordle 2 ayda 90 → 300.000+ oyuncuya paylaş butonuyla çıktı; format DÜZ METİN
 * olduğu için her yere yapıştırılabildi ve SPOILER İÇERMEDİĞİ için paylaşmak
 * bedava oldu. Bizde olay listesi (yakala/kaçır) zaten motorda hazır — sıfır ek
 * veri, sıfır ek istek.
 *
 * 🟩 yakalanan gerçek · ⬛ kaçan. İkisi de "büyük kare" ailesinden — Wordle'ın
 * ızgarasının hizalı görünmesinin sebebi budur. 🟢/⚫ karışımı farklı genişlikte
 * olduğu için desen tırtıklı çıkıyordu.
 * Skor küçük yazılır: kartın kahramanı "kaç gerçeği kurtardın", "kaç puan yaptın" değil.
 */
/**
 * 18 Ağustos 2026 TR gece yarısı = 1. gün. Epok UTC gece yarısıydı; günlük seed ve tablo
 * TR (UTC+3) gece yarısında değişirken paylaşım numarası 00:00-03:00 arası bir gün
 * geride kalıyordu (denetim dogruluk-4). Artık iki eksen aynı.
 */
export const OYUN_EPOK = Date.UTC(2026, 7, 17, 21); // 2026-08-18T00:00+03:00
const TR_OFSET = 3 * 60 * 60 * 1000;

export function gunNo(now: Date = new Date()): number {
  return Math.max(1, Math.floor((now.getTime() + TR_OFSET - (OYUN_EPOK + TR_OFSET)) / 86_400_000) + 1);
}

export function emojiSatiri(olaylar: Array<'yakala' | 'kacir'>): string {
  return olaylar.map((o) => (o === 'yakala' ? '🟩' : '⬛')).join('');
}

/**
 * KİMLİK ETİKETİ — paylaşımın asıl yakıtı.
 *
 * İnsanlar skor paylaşmaz, KENDİLERİNİ paylaşır (Berger, Social Currency;
 * Spotify Wrapped'in tüm mekanizması budur). Çıplak "5/12" bir sayıdır;
 * "Aradaki Bean" bir portredir ve ekran görüntüsü alınır.
 *
 * Etiketler oyuncuyu AŞAĞILAMAZ — ton düzene yönelir, kişiye değil.
 */
export function etiketEsle(yakalanan: number, yanlisDokunma: number): string {
  if (yanlisDokunma >= 5) return 'Panik Parmak';
  if (yakalanan === 0) return 'Tam Teslimiyet';
  if (yakalanan <= 3) return 'Akıntıya Kapılan';
  if (yakalanan <= 7) return 'Aradaki Bean';
  if (yakalanan <= 11) return 'Uyanık';
  return 'Akışa Direnen';
}

/**
 * Fiyasko satırları — düşük skoru paylaşılabilir kılan mizah.
 *
 * Flappy Bird'ün en çok yayılan paylaşımı "0 puan aldım" idi: başarısızlık,
 * başarıdan daha paylaşılabilirdir çünkü övünme değil ortaklık kurar.
 * KURAL: özne daima AKIŞ, asla oyuncu. "Sen beceremedin" cümlesi yasak.
 */
export const FIYASKO_SATIRLARI = [
  'Akış bugün beni yuttu.',
  'Akış 60 saniyemi aldı, karşılığında hiçbir şey vermedi.',
  'Bugün akışın tarafındaydım.',
  'Akış kaydırdı, ben kaçırdım.',
] as const;

/** Kısa itiraf — paylaşım metni tıklanmasa bile markanın tezini taşır. */
export const ITIRAF_KISA = 'Bu oyun seni tutmak için yapıldı. Yüzüne söylüyor.';

/**
 * SATIR BÜTÇESİ ANAYASASI (panel kararı):
 *   sabit çekirdek  = başlık + emoji ızgarası + sonuç/etiket
 *   + EN FAZLA 1 koşullu satır (öncelik: fiyasko > kısa itiraf)
 *   + kısa tanım satırı (spec §12 — "obezite" geçen her yüzey; denetim viral-4)
 *   + son satır: kanal 'genel' → URL; kanal 'x' → düz alan adı (X düz alan adını
 *     link saymaz, erişim cezası uygulamaz; okuyan yazıp girebilir — denetim viral-3)
 * Toplam ≤ 6 satır. Sebep: X'te 280 karakter sınırı (12 emoji = 24 karakter,
 * URL = 23 karakter sabit sayılır) ve uzun metin kopyalanmaz.
 */
export const OYUN_ALAN_ADI = 'clubbeans.com/sosyal-obezite';
export function emojiPaylasim(opts: {
  olaylar: Array<'yakala' | 'kacir'>;
  yakalanan: number;
  toplam: number;
  enYuksekCarpan: number;
  url: string;
  seri?: number;
  yanlisDokunma?: number;
  /**
   * 'x'    → URL YOK. X dış linkli gönderilerin erişimini belirgin kırpıyor;
   *          link resmi hesabın ilk yanıtında yaşar, paylaşım metninde değil.
   * 'genel'→ URL var (WhatsApp/Web Share — orada link cezası yok, tıklama şart).
   */
  kanal?: 'x' | 'genel';
}): string {
  const {
    olaylar, yakalanan, toplam, enYuksekCarpan, url, seri,
    yanlisDokunma = 0, kanal = 'genel',
  } = opts;

  const etiket = etiketEsle(yakalanan, yanlisDokunma);
  const fiyasko = yakalanan <= 2;

  // Koşullu TEK satır — çifte şaka yasağı: fiyaskoda itiraf satırı GİRMEZ.
  const kosullu = fiyasko
    ? FIYASKO_SATIRLARI[gunNo() % FIYASKO_SATIRLARI.length]
    : ITIRAF_KISA;

  const satirlar = [
    `SOSYAL OBEZİTE #${gunNo()}`,
    emojiSatiri(olaylar),
    `${yakalanan}/${toplam} gerçek · ${etiket}${seri && seri > 1 ? ` · 🔥${seri}. gün` : ''}`,
    kosullu,
    TANIM_KISA,
    kanal === 'genel' ? url : OYUN_ALAN_ADI,
  ];
  return satirlar.join('\n');
}

/**
 * Meydan okuma metni.
 *
 * Denetim (viral-1, CONFIRMED): 'Meydan oku' hiçbir kanalda link taşımıyordu; alıcı
 * ?rakip= ekranına hiçbir yoldan giremiyordu. Artık 'genel' kanalda paylaşım kartı
 * linki taşır (kart sayfası ?rakip=<runId> ile oyuna geri döner); X'te düz alan adı.
 * Fiil "kurtar" (spec §7: "geç beni" değil); ton düzene, kişiye değil (karar 4).
 */
export function meydanOkumaMetni(opts: {
  olaylar: Array<'yakala' | 'kacir'>;
  yakalanan: number;
  toplam: number;
  url?: string;
  kanal?: 'x' | 'genel';
  /** Rakiple oynandıysa cevap metni: "sartaa 6, ben 7. Sıra sende." */
  rakip?: { ad: string; yakalanan: number };
}): string {
  const kanal = opts.kanal ?? 'genel';
  const sonuc = opts.rakip
    ? `${opts.rakip.ad} ${opts.rakip.yakalanan}, ben ${opts.yakalanan}. ${
        opts.yakalanan > opts.rakip.yakalanan ? 'Sıra sende.' : 'Bir tur daha alıyorum.'
      }`
    : `${opts.yakalanan}/${opts.toplam} gerçeği kurtardım. Sen kaçını kurtarırsın?`;
  return [
    `SOSYAL OBEZİTE #${gunNo()}`,
    emojiSatiri(opts.olaylar),
    sonuc,
    TANIM_KISA,
    kanal === 'genel' && opts.url ? opts.url : OYUN_ALAN_ADI,
  ].join('\n');
}

/** Hile reddi — suçlama yok, mizah düzende kalır. */
export const HILE_REDDI = 'Bu skor akla yatmadı. Akış bile bu kadar hızlı akmaz.';

/** İlk gerçek kaçırılırsa bir kez gösterilen öğretici mikro-mesaj (ceza yok). */
export const ILK_KACIRMA_IPUCU = 'Az önce bir gerçek kaçırdın. Dokunarak yakalanır.';
