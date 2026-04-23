'use client';

import { FAQS } from '@/lib/faqs';
import { easeOutExpo } from '@/lib/motion';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="sss" className="relative py-24 md:py-36 overflow-hidden">
      <div className="container-x">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-xs uppercase tracking-[0.3em] text-acid mb-6 font-mono text-center"
          >
            6 net cevap · kalanı metinlerde
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: easeOutExpo }}
            className="text-section font-bold tracking-tight text-white text-center mb-12 md:mb-16"
          >
            Aklındakini sor.
            <br />
            <span className="text-zinc-500">Bahaneye yer bırakmıyoruz.</span>
          </motion.h2>

          <div className="space-y-2">
            {FAQS.map((f, i) => {
              const isOpen = open === i;
              return (
                <motion.div
                  key={f.q}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-5%' }}
                  transition={{ duration: 0.5, delay: i * 0.03, ease: easeOutExpo }}
                  className="bg-elevated border border-border rounded-2xl overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-${i}`}
                    className="w-full text-left px-5 md:px-6 py-4 md:py-5 flex items-center justify-between gap-4 group"
                  >
                    <span
                      className={`text-sm md:text-base font-semibold transition ${
                        isOpen ? 'text-acid' : 'text-white group-hover:text-acid'
                      }`}
                    >
                      {f.q}
                    </span>
                    <span
                      className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${
                        isOpen ? 'border-acid bg-acid/10' : 'border-white/10 group-hover:border-acid/40'
                      }`}
                      aria-hidden
                    >
                      <motion.span
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.3, ease: easeOutExpo }}
                        className="text-xs leading-none"
                        style={{ color: isOpen ? '#A8E600' : 'rgb(161,161,170)' }}
                      >
                        +
                      </motion.span>
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-${i}`}
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          height: { duration: 0.4, ease: easeOutExpo },
                          opacity: { duration: 0.25, ease: 'easeOut' },
                        }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 md:px-6 pb-5 md:pb-6 text-sm md:text-base text-zinc-400 leading-relaxed border-t border-white/[0.04]">
                          <div className="pt-4">{f.a}</div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-10 space-y-3 text-center text-xs text-zinc-500 font-mono"
          >
            <p>
              İptal kuralları, ücretli Bean, KVKK detayı —{' '}
              <a href="/terms" className="text-zinc-300 hover:text-acid underline underline-offset-2">
                Kullanım Şartları
              </a>
              {' · '}
              <a href="/privacy" className="text-zinc-300 hover:text-acid underline underline-offset-2">
                Gizlilik
              </a>
            </p>
            <p>
              Başka bir şey mi merak ediyorsun?{' '}
              <a
                href="mailto:hello@clubbeans.com?subject=Soru"
                className="inline-flex items-center min-h-[36px] text-acid hover:underline"
              >
                hello@clubbeans.com
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
