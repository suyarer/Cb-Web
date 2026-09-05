'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import BeanCozulme from '@/components/game/BeanCozulme';
import { ILK_KACIRMA_IPUCU, oyunIciSatir } from '@/content/sosyal-obezite-feed';
import { denetimSayisi } from '@/lib/game/denetim';
import {
  beanFazi, CARPAN_MERDIVENI, GERCEK_SAYISI, hesaplaSkor, seedToInt, spawnTakvimi,
  TUR_SURESI_MS, YAKALAMA_PENCERESI_MS, YAKALAMA_TABAN, type BeanFaz, type TurOzeti,
} from '@/lib/game/engine';
import {
  firlatmaHizi, geriYayla, konumIlerlet, MIN_MOMENTUM_MESAFESI, snapHedefi, sonumUygula, type Ornek,
} from '@/lib/game/fizik';
import { gercekDaveti, kademeIcin, kartVerisi, turSeedi } from '@/lib/game/kart';

/**
 * SOSYAL OBEZİTE — çekirdek oyun (yalnız oynanış; itiraf ve tur sonu OyunKabuk'ta).
 *
 * HİS KURALI: parmak 1:1 takip edilir, hareket ASLA kırpılmaz. Hız tavanı
 * SKORA aittir ve sunucuda uygulanır.
 *
 * Denetim düzeltmeleri (2026-09-05, hepsi ölçümle CONFIRMED):
 *   - Ödül rozeti 0 kare görünüyordu (opacity'siz transition + sonraki karede 0) → 350 ms görünür
 *   - Kalan-süre çubuğu yanlış çocuğa (etiket) bağlıydı → ref
 *   - Fren dokunuşundan sonra eski snap hedefine 55-407 px süzülme → onDown/tap'ta snapHedef=null
 *   - pointercancel tap sayılıp −20 yazıyordu → ayrı onCancel
 *   - İkinci parmağın dokunuşu ölüydü → devir parmağı tap değerlendirmesi
 *   - Masaüstünde tekerlek ölüydü → wheel dinleyicisi
 *   - Boşluk basılı tutma sınırsız ceza → e.repeat kapısı
 *   - '60 saniye' çift dokunuşu ilk kareye −20 → 400 ms ısınma
 *   - Kör 'fırlat→dokun' ritmi cezasızdı → 1 sn içinde ikinci fren dokunuşu normal tap sayılır
 *   - viewportH mount'ta sabitti → resize dinleyicisi
 *   - Reduced-motion'da atalet sürüyordu → hız 0, kart kart
 *   - Slot eşlemesi konuma bağlıydı (10 kart/kart sınırı) → index'e sabit
 */

const KART_H = 188;
const BOSLUK = 12;
const HAVUZ = 10;
/** Tap kapısı gevşetildi: 12px/280ms aceleci yakalamayı sürüklemeye çeviriyordu */
const TAP_ESIGI_PX = 18;
const TAP_SURESI_MS = 500;
/** Bu mesafenin altında + bu hızın altında biten hareket, fling değil yakalama sayılır */
const GEVSEK_TAP_PX = 28;
const GEVSEK_TAP_HIZ = 250;
/** Bu hızla akan akışı durdurmak için yapılan dokunuş CEZASIZ (doğal fren) */
const FREN_ESIGI = 200;
/** İki fren dokunuşu bundan yakınsa ikincisi normal tap sayılır (kör ritim kapısı) */
const FREN_ARALIGI_MS = 1000;
/** Oyun başlangıcında dokunuşlar değerlendirilmez ('60 saniye' çift tap'ı) */
const ISINMA_MS = 400;
const ODUL_MS = 350;
const KACIRMA_MS = 250;

type Olay = 'yakala' | 'kacir';

type Props = {
  seed: string; sessionId: string; ilkTur: boolean; turNo: number;
  toplamSaniyeOnce: number; reduced: boolean;
  onBitti: (v: { ozet: TurOzeti; olaylar: Olay[]; skor: number; sessionId: string }) => void;
};

export default function SosyalObezite({
  seed, sessionId, ilkTur, turNo, toplamSaniyeOnce, onBitti, reduced,
}: Props) {
  const [bitti, setBitti] = useState(false);
  const [hud, setHud] = useState({ kalan: 60, faz: 0 as BeanFaz });
  const [anons, setAnons] = useState({ metin: '', n: 0 });
  const [ozet, setOzet] = useState('');
  const [ipucu, setIpucu] = useState<string | null>(null);

  const kokRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<HTMLDivElement>(null);
  const kartRef = useRef<Array<HTMLDivElement | null>>([]);
  const isaretRef = useRef<HTMLDivElement>(null);
  const rozetRef = useRef<HTMLSpanElement>(null);
  const kalanRef = useRef<HTMLSpanElement>(null);
  const cezaRef = useRef<HTMLDivElement>(null);
  const skorRef = useRef<HTMLParagraphElement>(null);
  const kalanSayacRef = useRef<HTMLParagraphElement>(null);
  const gercekRef = useRef<HTMLSpanElement>(null);
  const seriRef = useRef<HTMLSpanElement>(null);
  const zamanlayicilar = useRef<number[]>([]);

  const S = useRef({
    baslangic: 0, offset: 0, hiz: 0, hizOnDown: 0,
    surukleniyor: false, aktifPointer: null as number | null,
    basiliPointerlar: new Map<number, number>(), // pointerId -> son clientY
    devir: null as null | { id: number; t: number; y: number },
    ornekler: [] as Ornek[], basY: 0, basT: 0, sonY: 0,
    kart: 0, yakalanan: 0, kacan: 0, yanlisDokunma: 0, seri: 0,
    olaylar: [] as Olay[], takvim: [] as number[], sonrakiSpawn: 0,
    aktifGercek: null as null | { basladi: number },
    isaretKartIndex: 0, odulBitis: 0, kacirmaBitis: 0, sonFrenT: -Infinity,
    ilkKacirmaGosterildi: false, ilkCezaGosterildi: false,
    gizlendi: 0, seedInt: 0, turSeed: 0, bitti: false, viewportH: 800,
    snapHedef: null as number | null,
    trauma: 0,
    sonPolite: 0,
  });

  const zamanla = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    zamanlayicilar.current.push(id);
  }, []);
  useEffect(() => () => { for (const id of zamanlayicilar.current) clearTimeout(id); }, []);

  const anonsEt = useCallback((metin: string) => setAnons((a) => ({ metin, n: a.n + 1 })), []);

  const skorYaz = useCallback((renk?: string) => {
    const s = S.current;
    const o: TurOzeti = {
      kart: s.kart, yakalanan: s.yakalanan, kacan: s.kacan,
      yanlisDokunma: s.yanlisDokunma, sureMs: TUR_SURESI_MS, // HUD ve final aynı tavan kuralı
    };
    const sk = skorRef.current;
    if (sk) {
      sk.textContent = String(hesaplaSkor(o, s.olaylar).skor);
      if (renk) {
        sk.style.color = renk;
        sk.style.transform = 'scale(1.15)';
        zamanla(() => { sk.style.color = ''; sk.style.transform = ''; }, 150);
      }
    }
    if (gercekRef.current) gercekRef.current.textContent = `${s.yakalanan}/${GERCEK_SAYISI}`;
    if (seriRef.current) {
      const n = Math.min(s.seri, CARPAN_MERDIVENI.length);
      seriRef.current.textContent = '●'.repeat(n) + '○'.repeat(CARPAN_MERDIVENI.length - n);
    }
  }, [zamanla]);

  const bitir = useCallback(() => {
    const s = S.current;
    if (s.bitti) return;
    s.bitti = true;
    const acik = s.takvim.length - s.sonrakiSpawn + (s.aktifGercek ? 1 : 0);
    const oz: TurOzeti = {
      kart: s.kart, yakalanan: s.yakalanan, kacan: s.kacan + acik,
      yanlisDokunma: s.yanlisDokunma, sureMs: TUR_SURESI_MS,
    };
    const olaylar = [...s.olaylar];
    for (let i = 0; i < acik; i++) olaylar.push('kacir');
    setBitti(true);
    onBitti({ ozet: oz, olaylar, skor: hesaplaSkor(oz, olaylar).skor, sessionId });
  }, [onBitti, sessionId]);

  // ── rAF ──
  useEffect(() => {
    const s = S.current;
    s.baslangic = performance.now();
    s.seedInt = seedToInt(seed);
    s.turSeed = turSeedi(s.seedInt, turNo);
    s.takvim = spawnTakvimi(seed, ilkTur);
    s.viewportH = window.innerHeight;
    const pozSn = denetimSayisi('poz');

    let raf = 0, sonFrame = s.baslangic, sonHud = 0;

    const isaretKonumla = (t: number) => {
      const im = isaretRef.current;
      if (!im) return;
      const aktif = !!s.aktifGercek;
      const odul = !aktif && t < s.odulBitis;
      const kacirma = !aktif && !odul && t < s.kacirmaBitis;
      if (!aktif && !odul && !kacirma) {
        if (im.style.opacity !== '0') im.style.opacity = '0';
        return;
      }
      let y = s.isaretKartIndex * KART_H - s.offset;
      if (aktif && (y < -KART_H || y > s.viewportH - KART_H * 0.5)) {
        // Ekrandan taştı: akış yönünde GİREN slota taşı. basladi DEĞİŞMEZ.
        s.isaretKartIndex =
          y > s.viewportH - KART_H * 0.5
            ? Math.floor(s.offset / KART_H) + 1
            : Math.floor(s.offset / KART_H) + Math.max(1, Math.ceil(s.viewportH / KART_H) - 1);
        y = s.isaretKartIndex * KART_H - s.offset;
      }
      im.style.opacity = '1';
      im.style.transform = `translate3d(0,${y}px,0)`;
      if (aktif && s.aktifGercek && kalanRef.current) {
        const kalan = 1 - (t - s.aktifGercek.basladi) / YAKALAMA_PENCERESI_MS;
        kalanRef.current.style.transform = `scaleX(${Math.max(0, kalan)})`;
      }
    };

    const dongu = (t: number) => {
      const dtMs = Math.min(t - sonFrame, 50);
      sonFrame = t;
      const gecen = t - s.baslangic;
      if (gecen >= TUR_SURESI_MS) { bitir(); return; }

      // ── Hareket ──
      if (!s.surukleniyor) {
        s.hiz = sonumUygula(s.hiz, dtMs);
        const onceki = s.offset;
        if (s.hiz === 0 && s.snapHedef !== null) {
          // Fling bitti → en yakın kart sınırına otur (reel sayfalama hissi).
          const fark = s.snapHedef - s.offset;
          if (Math.abs(fark) < 0.6) { s.offset = s.snapHedef; s.snapHedef = null; }
          else s.offset += fark * (1 - Math.pow(0.988, dtMs));
        } else {
          s.offset = konumIlerlet(s.offset, (s.hiz * dtMs) / 1000, s.viewportH);
        }
        if (s.offset < 0) {
          s.offset = geriYayla(s.offset, dtMs);
          if (s.hiz <= 0) s.hiz = 0;
          s.snapHedef = null;
        }
        const g = Math.floor(s.offset / KART_H) - Math.floor(onceki / KART_H);
        if (g > 0) s.kart += g;
      }

      // ── Sarsıntı: shake = trauma² × 14 px (trauma³×12 ölçümde 0.1 px'ti). Yalnız olumsuz olaylarda. ──
      if (s.trauma > 0 && !reduced) {
        s.trauma = Math.max(0, s.trauma - dtMs / 250);
        const g = s.trauma * s.trauma * 14;
        kokRef.current?.style.setProperty(
          '--sarsinti',
          `${(Math.random() * 2 - 1) * g}px, ${(Math.random() * 2 - 1) * g}px`
        );
      } else if (kokRef.current?.style.getPropertyValue('--sarsinti')) {
        kokRef.current.style.setProperty('--sarsinti', '0px, 0px');
      }

      // ── Spawn ──
      while (s.sonrakiSpawn < s.takvim.length && gecen >= s.takvim[s.sonrakiSpawn]) {
        if (s.aktifGercek) { s.kacan++; s.olaylar.push('kacir'); s.seri = 0; anonsEt('Kaçtı'); }
        const davet = gercekDaveti(s.sonrakiSpawn, s.turSeed);
        s.aktifGercek = { basladi: t };
        s.isaretKartIndex = Math.floor(s.offset / KART_H) + Math.min(2, Math.max(1, Math.floor((s.viewportH - KART_H) / KART_H)));
        s.sonrakiSpawn++;
        const im = isaretRef.current;
        if (im) {
          if (rozetRef.current) rozetRef.current.textContent = 'GERÇEK — dokun';
          const ic = im.querySelector('[data-davet]') as HTMLElement | null;
          if (ic) ic.textContent = davet.metin;
          im.style.transition = 'none';
          im.style.scale = '0.9';
          im.style.borderColor = '#A8E600';
          if (kalanRef.current) kalanRef.current.style.transform = 'scaleX(1)';
          requestAnimationFrame(() => {
            im.style.transition = reduced
              ? 'none'
              : 'scale 250ms cubic-bezier(0.05,0.7,0.1,1), opacity 120ms linear, border-color 250ms';
            im.style.scale = '1.03';
            zamanla(() => { im.style.scale = '1'; }, 250);
          });
        }
        anonsEt(`Gerçek belirdi: ${davet.metin}. Dokun ya da boşluk.`);
      }
      if (s.aktifGercek && t - s.aktifGercek.basladi > YAKALAMA_PENCERESI_MS) {
        // Seri koparken sarsıntı daha sert: skorun ~%70'ini yöneten olay bu
        s.trauma = Math.max(s.trauma, s.seri > 0 ? 0.8 : 0.45);
        s.aktifGercek = null; s.kacan++; s.olaylar.push('kacir'); s.seri = 0;
        s.kacirmaBitis = t + KACIRMA_MS;
        const im = isaretRef.current;
        if (im) {
          im.style.transition = reduced ? 'none' : 'scale 250ms ease-out, border-color 150ms, opacity 200ms linear';
          im.style.borderColor = '#3A3A3A';
          im.style.scale = '0.94';
          if (rozetRef.current) rozetRef.current.textContent = 'kaçtı';
        }
        skorYaz();
        anonsEt(`Kaçtı, ${s.kacan}. gerçek`);
        if (!s.ilkKacirmaGosterildi) {
          s.ilkKacirmaGosterildi = true;
          setIpucu(ILK_KACIRMA_IPUCU);
          zamanla(() => setIpucu(null), 2400);
        }
      }

      // ── Kartlar (slot = index'e sabit; kart sınırında yalnız saran 1 kart yeniden yazılır) ──
      const ilkIndex = Math.floor(s.offset / KART_H) - 1;
      const kademe = kademeIcin(gecen);
      let yazimKotasi = 3;
      for (let i = 0; i < HAVUZ; i++) {
        const index = ilkIndex + i;
        const el = kartRef.current[((index % HAVUZ) + HAVUZ) % HAVUZ];
        if (!el) continue;
        el.style.transform = `translate3d(0,${index * KART_H - s.offset}px,0)`;
        const anahtar = `${index}:${kademe}`;
        if (el.dataset.k === anahtar) continue;
        if (yazimKotasi <= 0) continue;
        yazimKotasi--;
        const ayniKart = el.dataset.k?.split(':')[0] === String(index);
        el.style.transition = ayniKart && !reduced ? 'opacity 400ms' : 'none';
        el.dataset.k = anahtar;

        const d = kartVerisi(index, kademe, s.turSeed);
        const [ust, metinEl, medya, alt] = el.children as unknown as HTMLElement[];
        const [avatar, adEl] = ust.children as unknown as HTMLElement[];
        avatar.textContent = d.ad[0].toUpperCase();
        avatar.style.background = `hsl(${d.renk} ${kademe === 'anlamli' ? 28 : 10}% 20%)`;
        adEl.textContent = `@${d.ad}`;
        metinEl.textContent = d.metin;
        metinEl.style.fontSize = d.buyuk && kademe === 'anlamli' ? '19px' : '15px';
        metinEl.style.color = kademe === 'anlamli' ? 'rgba(255,255,255,.82)' : 'rgba(255,255,255,.6)';
        medya.style.display = d.medya && kademe !== 'boskutu' ? 'block' : 'none';
        medya.style.background = `linear-gradient(135deg, hsl(${d.renk} 22% 16%), hsl(${(d.renk + 40) % 360} 18% 11%))`;
        const [s1, s2, s3] = alt.children as unknown as HTMLElement[];
        s1.textContent = `◆ ${d.sayilar[0]}`;
        s2.textContent = `◇ ${d.sayilar[1]}`;
        s3.textContent = `↗ ${d.sayilar[2]}`;
        // Boşalma yayı — parçalar TEKER TEKER sökülür
        ust.style.opacity = kademe === 'boskutu' ? '0' : kademe === 'bos' ? '0.4' : '1';
        s1.style.opacity = kademe === 'anlamli' ? '0.55' : kademe === 'klise' ? '0.3' : '0';
        s2.style.opacity = kademe === 'anlamli' ? '0.55' : '0';
        s3.style.opacity = kademe === 'anlamli' ? '0.55' : '0';
        metinEl.style.opacity = kademe === 'boskutu' ? '0' : '1';
        el.style.background = kademe === 'boskutu' ? '#0C0C0C' : '#111';
        el.style.borderColor = kademe === 'bos' || kademe === 'boskutu' ? '#141414' : '#1F1F1F';
        (el.lastElementChild as HTMLElement).style.opacity = kademe === 'boskutu' ? '1' : '0';
      }

      isaretKonumla(t);

      if (t - sonHud > 250) {
        sonHud = t;
        const kalan = Math.max(0, Math.ceil((TUR_SURESI_MS - gecen) / 1000));
        setHud({ kalan, faz: beanFazi(gecen) });
        if (kalanSayacRef.current) kalanSayacRef.current.style.color = kalan <= 10 ? '#e8654f' : '';
        skorYaz();
        if (t - s.sonPolite > 10_000) {
          s.sonPolite = t;
          setOzet(`${kalan} saniye kaldı. ${s.yakalanan} gerçek kurtardın.`);
        }
      }
      if (pozSn !== null) return; // poz modu: zaman donar
      raf = requestAnimationFrame(dongu);
    };

    if (pozSn !== null && pozSn >= 0 && pozSn < 59) {
      s.baslangic = performance.now() - pozSn * 1000;
      s.offset = pozSn * 240;
      if (pozSn % 1 !== 0) {
        const davet = gercekDaveti(0, s.turSeed);
        s.aktifGercek = { basladi: performance.now() - 400 };
        s.isaretKartIndex = Math.floor(s.offset / KART_H) + 2;
        const ic = isaretRef.current?.querySelector('[data-davet]') as HTMLElement | null;
        if (ic) ic.textContent = davet.metin;
        if (rozetRef.current) rozetRef.current.textContent = 'GERÇEK — dokun';
      }
      // Poz modunda 10 kart tek karede yazılsın (kota geçici olarak kalkar)
      for (let k = 0; k < 4; k++) dongu(performance.now());
      return () => cancelAnimationFrame(raf);
    }

    raf = requestAnimationFrame(dongu);
    requestAnimationFrame(() => appRef.current?.focus({ preventScroll: true }));
    return () => cancelAnimationFrame(raf);
  }, [seed, ilkTur, turNo, bitir, reduced, anonsEt, skorYaz, zamanla]);

  // Sekme gizlenince tur saati durur; döndürme/yeniden boyutlanmada viewport tazelenir
  useEffect(() => {
    const gorunurluk = () => {
      const s = S.current;
      if (document.visibilityState === 'hidden') s.gizlendi = performance.now();
      else if (s.gizlendi) {
        const d = performance.now() - s.gizlendi;
        s.baslangic += d;
        if (s.aktifGercek) s.aktifGercek.basladi += d;
        s.gizlendi = 0; s.hiz = 0; s.ornekler = [];
      }
    };
    const boyut = () => { S.current.viewportH = window.innerHeight; };
    document.addEventListener('visibilitychange', gorunurluk);
    window.addEventListener('resize', boyut);
    window.visualViewport?.addEventListener('resize', boyut);
    return () => {
      document.removeEventListener('visibilitychange', gorunurluk);
      window.removeEventListener('resize', boyut);
      window.visualViewport?.removeEventListener('resize', boyut);
    };
  }, []);

  // ── Yakalama + görünür imzalar ──
  const yakalamaDene = useCallback((t: number, x?: number, y?: number) => {
    const s = S.current;
    if (s.bitti) return;
    // Ödül/kaçırma imzası ekrandayken (≤350 ms) ikinci dokunuş NÖTR: heyecanla çift
    // dokunan ya da pencereyi 100 ms kaçıran oyuncuya "-20" yazmak his kırığı.
    if (!s.aktifGercek && (t < s.odulBitis || t < s.kacirmaBitis)) return;
    const im = isaretRef.current;
    if (s.aktifGercek && t - s.aktifGercek.basladi <= YAKALAMA_PENCERESI_MS) {
      const carpan = CARPAN_MERDIVENI[Math.min(s.seri, CARPAN_MERDIVENI.length - 1)];
      const puan = Math.round(YAKALAMA_TABAN * carpan);
      s.aktifGercek = null; s.yakalanan++; s.seri++; s.olaylar.push('yakala');
      s.odulBitis = t + ODUL_MS; // rozet 350 ms görünür kalır — tek dopamin anı
      if (im) {
        if (rozetRef.current) rozetRef.current.textContent = `+${puan}  ×${carpan.toFixed(1)}`;
        if (kalanRef.current) kalanRef.current.style.transform = 'scaleX(1)';
        im.style.transition = reduced ? 'none' : 'scale 90ms cubic-bezier(0.05,0.7,0.1,1), opacity 120ms linear';
        im.style.scale = '1.12';
        zamanla(() => {
          im.style.transition = reduced ? 'none' : 'scale 160ms cubic-bezier(0.3,0,0.8,0.15), opacity 120ms linear';
          im.style.scale = '1';
        }, 90);
      }
      skorYaz('#A8E600');
      anonsEt(`Yakaladın, ${puan} puan. Toplam ${s.yakalanan}`);
      navigator.vibrate?.(50);
    } else {
      s.yanlisDokunma++;
      s.trauma = Math.max(s.trauma, 0.55);
      const c = cezaRef.current;
      if (c && x !== undefined && y !== undefined) {
        const r = c.parentElement?.getBoundingClientRect();
        const lx = x - (r?.left ?? 0), ly = y - (r?.top ?? 0);
        c.style.transition = 'none';
        c.style.transform = `translate3d(${lx}px, ${ly}px, 0) translate(-50%,-50%)`;
        c.style.opacity = '1';
        requestAnimationFrame(() => {
          c.style.transition = reduced ? 'opacity 600ms' : 'opacity 600ms, transform 600ms';
          c.style.opacity = '0';
          c.style.transform = `translate3d(${lx}px, ${ly - 70}px, 0) translate(-50%,-50%)`;
        });
      }
      skorYaz('#e8654f');
      if (!s.ilkCezaGosterildi) {
        s.ilkCezaGosterildi = true;
        setIpucu('Gerçek yokken dokunmak 20 puan yakar.');
        zamanla(() => setIpucu(null), 2400);
      }
      anonsEt('Boşa gitti, 20 puan eksi');
    }
  }, [anonsEt, reduced, skorYaz, zamanla]);

  // ── Girdi: parmak sahipliği + devir ──
  const onDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const s = S.current;
    if (s.bitti) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    s.basiliPointerlar.set(e.pointerId, e.clientY);
    const t = performance.now();
    s.snapHedef = null; // parmak indi = fling ve snap iptal (hayalet kayma yok)

    if (s.surukleniyor && s.aktifPointer !== null && s.aktifPointer !== e.pointerId) {
      // İKİNCİ PARMAK: hem devir adayı hem tap adayı. Tap'ı onUp'ta kendi ölçüleriyle değerlendiririz.
      s.devir = { id: e.pointerId, t, y: e.clientY };
      return;
    }
    s.aktifPointer = e.pointerId;
    s.surukleniyor = true;
    s.hizOnDown = s.hiz; // fren tespiti için bırakmadan önceki hızı sakla
    s.hiz = 0;
    s.basY = s.sonY = e.clientY;
    s.basT = t;
    s.ornekler = [{ t, y: e.clientY }];
  }, []);

  const onMove = useCallback((e: React.PointerEvent) => {
    const s = S.current;
    if (s.basiliPointerlar.has(e.pointerId)) s.basiliPointerlar.set(e.pointerId, e.clientY);
    if (!s.surukleniyor || e.pointerId !== s.aktifPointer) return;
    const onceki = s.offset;
    s.offset = konumIlerlet(s.offset, s.sonY - e.clientY, s.viewportH);
    const g = Math.floor(s.offset / KART_H) - Math.floor(onceki / KART_H);
    if (g > 0) s.kart += g;
    s.sonY = e.clientY;
    const ham = (e.nativeEvent as PointerEvent).getCoalescedEvents?.() ?? [];
    if (ham.length > 1) for (const c of ham) s.ornekler.push({ t: c.timeStamp, y: c.clientY });
    else s.ornekler.push({ t: performance.now(), y: e.clientY });
    while (s.ornekler.length > 32) s.ornekler.shift();
  }, []);

  const parmakBirak = useCallback((pointerId: number) => {
    const s = S.current;
    s.basiliPointerlar.delete(pointerId);
    if (s.devir?.id === pointerId) s.devir = null;
  }, []);

  const onUp = useCallback((e: React.PointerEvent) => {
    const s = S.current;
    const t = performance.now();
    // İkinci parmak kalktı: yalnız yakalama denemesi (gerçek varsa), ceza YOK
    if (s.devir && e.pointerId === s.devir.id) {
      const tap = Math.abs(e.clientY - s.devir.y) < TAP_ESIGI_PX && t - s.devir.t < TAP_SURESI_MS;
      parmakBirak(e.pointerId);
      if (tap && s.aktifGercek) yakalamaDene(t, e.clientX, e.clientY);
      return;
    }
    parmakBirak(e.pointerId);
    if (e.pointerId !== s.aktifPointer) return;

    // Sahip kalktı ama başka parmak hâlâ basılı → sürükleme SÜRSÜN, sahiplik devret
    const kalan = s.basiliPointerlar.entries().next();
    if (!kalan.done) {
      const [pid, y] = kalan.value;
      s.aktifPointer = pid;
      s.sonY = y;
      s.ornekler = [{ t, y }];
      s.basT = -Infinity; // devralan parmağın kalkışı tap sayılmasın
      s.devir = null;
      return;
    }

    s.surukleniyor = false;
    s.aktifPointer = null;
    const mesafe = Math.abs(e.clientY - s.basY);
    const sure = t - s.basT;
    const fling = firlatmaHizi(s.ornekler, t);
    const tapSayilir =
      (mesafe < TAP_ESIGI_PX && sure < TAP_SURESI_MS) ||
      (mesafe < GEVSEK_TAP_PX && Math.abs(fling) < GEVSEK_TAP_HIZ && s.basT !== -Infinity);

    if (tapSayilir) {
      s.hiz = 0;
      const isinma = s.basT - s.baslangic < ISINMA_MS; // '60 saniye' düğmesinin ikinci dokunuşu
      // Akan akışı durdurmak için yapılan dokunuş CEZASIZ — ama 1 sn içinde ikincisi normal tap
      const frenAdayi = Math.abs(s.hizOnDown) > FREN_ESIGI && !s.aktifGercek;
      const frenBedava = frenAdayi && t - s.sonFrenT > FREN_ARALIGI_MS;
      if (frenAdayi) s.sonFrenT = t;
      if (!isinma && !frenBedava) yakalamaDene(t, e.clientX, e.clientY);
      // Fren dokunuşunda snap YOK: kullanıcı "burada dur" dedi.
    } else if (mesafe < MIN_MOMENTUM_MESAFESI) {
      s.hiz = 0;
      s.snapHedef = snapHedefi(s.offset, 0, KART_H);
    } else if (reduced) {
      // Reduced-motion: atalet yok, en yakın karta otur
      s.hiz = 0;
      s.snapHedef = snapHedefi(s.offset, 0, KART_H);
    } else {
      s.hiz = fling;
      s.snapHedef = snapHedefi(s.offset, fling, KART_H);
    }
    s.ornekler = [];
    s.hizOnDown = 0;
  }, [parmakBirak, reduced, yakalamaDene]);

  /** Sistem jesti (kenar-geri, bildirim çekme, çağrı): dokunuş iptal — ceza YOK, yakalama YOK */
  const onCancel = useCallback((e: React.PointerEvent) => {
    const s = S.current;
    parmakBirak(e.pointerId);
    if (e.pointerId !== s.aktifPointer) return;
    s.surukleniyor = false;
    s.aktifPointer = null;
    s.hiz = 0;
    s.ornekler = [];
    s.hizOnDown = 0;
    s.snapHedef = snapHedefi(s.offset, 0, KART_H);
  }, [parmakBirak]);

  // Tekerlek / trackpad (masaüstü): React onWheel passive → preventDefault çalışmaz, elle bağla
  useEffect(() => {
    const el = appRef.current;
    if (!el) return;
    const h = (e: WheelEvent) => {
      const s = S.current;
      if (s.bitti) return;
      e.preventDefault();
      const delta = e.deltaY * (e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? s.viewportH : 1);
      s.hiz = 0;
      s.snapHedef = null;
      const onceki = s.offset;
      s.offset = konumIlerlet(s.offset, delta, s.viewportH);
      const g = Math.floor(s.offset / KART_H) - Math.floor(onceki / KART_H);
      if (g > 0) s.kart += g;
    };
    el.addEventListener('wheel', h, { passive: false });
    return () => el.removeEventListener('wheel', h);
  }, []);

  useEffect(() => {
    const el = (e: KeyboardEvent) => {
      const s = S.current;
      if (s.bitti) return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (e.repeat) return; // basılı tutma = tek dokunuş
        yakalamaDene(performance.now());
      } else if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault();
        if (reduced) { s.offset += KART_H; s.kart += 1; s.snapHedef = null; }
        else s.hiz = 1900;
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (reduced) { s.offset = Math.max(0, s.offset - KART_H); s.snapHedef = null; }
        else s.hiz = -1200;
      }
    };
    window.addEventListener('keydown', el);
    return () => window.removeEventListener('keydown', el);
  }, [yakalamaDene, reduced]);

  if (bitti) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center">
        <p className="animate-pulse font-mono text-sm text-ghost">Skor yazılıyor…</p>
      </div>
    );
  }

  return (
    <div
      ref={kokRef}
      className="relative mx-auto min-h-[100dvh] max-w-[520px] select-none overflow-hidden bg-midnight"
      style={{ transform: 'translate(var(--sarsinti, 0px, 0px))' }}
    >
      {/* Üst maske — HUD'u akıştan ayırır; düz bölge HUD'un altına (84px) kadar iner */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-10"
        style={{
          height: 'calc(132px + env(safe-area-inset-top, 0px))',
          background:
            'linear-gradient(#050505 calc(84px + env(safe-area-inset-top, 0px)), transparent calc(132px + env(safe-area-inset-top, 0px)))',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3 p-4"
        style={{ paddingTop: 'calc(1rem + env(safe-area-inset-top, 0px))' }}
      >
        <div className="rounded-2xl border border-border bg-elevated px-3 py-2">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ghost">skor</p>
          <p
            ref={skorRef}
            className="font-mono text-xl font-bold tabular-nums text-white"
            style={{ transition: reduced ? 'none' : 'color 150ms, transform 150ms', transformOrigin: 'left center' }}
          >
            0
          </p>
        </div>
        <BeanCozulme faz={hud.faz} size={62} reduced={reduced} />
        <div className="rounded-2xl border border-border bg-elevated px-3 py-2 text-right">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ghost">kalan</p>
          <p ref={kalanSayacRef} className="font-mono text-xl font-bold tabular-nums text-white/80" style={{ transition: 'color 300ms' }}>
            {hud.kalan}
          </p>
          {/* Gerçek sayacı + seri noktaları: skorun %70'ini üreten mekanik artık görünür */}
          <p className="mt-0.5 font-mono text-[10px] tabular-nums text-ghost">
            gerçek <span ref={gercekRef} className="text-white/80">0/{GERCEK_SAYISI}</span>{' '}
            <span ref={seriRef} className="tracking-[0.1em] text-acid">○○○</span>
          </p>
        </div>
      </div>

      <div
        ref={appRef}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onCancel}
        className="absolute inset-0 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-acid focus-visible:[outline-offset:-4px]"
        style={{ touchAction: 'none', WebkitTouchCallout: 'none' }}
        role="application"
        aria-label="Sosyal obezite akışı. Parmakla, tekerlekle ya da aşağı ok tuşuyla kaydır; gerçek belirince dokun ya da boşluk tuşuna bas."
        tabIndex={0}
      >
        <div aria-hidden>
          {Array.from({ length: HAVUZ }, (_, i) => (
            <div
              key={i}
              ref={(el) => { kartRef.current[i] = el; }}
              className="absolute inset-x-3 flex flex-col overflow-hidden rounded-2xl border px-4 pb-3 pt-4 will-change-transform"
              style={{ height: KART_H - BOSLUK, top: 0, background: '#111', borderColor: '#1F1F1F' }}
            >
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-full font-mono text-[12px] text-white/70" />
                <span className="font-mono text-[12px] text-ghost" />
              </div>
              <p className="mt-3 flex-1 leading-snug" />
              <div className="mb-6 h-12 w-full shrink-0 rounded-lg" style={{ display: 'none' }} />
              <div className="absolute inset-x-4 bottom-3 flex gap-4 font-mono text-[11px] text-ghost">
                <span /><span /><span />
              </div>
              {/* Boş kutu iskeleti — siyah delik yerine ölü bir gönderi taslağı */}
              <div className="pointer-events-none absolute inset-x-4 top-4" style={{ opacity: 0 }}>
                <span className="block h-8 w-8 rounded-full bg-[#1A1A1A]" />
                <span className="mt-3 block h-2 w-3/5 rounded bg-[#1A1A1A]" />
                <span className="mt-2 block h-2 w-2/5 rounded bg-[#1A1A1A]" />
              </div>
            </div>
          ))}
        </div>

        {/* GERÇEK — opak zemin, altındaki parodi metniyle üst üste binmez */}
        <div
          ref={isaretRef}
          aria-hidden
          className="pointer-events-none absolute inset-x-3 flex flex-col overflow-hidden rounded-2xl border-2 px-4 pt-4 will-change-transform"
          style={{
            height: KART_H - BOSLUK, top: 0, opacity: 0, background: '#0A0A0A',
            borderColor: '#A8E600',
            transition: reduced ? 'none' : 'opacity 120ms linear, scale 150ms ease-out, border-color 250ms',
            boxShadow: '0 0 0 5px rgba(168,230,0,0.14), 0 0 44px rgba(168,230,0,0.34)',
          }}
        >
          <span ref={rozetRef} className="self-start rounded-full bg-acid px-2 py-0.5 font-mono text-[10px] font-bold text-midnight">
            GERÇEK — dokun
          </span>
          <div className="flex flex-1 items-center gap-3">
            <span className="block h-9 w-9 shrink-0"><BeanCozulme faz={0} size={36} reduced /></span>
            <p data-davet className="text-[16px] font-medium leading-snug text-white" />
          </div>
          <span className="mb-3 self-start font-mono text-[10px] uppercase tracking-widest text-acid/70">
            dokun ve kurtar
          </span>
          {/* Kalan-süre çubuğu — ref üzerinden yazılır (önceden yanlış çocuğa bağlıydı) */}
          <span
            ref={kalanRef}
            className="absolute bottom-0 left-0 h-1.5 w-full bg-acid shadow-[0_0_8px_rgba(168,230,0,0.6)]"
            style={{ transformOrigin: 'left', transform: 'scaleX(1)' }}
          />
        </div>
      </div>

      {/* Yüzen ceza — ipucu pilinin ÜSTÜNDE (z-40) */}
      <div
        ref={cezaRef}
        aria-hidden
        className="pointer-events-none absolute z-40 font-mono text-lg font-bold"
        style={{ left: 0, top: 0, opacity: 0, color: '#e8654f' }}
      >
        −20
      </div>

      {/* Ekran okuyucu: assertive anons (aynı metin tekrarında DOM yeniden oluşur) + polite özet */}
      <p aria-live="assertive" aria-atomic="true" className="sr-only">
        <span key={anons.n}>{anons.metin}</span>
      </p>
      <p aria-live="polite" aria-atomic="true" className="sr-only">{ozet}</p>

      {ipucu && (
        <div
          className="pointer-events-none absolute inset-x-0 z-30 flex justify-center px-4"
          style={{ bottom: 'calc(6rem + env(safe-area-inset-bottom, 0px))' }}
        >
          <p
            role="status"
            className="rounded-full border border-acid/25 bg-midnight/95 px-4 py-2 text-center font-mono text-xs text-acid"
          >
            {ipucu}
          </p>
        </div>
      )}

      {/* Alt maske + oyun-içi satır (tur mesajı tur sonunda; burada yönlendirme/tur sayacı) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10"
        style={{
          height: 'calc(7rem + env(safe-area-inset-bottom, 0px))',
          background: 'linear-gradient(transparent, #050505 62%)',
        }}
      />
      <p
        aria-hidden
        className="pointer-events-none absolute inset-x-0 z-20 px-6 text-center font-mono text-[11px] leading-relaxed text-ghost"
        style={{ bottom: 'calc(1.25rem + env(safe-area-inset-bottom, 0px))' }}
      >
        {oyunIciSatir(turNo, toplamSaniyeOnce)}
      </p>
    </div>
  );
}
