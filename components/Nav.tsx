'use client';

import { easeOutExpo } from '@/lib/motion';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Nav() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: easeOutExpo }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <div className="container-x py-5 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 no-underline group"
          aria-label="ClubBeans ana sayfa"
        >
          <div className="w-8 h-8 rounded-lg bg-acid flex items-center justify-center">
            <span className="text-midnight font-black text-sm">CB</span>
          </div>
          <span className="font-semibold text-white tracking-tight group-hover:text-acid transition">
            ClubBeans
          </span>
        </Link>
        <nav className="flex items-center gap-8 text-sm">
          <Link
            href="/#manifesto"
            className="text-zinc-400 hover:text-white transition no-underline hidden md:inline"
          >
            Manifesto
          </Link>
          <Link
            href="/#features"
            className="text-zinc-400 hover:text-white transition no-underline hidden md:inline"
          >
            Özellikler
          </Link>
          <a
            href="#launch"
            className="bg-white/5 border border-white/10 hover:bg-white/10 hover:border-acid/50 transition px-4 py-2 rounded-full text-white text-xs font-medium no-underline"
          >
            Lansman listesine katıl →
          </a>
        </nav>
      </div>
    </motion.header>
  );
}
