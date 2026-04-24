'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Script from 'next/script';
import { useSearchParams } from 'next/navigation';
import { useCallback, useId, useRef, useState } from 'react';

type Status = 'idle' | 'loading' | 'success' | 'error';

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

// Global Turnstile tipi (Cloudflare script yüklenince window'a eklenir)
declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: TurnstileOptions) => string;
      remove: (widgetId: string) => void;
      reset: (widgetId: string) => void;
    };
  }
}

type TurnstileOptions = {
  sitekey: string;
  callback: (token: string) => void;
  'error-callback'?: () => void;
  'expired-callback'?: () => void;
  theme?: 'light' | 'dark' | 'auto';
  appearance?: 'always' | 'execute' | 'interaction-only';
};

export default function SubscribeForm({
  source = 'unknown',
  compact = false,
  accent = true,
}: {
  source?: string;
  compact?: boolean;
  accent?: boolean;
}) {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState<string>('');
  const [position, setPosition] = useState<number | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileWidgetId = useRef<string | null>(null);
  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const consentId = useId();

  const initTurnstile = useCallback(() => {
    if (!TURNSTILE_SITE_KEY) return;
    if (!turnstileContainerRef.current || !window.turnstile) return;
    if (turnstileWidgetId.current) return;

    turnstileWidgetId.current = window.turnstile.render(turnstileContainerRef.current, {
      sitekey: TURNSTILE_SITE_KEY,
      theme: 'dark',
      appearance: 'interaction-only',
      callback: (token) => setTurnstileToken(token),
      'error-callback': () => setTurnstileToken(null),
      'expired-callback': () => setTurnstileToken(null),
    });
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === 'loading') return;

    if (!consent) {
      setStatus('error');
      setMessage('E-posta izni kutusunu işaretlemen gerek.');
      return;
    }

    // Honeypot field — JS ile gizlenmiş input'u gerçek kullanıcı doldurmaz
    const form = e.currentTarget as HTMLFormElement;
    const honeypot = (form.elements.namedItem('website') as HTMLInputElement | null)?.value || '';

    // UTM parametreleri — kampanya / kanal takibi için
    const utm = {
      source: searchParams?.get('utm_source') || undefined,
      medium: searchParams?.get('utm_medium') || undefined,
      campaign: searchParams?.get('utm_campaign') || undefined,
    };

    setStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          source,
          website: honeypot,
          utm,
          consent: true,
          turnstileToken: turnstileToken || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setStatus('error');
        setMessage(data.error || 'Gönderilemedi. Tekrar dener misin?');
        // Turnstile token tek kullanımlık — reset
        if (turnstileWidgetId.current && window.turnstile) {
          window.turnstile.reset(turnstileWidgetId.current);
          setTurnstileToken(null);
        }
      } else {
        setStatus('success');
        setPosition(data.position ?? null);
        setMessage('');
      }
    } catch {
      setStatus('error');
      setMessage('Bağlantı sorunu. Biraz sonra dener misin?');
    }
  };

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${
          compact ? 'text-sm' : 'text-base'
        } bg-acid/10 border border-acid/40 rounded-2xl p-4 md:p-5 max-w-md`}
        role="status"
      >
        <div className="flex items-start gap-3">
          <span className="w-6 h-6 rounded-full bg-acid text-midnight flex items-center justify-center font-bold flex-shrink-0">
            ✓
          </span>
          <div>
            <div className="text-white font-semibold mb-1">
              Listede yerin hazır.
            </div>
            <div className="text-zinc-400 text-sm">
              {position != null ? (
                <>
                  <span className="text-acid font-mono">{position}.</span> kişisin.
                  Lansman günü tek mail gelir — spam yok, söz.
                </>
              ) : (
                'Lansman günü tek mail gelir — spam yok, söz.'
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  const inputId = `subscribe-email-${source}`;

  return (
    <>
      {TURNSTILE_SITE_KEY && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          async
          defer
          onLoad={initTurnstile}
          strategy="afterInteractive"
        />
      )}
      <form
        onSubmit={submit}
        className={`${compact ? '' : 'max-w-md'} w-full`}
        noValidate
      >
        <label htmlFor={inputId} className="sr-only">
          E-posta adresin
        </label>
        {/* Honeypot — botlar görür, insan göremez */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: '-9999px',
            width: '1px',
            height: '1px',
            opacity: 0,
          }}
        />
        <div
          className={`flex items-stretch gap-2 rounded-full p-1.5 border transition ${
            accent
              ? 'bg-white/[0.03] border-white/10 focus-within:border-acid/50'
              : 'bg-midnight/60 border-white/[0.08] focus-within:border-acid/40'
          }`}
        >
          <input
            id={inputId}
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            placeholder="sen@e-posta.com"
            aria-label="E-posta adresin"
            aria-describedby={status === 'error' ? `${inputId}-error` : undefined}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === 'error') setStatus('idle');
            }}
            className="flex-1 bg-transparent outline-none px-4 text-sm text-white placeholder:text-zinc-600 min-w-0"
          />
          <motion.button
            type="submit"
            disabled={status === 'loading'}
            whileTap={{ scale: 0.97 }}
            className="bg-acid text-midnight font-semibold text-sm px-5 py-2.5 rounded-full transition hover:bg-acid-400 disabled:opacity-70 disabled:cursor-wait whitespace-nowrap"
          >
            {status === 'loading' ? '...' : 'Beni listeye al →'}
          </motion.button>
        </div>

        {/* KVKK açık rıza checkbox'u */}
        <label
          htmlFor={consentId}
          className="mt-3 flex items-start gap-2.5 cursor-pointer group pl-1"
        >
          <input
            id={consentId}
            type="checkbox"
            required
            checked={consent}
            onChange={(e) => {
              setConsent(e.target.checked);
              if (status === 'error') setStatus('idle');
            }}
            className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/[0.03] text-acid focus:ring-acid/40 focus:ring-offset-0 flex-shrink-0 cursor-pointer"
          />
          <span className="text-[11px] text-zinc-500 leading-relaxed group-hover:text-zinc-400 transition">
            Lansman günü tek bir bilgilendirme e-postası almayı kabul ediyorum.{' '}
            <a
              href="/privacy"
              className="text-zinc-400 hover:text-acid underline underline-offset-2"
              onClick={(e) => e.stopPropagation()}
            >
              Gizlilik
            </a>
            .
          </span>
        </label>

        {/* Turnstile widget — env var varsa render edilir */}
        {TURNSTILE_SITE_KEY && (
          <div
            ref={turnstileContainerRef}
            className="mt-3"
            aria-label="Bot olmadığını doğrula"
          />
        )}

        <AnimatePresence>
          {status === 'error' && (
            <motion.div
              id={`${inputId}-error`}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-2 text-xs text-rose-300 pl-4"
              role="alert"
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        <p className="mt-2.5 text-[10.5px] text-zinc-600 pl-4 font-mono">
          Spam yok · haftalık newsletter yok · tek mail lansmanda
        </p>
      </form>
    </>
  );
}
