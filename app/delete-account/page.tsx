import type { Metadata } from 'next';
import FooterLegal from '@/components/FooterLegal';
import Nav from '@/components/Nav';

export const metadata: Metadata = {
  title: 'Hesap Silme — ClubBeans',
  description: 'ClubBeans hesabınızı ve tüm verilerinizi nasıl silersiniz.',
};

export default function DeleteAccountPage() {
  return (
    <>
      <Nav />
      <main className="pt-32 pb-24 container-x">
        <article className="prose-legal">
          <div className="text-xs uppercase tracking-[0.3em] text-acid mb-6 font-mono">
            KVKK Md. 11 · Google Play Policy
          </div>
          <h1>Hesap Silme</h1>

          <p>
            Kişisel verilerinizi silme hakkınız saklıdır. İki yoldan hesabınızı tamamen silebilirsiniz:
          </p>

          <h2>Yöntem 1 — Uygulama İçinden (Önerilen)</h2>
          <ol className="list-decimal list-outside pl-6 space-y-2 text-zinc-400 mb-6">
            <li>ClubBeans uygulamasını aç</li>
            <li>Profil sekmesine git</li>
            <li>
              <strong>Settings → Privacy → Delete Account</strong>
            </li>
            <li>Şifreni girerek onayla</li>
            <li>Hesap 30 gün içinde tamamen silinir</li>
          </ol>

          <h2>Yöntem 2 — E-posta ile Talep</h2>
          <p>
            Uygulamaya erişiminiz yoksa veya manuel silme talep ediyorsanız, aşağıdaki bilgilerle{' '}
            <a href="mailto:privacy@clubbeans.com?subject=Hesap%20Silme%20Talebi">
              privacy@clubbeans.com
            </a>{' '}
            adresine e-posta gönderin:
          </p>
          <ul>
            <li>Hesaba kayıtlı e-posta adresi</li>
            <li>Kullanıcı adınız (@username)</li>
            <li>Silme talep nedeniniz (opsiyonel, istatistik için)</li>
          </ul>
          <p>
            E-postanın, hesabınıza kayıtlı adresten geldiğini doğruladıktan sonra 48 saat içinde
            silme işlemini başlatırız.
          </p>

          <h2>Silinecek Veriler</h2>
          <ul>
            <li>Profil bilgileri (isim, biyografi, avatar)</li>
            <li>E-posta ve telefon numarası</li>
            <li>Oluşturduğunuz Bean&apos;ler ve postlar</li>
            <li>Kabile (topluluk üyelik) ilişkileri</li>
            <li>Bildirim ve uygulama tercihleri</li>
            <li>Konum geçmişi</li>
            <li>Kimlik doğrulama kayıtları</li>
          </ul>

          <h2>Saklanan Veriler (Yasal Zorunluluk)</h2>
          <p>Aşağıdaki veriler yasal mevzuat gereği sınırlı süre saklanabilir:</p>
          <ul>
            <li>Fatura ve ödeme kayıtları — 10 yıl (Vergi Usul Kanunu)</li>
            <li>
              Kötüye kullanım şüphesi olan hesapların IP/cihaz bilgileri — 1 yıl (güvenlik amaçlı,
              anonimize edilir)
            </li>
            <li>
              Yargı kararıyla talep edilen veriler — ilgili mevzuat süresi boyunca
            </li>
          </ul>
          <p>
            Bu istisnai veriler dışında tüm kişisel veriler 30 gün içinde{' '}
            <strong>geri dönüşü olmayacak şekilde</strong> silinir.
          </p>

          <h2>Geri Alma (Undo)</h2>
          <p>
            Hesap silme talebinden sonra <strong>30 gün</strong> içinde uygulamaya aynı e-posta ile
            giriş yapılırsa silme iptal edilebilir. 30. günden sonra tüm veriler kalıcı olarak
            silinir ve geri getirilemez.
          </p>

          <h2>Sorularınız İçin</h2>
          <p>
            Silme süreci hakkında sorularınız varsa:{' '}
            <a href="mailto:privacy@clubbeans.com">privacy@clubbeans.com</a>
          </p>
        </article>
      </main>
      <FooterLegal />
    </>
  );
}
