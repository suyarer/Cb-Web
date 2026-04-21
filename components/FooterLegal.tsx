import Link from 'next/link';

export default function FooterLegal() {
  return (
    <footer className="relative border-t border-border overflow-hidden">
      {/* Kapanış satırı */}
      <div className="container-x pt-20 pb-16 border-b border-border">
        <p className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight max-w-3xl">
          Bu sayfayı şimdi kapat.
          <br />
          <span className="text-zinc-500">
            En iyi test: önümüzdeki Cumartesi.
          </span>
        </p>
      </div>

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
              Türkiye&apos;de yapıldı — Cumartesi akşamlarını geri vermek için.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 bg-white/[0.03] border border-white/10 rounded-full pl-3 pr-4 py-1.5 text-[11px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-acid animate-pulse" />
              <span className="text-zinc-400">2026 Q2 — lansman yaklaşıyor</span>
            </div>
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

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-8 border-t border-border">
          <div className="text-xs text-zinc-600">
            © {new Date().getFullYear()} ClubBeans · dikkatini çalmadan.
          </div>
          <div className="text-[10px] font-mono text-zinc-700 italic">
            &quot;Ekran süresi değil, yaşam süresi.&quot;
          </div>
        </div>
      </div>
    </footer>
  );
}
