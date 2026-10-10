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
            Yürürlük tarihi: 17 Nisan 2026 · Son güncelleme: 10 Ekim 2026
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
              (semt, ilk masanın zamanı, çevrenizden kaç kişinin gelebileceği; formun ilk sürümünde
              masa türü de soruluyordu). E-posta adresi istenmez.
            </li>
            <li>
              Amaç: formunuzu değerlendirmek, size bu konuda telefonla ya da SMS ile dönmek ve ilk
              masanızı kurarken yardımcı olmak. Form ticari ileti onayı istemez; size tanıtım
              göndermeyiz. Eşleşme olmazsa verileriniz en geç 6 ay içinde silinir.
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

          <h3 id="google-ile-giris">2.8. Google ile Giriş ve Apple ile Giriş</h3>
          <p>
            &quot;Google ile devam et&quot;i seçtiğinizde Google, izninizle bize şu bilgileri iletir: Google
            hesabınızın <strong>e-posta adresi</strong>, <strong>hesap kimliği</strong> (Google&apos;ın size özgü
            numarası) ve hesabınızda tanımlı <strong>ad ile profil fotoğrafı bağlantısı</strong>. Yalnızca temel
            profil izinlerini isteriz (openid, e-posta, profil); Gmail, Drive, kişiler veya takvim gibi başka hiçbir
            Google verisine erişmeyiz.
          </p>
          <ul>
            <li>
              <strong>Kullanım:</strong> Bu bilgileri yalnızca ClubBeans hesabınızı oluşturmak, sizi tanımak ve
              giriş yapmanızı sağlamak için kullanırız. Google&apos;dan gelen ad ve profil fotoğrafı ClubBeans
              profilinize aktarılmaz; profilinizdeki adı ve fotoğrafı siz belirlersiniz.
            </li>
            <li>
              <strong>Saklama:</strong> Bu bilgiler kimlik doğrulama kaydınızda (Supabase — AB/Frankfurt)
              hesabınız açık kaldığı sürece saklanır; hesabınızı sildiğinizde Bölüm 4&apos;teki sürelerle silinir.
            </li>
            <li>
              <strong>Paylaşım:</strong> Google&apos;dan aldığımız bilgileri satmayız; reklam, profilleme veya
              yapay zekâ modeli eğitimi için kullanmayız. Yalnızca hizmeti sunmak için altyapı sağlayıcımız
              Supabase&apos;de işlenir.
            </li>
            <li>
              <strong>Erişimi kaldırma:</strong> ClubBeans&apos;in Google hesabınıza erişimini istediğiniz zaman{' '}
              <a href="https://myaccount.google.com/permissions">myaccount.google.com/permissions</a> adresinden
              kaldırabilir, hesabınızı uygulamada Ayarlar → Hesabı Sil ya da{' '}
              <a href="https://www.clubbeans.com/delete-account">clubbeans.com/delete-account</a> üzerinden
              silebilirsiniz.
            </li>
          </ul>
          <p>
            ClubBeans&apos;in Google API&apos;lerinden aldığı bilgileri kullanması ve başka herhangi bir uygulamaya
            aktarması, Sınırlı Kullanım (Limited Use) gereklilikleri dahil{' '}
            <a href="https://developers.google.com/terms/api-services-user-data-policy">
              Google API Hizmetleri Kullanıcı Verileri Politikası
            </a>
            &apos;na uyar.
          </p>
          <p>
            &quot;Apple ile devam et&quot;i seçtiğinizde Apple bize e-posta adresinizi (dilerseniz Apple&apos;ın
            gizli iletim adresini) ve Apple hesap kimliğinizi iletir; aynı kullanım, saklama ve paylaşım kuralları
            geçerlidir.
          </p>

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
              Bülten e-postaları (ticari elektronik ileti), Meta Pikseli ve PostHog: açık rızanız
              (KVKK m.5/1). Rızanızı istediğiniz zaman geri alabilirsiniz.
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
            <li><strong>Google</strong> (Google ile Giriş — kimlik doğrulama; Bölüm 2.8)</li>
            <li><strong>Apple</strong> (Apple ile Giriş — kimlik doğrulama; Bölüm 2.8)</li>
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
              <strong>İleti Yönetim Sistemi (İYS)</strong> — bülten için ticari ileti onayı verenlerin
              yasal kaydı
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

          <h2 id="sign-in-with-google" lang="en">Sign in with Google — Google user data (English)</h2>
          <div lang="en">
            <p>
              When you choose &quot;Continue with Google&quot;, Google shares with ClubBeans, with your permission,
              your Google account <strong>email address</strong>, <strong>account identifier</strong>, and the{' '}
              <strong>name and profile picture link</strong> set on your Google account. We request only the basic
              profile scopes (openid, email, profile) and do not access Gmail, Drive, contacts, calendar or any
              other Google data.
            </p>
            <ul>
              <li>
                <strong>Use:</strong> only to create your ClubBeans account, recognise you and sign you in. Your
                Google name and photo are not copied into your ClubBeans profile.
              </li>
              <li>
                <strong>Storage:</strong> in our authentication record (Supabase, EU/Frankfurt) while your account
                exists; deleted when you delete your account (section 4).
              </li>
              <li>
                <strong>Sharing:</strong> we do not sell this data and do not use it for advertising, profiling or
                training AI models; it is processed only by our infrastructure provider Supabase to provide the
                service.
              </li>
              <li>
                <strong>Revoking access:</strong> at{' '}
                <a href="https://myaccount.google.com/permissions">myaccount.google.com/permissions</a>; delete your
                account in the app (Settings → Delete account) or at{' '}
                <a href="https://www.clubbeans.com/delete-account">clubbeans.com/delete-account</a>.
              </li>
            </ul>
            <p>
              ClubBeans&apos;s use and transfer to any other app of information received from Google APIs will adhere
              to the{' '}
              <a href="https://developers.google.com/terms/api-services-user-data-policy">
                Google API Services User Data Policy
              </a>
              , including the Limited Use requirements. Contact:{' '}
              <a href="mailto:privacy@clubbeans.com">privacy@clubbeans.com</a>.
            </p>
          </div>
        </article>
      </main>
      <FooterLegal />
    </>
  );
}
