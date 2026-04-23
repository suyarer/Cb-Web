'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

type Status = 'idle' | 'loading' | 'success' | 'error';

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
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState<string>('');
  const [position, setPosition] = useState<number | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === 'loading') return;

    setStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setStatus('error');
        setMessage(data.error || 'Gönderilemedi. Tekrar dener misin?');
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

  return (
    <form
      onSubmit={submit}
      className={`${compact ? '' : 'max-w-md'} w-full`}
      noValidate
    >
      <div
        className={`flex items-stretch gap-2 rounded-full p-1.5 border transition ${
          accent
            ? 'bg-white/[0.03] border-white/10 focus-within:border-acid/50'
            : 'bg-midnight/60 border-white/[0.08] focus-within:border-acid/40'
        }`}
      >
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          placeholder="sen@e-posta.com"
          aria-label="E-posta adresin"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status === 'error') setStatus('idle');
          }}
          className="flex-1 bg-transparent outline-none px-4 text-sm text-white placeholder:text-zinc-600 min-w-0"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="bg-acid text-midnight font-semibold text-sm px-5 py-2.5 rounded-full transition hover:bg-acid-400 disabled:opacity-70 disabled:cursor-wait whitespace-nowrap"
        >
          {status === 'loading' ? '...' : 'Haber ver →'}
        </button>
      </div>

      <AnimatePresence>
        {status === 'error' && (
          <motion.div
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
  );
}
