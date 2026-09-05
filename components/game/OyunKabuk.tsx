'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Lider, Rakip } from '@/components/game/HedefKutusu';
import Itiraf from '@/components/game/Itiraf';
import SosyalObezite from '@/components/game/SosyalObezite';
import TurSonu, { type Kayit, type Magaza, type TurSonucu } from '@/components/game/TurSonu';
import Yakinda from '@/components/game/Yakinda';
import { emojiPaylasim, meydanOkumaMetni } from '@/content/sosyal-obezite-feed';
import { magazaLinki } from '@/lib/appLinks';
import { denetimSayisi } from '@/lib/game/denetim';
import { trGunu } from '@/lib/game/gun';
import { oyunOlay } from '@/lib/game/olay';

/**
 * Tur yaşam döngüsü — orkestratör. Ekranlar: Itiraf (SSR) → SosyalObezite → TurSonu.
 *
 * ANINDA BAŞLAMA: seed günlük (`so-<TR günü>`) ve istemcide hesaplanır; '60 saniye'
 * oyunu hemen açar, /api/game/start arka planda oturum kimliğini getirir (tur bitene
 * kadar gelir; gelmezse tur tablosuz sayılır). "Akış hazırlanıyor…" ekranı yok.
 *
 * CTA SIRASI (kullanıcı onayı, karar 12'den bilinçli sapma): 1. tur paylaşım
 * birincil / 2.+ tur store birincil. 2+ turda itiraf ekranı tekrar gelmez.
 *
 * Kill-switch: start 503 {hata:'kapali'} → Yakinda. Redis yoksa oyun yine oynanır.
 */

type Asama = 'itiraf' | 'oynaniyor' | 'bitti' | 'kapali';

/** Gün serisi — yalnız localStorage; sunucuya hiçbir şey gitmez. */
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
    return 0;
  }
}

function useReducedMotionYerel(): boolean {
  const [r, setR] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setR(mq.matches);
    const h = (e: MediaQueryListEvent) => setR(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);
  return r;
}

function platformOnceligi(): Magaza['oncelik'] {
  if (typeof navigator === 'undefined') return 'ikisi';
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return 'ios';
  if (/Android/i.test(ua)) return 'android';
  return 'ikisi';
}

export default function OyunKabuk() {
  const reduced = useReducedMotionYerel();
  const [asama, setAsama] = useState<Asama>('itiraf');
  const [sonuc, setSonuc] = useState<TurSonucu | null>(null);
  const [kayit, setKayit] = useState<Kayit | null>(null);
  const [takmaAd, setTakmaAd] = useState('');
  const [gonderiliyor, setGonderiliyor] = useState(false);
  const [kopyalandi, setKopyalandi] = useState(false);
  const [seri, setSeri] = useState(0);
  const [rakip, setRakip] = useState<Rakip>(null);
  const [lider, setLider] = useState<Lider>(null);
  const [hedefYuklendi, setHedefYuklendi] = useState(false);
  const [magaza, setMagaza] = useState<Magaza>({ ios: magazaLinki('ios', 'sosyal-obezite'), android: magazaLinki('android', 'sosyal-obezite'), oncelik: 'ikisi' });
  const turNo = useRef(0);
  const toplamSaniye = useRef(0);
  const sessionId = useRef('');
  const oneriAd = useRef('');
  const seed = useMemo(() => `so-${trGunu()}`, []);

  /** Oturum kimliğini arka planda getirir; oyun beklemez. */
  const oturumGetir = useCallback(async (tur: number) => {
    sessionId.current = '';
    try {
      const r = await fetch('/api/game/start', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ turNo: tur }),
        signal: AbortSignal.timeout(4000),
      });
      if (r.status === 503) {
        const d = (await r.json().catch(() => null)) as { hata?: string } | null;
        if (d?.hata === 'kapali') { setAsama('kapali'); return; }
      }
      if (!r.ok) return; // 429 vb.: tur tablosuz oynanır
      const d = (await r.json()) as { sessionId: string; oneriAd?: string };
      sessionId.current = d.sessionId ?? '';
      if (d.oneriAd && !oneriAd.current) {
        oneriAd.current = d.oneriAd;
        setTakmaAd((v) => v || d.oneriAd!);
      }
    } catch {
      // ağ hatası / zaman aşımı: oyun yine oynanır, skor tabloya yazılmaz
    }
  }, []);

  const turBaslat = useCallback(() => {
    turNo.current += 1;
    setSonuc(null);
    setKayit(null);
    setKopyalandi(false);
    setAsama('oynaniyor');
    void oturumGetir(turNo.current);
    oyunOlay('tur_basladi', { turNo: turNo.current, rakipVar: !!rakip });
  }, [oturumGetir, rakip]);

  // Açılış: hedef (rakip / günün lideri) + denetim modu tur-sonu pozu
  useEffect(() => {
    setMagaza((m) => ({ ...m, oncelik: platformOnceligi() }));
    oyunOlay('oyun_goruntulendi', { turNo: 0 });
    const bitis = denetimSayisi('bitis');
    if (bitis !== null) {
      const yakalanan = Math.max(0, Math.min(12, bitis));
      turNo.current = 1;
      toplamSaniye.current = 60;
      setSonuc({
        ozet: { kart: 143, yakalanan, kacan: 12 - yakalanan, yanlisDokunma: 2, sureMs: 60_000 },
        olaylar: Array.from({ length: 12 }, (_, i) => (i < yakalanan ? 'yakala' : 'kacir')),
        skor: 143 + yakalanan * 90,
        sessionId: '',
      });
      setAsama('bitti');
    }
    const id = new URLSearchParams(window.location.search).get('rakip');
    if (!id) {
      fetch('/api/game/leaderboard', { cache: 'no-store', signal: AbortSignal.timeout(4000) })
        .then((r) => r.json())
        .then((d: { bugun?: Array<{ ad: string; skor: number }> }) => {
          setLider(d.bugun?.[0] ?? null);
          setHedefYuklendi(true);
        })
        .catch(() => setHedefYuklendi(true));
      return;
    }
    oyunOlay('rakip_ile_gelindi');
    fetch(`/api/game/rakip?id=${encodeURIComponent(id)}`, { cache: 'no-store', signal: AbortSignal.timeout(4000) })
      .then((r) => r.json())
      .then((d: { bulundu: boolean } & NonNullable<Rakip>) => {
        if (d?.bulundu) setRakip({ ad: d.ad, skor: d.skor, yakalanan: d.yakalanan, toplam: d.toplam, ayniGun: d.ayniGun });
        setHedefYuklendi(true);
      })
      .catch(() => setHedefYuklendi(true));
  }, []);

  const onBitti = useCallback((v: TurSonucu) => {
    toplamSaniye.current += 60;
    setSeri(seriGuncelle(trGunu()));
    setSonuc({ ...v, sessionId: sessionId.current });
    setAsama('bitti');
    oyunOlay('tur_bitti', {
      turNo: turNo.current, skor: v.skor, yakalanan: v.ozet.yakalanan, kacan: v.ozet.kacan,
      yanlisDokunma: v.ozet.yanlisDokunma, kart: v.ozet.kart, tabloAcik: !!sessionId.current,
    });
  }, []);

  /** Skoru tabloya yazar; runId döner (paylaşım kartı için). */
  const skoruGonder = useCallback(async (): Promise<string | null> => {
    if (!sonuc || !sonuc.sessionId) return null;
    const ad = takmaAd.trim();
    if (ad.length < 2) return null;
    if (kayit?.runId) return kayit.runId;
    setGonderiliyor(true);
    try {
      const r = await fetch('/api/game/submit', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          sessionId: sonuc.sessionId, takmaAd: ad, skor: sonuc.skor, ozet: sonuc.ozet,
          olaylar: sonuc.olaylar, toplamSaniye: toplamSaniye.current,
        }),
        signal: AbortSignal.timeout(8000),
      });
      const d = (await r.json().catch(() => ({}))) as Kayit & { mesaj?: string; hata?: string };
      if (r.ok) {
        setKayit(d);
        oyunOlay('skor_yazildi', { turNo: turNo.current, sira: d.sira ?? 0 });
        oyunOlay('takma_ad_yazildi', { oneriKullanildi: ad === oneriAd.current });
        return d.runId ?? null;
      }
      setKayit({ hata: d.mesaj ?? 'Kaydedilemedi.' });
      oyunOlay('skor_reddedildi', { sebep: d.hata ?? String(r.status) });
      return null;
    } catch {
      setKayit({ hata: 'Bağlantı kurulamadı.' });
      return null;
    } finally {
      setGonderiliyor(false);
    }
  }, [sonuc, takmaAd, kayit]);

  const kartUrl = useCallback((runId: string | null) =>
    runId ? `${location.origin}/sosyal-obezite/s/${runId}` : `${location.origin}/sosyal-obezite`, []);

  const metinUret = useCallback((kanal: 'x' | 'genel' | 'meydan' | 'meydan-x' | 'cevap', runId: string | null) => {
    if (!sonuc) return '';
    const toplam = sonuc.ozet.yakalanan + sonuc.ozet.kacan;
    const url = kartUrl(runId);
    if (kanal === 'cevap' && rakip) {
      return meydanOkumaMetni({
        olaylar: sonuc.olaylar, yakalanan: sonuc.ozet.yakalanan, toplam, url, kanal: 'genel',
        rakip: { ad: rakip.ad, yakalanan: rakip.yakalanan },
      });
    }
    if (kanal === 'meydan' || kanal === 'meydan-x') {
      return meydanOkumaMetni({
        olaylar: sonuc.olaylar, yakalanan: sonuc.ozet.yakalanan, toplam, url,
        kanal: kanal === 'meydan' ? 'genel' : 'x',
      });
    }
    const enYuksekCarpan = sonuc.ozet.yakalanan >= 3 ? 2 : sonuc.ozet.yakalanan === 2 ? 1.5 : 1;
    return emojiPaylasim({
      olaylar: sonuc.olaylar, yakalanan: sonuc.ozet.yakalanan, toplam, enYuksekCarpan,
      yanlisDokunma: sonuc.ozet.yanlisDokunma, seri, kanal: kanal === 'x' ? 'x' : 'genel', url,
    });
  }, [sonuc, rakip, seri, kartUrl]);

  /** Web Share / pano. Link METNİN İÇİNDE; ad yazılmadıysa önce öneriyle kaydeder (kart oluşsun). */
  const paylas = useCallback(async (kanal: 'genel' | 'meydan' | 'cevap') => {
    if (!sonuc) return;
    let runId = kayit?.runId ?? null;
    if (!runId && sonuc.sessionId) runId = await skoruGonder();
    const metin = metinUret(kanal, runId);
    if (!metin) return;
    oyunOlay('paylasim_tiklandi', { kanal, kartli: !!runId });
    if (navigator.share) {
      try { await navigator.share({ text: metin }); return; } catch { /* iptal → panoya düş */ }
    }
    try {
      await navigator.clipboard.writeText(metin);
      setKopyalandi(true);
      setTimeout(() => setKopyalandi(false), 2200);
    } catch {
      window.prompt('Kopyala:', metin);
    }
  }, [sonuc, kayit, skoruGonder, metinUret]);

  /**
   * X intent — LİNKSİZ (X dış linkli gönderilerin erişimini kırpıyor); `via` ile resmi
   * hesap bildirim alır ve ilk yanıtta linki bırakır (denetim viral-3). <a> ile açılır:
   * popup engeli / WebView sorunu yok (tarayici-5).
   */
  const xIntent = useCallback((kanal: 'x' | 'meydan') => {
    const metin = metinUret(kanal === 'x' ? 'x' : 'meydan-x', kayit?.runId ?? null);
    return `https://x.com/intent/post?text=${encodeURIComponent(metin)}&via=ClubBeansapp`;
  }, [metinUret, kayit]);

  const indirTikla = useCallback((store: 'ios' | 'android') => {
    oyunOlay('indir_tiklandi', { store, turNo: turNo.current });
  }, []);

  const birTurDaha = useCallback(() => {
    oyunOlay('bir_tur_daha', { turNo: turNo.current });
    turBaslat();
  }, [turBaslat]);

  if (asama === 'kapali') return <Yakinda />;

  if (asama === 'oynaniyor') {
    return (
      <SosyalObezite
        key={turNo.current}
        seed={seed}
        sessionId={sessionId.current}
        ilkTur={turNo.current <= 1}
        turNo={turNo.current}
        toplamSaniyeOnce={toplamSaniye.current}
        onBitti={onBitti}
        reduced={reduced}
      />
    );
  }

  if (asama === 'bitti' && sonuc) {
    return (
      <TurSonu
        sonuc={sonuc}
        kayit={kayit}
        turNo={turNo.current}
        toplamSaniye={toplamSaniye.current}
        takmaAd={takmaAd}
        setTakmaAd={setTakmaAd}
        gonderiliyor={gonderiliyor}
        skoruGonder={() => void skoruGonder()}
        paylas={(k) => void paylas(k)}
        xIntent={xIntent}
        kopyalandi={kopyalandi}
        rakip={rakip}
        seri={seri}
        magaza={magaza}
        indirTikla={indirTikla}
        birTurDaha={birTurDaha}
        reduced={reduced}
      />
    );
  }

  return (
    <Itiraf rakip={rakip} lider={lider} yuklendi={hedefYuklendi} onBasla={turBaslat} reduced={reduced} />
  );
}
