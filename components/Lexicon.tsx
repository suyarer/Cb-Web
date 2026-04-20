'use client';

import { easeOutExpo } from '@/lib/motion';
import { motion } from 'framer-motion';

const terms = [
  {
    term: 'Bean',
    pron: '/biːn/',
    kind: 'isim',
    def: '4 saatlik, başı sonu belli fiziksel buluşma. ClubBeans\'in kalbindeki aktivite birimi — kahve, koşu, pitch night, kitap sohbeti.',
    ex: '"Cumartesi Kadıköy\'de bir Vinyl Night Bean\'i var."',
  },
  {
    term: 'Club',
    pron: '/klʌb/',
    kind: 'isim',
    def: 'Belirli bir ilgi alanı etrafında kurulmuş topluluk. AI girişimcileri, Moda koşucuları, film kulübü — dikeyini seç, Bean düzenle.',
    ex: '"@kadikoykosu Club\'ı pazarları Bean açıyor."',
  },
  {
    term: 'TrustScore',
    pron: '/trʌst skɔːr/',
    kind: 'isim',
    def: 'Hesabının güvenilirlik ve referans skoru. Kim kimle hangi Bean\'e geldi, kim Bean düzenledi — curated network\'ün temel ölçüsü.',
    ex: '"TrustScore\'u 84, üç farklı Club\'da aktif."',
  },
  {
    term: 'Jump In',
    pron: '/dʒʌmp ɪn/',
    kind: 'fiil',
    def: 'Bean\'e katılma aksiyonu. "Katıl" yerine kullanılır; anındalığın, kararlılığın ifadesi.',
    ex: '"34 kişi Jump In etti."',
  },
  {
    term: 'Signal',
    pron: '/ˈsɪɡ.nəl/',
    kind: 'isim',
    def: 'Sadece senin için anlamlı bildirim. Gürültü değil, işaret — yapay aciliyetten arınmış.',
    ex: '"Yakınında yeni bir Bean var — tek Signal."',
  },
  {
    term: 'Vibe',
    pron: '/vaɪb/',
    kind: 'isim',
    def: 'Bean\'in veya Club\'ın tonu, ruhu. Kategori değil, atmosfer.',
    ex: '"Sakin vibe, yavaş sohbet, ikili buluşma."',
  },
  {
    term: 'Radar',
    pron: '/ˈreɪ.dɑːr/',
    kind: 'isim',
    def: 'Yakınındaki Beans\'leri konum + zaman + ilgiye göre gösteren keşif ekranı. Algoritma değil, senin filtrelerin.',
    ex: '"800m yarıçapta 12 Bean aktif."',
  },
  {
    term: 'Sosyal Obezite',
    pron: '/sosˈjal obeˈzite/',
    kind: 'isim',
    def: 'Dijital çağın hastalığı: çok kaydırma, az yaşama. ClubBeans\'in karşıya aldığı sorunun adı.',
    ex: '"Bugün ekran süreden 6 saat, buluşma 0 — Sosyal Obezite."',
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
            Yeni dil,
            <br />
            <span className="text-zinc-500">yeni topluluk kodları.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-zinc-400 mt-6 max-w-2xl"
          >
            Kullanıcı, takipçi, etkinlik, bildirim — bunlar dikkat ekonomisinin
            kelimeleri. Biz yeni bir sözlükle konuşuyoruz.
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
