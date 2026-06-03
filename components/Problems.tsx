'use client';

import { easeOutExpo } from '@/lib/motion';
import { motion } from '@/lib/motion';

const problems = [
  {
    n: '01',
    persona: 'Etkinlik Arayan',
    cta: 'Yakında bul',
    pain: '"Bu akşam ne yaparız?" — Gruplara yazdın. 12 kişi okudu, kimse cevap vermedi. Akşam yine boş geçti. Oysa bir sokak ileride aynı kahveyi içen, aynı kitabı okuyan birileri var.',
    solution:
      'Uygulamayı aç, yakındaki etkinlikler tek ekranda karşında. Saat, yer, tür; filtreni sen oluştur. Algoritma seni beslemez, şehir sana el uzatır.',
  },
  {
    n: '02',
    persona: 'Sosyal Medyadan Yorulan',
    cta: 'Birlikte yap',
    pain: 'Bugün 284 beğeni aldın. 26 yorum yazdın. Hikaye paylaştın, gönderilere cevap verdin. 0 kişiyle gerçek vakit geçirdin. Ekran çok kalabalık, sokaklar çok yalnız — işte Sosyal Obezite.',
    solution:
      'ClubBeans\'te insanlar sayılardan ibaret değil. Etkinlikler gerçek bir buluşma — gerçek yüzler, gerçek anlar. Orada olursan ekranda olmazsın, hayata dahil olursun.',
  },
  {
    n: '03',
    persona: 'Şehre Yeni Gelen',
    cta: 'İçeri gir',
    pain: 'Kaç aydır bu şehirdesin. İşe gidiyorsun, eve geliyorsun. Bir iki tanıdık var ama gerçek bir çevren henüz yok. Nereden başlayacağını bilmiyorsun. Her yer tanıdık, hiçbir yer sen değil.',
    solution:
      'Şehri sıfırdan keşfetmene gerek yok. Yakınındaki etkinlikleri görebilir, ilgi alanına göre insanlarla bir araya gelebilirsin. Beraber kahve içip bisiklet sürebilir, belki hafta sonu koşusu yapabilirsiniz. Sen ilk adımı at, gerisini şehir getirir.',
  },
  {
    n: '04',
    persona: 'Ortak İlgi Alanı Arayan',
    cta: 'Bean\'leri bul',
    pain: 'Kitap okuyup kahve içmekten mi hoşlanıyorsun? Ya da koşmak, kutu oyunları oynamak, belki voleybol maçı yapmak… Bunu seninle birlikte yapmak isteyen insanlar kesinlikle var. Ama neredeler, onları nasıl bulacaksın?',
    solution:
      'Yapmak istediğin şeye göre kulüpleri keşfedip etkinliklere katılabilirsin. Cuma akşamı müzik eğlencesi, ya da cumartesi doğa yürüyüşü. Zamanı ve yeri sen belirle, doğru Bean\'ler seni bulur.',
  },
  {
    n: '05',
    persona: 'Kulüp Kurmak İsteyen',
    cta: 'Kolay kur',
    pain: 'Kendi kulübünü kurmak, seninle aynı zevkleri paylaşan insanlarla gerçek hayatta vakit geçirmek istedin. Sohbet grubu kurdun, sosyal medyada duyuru yaptın, eşe dosta haber verdin, belki afişler bastırdın. Birçok farklı yöntem, hiçbir yere varmıyor.',
    solution:
      'Kendi topluluğunu ClubBeans\'te bir dakikada kurarsın. Etkinlik oluşturup insanlarla buluşursun — belki bir film gecesi, belki satranç turnuvası, belki doğa yürüyüşü. Trust Score ile kimleri kabul edeceğini sen seçersin. Üç uygulama değil; bir ekran, bir akış, bir topluluk.',
  },
];

export default function Problems() {
  return (
    <section id="sorunlar" className="relative py-24 md:py-36 overflow-hidden">
      <div className="container-x relative">
        <div className="max-w-3xl mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-xs uppercase tracking-[0.3em] text-acid mb-6 font-mono"
          >
            Tanıdık geldi mi?
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: easeOutExpo }}
            className="text-section font-bold tracking-tight text-white"
          >
            Aynı dert,
            <br />
            <span className="text-zinc-500">beş farklı sahne.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 text-zinc-400 max-w-2xl"
          >
            Etkinlik arıyorsun, insan arıyorsun ya da kendi topluluğunu kurmak istiyorsun.
            Belki şehre yeni geldin, belki yıllardır buradasın ama hâlâ o çevreyi bulamadın.
            Hangisi sana tanıdık geliyorsa, ClubBeans senin için tam da oradan başlıyor.
          </motion.p>
        </div>

        <div className="space-y-3 md:space-y-4">
          {problems.map((p, i) => (
            <motion.div
              key={p.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: easeOutExpo }}
              className="group relative bg-elevated border border-border rounded-3xl overflow-hidden hover:border-acid/30 transition-colors duration-300"
            >
              <div className="grid md:grid-cols-[auto_1fr_1fr] gap-5 md:gap-8 p-6 md:p-8 items-start">
                <div
                  aria-hidden="true"
                  className="text-5xl md:text-6xl font-black text-zinc-600 font-mono leading-none"
                >
                  {p.n}
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-3">
                    {p.persona}
                  </div>
                  <p className="text-lg md:text-xl text-zinc-400 leading-snug">{p.pain}</p>
                </div>
                <div className="relative md:border-l md:border-white/[0.06] md:pl-10">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-acid mb-3">
                    ClubBeans nasıl değiştirir
                  </div>
                  <p className="text-lg md:text-xl text-white leading-snug mb-4">{p.solution}</p>
                  <span className="inline-flex items-center gap-2 bg-acid/10 border border-acid/30 text-acid text-xs font-semibold rounded-full px-3 py-1">
                    <span className="w-1 h-1 rounded-full bg-acid" />
                    {p.cta}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
