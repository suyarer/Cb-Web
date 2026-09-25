import type { Metadata } from 'next';
import FooterLegal from '@/components/FooterLegal';
import Nav from '@/components/Nav';

export const metadata: Metadata = {
  title: 'Gizlilik Politikası — ClubBeans',
  description: 'ClubBeans gizlilik politikası — KVKK ve GDPR uyumlu.',
  alternates: { canonical: 'https://clubbeans.com/privacy' },
  openGraph: {
    title: 'Gizlilik Politikası — ClubBeans',
    description: 'KVKK ve GDPR uyumlu gizlilik politikası.',
    url: 'https://clubbeans.com/privacy',
    type: 'article',
  },
};

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main className="pt-32 pb-24 container-x">
        <article className="prose-legal">
          <h1>Gizlilik Politikası</h1>
          <p className="text-sm text-zinc-500 font-mono">
            Yürürlük tarihi: 17 Nisan 2026 · Son güncelleme: 25 Eylül 2026
          </p>

          <p>
            ClubBeans (&quot;biz&quot;, &quot;uygulama&quot;) olarak kişisel verilerinizin gizliliğine
            önem veriyoruz. Bu politika, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) ve
            Avrupa Birliği Genel Veri Koruma Tüzüğü (GDPR) uyumluluğu çerçevesinde hazırlanmıştır.
          </p>

          <h2>1. Veri Sorumlusu</h2>
          <p>
            Veri sorumlusu: <strong>CLUBBEANS TEKNOLOJİ LTD ŞTİ</strong>, Dere Mah. Cavit Öztürk Sokak
            No:16, Merkez/Amasya. Aşağıdaki iletişim kanallarından ulaşabilirsiniz:
          </p>
          <ul>
            <li>E-posta: <a href="mailto:privacy@clubbeans.com">privacy@clubbeans.com</a></li>
            <li>Web: <a href="https://clubbeans.com">clubbeans.com</a></li>
          </ul>

          <h2>2. Toplanan Veriler</h2>
          <h3>2.1. Hesap Bilgileri</h3>
          <ul>
            <li>E-posta adresi (zorunlu, kayıt için)</li>
            <li>Kullanıcı adı (zorunlu, profil için)</li>
            <li>Profil fotoğrafı (opsiyonel)</li>
            <li>Biyografi (opsiyonel)</li>
          </ul>

          <h3>2.2. Konum Verisi</h3>
          <ul>
            <li>
              <strong>Yaklaşık konum:</strong> Yakındaki etkinlikleri listelemek için —
              yalnızca uygulama açıkken.
            </li>
            <li>
              <strong>Tam konum (opsiyonel):</strong> Harita keşif özelliği için — sadece siz aktif
              olarak kullandığınızda. Arka planda toplanmaz.
            </li>
            <li>Konum verisi üçüncü taraflarla paylaşılmaz.</li>
          </ul>

          <h3>2.3. Etkinlik Verileri</h3>
          <ul>
            <li>Katıldığınız etkinlikler, oluşturduğunuz içerikler, yorumlar</li>
            <li>Kulüp üyelikleri</li>
            <li>Bildirim tercihleri</li>
          </ul>

          <h3>2.4. Cihaz ve Teknik Veriler</h3>
          <ul>
            <li>Cihaz modeli, işletim sistemi versiyonu, uygulama versiyonu</li>
            <li>Push bildirim token&apos;ı (bildirim gönderimi için)</li>
            <li>Crash raporları (Sentry — uygulama kararlılığı için, kişisel veri içermez)</li>
          </ul>

          <h3>2.5. Kimlik Doğrulama (KYC — opsiyonel)</h3>
          <ul>
            <li>Bazı özelliklerde güvenli topluluk için kimlik doğrulaması istenir.</li>
            <li>
              Doğrulama üçüncü taraf sağlayıcı (Didit) üzerinden yapılır, biz kimlik belgesi
              saklamayız.
            </li>
            <li>Yalnızca doğrulama durumu (verified/unverified) tarafımızda tutulur.</li>
          </ul>

          <h3>2.6. Kulüp Kurma Başvuru Formu (Facebook / Instagram reklamı)</h3>
          <ul>
            <li>
              Reklamdaki formu doldurursanız: ad soyad, telefon numarası ve formdaki yanıtlarınız
              (semt, masa türü, çağırabileceğiniz kişi sayısı, zamanlama). E-posta adresi istenmez.
            </li>
            <li>
              Formdaki isteğe bağlı kutuyu işaretlerseniz: ticari elektronik ileti onayınız. Onay,
              yasa gereği İleti Yönetim Sistemi&apos;ne (İYS) kaydedilir. Kutuyu işaretlememeniz
              başvurunuzu etkilemez.
            </li>
            <li>
              Form Meta&apos;nın (Facebook / Instagram) altyapısında doldurulur; yanıtlarınız yurt
              dışındaki Meta sunucularında işlenir ve bize iletilir.
            </li>
          </ul>

          <h3>2.7. Web Sitesi (clubbeans.com)</h3>
          <ul>
            <li>Bülten formunu doldurursanız e-posta adresiniz.</li>
            <li>Yalnızca onay verirseniz: Meta Pikseli ve PostHog ölçüm verileri (Bölüm 6).</li>
            <li>
              Vercel&apos;in çerez kullanmayan, günlük sıfırlanan anonim ziyaret sayımı ve performans
              ölçümü.
            </li>
          </ul>

          <h2>3. İşlenme Amaçları</h2>
          <ul>
            <li>Hesap oluşturma ve kimlik doğrulama</li>
            <li>Yakın etkinlik ve topluluk önerisi</li>
            <li>Bildirim gönderimi (push + in-app)</li>
            <li>Uygulama performans iyileştirmesi (anonim crash raporu)</li>
            <li>Yasal yükümlülüklerin yerine getirilmesi</li>
            <li>
              Reklamla gelen kulüp kurma başvurularını değerlendirmek, başvuru sahibiyle telefon veya
              SMS ile iletişime geçmek ve kulübünü kurarken yardımcı olmak
            </li>
            <li>Onay verenlere yeni masa, kulüp ve etkinlik duyuruları göndermek</li>
            <li>Onay verilirse reklamlarımızın ve web sitesinin nasıl çalıştığını ölçmek</li>
          </ul>

          <h3>Hukuki sebepler</h3>
          <ul>
            <li>
              Kulüp kurma başvurusu: talebiniz üzerine sözleşme öncesi adımlar (KVKK m.5/2-c) ve
              talepleri yönetmedeki meşru menfaatimiz (KVKK m.5/2-f).
            </li>
            <li>
              Ticari elektronik ileti, Meta Pikseli ve PostHog: açık rızanız (KVKK m.5/1). Rızanızı
              istediğiniz zaman geri alabilirsiniz.
            </li>
          </ul>

          <h2>4. Veri Saklama Süresi</h2>
          <ul>
            <li>Hesap verileri: Hesabınız aktif olduğu sürece</li>
            <li>Hesap silme talebinde: 30 gün içinde tüm veriler silinir</li>
            <li>Yasal gereklilikler: İlgili mevzuat gereği saklama süreleri (örn. fatura 10 yıl)</li>
            <li>
              Kulüp kurma başvuruları: Meta&apos;nın reklam panelinde ve şirketimizin şifreli
              bilgisayarında tutulur; eşleşme olmazsa en geç 6 ay içinde silinir.
            </li>
            <li>Ticari ileti onayı: geri alınana kadar; geri alındığında ileti gönderimi durur.</li>
            <li>Çerez tercihiniz: tarayıcınızda, siz değiştirene kadar.</li>
          </ul>

          <h2>5. Üçüncü Taraflar</h2>
          <p>Aşağıdaki hizmet sağlayıcılarla veri paylaşıyoruz:</p>
          <ul>
            <li><strong>Supabase</strong> (uygulama veritabanı + auth) — AB/Frankfurt sunucuları</li>
            <li><strong>Upstash</strong> (lansman e-posta listesi + rate limit) — AB/Frankfurt</li>
            <li><strong>Resend</strong> (lansman e-postası gönderimi) — AB sunucuları</li>
            <li><strong>Vercel</strong> (barındırma + analytics + blob yedekleme) — global CDN</li>
            <li><strong>Cloudflare</strong> (DNS + bot koruma — Turnstile)</li>
            <li><strong>Sentry</strong> (hata raporlama — PII kapalı) — AB sunucuları</li>
            <li><strong>Expo / EAS</strong> (mobil uygulama için push bildirimleri)</li>
            <li><strong>Mapbox</strong> (harita görselleri — konum paylaşılmaz)</li>
            <li><strong>Didit</strong> (KYC — opsiyonel, sadece kullanıcı tercihiyle)</li>
            <li>
              <strong>Meta Platforms Ireland (Facebook / Instagram)</strong> — (1) kulüp kurma başvuru
              formu: form Meta altyapısında doldurulur, yanıtlarınız yurt dışındaki Meta
              sunucularında işlenir ve bize iletilir; (2) web sitesinde yalnızca açık onayınızla
              reklam ölçümü (Bölüm 6).
            </li>
            <li>
              <strong>PostHog</strong> (web sitesi kullanım analizi ve oturum kaydı — yalnızca açık
              onayınızla) — AB/Frankfurt sunucuları
            </li>
            <li>
              <strong>İleti Yönetim Sistemi (İYS)</strong> — ticari ileti onayı verenlerin yasal kaydı
            </li>
          </ul>
          <p>
            Yukarıdaki sağlayıcıların sunucuları büyük ölçüde yurt dışındadır; bu hizmetleri
            kullandığımız ölçüde verileriniz yurt dışına aktarılır.
          </p>
          <p>
            Hiçbir üçüncü tarafa veri <strong>satılmaz</strong>; başvuru formundaki verileriniz
            pazarlama için üçüncü kişilere verilmez.
          </p>

          <h2>6. Çerezler ve Ölçüm</h2>
          <p>
            ClubBeans mobil uygulaması çerez veya pazarlama izleyicisi içermez. Web sitesinde
            (clubbeans.com) iki ölçüm aracı <strong>yalnızca açık onayınızla</strong> çalışır:
          </p>
          <ul>
            <li>
              <strong>Meta Pikseli ve Dönüşüm API&apos;si (Facebook / Instagram):</strong>{' '}
              reklamlarımızın işe yarayıp yaramadığını ölçmek için. Sayfa görüntülemeleriniz, IP
              adresiniz ve tarayıcı bilginiz Meta&apos;ya iletilir. Bülten formunu doldurursanız e-posta
              adresiniz geri döndürülemez biçimde şifrelenerek (SHA-256) iletilir; açık hâli gönderilmez.
            </li>
            <li>
              <strong>PostHog:</strong> siteyi iyileştirmek için tıklamalar, sayfa geçişleri, IP
              adresi (kaba konum için) ve oturum kaydı. Formlara yazdıklarınız kayda girmez.
            </li>
            <li>
              Reklamdan gelmeniz (bağlantıdaki reklam kimliği) onay sayılmaz; daha önce
              &quot;Hayır&quot; dediyseniz bu tercihiniz korunur.
            </li>
            <li>Onay vermezseniz hiçbiri yüklenmez ve site özelliklerinin tamamı sorunsuz çalışır.</li>
            <li>
              Kararınızı istediğiniz zaman sayfanın altındaki <strong>Çerez tercihleri</strong>{' '}
              düğmesiyle değiştirebilir ya da{' '}
              <a href="mailto:privacy@clubbeans.com">privacy@clubbeans.com</a> adresine yazabilirsiniz.
            </li>
            <li>
              Vercel&apos;in çerez kullanmayan, kişiyi tanımlamayan ziyaret sayımı ve performans
              ölçümü onaydan bağımsız çalışır.
            </li>
          </ul>

          <h2>7. KVKK Haklarınız</h2>
          <p>KVKK&apos;nın 11. maddesi uyarınca:</p>
          <ul>
            <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
            <li>İşlenmişse bilgi talep etme</li>
            <li>İşlenme amacını ve uygun kullanımını öğrenme</li>
            <li>Yurt içinde/dışında aktarıldığı üçüncü kişileri bilme</li>
            <li>Eksik/yanlış işlenmişse düzeltilmesini isteme</li>
            <li>Silinmesini veya yok edilmesini isteme</li>
            <li>Otomatik analiz sonucunda aleyhinize sonuç çıkmasına itiraz etme</li>
            <li>Zararın giderilmesini talep etme</li>
          </ul>
          <p>
            Bu haklarınızı kullanmak için{' '}
            <a href="mailto:privacy@clubbeans.com">privacy@clubbeans.com</a> adresine yazabilir veya
            uygulama içinden &quot;Hesap Silme&quot; işlemini başlatabilirsiniz. Ticari ileti
            onayınızı istediğiniz zaman ücretsiz geri alabilirsiniz.
          </p>

          <h2>8. Çocukların Gizliliği</h2>
          <p>
            ClubBeans 16 yaş altı kullanıcılara yönelik değildir. 16 yaş altı bir kullanıcının veri
            işlediğimizi fark edersek, ilgili verileri derhal sileriz.
          </p>

          <h2>9. Değişiklikler</h2>
          <p>
            Bu politika güncellenebilir. Önemli değişikliklerde uygulama içi bildirim veya e-posta ile
            bilgilendirme yapılır.
          </p>

          <h2>10. İletişim</h2>
          <p>
            Soru ve talepleriniz için:{' '}
            <a href="mailto:privacy@clubbeans.com">privacy@clubbeans.com</a>
          </p>
        </article>
      </main>
      <FooterLegal />
    </>
  );
}
