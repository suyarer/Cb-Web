import type { Metadata } from 'next';
import FooterLegal from '@/components/FooterLegal';
import Nav from '@/components/Nav';

export const metadata: Metadata = {
  title: 'Çocuk Güvenliği Standartları — ClubBeans',
  description:
    'ClubBeans çocuk güvenliği standartları — çocukların cinsel istismarı ve sömürüsüne (CSAE) karşı sıfır tolerans. Child Safety Standards & zero tolerance for CSAE/CSAM.',
  alternates: { canonical: 'https://clubbeans.com/child-safety' },
  openGraph: {
    title: 'Çocuk Güvenliği Standartları — ClubBeans',
    description:
      'Çocukların cinsel istismarı ve sömürüsüne karşı sıfır tolerans. Zero tolerance for child sexual abuse and exploitation.',
    url: 'https://clubbeans.com/child-safety',
    type: 'article',
  },
};

export default function ChildSafetyPage() {
  return (
    <>
      <Nav />
      <main className="pt-32 pb-24 container-x">
        <article className="prose-legal">
          <h1>Çocuk Güvenliği Standartları</h1>
          <p className="text-sm text-zinc-500 font-mono">
            Yürürlük tarihi: 23 Haziran 2026 · Son güncelleme: 23 Haziran 2026
          </p>

          <p>
            ClubBeans, çocukların cinsel istismarı ve sömürüsüne (CSAE) ve çocuk cinsel istismarı
            materyaline (CSAM) karşı <strong>sıfır tolerans</strong> uygular. Bu sayfa, Google Play
            Çocuk Güvenliği Standartları Politikası kapsamında ClubBeans&apos;in çocuk güvenliği
            taahhütlerini ve raporlama mekanizmasını açıklar.
          </p>

          <h2>1. Sıfır Tolerans Beyanı</h2>
          <p>
            Çocukların cinsel istismarına/sömürüsüne yönelik her türlü içerik ve davranış kesinlikle
            yasaktır. Bu tür içerik veya davranış tespit edildiğinde <strong>derhal kaldırılır</strong>,
            ilgili hesap <strong>kalıcı olarak kapatılır</strong> ve durum yetkili makamlara bildirilir.
          </p>

          <h2>2. Yalnızca 18 Yaş ve Üzeri (18+)</h2>
          <p>
            ClubBeans yalnızca 18 yaş ve üzeri yetişkinler içindir. Kullanım Koşulları gereği 18 yaş
            altı kişilerin kayıt olması yasaktır; uygulama içi yaş kapısı (age-gate) ve isteğe bağlı
            Didit kimlik doğrulaması ile 18+ teyidi yapılır. Bir kullanıcının reşit olmadığını
            öğrenirsek hesabı derhal kapatır ve verilerini sileriz.
          </p>

          <h2>3. Yasaklı İçerik ve Davranışlar</h2>
          <ul>
            <li>Çocuk cinsel istismarı materyali (CSAM) — her türlü görsel, video, metin.</li>
            <li>Reşit olmayanların cinselleştirilmesi, taciz edilmesi veya cinsel amaçlı kandırılması
              (grooming).</li>
            <li>Reşit olmayanlarla cinsel içerikli iletişim girişimi veya bu yönde teşvik.</li>
            <li>Çocuk istismarını normalleştiren, öven veya kolaylaştıran her türlü içerik.</li>
          </ul>

          <h2>4. Raporlama Mekanizması</h2>
          <p>
            ClubBeans uygulaması içinde, uygulamadan çıkmadan rapor verebilirsiniz. Herhangi bir
            gönderi, yorum, profil veya mesajdaki <strong>Bildir</strong> düğmesine dokunup{' '}
            <strong>&quot;Çocuk Güvenliği / İstismar&quot;</strong> sebebini seçtiğinizde, rapor anında{' '}
            <strong>kritik önceliğe</strong> yükseltilir ve moderasyon ekibine gerçek zamanlı olarak
            iletilir. Ek olarak doğrudan e-posta ile de bildirebilirsiniz:{' '}
            <a href="mailto:childsafety@clubbeans.com">childsafety@clubbeans.com</a>.
          </p>

          <h2>5. Yetkili Makamlarla İşbirliği</h2>
          <p>
            Doğrulanan çocuk istismarı vakalarında içeriği kaldırır, hesabı kapatır, kanıtları korur ve
            durumu yetkili makamlara bildiririz: Türkiye&apos;de ilgili kolluk birimleri (Siber Suçlarla
            Mücadele / İHBARWEB) ve uluslararası düzeyde NCMEC (National Center for Missing &amp;
            Exploited Children) CyberTipline.
          </p>

          <h2>6. Yasalara Uygunluk</h2>
          <p>
            Uygulanabilir tüm çocuk güvenliği yasalarına (5237 sayılı Türk Ceza Kanunu ilgili maddeleri
            dahil) ve uluslararası CSAM raporlama yükümlülüklerine ve Google Play CSAE politikasına uyarız.
          </p>

          <h2>7. CSAE İletişim Kişisi</h2>
          <ul>
            <li>İsim: <strong>Selahattin Uyarer</strong></li>
            <li>Unvan: Kurucu &amp; Veri Koruma Sorumlusu (Founder &amp; Data Protection Lead)</li>
            <li>E-posta: <a href="mailto:childsafety@clubbeans.com">childsafety@clubbeans.com</a></li>
          </ul>

          <h2>8. Hesap Silme</h2>
          <p>
            Hesabınızı ve verilerinizi istediğiniz zaman silebilirsiniz:{' '}
            <a href="https://clubbeans.com/delete-account">clubbeans.com/delete-account</a>.
          </p>

          <hr />

          <h2>Child Safety Standards (English Summary)</h2>
          <p>
            ClubBeans maintains <strong>zero tolerance</strong> for child sexual abuse and exploitation
            (CSAE) and child sexual abuse material (CSAM). ClubBeans is an adults-only platform for users
            aged <strong>18 and over</strong>, enforced by an in-app age-gate and optional Didit identity
            verification.
          </p>
          <p>
            Prohibited: CSAM, sexualization, grooming or solicitation of minors, and any content that
            normalizes or facilitates child abuse. Users can report such content{' '}
            <strong>without leaving the app</strong> via the <strong>Report</strong> button → &quot;Child
            Safety / Exploitation&quot;, which is auto-escalated to critical priority and routed to
            moderators in real time; or by email to{' '}
            <a href="mailto:childsafety@clubbeans.com">childsafety@clubbeans.com</a>.
          </p>
          <p>
            Verified cases are removed, the account is permanently terminated, evidence is preserved, and
            the matter is reported to the competent authorities in Turkey and to NCMEC&apos;s CyberTipline,
            in compliance with applicable child safety laws and Google Play&apos;s CSAE policy. CSAE point
            of contact: <strong>Selahattin Uyarer</strong>, Founder &amp; Data Protection Lead —{' '}
            <a href="mailto:childsafety@clubbeans.com">childsafety@clubbeans.com</a>.
          </p>
        </article>
      </main>
      <FooterLegal />
    </>
  );
}
