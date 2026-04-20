import type { Metadata } from 'next';
import FooterLegal from '@/components/FooterLegal';
import Nav from '@/components/Nav';

export const metadata: Metadata = {
  title: 'Kullanım Şartları — ClubBeans',
  description: 'ClubBeans kullanım şartları ve hizmet sözleşmesi.',
};

export default function TermsPage() {
  return (
    <>
      <Nav />
      <main className="pt-32 pb-24 container-x">
        <article className="prose-legal">
          <h1>Kullanım Şartları</h1>
          <p className="text-sm text-zinc-500 font-mono">
            Yürürlük tarihi: 17 Nisan 2026 · Son güncelleme: 17 Nisan 2026
          </p>

          <p>
            ClubBeans uygulamasını (&quot;Hizmet&quot;) kullanarak, aşağıdaki şartları kabul etmiş
            sayılırsınız. Bu şartları kabul etmiyorsanız Hizmet&apos;i kullanmayın.
          </p>

          <h2>1. Tanımlar</h2>
          <ul>
            <li><strong>Bean:</strong> Uygulamada oluşturulan 4 saatlik etkinlik</li>
            <li><strong>Tribe:</strong> Takipçi kitlesi</li>
            <li><strong>Jump In:</strong> Bean&apos;e katılma aksiyonu</li>
            <li><strong>Signal:</strong> Uygulama içi ve push bildirimler</li>
            <li><strong>Kulüp:</strong> Bean oluşturabilen topluluk sahibi hesap</li>
          </ul>

          <h2>2. Hesap Açma</h2>
          <ul>
            <li>16 yaşından büyük olmalısınız.</li>
            <li>Gerçek bilgilerle kayıt olmalısınız.</li>
            <li>Hesap güvenliğinizden siz sorumlusunuz.</li>
            <li>Her kullanıcı yalnızca 1 kulüp kurabilir.</li>
          </ul>

          <h2>3. İçerik Kuralları</h2>
          <p>Aşağıdaki içerikler <strong>yasaktır</strong>:</p>
          <ul>
            <li>Nefret söylemi, ayrımcılık, şiddet içeriği</li>
            <li>Cinsel istismar, çocuk istismarı, taciz</li>
            <li>Yanıltıcı bilgi, dolandırıcılık, spam</li>
            <li>Telif hakkı ihlali</li>
            <li>Yasadışı faaliyet teşviki</li>
            <li>Sahte etkinlik / hayalet Bean oluşturma</li>
          </ul>
          <p>
            Kurallara uymayan içerikler kaldırılır, tekrar eden ihlallerde hesap askıya alınır veya
            silinir.
          </p>

          <h2>4. Bean ve Bilet Kuralları</h2>
          <ul>
            <li>
              <strong>Bean süresi:</strong> Tüm Bean&apos;ler 4 saat sabittir.
            </li>
            <li>
              <strong>Kapasite:</strong> Her Bean&apos;in sınırlı katılımcı kapasitesi vardır. Dolduğunda
              bekleme listesi (waitlist) devreye girer.
            </li>
            <li>
              <strong>İptal:</strong> Bean&apos;e katılımınızı iptal edebilirsiniz. İptal zamanına göre
              güven puanı (trust score) etkilenebilir.
            </li>
            <li>
              <strong>No-show:</strong> Katıldığınızı belirtip gelmemeniz durumunda trust score düşer.
            </li>
            <li>
              <strong>Haftalık limit:</strong> Her kulüp haftada en fazla 5 Bean oluşturabilir.
            </li>
          </ul>

          <h2>5. Ödeme ve Ücretler</h2>
          <ul>
            <li>
              Uygulamaya katılım şu an ücretsizdir. Gelecekte bazı Bean&apos;ler ücretli olabilir;
              bu durumda fiyat Bean sayfasında açıkça gösterilir.
            </li>
            <li>
              Ücretli Bean iptali durumunda iade politikası Bean oluşturucusu tarafından belirlenir,
              uygulama sayfasında gösterilir.
            </li>
          </ul>

          <h2>6. Fikri Mülkiyet</h2>
          <ul>
            <li>
              Yüklediğiniz içeriklerin telif hakkı size aittir; bize Hizmet&apos;i sunmak için dünya
              çapında, ücretsiz, devredilebilir bir lisans verirsiniz.
            </li>
            <li>
              Uygulamanın kendisi, logosu ve tüm marka öğeleri ClubBeans&apos;e aittir.
            </li>
          </ul>

          <h2>7. Sorumluluk Reddi</h2>
          <p>
            ClubBeans, Bean&apos;lerde gerçekleşen olaylardan, katılımcıların davranışlarından veya
            ürettiği içerikten sorumlu değildir. Bean&apos;ler kullanıcılar tarafından oluşturulur.
            Kendi güvenliğinizden siz sorumlusunuz.
          </p>

          <h2>8. Hesap Silme ve Sonlandırma</h2>
          <ul>
            <li>
              Hesabınızı dilediğiniz zaman silebilirsiniz. Bakınız:{' '}
              <a href="/delete-account/">/delete-account</a>
            </li>
            <li>
              Kurallara uymayan kullanıcıların hesapları uyarıya gerek kalmadan askıya alınabilir veya
              silinebilir.
            </li>
          </ul>

          <h2>9. Değişiklikler</h2>
          <p>
            Bu şartlar zaman zaman güncellenebilir. Önemli değişikliklerde uygulama içi bildirim ile
            bilgilendirirsiniz. Güncellemeden sonra Hizmet&apos;i kullanmaya devam etmeniz yeni
            şartları kabul ettiğiniz anlamına gelir.
          </p>

          <h2>10. Uyuşmazlık Çözümü</h2>
          <p>
            Bu şartlar Türkiye Cumhuriyeti kanunlarına tabidir. Uyuşmazlıklar İstanbul
            Mahkemeleri&apos;nde çözülür.
          </p>

          <h2>11. İletişim</h2>
          <p>
            Sorularınız için:{' '}
            <a href="mailto:support@clubbeans.com">support@clubbeans.com</a>
          </p>
        </article>
      </main>
      <FooterLegal />
    </>
  );
}
