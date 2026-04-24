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
            Yürürlük tarihi: 17 Nisan 2026 · Son güncelleme: 17 Nisan 2026
          </p>

          <p>
            ClubBeans (&quot;biz&quot;, &quot;uygulama&quot;) olarak kişisel verilerinizin gizliliğine
            önem veriyoruz. Bu politika, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) ve
            Avrupa Birliği Genel Veri Koruma Tüzüğü (GDPR) uyumluluğu çerçevesinde hazırlanmıştır.
          </p>

          <h2>1. Veri Sorumlusu</h2>
          <p>
            Veri sorumlusu sıfatıyla hareket eden ClubBeans&apos;e aşağıdaki iletişim kanallarından
            ulaşabilirsiniz:
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
              <strong>Yaklaşık konum:</strong> Yakındaki etkinlikleri (Bean) listelemek için —
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

          <h2>3. İşlenme Amaçları</h2>
          <ul>
            <li>Hesap oluşturma ve kimlik doğrulama</li>
            <li>Yakın etkinlik ve topluluk önerisi</li>
            <li>Bildirim gönderimi (Signal sistemi)</li>
            <li>Uygulama performans iyileştirmesi (anonim crash raporu)</li>
            <li>Yasal yükümlülüklerin yerine getirilmesi</li>
          </ul>

          <h2>4. Veri Saklama Süresi</h2>
          <ul>
            <li>Hesap verileri: Hesabınız aktif olduğu sürece</li>
            <li>Hesap silme talebinde: 30 gün içinde tüm veriler silinir</li>
            <li>Yasal gereklilikler: İlgili mevzuat gereği saklama süreleri (örn. fatura 10 yıl)</li>
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
          </ul>
          <p>Hiçbir üçüncü tarafa veri <strong>satılmaz</strong>.</p>

          <h2>6. KVKK Haklarınız</h2>
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
            uygulama içinden &quot;Hesap Silme&quot; işlemini başlatabilirsiniz.
          </p>

          <h2>7. Çocukların Gizliliği</h2>
          <p>
            ClubBeans 16 yaş altı kullanıcılara yönelik değildir. 16 yaş altı bir kullanıcının veri
            işlediğimizi fark edersek, ilgili verileri derhal sileriz.
          </p>

          <h2>8. Değişiklikler</h2>
          <p>
            Bu politika güncellenebilir. Önemli değişikliklerde uygulama içi bildirim veya e-posta ile
            bilgilendirme yapılır.
          </p>

          <h2>9. İletişim</h2>
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
