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
  const dk = Math.floor(toplamSaniye / 60);
  return `${turNo}. tur. Toplam ${dk} dakika. Biz kapıyı açık bıraktık. Diğerleri bırakmaz.`;
}

/**
 * Tur sonu bloğu — CTA oyunun mekanik diline bağlanır.
 * "Hemen / şimdi / kaçırma" YASAK: aciliyet dili, eleştirdiğimiz düzenin dilidir.
 */
export const TUR_SONU = {
  baslik: '60 saniye bitti.',
  kopruSatiri: 'Kaçırdığın gerçekler ekranda değil, dışarıda duruyor.',
  ctaUstu: 'ClubBeans: gerçeğin uygulaması. Akışı değil, buluşmayı açar.',
  storeAppleEtiket: 'App Store',
  storeGoogleEtiket: 'Google Play',
} as const;

export function turSonuGovde(kartSayisi: number, yakalanan: number, kacan: number): string {
  return `${kartSayisi} kart kaydırdın. ${yakalanan} gerçeği yakaladın; ${kacan}'i akıp gitti.`;
}

/**
 * Paylaşım kartı metni.
 * Hiyerarşi ZORUNLU: (1) kurtarılan gerçek BÜYÜK, (2) akışa verilen süre, (3) skor küçük.
 * Meydan okuma fiili "geç beni" DEĞİL "kurtar" — rekabet tezi desteklemek zorunda.
 */
export function paylasimMetni(yakalanan: number, toplamDk: number): string {
  return `SOSYAL OBEZİTE — ${yakalanan} gerçeği kurtardım. ${toplamDk} dakikamı akış aldı. Sen kaçını kurtarabilirsin?`;
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
export const OYUN_EPOK = Date.UTC(2026, 7, 18); // 18 Ağustos 2026 = 1. gün

export function gunNo(now: Date = new Date()): number {
  return Math.max(1, Math.floor((now.getTime() - OYUN_EPOK) / 86_400_000) + 1);
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
  'Kaydırdım, kaydırdım, kaçırdım.',
] as const;

/** Kısa itiraf — paylaşım metni tıklanmasa bile markanın tezini taşır. */
export const ITIRAF_KISA = 'Bu oyun seni tutmak için yapıldı. Yüzüne söylüyor.';

/**
 * SATIR BÜTÇESİ ANAYASASI (panel kararı):
 *   sabit çekirdek  = başlık + emoji ızgarası + sonuç/etiket
 *   + EN FAZLA 1 koşullu satır (öncelik: fiyasko > kısa itiraf)
 *   + URL yalnız kanal 'genel' iken
 * Toplam ≤ 6 satır. Sebep: X'te 280 karakter sınırı (12 emoji = 24 karakter,
 * URL = 23 karakter sabit sayılır) ve uzun metin kopyalanmaz.
 */
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
  ];
  if (kanal === 'genel') satirlar.push('', url);
  return satirlar.join('\n');
}

/** Meydan okuma metni — X'te en çok alıntılanan biçim. Link YOK. */
export function meydanOkumaMetni(opts: {
  olaylar: Array<'yakala' | 'kacir'>;
  yakalanan: number;
  toplam: number;
}): string {
  return [
    `SOSYAL OBEZİTE #${gunNo()}`,
    emojiSatiri(opts.olaylar),
    `${opts.yakalanan}/${opts.toplam} gerçek kurtardım.`,
    'Sen bunu geçemezsin.',
  ].join('\n');
}

/** Hile reddi — suçlama yok, mizah düzende kalır. */
export const HILE_REDDI = 'Bu skor akla yatmadı. Akış bile bu kadar hızlı akmaz.';

/** İlk gerçek kaçırılırsa bir kez gösterilen öğretici mikro-mesaj (ceza yok). */
export const ILK_KACIRMA_IPUCU = 'Az önce bir gerçek kaçırdın. Dokunarak yakalanır.';
