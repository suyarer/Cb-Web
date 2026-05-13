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
              <span className="w-1.5 h-1.5 rounded-full bg-acid" />
              <span className="text-zinc-400">29 Mayıs 2026 — lansman yaklaşıyor</span>
            </div>
          </div>

          <div>
            <div className="text-xs uppercase tracking-wider text-zinc-600 mb-4 font-mono">
              Yasal
            </div>
            <ul className="space-y-3 text-sm list-none pl-0">
              <li>
                <Link href="/privacy" className="inline-flex items-center min-h-[44px] text-zinc-400 hover:text-white transition no-underline">
                  Gizlilik Politikası
                </Link>
              </li>
              <li>
                <Link href="/terms" className="inline-flex items-center min-h-[44px] text-zinc-400 hover:text-white transition no-underline">
                  Kullanım Şartları
                </Link>
              </li>
              <li>
                <Link href="/delete-account" className="inline-flex items-center min-h-[44px] text-zinc-400 hover:text-white transition no-underline">
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
                <Link href="/support" className="inline-flex items-center min-h-[44px] text-zinc-400 hover:text-white transition no-underline">
                  Destek
                </Link>
              </li>
              <li>
                <a
                  href="mailto:info@clubbeans.com"
                  className="inline-flex items-center min-h-[44px] text-zinc-400 hover:text-white transition no-underline"
                >
                  info@clubbeans.com
                </a>
              </li>
              <li>
                <a
                  href="mailto:privacy@clubbeans.com"
                  className="inline-flex items-center min-h-[44px] text-zinc-400 hover:text-white transition no-underline"
                >
                  privacy@clubbeans.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Sosyal medya — canlı kanallar */}
        <div className="flex flex-wrap items-center gap-3 pt-8 pb-6 border-t border-border">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-600 mr-2">
            Sosyal
          </span>
          <SocialIcon
            label="Instagram"
            href="https://www.instagram.com/clubbeansapp/"
            path="M12 2.2c3.2 0 3.6 0 4.8.1 1.2 0 1.8.3 2.2.5.6.2 1 .5 1.4 1 .4.4.7.8 1 1.4.2.4.4 1 .5 2.2 0 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c0 1.2-.3 1.8-.5 2.2-.2.6-.5 1-1 1.4-.4.4-.8.7-1.4 1-.4.2-1 .4-2.2.5-1.2 0-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2 0-1.8-.3-2.2-.5-.6-.2-1-.5-1.4-1-.4-.4-.7-.8-1-1.4-.2-.4-.4-1-.5-2.2 0-1.2-.1-1.6-.1-4.8s0-3.6.1-4.8c0-1.2.3-1.8.5-2.2.2-.6.5-1 1-1.4.4-.4.8-.7 1.4-1 .4-.2 1-.4 2.2-.5 1.2 0 1.6-.1 4.8-.1zm0 2c-3.2 0-3.5 0-4.7.1-1.1 0-1.7.2-2.1.4-.5.2-.9.5-1.3.8-.3.4-.6.8-.8 1.3-.1.4-.3 1-.4 2.1 0 1.2-.1 1.5-.1 4.7s0 3.5.1 4.7c0 1.1.2 1.7.4 2.1.2.5.5.9.8 1.3.4.3.8.6 1.3.8.4.1 1 .3 2.1.4 1.2 0 1.5.1 4.7.1s3.5 0 4.7-.1c1.1 0 1.7-.2 2.1-.4.5-.2.9-.5 1.3-.8.3-.4.6-.8.8-1.3.1-.4.3-1 .4-2.1 0-1.2.1-1.5.1-4.7s0-3.5-.1-4.7c0-1.1-.2-1.7-.4-2.1-.2-.5-.5-.9-.8-1.3-.4-.3-.8-.6-1.3-.8-.4-.1-1-.3-2.1-.4-1.2 0-1.5-.1-4.7-.1zm0 3.4a5.4 5.4 0 110 10.8 5.4 5.4 0 010-10.8zm0 2a3.4 3.4 0 100 6.8 3.4 3.4 0 000-6.8zm6.9-2.3a1.3 1.3 0 11-2.6 0 1.3 1.3 0 012.6 0z"
          />
          <SocialIcon
            label="LinkedIn"
            href="https://www.linkedin.com/company/clubbeans/"
            path="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46zM5.34 7.43a2.06 2.06 0 110-4.13 2.06 2.06 0 010 4.13zM7.12 20.45H3.56V9h3.56z"
          />
          <SocialIcon
            label="WhatsApp Channel"
            href="https://whatsapp.com/channel/0029Vb7WVjrDOQIf753SuS2l"
            path="M19.077 4.928a9.94 9.94 0 0 0-7.072-2.928c-5.5 0-9.998 4.5-10 10.002a9.99 9.99 0 0 0 1.34 5.005L2 22l5.117-1.34a9.99 9.99 0 0 0 4.882 1.243h.004c5.502 0 10-4.5 10-10.002a9.99 9.99 0 0 0-2.926-7.073zm-7.072 15.346h-.003a8.298 8.298 0 0 1-4.226-1.157l-.303-.18-3.137.823.836-3.063-.197-.314a8.275 8.275 0 0 1-1.27-4.4c0-4.567 3.717-8.283 8.297-8.283a8.243 8.243 0 0 1 5.864 2.43 8.245 8.245 0 0 1 2.428 5.864c0 4.566-3.717 8.28-8.288 8.28zm4.547-6.205c-.249-.124-1.474-.728-1.703-.811-.228-.083-.394-.124-.561.125-.166.249-.643.811-.789.978-.146.166-.291.187-.54.062-.249-.124-1.052-.388-2.005-1.236-.741-.66-1.241-1.474-1.387-1.723-.146-.249-.016-.383.109-.508.112-.111.249-.291.374-.437.124-.146.166-.249.249-.415.083-.166.041-.311-.021-.435-.062-.124-.561-1.353-.769-1.852-.202-.486-.408-.42-.561-.428a10.74 10.74 0 0 0-.478-.009c-.166 0-.435.062-.663.311-.228.249-.871.852-.871 2.077s.892 2.408 1.016 2.575c.124.166 1.755 2.679 4.252 3.757.594.257 1.058.41 1.42.524.596.19 1.139.163 1.568.099.479-.071 1.474-.603 1.682-1.184.207-.582.207-1.08.146-1.184-.062-.104-.228-.166-.477-.291z"
          />
          <SocialIcon
            label="X (Twitter)"
            href="https://x.com/ClubBeansapp"
            path="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
          />
          <SocialIcon
            label="Substack"
            href="https://clubbeans.substack.com"
            path="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"
          />
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

function SocialIcon({ label, path, href }: { label: string; path: string; href?: string }) {
  // href yoksa pasif (yakında) modu — X (Twitter) için
  if (!href) {
    return (
      <span
        role="img"
        aria-label={`${label} · yakında`}
        title={`${label} — lansman ile birlikte aktif`}
        className="w-11 h-11 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center text-zinc-500 cursor-not-allowed"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden>
          <path d={path} />
        </svg>
      </span>
    );
  }

  // href varsa canlı link
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className="w-11 h-11 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center text-zinc-400 hover:text-acid hover:border-acid/30 transition no-underline"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden>
        <path d={path} />
      </svg>
    </a>
  );
}
