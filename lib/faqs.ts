export type FAQItem = {
  q: string;
  a: string;
};

// Tam FAQ seti — /sss alt sayfasında gösterilir.
export const FAQS: FAQItem[] = [
  {
    q: 'Ne zaman çıkacak?',
    a: '2026 Q2 — Mayıs. Önce İstanbul (Kadıköy, Beşiktaş, Beyoğlu, Moda), ardından Ankara ve İzmir. Lansman günü tek mail alırsın — tarih, davet kodu, link. Sonrası senin.',
  },
  {
    q: 'Ücretsiz mi?',
    a: 'Evet. Bean\'e katılmak ücretsiz. Club kurmak ücretsiz. Ücretli Bean düzenlersen bile ClubBeans payı %0. Abonelik yok, premium katman yok — ve olmayacak.',
  },
  {
    q: 'iOS ve Android\'te var mı?',
    a: 'İkisinde de. App Store ve Google Play\'de lansman günü aynı anda çıkacak. Web versiyonu yok — çünkü ClubBeans ekranda değil hayatta çalışmak için yazıldı.',
  },
  {
    q: 'Verim, fotoğraflarım ne olacak?',
    a: 'Sunucular Türkiye\'de ve EU\'da (KVKK + GDPR uyumlu). Veri satmıyoruz, üçüncü taraf tracker kullanmıyoruz, davranış takibi yok. Hesabını her zaman tek tıkla silebilirsin; 30 gün içinde tüm veriler silinir.',
  },
  {
    q: 'Kulüp kurmak için onay gerekiyor mu?',
    a: 'Hayır. Bir dakikada kendi Club\'ını kurabilirsin. Alan seç, isim ver, Bean aç — kabilen dolmaya başlar. Tek şart: TrustScore\'un 75\'te başlar, masaya oturduğunda yükselir.',
  },
  {
    q: 'TrustScore neden önemli?',
    a: 'Rastgele insan değil, sözünü tutan insan masanda otursun diye. Herkes 75\'ten başlar. Gittiğin Bean, düzenlediğin masa, aldığın referans — hepsi şeffaf katkı sağlar. İptal ve no-show puan düşürür.',
  },
  {
    q: 'Erken erişim nasıl alırım?',
    a: 'Ana sayfadaki mail formuna e-postanı bırak. Lansmandan 2 hafta önce alfa grubuna, 1 hafta önce beta grubuna davet ederiz. Tek mail, tek link — spam yok, söz.',
  },
  {
    q: 'İstanbul/Ankara/İzmir dışında kullanılır mı?',
    a: 'İlk fazda bu üç şehir odaklı çünkü kabile kritik yoğunluğa ihtiyacı var. 2026 Q3\'te tüm Türkiye, 2027\'de yurt dışı. Şehrini mail\'e yazarsan oraya sıra gelince ilk sen haberdar olursun.',
  },
  {
    q: 'Reklam var mı?',
    a: 'Hayır. 0 popup, 0 banner, 0 interstitial, 0 sponsored content. ClubBeans bir anti-platform — dikkatini ürün olarak görmüyoruz, onu saygı duyduğumuz bir şey olarak tanıyoruz.',
  },
  {
    q: 'Bir Bean\'e gelemeyeceğim. İptal nasıl?',
    a: 'Bean başlamadan 24 saat öncesine kadar ücretsiz iptal. Sonrasında TrustScore\'un -5 puan kaybeder — çünkü masaya söz verdin. Acil durum varsa host\'a mesaj atarsan no-show sayılmaz.',
  },
  {
    q: 'Ücretli Bean nasıl olur?',
    a: 'Host isterse ücretli yapabilir (bilet satışı, mekan maliyeti). Ödeme Bean\'e katılırken peşin alınır. ClubBeans hiçbir komisyon almaz — tüm para host\'a gider. Yarım kalan Bean\'lerde otomatik iade.',
  },
  {
    q: 'KVKK uyumlu musunuz?',
    a: 'Tam uyumlu. Aydınlatma metnini, veri kullanım hakkını ve silme prosedürünü uygulamadan her an görebilirsin. Veri sorumlusu: ClubBeans Teknoloji A.Ş., İstanbul. İletişim: privacy@clubbeans.com.',
  },
];
