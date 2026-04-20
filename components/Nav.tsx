'use client';

import { easeOutExpo } from '@/lib/motion';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const LINKS = [
  { href: '/#sorunlar', label: 'Ne çözüyor' },
  { href: '/#nasil-calisir', label: 'Nasıl çalışır' },
  { href: '/#trustscore', label: 'TrustScore' },
  { href: '/#uygulamada', label: 'Uygulamada' },
  { href: '/#karsilastirma', label: 'Fark' },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: easeOutExpo }}
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
          scrolled
            ? 'bg-midnight/70 backdrop-blur-xl border-b border-white/[0.06]'
            : 'bg-transparent'
        }`}
      >
        <div className="container-x py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 no-underline group"
            aria-label="ClubBeans ana sayfa"
          >
            <div className="w-8 h-8 rounded-lg bg-acid flex items-center justify-center shadow-lg shadow-acid/20">
              <span className="text-midnight font-black text-sm">CB</span>
            </div>
            <span className="font-semibold text-white tracking-tight group-hover:text-acid transition">
              ClubBeans
            </span>
          </Link>

          {/* Desktop menü */}
          <nav className="hidden md:flex items-center gap-8 text-sm">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-zinc-400 hover:text-white transition no-underline"
              >
                {link.label}
              </Link>
            ))}
            <a
              href="#launch"
              className="bg-white/5 border border-white/10 hover:bg-white/10 hover:border-acid/50 transition px-4 py-2 rounded-full text-white text-xs font-medium no-underline"
            >
              Lansman listesi →
            </a>
          </nav>

          {/* Mobil hamburger */}
          <button
            type="button"
            aria-label={open ? 'Menüyü kapat' : 'Menüyü aç'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-full bg-white/[0.04] border border-white/10"
          >
            <span className="sr-only">{open ? 'Kapat' : 'Menü'}</span>
            <motion.span
              animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -4 }}
              transition={{ duration: 0.3, ease: easeOutExpo }}
              className="absolute w-4 h-[1.5px] bg-white"
            />
            <motion.span
              animate={open ? { rotate: -45, y: 0 } : { rotate: 0, y: 4 }}
              transition={{ duration: 0.3, ease: easeOutExpo }}
              className="absolute w-4 h-[1.5px] bg-white"
            />
          </button>
        </div>
      </motion.header>

      {/* Mobil overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-midnight/95 backdrop-blur-xl md:hidden"
            onClick={() => setOpen(false)}
          >
            <motion.nav
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 12, opacity: 0 }}
              transition={{ duration: 0.4, ease: easeOutExpo }}
              className="absolute inset-x-0 top-20 px-8 flex flex-col gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              {LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + i * 0.05, duration: 0.5, ease: easeOutExpo }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block text-3xl font-bold text-white tracking-tight py-3 border-b border-white/[0.05] no-underline"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.a
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5, ease: easeOutExpo }}
                href="#launch"
                onClick={() => setOpen(false)}
                className="mt-8 bg-acid text-midnight font-bold text-center py-4 rounded-full no-underline"
              >
                Lansman listesine katıl →
              </motion.a>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
