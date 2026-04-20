'use client';

import { easeOutExpo } from '@/lib/motion';
import { motion } from 'framer-motion';

const terms = [
  {
    term: 'Bean',
    pron: '/biːn/',
    kind: 'isim',
    def: '4 saatlik, başı sonu belli samimi buluşma. ClubBeans\'in kalbindeki birim.',
    ex: '"Cumartesi akşamı Kadıköy\'de bir Vinyl Night Bean\'i var."',
  },
  {
    term: 'Tribe',
    pron: '/traɪb/',
    kind: 'isim',
    def: 'Ortak vibe\'ı paylaşan topluluk. Takipçi değil, birlikte hareket eden grup.',
    ex: '"Moda koşucuları tribe\'ı pazarları parkta buluşur."',
  },
  {
    term: 'Jump In',
    pron: '/dʒʌmp ɪn/',
    kind: 'fiil',
    def: 'Bir Bean\'e katılma aksiyonu. "Katıl" yerine kullanılır; kararlılığın, anındalığın ifadesi.',
    ex: '"34 kişi Jump In etti, sen de katıl."',
  },
  {
    term: 'Signal',
    pron: '/ˈsɪɡ.nəl/',
    kind: 'isim',
    def: 'Sadece senin için anlamlı bildirim. Gürültü değil, işaret — yapay aciliyetten arınmış.',
    ex: '"Radar Signal\'i: Yakınındaki yeni Bean."',
  },
  {
    term: 'Vibe',
    pron: '/vaɪb/',
    kind: 'isim',
    def: 'Bean\'in veya tribe\'ın tonu, ruhu, niyeti. Kategori değil, atmosfer.',
    ex: '"Sakin vibe, gürültüsüz müzik, yavaş sohbet."',
  },
  {
    term: 'Radar',
    pron: '/ˈreɪ.dɑːr/',
    kind: 'isim',
    def: 'Konum + zaman + vibe filtresiyle yakınındaki Bean\'leri gösteren harita. Algoritma değil, filtre.',
    ex: '"Radar\'ı aç, 800m yarıçapta 12 aktif Bean var."',
  },
  {
    term: 'Kulüp',
    pron: '/kuˈlyp/',
    kind: 'isim',
    def: 'Bean organize eden hesap türü. Barlar, topluluklar, yaratıcılar — tribe\'ının gönüllü ev sahipleri.',
    ex: '"@kulturevi kulübü bu hafta üç farklı Bean düzenliyor."',
  },
  {
    term: 'Keşif',
    pron: '/keˈʃif/',
    kind: 'isim',
    def: 'Akışının %30\'unda gördüğün, konfor alanının dışındaki Bean\'ler. Filter bubble\'dan çıkış kapısı.',
    ex: '"Bu hafta keşif sayesinde ilk kez bir desen atölyesine gittim."',
  },
];

export default function Lexicon() {
  return (
    <section id="sozluk" className="relative py-24 md:py-36 overflow-hidden">
      <div className="container-x">
        <div className="max-w-3xl mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-xs uppercase tracking-[0.3em] text-acid mb-6 font-mono"
          >
            Sözlük
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: easeOutExpo }}
            className="text-section font-bold tracking-tight"
          >
            Yeni dil, yeni
            <br />
            <span className="text-zinc-500">topluluk kodları.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-zinc-400 mt-6 max-w-2xl"
          >
            Etkinlik, kullanıcı, takipçi, bildirim — bu kelimeler dikkat ekonomisinin
            kelimeleri. Biz yeni bir sözlükle çalışıyoruz.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {terms.map((t, i) => (
            <motion.div
              key={t.term}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.6, delay: (i % 4) * 0.08, ease: easeOutExpo }}
              className="group relative bg-elevated border border-border rounded-2xl p-6 hover:border-acid/30 transition"
            >
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-xl font-bold text-white tracking-tight">{t.term}</span>
                <span className="text-[10px] font-mono text-zinc-600">{t.kind}</span>
              </div>
              <div className="text-[11px] font-mono text-acid mb-4">{t.pron}</div>
              <p className="text-sm text-zinc-400 leading-relaxed mb-4">{t.def}</p>
              <p className="text-xs text-zinc-600 italic border-l-2 border-white/10 pl-3 group-hover:border-acid/50 transition">
                {t.ex}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
