import AntiTrackerBadge from '@/components/AntiTrackerBadge';
import BeanSprout from '@/components/BeanSprout';
import Link from 'next/link';

export default function FooterLegal() {
  return (
    <footer className="relative border-t border-border overflow-hidden">
      {/* Kapanış satırı */}
      <div className="container-x pt-16 md:pt-20 pb-12 md:pb-16 border-b border-border">
        <p className="text-2xl md:text-5xl font-bold tracking-tight text-white leading-tight max-w-3xl">
          Bu sayfayı şimdi kapat.
          <br />
          <span className="text-zinc-500">
            En iyi test: önümüzdeki Cumartesi.
          </span>
        </p>
      </div>

      {/* Anti-tracker mührü — sessiz marka beyanı */}
      <div className="container-x py-2">
        <AntiTrackerBadge />
      </div>

      <div className="container-x py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <BeanSprout size={32} />
              <span className="font-semibold tracking-tight">ClubBeans</span>
            </div>
            <p className="text-sm text-zinc-500 max-w-sm leading-relaxed">
              Anti-platform topluluk uygulaması.
              <br />
              Türkiye&apos;de yapıldı — Cumartesi akşamlarını geri vermek için.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 bg-white/[0.03] border border-white/10 rounded-full pl-3 pr-4 py-1.5 text-[11px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-acid brand-pulse" />
              <span className="text-zinc-400">2026 Q2 — lansman yaklaşıyor</span>
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-wider text-zinc-600 mb-4 font-mono">
              Yasal
            </div>
            <ul className="space-y-3 text-sm list-none pl-0">
              <li>
                <Link href="/privacy" className="inline-flex items-center min-h-[36px] text-zinc-400 hover:text-white transition no-underline">
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link href="/terms" className="inline-flex items-center min-h-[36px] text-zinc-400 hover:text-white transition no-underline">
                  Kullanım Şartları
                </Link>
              </li>
              <li>
                <Link href="/delete-account" className="inline-flex items-center min-h-[36px] text-zinc-400 hover:text-white transition no-underline">
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
                <Link href="/support" className="inline-flex items-center min-h-[36px] text-zinc-400 hover:text-white transition no-underline">
                  Destek
                </Link>
              </li>
              <li>
                <a
                  href="mailto:hello@clubbeans.com"
                  className="inline-flex items-center min-h-[36px] text-zinc-400 hover:text-white transition no-underline"
                >
                  hello@clubbeans.com
                </a>
              </li>
              <li>
                <a
                  href="mailto:privacy@clubbeans.com"
                  className="inline-flex items-center min-h-[36px] text-zinc-400 hover:text-white transition no-underline"
                >
                  privacy@clubbeans.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Sosyal medya — lansmanda açılacak */}
        <div className="flex flex-wrap items-center gap-3 pt-8 pb-6 border-t border-border">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-600 mr-2">
            Sosyal · yakında
          </span>
          <SocialIcon label="X (Twitter)" path="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          <SocialIcon label="Instagram" path="M12 2.2c3.2 0 3.6 0 4.8.1 1.2 0 1.8.3 2.2.5.6.2 1 .5 1.4 1 .4.4.7.8 1 1.4.2.4.4 1 .5 2.2 0 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c0 1.2-.3 1.8-.5 2.2-.2.6-.5 1-1 1.4-.4.4-.8.7-1.4 1-.4.2-1 .4-2.2.5-1.2 0-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2 0-1.8-.3-2.2-.5-.6-.2-1-.5-1.4-1-.4-.4-.7-.8-1-1.4-.2-.4-.4-1-.5-2.2 0-1.2-.1-1.6-.1-4.8s0-3.6.1-4.8c0-1.2.3-1.8.5-2.2.2-.6.5-1 1-1.4.4-.4.8-.7 1.4-1 .4-.2 1-.4 2.2-.5 1.2 0 1.6-.1 4.8-.1zm0 2c-3.2 0-3.5 0-4.7.1-1.1 0-1.7.2-2.1.4-.5.2-.9.5-1.3.8-.3.4-.6.8-.8 1.3-.1.4-.3 1-.4 2.1 0 1.2-.1 1.5-.1 4.7s0 3.5.1 4.7c0 1.1.2 1.7.4 2.1.2.5.5.9.8 1.3.4.3.8.6 1.3.8.4.1 1 .3 2.1.4 1.2 0 1.5.1 4.7.1s3.5 0 4.7-.1c1.1 0 1.7-.2 2.1-.4.5-.2.9-.5 1.3-.8.3-.4.6-.8.8-1.3.1-.4.3-1 .4-2.1 0-1.2.1-1.5.1-4.7s0-3.5-.1-4.7c0-1.1-.2-1.7-.4-2.1-.2-.5-.5-.9-.8-1.3-.4-.3-.8-.6-1.3-.8-.4-.1-1-.3-2.1-.4-1.2 0-1.5-.1-4.7-.1zm0 3.4a5.4 5.4 0 110 10.8 5.4 5.4 0 010-10.8zm0 2a3.4 3.4 0 100 6.8 3.4 3.4 0 000-6.8zm6.9-2.3a1.3 1.3 0 11-2.6 0 1.3 1.3 0 012.6 0z" />
          <SocialIcon label="LinkedIn" path="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46zM5.34 7.43a2.06 2.06 0 110-4.13 2.06 2.06 0 010 4.13zM7.12 20.45H3.56V9h3.56z" />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-6 border-t border-border">
          <div className="text-xs text-zinc-600">
            © {new Date().getFullYear()} ClubBeans · dikkatini çalmadan.
          </div>
          <div className="text-[10px] font-mono text-zinc-500 italic">
            &quot;Ekran süresi değil, yaşam süresi.&quot;
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ label, path }: { label: string; path: string }) {
  return (
    <span
      role="img"
      aria-label={`${label} · yakında`}
      title={`${label} — lansman ile birlikte aktif`}
      className="w-11 h-11 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center text-zinc-500 hover:text-zinc-300 hover:border-white/20 transition cursor-not-allowed"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden>
        <path d={path} />
      </svg>
    </span>
  );
}
