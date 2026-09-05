'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import BeanCozulme from '@/components/game/BeanCozulme';
import SkorTablosu from '@/components/game/SkorTablosu';
import SosyalObezite from '@/components/game/SosyalObezite';
import {
  emojiPaylasim, ITIRAF, meydanOkumaMetni, TANIM_SATIRI, TUR_SONU, turSonuGovde,
} from '@/content/sosyal-obezite-feed';
import { useReducedMotion } from '@/lib/motion';
import type { TurOzeti } from '@/lib/game/engine';

/**
 * Tur yaşam döngüsü + tur sonu ekranı.
 *
 * CTA SIRASI (kullanıcı onayı, karar 12'den bilinçli sapma):
 *   1. tur  → PAYLAŞIM birincil, store ikincil
 *   2.+ tur → STORE birincil, paylaşım ikincil
 * Gerekçe: ilk temasta viral döngüyü besle; tekrar oynayan (niyeti belli olan)
 * kullanıcıyı store'a it.
 *
 * Redis yoksa oyun YİNE oynanır — yalnız skor tablosu devre dışı kalır.
 * Kampanya sayfasının tek bir altyapı arızasıyla tamamen ölmesi kabul edilemez.
 */

type Tur = { seed: string; sessionId: string; ilkTur: boolean; turNo: number };
type Sonuc = {
  ozet: TurOzeti; olaylar: Array<'yakala' | 'kacir'>; skor: number; sessionId: string;
};
type Kayit = { runId?: string; sira?: number; toplamOyuncu?: number; hata?: string };
import type { Lider, Rakip } from '@/components/game/HedefKutusu';

const APP_STORE = 'https://apps.apple.com/app/id6778042472';
const PLAY_STORE = 'https://play.google.com/store/apps/details?id=com.clubbeans';

/**
 * Gün serisi — "🔥7. gün" paylaşım satırının kaynağı.
 *
 * Yalnız localStorage: sunucuya HİÇBİR şey yazılmaz, kimliğe bağlanmaz.
 * Duolingo/Wordle deseni; sınırsız denemede kıtlığın yerini tutan ikinci
 * bağlılık kancası (birincisi günlük ortak akış).
 *
 * Dün oynanmışsa artar, bugün zaten oynanmışsa sabit kalır, arada boşluk
 * varsa 1'e döner.
 */
function seriGuncelle(bugun: string): number {
  try {
    const sonGun = localStorage.getItem('soSonGun');
    const seri = Number(localStorage.getItem('soSeri') ?? '0') || 0;
    if (sonGun === bugun) return seri;
    const dun = new Date(`${bugun}T00:00:00Z`);
    dun.setUTCDate(dun.getUTCDate() - 1);
    const yeni = sonGun === dun.toISOString().slice(0, 10) ? seri + 1 : 1;
    localStorage.setItem('soSonGun', bugun);
    localStorage.setItem('soSeri', String(yeni));
    return yeni;
  } catch {
    return 0; // gizli sekme / depolama kapalı — seri satırı gösterilmez
  }
}

function yerelSeed(): string {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : String(Math.random()).slice(2);
}

export default function OyunKabuk() {
  const reduced = useReducedMotion() ?? false;
  const [tur, setTur] = useState<Tur | null>(null);
  const [sonuc, setSonuc] = useState<Sonuc | null>(null);
  const [kayit, setKayit] = useState<Kayit | null>(null);
  const [takmaAd, setTakmaAd] = useState('');
  const [gonderiliyor, setGonderiliyor] = useState(false);
  const [kopyalandi, setKopyalandi] = useState(false);
  const [seri, setSeri] = useState(0);
  const [rakip, setRakip] = useState<Rakip>(null);
  const [lider, setLider] = useState<Lider>(null);
  const [hedefYuklendi, setHedefYuklendi] = useState(false);
  const turNo = useRef(0);
  const toplamSaniye = useRef(0);

  /**
   * Rakip taşıma — viral döngünün kapanış halkası.
   *
   * `useSearchParams` yerine window.location: o hook prerender sırasında
   * Suspense sınırı ZORUNLU kılıyor ve bu sayfada tek kazancı olmayacak bir
   * kabuk katmanı eklemek olurdu.
   */
  /**
   * Tur sonu ekranını gerçekten 60 saniye oynamadan görüntülemek için poz modu
   * (`?bitis=8` → 8 gerçek kurtarılmış hâli). `?poz=` ile aynı gerekçe:
   * tarayıcı panelinde rAF kısıtlandığı için tur sonunu canlı yakalamak
   * pratikte imkânsızdı ve uç ekran gözle HİÇ doğrulanamıyordu.
   * Yalnız localhost'ta çalışır — dağıtımda ölü koddur.
   */
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const bitis = q.get('bitis');
    const yerel = /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname);
    if (bitis && yerel) {
      const yakalanan = Math.max(0, Math.min(12, Number(bitis) || 0));
      turNo.current = 1;
      toplamSaniye.current = 60;
      setSonuc({
        ozet: { kart: 143, yakalanan, kacan: 12 - yakalanan, yanlisDokunma: 2, sureMs: 60_000 },
        olaylar: Array.from({ length: 12 }, (_, i) => (i < yakalanan ? 'yakala' : 'kacir')),
        skor: 143 + yakalanan * 90,
        sessionId: '',
      });
    }
  }, []);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('rakip');
    if (!id) {
      // Meydan okuma yoksa hedef günün lideridir — boş bir "Başla" ekranı
      // yarışma vaadini hiç kurmuyordu.
      fetch('/api/game/leaderboard', { cache: 'no-store' })
        .then((r) => r.json())
        .then((d: { bugun?: Array<{ ad: string; skor: number }> }) => {
          setLider(d.bugun?.[0] ?? null);
          setHedefYuklendi(true);
        })
        .catch(() => setHedefYuklendi(true));
      return;
    }
    fetch(`/api/game/rakip?id=${encodeURIComponent(id)}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((d: { bulundu: boolean } & NonNullable<Rakip>) => {
        if (d?.bulundu) {
          setRakip({
            ad: d.ad, skor: d.skor, yakalanan: d.yakalanan,
            toplam: d.toplam, ayniGun: d.ayniGun,
          });
        }
        setHedefYuklendi(true);
      })
      .catch(() => setHedefYuklendi(true));
  }, []);

  const turBaslat = useCallback(async () => {
    turNo.current += 1;
    setSonuc(null);
    setKayit(null);
    try {
      const r = await fetch('/api/game/start', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ turNo: turNo.current }),
      });
      if (!r.ok) throw new Error('start-basarisiz');
      const d = (await r.json()) as { seed: string; sessionId: string; ilkTur: boolean };
      setTur({ ...d, turNo: turNo.current });
    } catch {
      // Altyapı yoksa oyun yine oynanır; skor tablosuna yazılmaz.
      setTur({ seed: yerelSeed(), sessionId: '', ilkTur: turNo.current <= 1, turNo: turNo.current });
    }
  }, []);



  useEffect(() => {
    // Poz modu (?bitis=) tur sonu ekranını doğrudan boyar — tur başlatılmaz,
    // yoksa oyun ekranı poza baskın gelir ve doğrulama imkânsızlaşır.
    if (new URLSearchParams(window.location.search).has('bitis')) return;
    void turBaslat();
  }, [turBaslat]);

  const onBitti = useCallback((v: Sonuc) => {
    toplamSaniye.current += 60;
    // TR günü (UTC+3) — sunucudaki trGunu() ile aynı tanım
    const trBugun = new Date(Date.now() + 3 * 3_600_000).toISOString().slice(0, 10);
    setSeri(seriGuncelle(trBugun));
    setSonuc(v);
    setTur(null);
  }, []);

  const skoruGonder = useCallback(async () => {
    if (!sonuc || !takmaAd.trim() || !sonuc.sessionId) return;
    setGonderiliyor(true);
    try {
      const r = await fetch('/api/game/submit', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          sessionId: sonuc.sessionId,
          takmaAd: takmaAd.trim(),
          skor: sonuc.skor,
          ozet: sonuc.ozet,
          olaylar: sonuc.olaylar,
          toplamSaniye: toplamSaniye.current,
        }),
      });
      const d = (await r.json()) as Kayit & { mesaj?: string };
      setKayit(r.ok ? d : { hata: d.mesaj ?? 'Kaydedilemedi.' });
    } catch {
      setKayit({ hata: 'Bağlantı kurulamadı.' });
    } finally {
      setGonderiliyor(false);
    }
  }, [sonuc, takmaAd]);

  /** Paylaşım metnini üretir — kanal metnin biçimini değiştirir, süsünü değil. */
  const metinUret = useCallback(
    (kanal: 'x' | 'genel' | 'meydan') => {
      if (!sonuc) return '';
      const toplam = sonuc.ozet.yakalanan + sonuc.ozet.kacan;
      if (kanal === 'meydan') {
        return meydanOkumaMetni({
          olaylar: sonuc.olaylar, yakalanan: sonuc.ozet.yakalanan, toplam,
        });
      }
      const enYuksekCarpan =
        sonuc.ozet.yakalanan >= 3 ? 2 : sonuc.ozet.yakalanan === 2 ? 1.5 : 1;
      return emojiPaylasim({
        olaylar: sonuc.olaylar,
        yakalanan: sonuc.ozet.yakalanan,
        toplam,
        enYuksekCarpan,
        yanlisDokunma: sonuc.ozet.yanlisDokunma,
        seri,
        kanal,
        url: kayit?.runId
          ? `${location.origin}/sosyal-obezite/s/${kayit.runId}`
          : `${location.origin}/sosyal-obezite`,
      });
    },
    [sonuc, kayit, seri]
  );

  /** Web Share / pano — burada link METNİN İÇİNDE, ayrıca `url` VERİLMEZ
   *  (iki kez çıkardı). */
  const paylas = useCallback(() => {
    const metin = metinUret('genel');
    if (!metin) return;
    if (navigator.share) {
      void navigator.share({ text: metin }).catch(() => {});
    } else if (navigator.clipboard) {
      void navigator.clipboard.writeText(metin).then(
        () => setKopyalandi(true),
        () => window.open(`https://x.com/intent/post?text=${encodeURIComponent(metin)}`, '_blank', 'noopener')
      );
      setTimeout(() => setKopyalandi(false), 2200);
    } else {
      window.open(`https://x.com/intent/post?text=${encodeURIComponent(metin)}`, '_blank', 'noopener');
    }
  }, [metinUret]);

  /**
   * X'e LİNKSİZ gönderim.
   *
   * X, dış link taşıyan gönderilerin erişimini belirgin biçimde kırpıyor.
   * Skor paylaşımının işi tıklatmak değil GÖRÜNMEK; link resmi hesabın günlük
   * gönderisinin ilk yanıtında yaşar. Bu yüzden metinde URL yok.
   */
  const xePaylas = useCallback(
    (kanal: 'x' | 'meydan') => {
      const metin = metinUret(kanal);
      if (!metin) return;
      window.open(
        `https://x.com/intent/post?text=${encodeURIComponent(metin)}`,
        '_blank',
        'noopener'
      );
    },
    [metinUret]
  );

  if (tur) {
    return (
      <SosyalObezite
        key={tur.sessionId || tur.seed}
        seed={tur.seed}
        sessionId={tur.sessionId}
        ilkTur={tur.ilkTur}
        turNo={tur.turNo}
        toplamSaniyeOnce={toplamSaniye.current}
        rakip={rakip}
        lider={lider}
        hedefYuklendi={hedefYuklendi}
        onBitti={onBitti}
        reduced={reduced}
      />
    );
  }

  if (!sonuc) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center">
        <p className="font-mono text-sm text-ghost">Akış hazırlanıyor…</p>
      </div>
    );
  }

  const ilkKosu = turNo.current <= 1;
  const dk = Math.max(1, Math.round(toplamSaniye.current / 60));

  // Hiyerarşi ZORUNLU (metin uzmanı): kurtarılan gerçek BÜYÜK, süre orta, skor KÜÇÜK.
  // Skoru öne alan kart "çok kaydırdım" diye övünür ve tezi ters çevirir.
  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-md flex-col justify-center gap-6 px-6 py-10">
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs uppercase tracking-widest text-ghost">{TUR_SONU.baslik}</p>
        <BeanCozulme faz={5} size={56} reduced={reduced} />
      </div>

      <div>
        <p className="font-mono text-[11px] uppercase tracking-widest text-ghost">kurtardığın gerçek</p>
        <p className="font-mono text-6xl font-bold tabular-nums leading-none text-acid">
          {sonuc.ozet.yakalanan}
          <span className="text-2xl text-ghost">/{sonuc.ozet.yakalanan + sonuc.ozet.kacan}</span>
        </p>
      </div>

      <p className="text-[15px] leading-relaxed text-white/85">
        {turSonuGovde(sonuc.ozet.kart, sonuc.ozet.yakalanan, sonuc.ozet.kacan)}
      </p>
      <p className="font-mono text-xs text-ghost">
        akışa verdiğin süre: <span className="text-white/70">{dk} dakika</span> · skor:{' '}
        <span className="text-white/70 tabular-nums">{sonuc.skor}</span>
        {kayit?.sira ? <> · sıra: <span className="text-white/70">{kayit.sira}</span></> : null}
      </p>

      {/* Meydan okuma hükmü — rakiple gelindiyse turun asıl sonucu budur.
          Yenilgi "kaybettin" diye değil "N puan kaldı" diye yazılır: near-miss
          tekrar denemeyi besler, kesin yenilgi sekmeyi kapattırır. */}
      {rakip && (
        <div className="rounded-2xl border border-acid/30 bg-acid/5 p-4">
          {sonuc.skor > rakip.skor ? (
            <>
              <p className="text-[17px] font-semibold leading-snug text-acid">
                {rakip.ad} geçildi.
              </p>
              <p className="mt-1 font-mono text-xs text-ghost">
                {sonuc.skor} — {rakip.skor}. Sıra onda.
              </p>
            </>
          ) : (
            <>
              <p className="text-[17px] font-semibold leading-snug text-white">
                {rakip.skor - sonuc.skor + 1 <= 100
                  ? `${rakip.ad}’a ${Math.max(1, Math.ceil((rakip.skor - sonuc.skor + 1) / 50))} yakalama kaldı.`
                  : `${rakip.ad} önde.`}
              </p>
              <p className="mt-1 font-mono text-xs text-ghost">
                {sonuc.skor} — {rakip.skor}
                {rakip.ayniGun === false && ' · bu skor başka bir günün akışından'}
              </p>
            </>
          )}
        </div>
      )}

      <p className="border-l-2 border-acid/40 pl-3 text-[15px] italic leading-relaxed text-white/70">
        {TUR_SONU.kopruSatiri}
      </p>

      {/* Skor tablosuna yazma */}
      {sonuc.sessionId && !kayit?.runId && (
        <div className="space-y-2">
          <label htmlFor="ad" className="font-mono text-[11px] uppercase tracking-widest text-ghost">
            takma ad
          </label>
          <div className="flex gap-2">
            <input
              id="ad"
              value={takmaAd}
              onChange={(e) => setTakmaAd(e.target.value)}
              maxLength={20}
              placeholder="tabloya yazılacak ad"
              className="min-h-[48px] flex-1 rounded-xl border border-border bg-raised px-3 text-white placeholder:text-ghost focus:border-acid focus:outline-none"
            />
            <button
              type="button"
              onClick={() => void skoruGonder()}
              disabled={gonderiliyor || takmaAd.trim().length < 2}
              className="min-h-[48px] rounded-xl border border-border px-4 font-semibold text-white disabled:opacity-40"
            >
              {gonderiliyor ? '…' : 'yaz'}
            </button>
          </div>
          {kayit?.hata && <p role="alert" className="font-mono text-xs text-[#e8654f]">{kayit.hata}</p>}
        </div>
      )}

      {/* Yarışmanın görünür yüzü. Skor yazıldıktan sonra remount ile tazelenir. */}
      <SkorTablosu key={kayit?.runId ?? 'ilk'} benimSkorum={sonuc.skor} />

      {/* CTA — sıra tur numarasına göre değişir */}
      <div className="flex flex-col gap-3 pt-2">
        {ilkKosu ? (
          <>
            <button
              type="button"
              onClick={paylas}
              className="min-h-[52px] rounded-full bg-acid px-6 font-semibold text-midnight active:scale-95"
            >
              {kopyalandi ? 'Panoya kopyalandı ✓' : 'Kartını paylaş'}
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => xePaylas('x')}
                className="min-h-[44px] flex-1 rounded-xl border border-border font-mono text-xs text-white/80"
              >
                X’e at
              </button>
              <button
                type="button"
                onClick={() => xePaylas('meydan')}
                className="min-h-[44px] flex-1 rounded-xl border border-border font-mono text-xs text-white/80"
              >
                Meydan oku
              </button>
            </div>
            <p className="text-center font-mono text-[11px] leading-relaxed text-ghost">{TUR_SONU.ctaUstu}</p>
            <div className="flex gap-2">
              <a href={APP_STORE} className="min-h-[48px] flex-1 rounded-xl border border-border text-center font-mono text-xs leading-[48px] text-white/80">
                {TUR_SONU.storeAppleEtiket}
              </a>
              <a href={PLAY_STORE} className="min-h-[48px] flex-1 rounded-xl border border-border text-center font-mono text-xs leading-[48px] text-white/80">
                {TUR_SONU.storeGoogleEtiket}
              </a>
            </div>
          </>
        ) : (
          <>
            <p className="text-center font-mono text-[11px] leading-relaxed text-ghost">{TUR_SONU.ctaUstu}</p>
            <div className="flex gap-2">
              <a href={APP_STORE} className="min-h-[52px] flex-1 rounded-full bg-acid text-center font-semibold leading-[52px] text-midnight">
                {TUR_SONU.storeAppleEtiket}
              </a>
              <a href={PLAY_STORE} className="min-h-[52px] flex-1 rounded-full bg-acid text-center font-semibold leading-[52px] text-midnight">
                {TUR_SONU.storeGoogleEtiket}
              </a>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={paylas}
                className="min-h-[48px] flex-1 rounded-xl border border-border font-semibold text-white/85"
              >
                {kopyalandi ? 'Kopyalandı ✓' : 'Paylaş'}
              </button>
              <button
                type="button"
                onClick={() => xePaylas('meydan')}
                className="min-h-[48px] flex-1 rounded-xl border border-border font-mono text-xs text-white/80"
              >
                Meydan oku
              </button>
            </div>
          </>
        )}
        {rakip && sonuc.skor <= rakip.skor ? (
          <button
            type="button"
            onClick={() => void turBaslat()}
            className="min-h-[52px] rounded-full bg-acid px-6 font-semibold text-midnight active:scale-95"
          >
            Tekrar dene
          </button>
        ) : (
          <button
            type="button"
            onClick={() => void turBaslat()}
            className="min-h-[44px] font-mono text-xs text-ghost underline decoration-dotted"
          >
            bir tur daha
          </button>
        )}
      </div>

      {/* İtiraf geri döner (metin uzmanı: başta verilip sonda tekrarlanmazsa anlamı kaybolur) */}
      <div className="border-t border-border pt-4">
        <p className="font-mono text-[11px] text-ghost">{ITIRAF.sonEkranOnek}</p>
        <p className="text-sm leading-snug text-white/70">
          {ITIRAF.satir1} <span className="text-acid">{ITIRAF.satir2}</span>
        </p>
        <p className="mt-3 font-mono text-[10px] leading-relaxed text-ghost">{TANIM_SATIRI}</p>
        {/* KVKK m.10: aydınlatma metni, veri girilen ekrandan erişilebilir olmalı */}
        <a
          href="/sosyal-obezite/kvkk"
          className="mt-3 inline-block font-mono text-[10px] text-ghost underline decoration-dotted"
        >
          Hangi veriler işleniyor?
        </a>
      </div>
    </div>
  );
}
