import type { Metadata } from 'next';
import Link from 'next/link';
import FooterLegal from '@/components/FooterLegal';
import Nav from '@/components/Nav';

/**
 * SOSYAL OBEZİTE — aydınlatma metni (KVKK m.10).
 *
 * Panelin KVKK uzmanı bunu lansmanı BLOKLAYAN madde saydı: viral olmayı
 * başaran bir oyunun aydınlatmasız kişisel veri işlemesi, tam lansman
 * penceresinde tek şikayetle inceleme ve "gizlilik vaazı veren anti-platform
 * KVKK'ya uymuyor" başlıklı itibar yangını demek.
 *
 * Oyun bilinçli olarak MİNİMUM veri işliyor: hesap yok, e-posta yok, konum yok,
 * reklam kimliği yok. Bu sayfa tam olarak neyin işlendiğini ve nasıl
 * sildirileceğini anlatır.
 */

export const metadata: Metadata = {
  title: 'Sosyal Obezite — Aydınlatma Metni',
  description:
    'Sosyal Obezite oyununda hangi verilerin işlendiği, neden işlendiği, ne kadar saklandığı ve nasıl sildirileceği.',
  robots: { index: true, follow: true },
};

export default function Page() {
  return (
    <>
      <Nav />
      <main className="container-x pb-24 pt-32">
        <article className="prose-legal">
          <h1>Sosyal Obezite — Aydınlatma Metni</h1>
          <p className="font-mono text-sm text-zinc-500">
            6698 sayılı KVKK m.10 kapsamında · Son güncelleme: 18 Ağustos 2026
          </p>

          <p>
            Sosyal Obezite, ClubBeans tarafından yayımlanan bir tarayıcı oyunudur. Oynamak için{' '}
            <strong>hesap açman gerekmez</strong>. Aşağıda, oyunu oynadığında tam olarak neyin
            işlendiği yazıyor.
          </p>

          <h2>1. Veri sorumlusu</h2>
          <p>
            CLUBBEANS TEKNOLOJİ LTD. İletişim:{' '}
            <a href="mailto:privacy@clubbeans.com">privacy@clubbeans.com</a>
          </p>

          <h2>2. İşlenen veriler</h2>
          <table>
            <thead>
              <tr>
                <th>Veri</th>
                <th>Neden</th>
                <th>Saklama</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>Anonim kimlik</strong> (tarayıcına yazılan rastgele bir numara)
                </td>
                <td>
                  Skor tablosunda aynı kişiyi tanımak ve takma adının başkası tarafından
                  alınmasını engellemek
                </td>
                <td>1 yıl (çerez süresi)</td>
              </tr>
              <tr>
                <td>
                  <strong>Takma ad</strong> — yalnız skorunu tabloya yazdırırsan
                </td>
                <td>Skor tablosunda gösterilmek</td>
                <td>Sen sildirene kadar</td>
              </tr>
              <tr>
                <td>
                  <strong>Skor ve tur istatistiği</strong> (yakalanan gerçek, süre, mesafe)
                </td>
                <td>Skor tablosu ve paylaşım kartı</td>
                <td>Paylaşım kartı: 180 gün · Tablo: sen sildirene kadar</td>
              </tr>
              <tr>
                <td>
                  <strong>IP adresi</strong>
                </td>
                <td>
                  Yalnız hız sınırı (aynı adresten saniyeler içinde yüzlerce istek gelmesini
                  engellemek). Skorunla <em>eşleştirilmez</em>.
                </td>
                <td>Dakikalar (geçici sayaç)</td>
              </tr>
            </tbody>
          </table>

          <h2>3. İşlemediğimiz veriler</h2>
          <ul>
            <li>Ad, soyad, e-posta, telefon — <strong>istemiyoruz</strong></li>
            <li>Konum — <strong>hiç okumuyoruz</strong></li>
            <li>Reklam kimliği, parmak izi, cihaz takibi — <strong>yok</strong></li>
            <li>Oyun verisi reklam amacıyla üçüncü taraflarla <strong>paylaşılmıyor</strong></li>
            <li>
              Bu sayfalarda (oyun, paylaşım kartı, bu metin) sitenin reklam ölçüm izleyicisi
              (Meta Pikseli) <strong>çalışmaz</strong>; sitenin diğer sayfalarında yalnız
              onayınla çalışır.
            </li>
          </ul>

          <h2>4. Hukuki sebep</h2>
          <p>
            Skorunu tabloya yazdırman tamamen isteğe bağlıdır; takma ad girip &quot;yaz&quot;
            dediğinde <strong>açık rızanı</strong> vermiş olursun (KVKK m.5/1). Hız sınırı için
            işlenen IP, hizmetin güvenliğini sağlamaya yönelik <strong>meşru menfaat</strong>
            kapsamındadır (KVKK m.5/2-f). Skorunu yazdırmadan oynarsan hiçbir kalıcı kayıt
            oluşmaz.
          </p>

          <h2>5. Aktarım</h2>
          <p>
            Skor tablosu ve oturum verisi, altyapı sağlayıcımız Upstash üzerinde Avrupa
            bölgesinde barındırılır. Site Vercel üzerinde yayınlanır.
          </p>

          <h2>6. Haklarınız ve silme</h2>
          <p>
            KVKK m.11 kapsamında verilerinize erişme, düzeltilmesini ve silinmesini isteme
            hakkınız var. Skorunu ve takma adını silmek için{' '}
            <a href="mailto:privacy@clubbeans.com?subject=Sosyal%20Obezite%20skor%20silme">
              privacy@clubbeans.com
            </a>{' '}
            adresine <strong>takma adını</strong> yazarak e-posta gönder — 30 gün içinde
            siliyoruz. Tarayıcı çerezini kendin de silebilirsin; sildiğinde anonim kimliğin
            ortadan kalkar.
          </p>

          <h2>7. Yaş</h2>
          <p>
            Oyun her yaşa uygundur ve çocuklara yönelik değildir. Yaş bilgisi{' '}
            <strong>sorulmaz ve saklanmaz</strong>. 18 yaşından küçüksen skorunu tabloya
            yazdırmadan oynamanı öneririz.
          </p>

          <h2>8. Çerezler ve tarayıcı depolaması</h2>
          <p>
            Oyun tek bir zorunlu çerez kullanır: <code>cb_oyun_id</code> (anonim kimlik,
            HttpOnly, 1 yıl). Bu çerez olmadan skor tablosu çalışmaz. Sitenin analiz
            çerezleri için{' '}
            <Link href="/privacy">Gizlilik Politikası</Link>&apos;na bakabilirsin.
          </p>
          <p>
            Ayrıca gün serisini (&quot;kaç gün üst üste oynadın&quot;) saymak için tarayıcının
            kendi belleğinde iki değer tutulur: <code>soSonGun</code> ve <code>soSeri</code>.
            Bunlar <strong>sunucumuza hiç gönderilmez</strong>, kimliğine bağlanmaz ve
            tarayıcı verilerini temizlediğinde kaybolur.
          </p>

          <p className="mt-10">
            <Link href="/sosyal-obezite">← Oyuna dön</Link>
          </p>
        </article>
      </main>
      <FooterLegal />
    </>
  );
}
