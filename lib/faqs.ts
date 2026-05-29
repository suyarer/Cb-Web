export type FAQItem = {
  q: string;
  a: string;
};

/**
 * Navbar SSS — karar aşamasındaki ziyaretçi için net cevaplar.
 *
 * Bu liste /sss sayfasında ve layout.tsx JSON-LD (SEO) için kullanılır.
 * Footer "Destek" SSS (/support) AYRI tutulur — orada mevcut kullanıcının
 * sorun çözme soruları (hesap silme, KVKK, KYC vb) bulunur. Karıştırılmaz.
 *
 * Cevaplar; felsefe değil, net karar bilgisi verecek şekilde yazıldı.
 *
 * @governing_law clubbeans-content-v1
 *
 * GEÇİCİ SORULAR (lansman sonrası kaldırılacak):
 *  - "Ne zaman çıkacak?" (index 4) — uygulama yayına girdiğinde sil
 *  - "Erken erişim nasıl sağlarım?" (index 7) — uygulama yayına girdiğinde sil
 *
 * Brand kuralları:
 *  - Bean kelimesi DM dışında kullanılmaz (jargon ziyaretçiyi kafalar)
 *  - "Ev sahibi" kullanılır (host yerine, kullanıcı kararı 2026-05-28)
 *  - "Trust Score" iki kelime (orijinal brand terim)
 */
export const FAQS: FAQItem[] = [
  {
    q: 'ClubBeans nedir?',
    a: 'ClubBeans, etkinlik odaklı anti-platform topluluk uygulamasıdır. Yakınındaki buluşmaları keşfedebilir, ilgi alanına göre kulüplere katılabilir veya kendi kulübünü kurup etkinlikler düzenleyebilirsin.',
  },
  {
    q: 'Neden anti-platform?',
    a: 'Çoğu uygulama seni ekranda tutmak için tasarlandı. ClubBeans\'in amacı ise seni ekrandan çıkarmak. Reklam yok, davranış takibi yok, seni besleyen bir algoritma yok. Kiminle buluşacağına ve nereye gideceğine sen karar verirsin, uygulama değil.',
  },
  {
    q: 'Ücretsiz mi?',
    a: 'Uygulamayı indirmek, etkinliklere katılmak, kulüp kurmak ve etkinlik düzenlemek tamamen ücretsiz. Abonelik yok, zorunlu premium üyelik yok ve temel deneyim her zaman ücretsiz kalacak. İleride ek özellikler içeren gönüllü ücretli seçenekler gelebilir.',
  },
  {
    q: 'ClubBeans kimin için?',
    a: 'Şehirde yeni birini tanımak isteyen, etkinlik düzenlemek isteyen, ortak ilgi alanı olan insanlarla bir araya gelmek isteyen herkes için. Yeni bir şehre taşındıysan veya yıllardır aynı şehirde olup hâlâ o çevreyi arıyorsan, ClubBeans senin için. 16 yaş ve üzeri.',
  },
  // GEÇİCİ — uygulama yayına girince bu kaydı kaldır
  {
    q: 'Ne zaman çıkacak?',
    a: '4 Haziran 2026 — App Store ve Google Play\'de yayında. Lansman duyuruları için ana sayfadaki listemize katılabilirsin.',
  },
  {
    q: 'iOS ve Android\'de var mı?',
    a: 'App Store ve Google Play\'de lansman günü aynı anda çıkıyor. Web versiyonu yok.',
  },
  {
    q: 'Şu an hangi şehirlerde aktif?',
    a: 'İlk etapta İstanbul\'da başlıyoruz. Diğer şehirler için çalışmalarımız devam ediyor. Yaşadığın şehirde ClubBeans\'i görmek istersen info@clubbeans.com adresinden bize yazabilirsin.',
  },
  // GEÇİCİ — uygulama yayına girince bu kaydı kaldır
  {
    q: 'Erken erişim nasıl sağlarım?',
    a: 'Ana sayfadaki e-posta listesine veya WhatsApp kanalımıza katıl. Lansmanda indir linkini sana iletelim.',
  },
  {
    q: 'Trust Score nedir ve neden önemli?',
    a: 'Profilindeki takipçi sayını değil, gerçekte ne kadar güvenilir olduğunu gösteren puan sistemidir. Etkinliklere katıldıkça, etkinlik düzenledikçe ve verdiğin sözleri tuttukça artar; iptal edersen veya geleceğim deyip gelmezsen azalır. Ev sahipleri kimlerin etkinliğe katılacağına bu puana bakarak karar verebilir. Yani ClubBeans\'te kim olduğun değil, ne yaptığın önemlidir.',
  },
  {
    q: 'Herkes kulüp kurabilir mi?',
    a: 'Evet. Ortak ilgi alanı olan insanlarla bir araya gelmek istiyorsan — kitap, koşu, kahve, müzik ya da aklındaki herhangi bir şey — tek yapman gereken kulübünü kapsayan bir alan seçmek ve kulübüne bir isim vermek. Sonra kulübün hazır, ilk etkinliğini oluşturabilirsin.',
  },
  {
    q: 'Ücretli etkinlik düzenleyebilir miyim?',
    a: 'Evet. Ev sahibi isterse etkinliği ücretli yapabilir. Bunu etkinliği oluştururken belirtir ve etkinliğe katılacak kişiler bu konuda bilgilendirilir. Ödeme etkinliğe katılım sırasında alınır. Şu an ClubBeans herhangi bir komisyon talep etmemektedir. Ödeme süreci ev sahibi ve katılımcı arasında gerçekleşir.',
  },
];
