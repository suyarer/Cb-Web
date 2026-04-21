import Link from 'next/link';

export default function FooterLegal() {
  return (
    <footer className="border-t border-border">
      <div className="container-x py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-acid flex items-center justify-center">
                <span className="text-midnight font-black text-xs">CB</span>
              </div>
              <span className="font-semibold tracking-tight">ClubBeans</span>
            </div>
            <p className="text-sm text-zinc-500 max-w-sm leading-relaxed">
              Anti-platform topluluk uygulaması.
              <br />
              Türkiye&apos;den dünyaya — Cumartesi akşamlarını geri vermek için.
            </p>
          </div>

          <div>
            <div className="text-xs uppercase tracking-wider text-zinc-600 mb-4 font-mono">
              Yasal
            </div>
            <ul className="space-y-3 text-sm list-none pl-0">
              <li>
                <Link href="/privacy" className="text-zinc-400 hover:text-white transition no-underline">
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-zinc-400 hover:text-white transition no-underline">
                  Kullanım Şartları
                </Link>
              </li>
              <li>
                <Link href="/delete-account" className="text-zinc-400 hover:text-white transition no-underline">
                  Hesap Silme
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-xs uppercase tracking-wider text-zinc-600 mb-4 font-mono">
              İletişim
            </div>
            <ul className="space-y-3 text-sm list-none pl-0">
              <li>
                <Link href="/support" className="text-zinc-400 hover:text-white transition no-underline">
                  Destek
                </Link>
              </li>
              <li>
                <a
                  href="mailto:hello@clubbeans.com"
                  className="text-zinc-400 hover:text-white transition no-underline"
                >
                  hello@clubbeans.com
                </a>
              </li>
              <li>
                <a
                  href="mailto:privacy@clubbeans.com"
                  className="text-zinc-400 hover:text-white transition no-underline"
                >
                  privacy@clubbeans.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-8 border-t border-border text-xs text-zinc-600">
          <div>© {new Date().getFullYear()} ClubBeans. Tüm hakları saklıdır.</div>
          <div className="font-mono">v1.0.0 · 🇹🇷 Türkiye</div>
        </div>
      </div>
    </footer>
  );
}
