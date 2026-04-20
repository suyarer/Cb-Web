import type { Metadata } from 'next';
import FooterLegal from '@/components/FooterLegal';
import Nav from '@/components/Nav';

export const metadata: Metadata = {
  title: 'Destek — ClubBeans',
  description: 'ClubBeans destek merkezi. Sıkça sorulan sorular ve iletişim kanalları.',
};

const faqs = [
  {
    q: 'ClubBeans nedir?',
    a: 'ClubBeans, etkinlik odaklı anti-platform topluluk uygulamasıdır. Yakınındaki 4 saatlik samimi buluşmaları (Bean) keşfedebilir, kendi kulübünü kurabilir veya mevcut topluluklara katılabilirsin.',
  },
  {
    q: 'App Store ve Google Play\'de mi?',
    a: 'Şu an beta aşamasındayız. 2026 Q2\'de App Store ve Google Play Internal Testing üzerinden erişilebilir olacak. Lansman listesine katılıp ilk senden haberdar olalım.',
  },
  {
    q: 'Neden "anti-platform"?',
    a: 'Büyük sosyal platformlar kullanıcıyı ürün olarak görür: veriyi satar, algoritma manipüle eder, dikkat ekonomisi kurar. ClubBeans topluluğun kendisini merkeze koyar. Veri satmıyoruz, davranış takip etmiyoruz, algoritma yönlendirmiyor — sen tribe\'ını seçersin.',
  },
  {
    q: 'Kulüp kurmak için ne gerekli?',
    a: 'Hesap doğrulaması tamamlandıktan sonra uygulamadan tek tıkla kulüp oluşturabilirsin. Her kullanıcı yalnızca 1 kulüp kurabilir. Kulüp owner\'ı haftada en fazla 5 Bean organize edebilir.',
  },
  {
    q: 'Bean iptal ettim, trust score\'uma etkisi olur mu?',
    a: 'İptal zamanına göre değişir. Erken iptalde (72 saat öncesinde) etki yok. Son 24 saatte iptal trust score\'unu hafif etkiler. No-show (geleceğini söyleyip gelmeme) ise belirgin düşüş yaratır.',
  },
  {
    q: 'Verilerim güvende mi?',
    a: 'Evet. Supabase AB/Frankfurt sunucularında saklanır, KVKK ve GDPR uyumluyuz. Kimse veriyi satmıyor. Detaylar: /privacy sayfası.',
  },
  {
    q: 'Kimlik doğrulama zorunlu mu?',
    a: 'Hayır. Temel kullanım için zorunlu değil. Bazı güvenlik gerektiren özelliklerde (yüksek kontenjanlı Bean\'ler, kulüp kurma) opsiyonel KYC doğrulaması istenir. Kimlik belgesi bizde saklanmaz, sadece doğrulama durumu (verified/unverified) tutulur.',
  },
  {
    q: 'Hesabımı nasıl silerim?',
    a: 'Uygulama içinden Settings → Privacy → Delete Account adımından. Veya /delete-account sayfasından manuel talep gönderebilirsin. 30 gün içinde tüm veriler silinir.',
  },
];

export default function SupportPage() {
  return (
    <>
      <Nav />
      <main className="pt-32 pb-24 container-x">
        <div className="prose-legal">
          <div className="text-xs uppercase tracking-[0.3em] text-acid mb-6 font-mono">Destek</div>
          <h1>Nasıl yardımcı olabiliriz?</h1>

          <p className="text-lg">
            Sorun mu yaşıyorsun? Önce aşağıdaki sıkça sorulan sorulara göz at. Cevabı bulamazsan{' '}
            <a href="mailto:support@clubbeans.com">support@clubbeans.com</a> adresine e-posta gönder —
            48 saat içinde geri dönüş yaparız.
          </p>

          <h2>Sıkça Sorulan Sorular</h2>

          <div className="not-prose space-y-4 mt-8">
            {faqs.map((faq) => (
              <details
                key={faq.q}
                className="group bg-elevated border border-border rounded-2xl open:border-acid/30 transition"
              >
                <summary className="list-none cursor-pointer px-6 py-5 flex justify-between items-center gap-4">
                  <span className="font-semibold text-white">{faq.q}</span>
                  <span className="text-acid text-xl transition group-open:rotate-45">+</span>
                </summary>
                <div className="px-6 pb-5 text-zinc-400 leading-relaxed">{faq.a}</div>
              </details>
            ))}
          </div>

          <h2>İletişim</h2>
          <ul>
            <li>
              <strong>Genel destek:</strong>{' '}
              <a href="mailto:support@clubbeans.com">support@clubbeans.com</a>
            </li>
            <li>
              <strong>Gizlilik &amp; KVKK:</strong>{' '}
              <a href="mailto:privacy@clubbeans.com">privacy@clubbeans.com</a>
            </li>
            <li>
              <strong>İş birliği &amp; basın:</strong>{' '}
              <a href="mailto:hello@clubbeans.com">hello@clubbeans.com</a>
            </li>
          </ul>

          <p className="text-sm text-zinc-500 font-mono mt-12">
            Ortalama yanıt süresi: 24-48 saat (hafta içi).
          </p>
        </div>
      </main>
      <FooterLegal />
    </>
  );
}
