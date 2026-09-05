'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import BeanCozulme from '@/components/game/BeanCozulme';
import HedefKutusu, { type Lider, type Rakip } from '@/components/game/HedefKutusu';
import {
  AKIS_ADLARI, FEED, GERCEK_DAVETLER, ITIRAF, TANIM_SATIRI, turMesaji, type Kademe,
} from '@/content/sosyal-obezite-feed';
import {
  beanFazi, CARPAN_MERDIVENI, hesaplaSkor, rng, seedToInt, spawnTakvimi,
  TUR_SURESI_MS, YAKALAMA_TABAN, type BeanFaz, type TurOzeti,
} from '@/lib/game/engine';
import {
  firlatmaHizi, geriYayla, konumIlerlet, MIN_MOMENTUM_MESAFESI, snapHedefi, sonumUygula, type Ornek,
} from '@/lib/game/fizik';

/**
 * SOSYAL OBEZİTE — çekirdek oyun.
 *
 * HİS KURALI: parmak 1:1 takip edilir, hareket ASLA kırpılmaz. Hız tavanı
 * SKORA aittir ve sunucuda uygulanır.
 *
 * His denetimi (5 boyut) şunu buldu: fizik doğrulandıktan sonra kalan kötü his
 * ÜÇ GİRDİ-YORUMLAMA hatasındaydı ve bir DUYUSAL BOŞLUKTA:
 *   1. Çok parmaklı kaydırma (reel'in güç jesti) ışınlanma + hayalet ceza üretiyordu
 *   2. Akan akışı dokunarak durdurmak -20 yiyordu (doğal fren = "dab")
 *   3. Dur-bırak sonrası hayalet fling atıyordu (bayat hız örneği)
 *   4. Yakalama/kaçırma/ceza anları EKRANDA hiçbir iz bırakmıyordu
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
const YAKALAMA_PENCERESI_MS = 1800;

type Durum = 'itiraf' | 'oynaniyor' | 'bitti';
type Olay = 'yakala' | 'kacir';

function kademeIcin(g: number): Kademe {
  if (g < 12_000) return 'anlamli';
  if (g < 25_000) return 'klise';
  if (g < 38_000) return 'bos';
  return 'boskutu';
}

function kartVerisi(index: number, kademe: Kademe, seedInt: number) {
  const havuz = FEED.filter((f) => f.kademe === kademe);
  const r = rng(seedInt + index * 7919);
  const ad = AKIS_ADLARI[Math.floor(r() * AKIS_ADLARI.length)];
  const varyant = r(); // 0-1: <0.45 metin, <0.75 medyalı, else büyük punto
  return {
    metin: havuz.length ? havuz[Math.floor(r() * havuz.length)].metin : '',
    ad,
    renk: Math.floor(r() * 360),
    medya: varyant >= 0.45 && varyant < 0.75,
    buyuk: varyant >= 0.75,
    sayilar: [Math.floor(r() * 900), Math.floor(r() * 90), Math.floor(r() * 20)],
  };
}

type Props = {
  seed: string; sessionId: string; ilkTur: boolean; turNo: number;
  toplamSaniyeOnce: number; reduced: boolean;
  /** Açılıştaki hedef çerçevesi — meydan okuyan rakip ya da günün lideri */
  rakip?: Rakip; lider?: Lider; hedefYuklendi?: boolean;
  onBitti: (v: { ozet: TurOzeti; olaylar: Olay[]; skor: number; sessionId: string }) => void;
};

export default function SosyalObezite({
  seed, sessionId, ilkTur, turNo, toplamSaniyeOnce, onBitti, reduced,
  rakip = null, lider = null, hedefYuklendi = false,
}: Props) {
  // Poz modunda itiraf ekranı atlanır — doğrudan oynanış karesi boyanır
  const [durum, setDurum] = useState<Durum>(() =>
    typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('poz')
      ? 'oynaniyor'
      : 'itiraf'
  );
  const [hud, setHud] = useState({ skor: 0, kalan: 60, faz: 0 as BeanFaz });
  const [anons, setAnons] = useState('');
  const [ipucu, setIpucu] = useState<string | null>(null);

  const kokRef = useRef<HTMLDivElement>(null);
  const kartRef = useRef<Array<HTMLDivElement | null>>([]);
  const isaretRef = useRef<HTMLDivElement>(null);
  const cezaRef = useRef<HTMLDivElement>(null);
  const skorRef = useRef<HTMLParagraphElement>(null);

  const S = useRef({
    baslangic: 0, offset: 0, hiz: 0, hizOnDown: 0,
    surukleniyor: false, aktifPointer: null as number | null,
    basiliPointerlar: new Map<number, number>(), // pointerId -> son clientY
    ornekler: [] as Ornek[], basY: 0, basT: 0, sonY: 0,
    kart: 0, yakalanan: 0, kacan: 0, yanlisDokunma: 0, seri: 0,
    olaylar: [] as Olay[], takvim: [] as number[], sonrakiSpawn: 0,
    aktifGercek: null as null | { basladi: number; kartIndex: number; metin: string; renk: number },
    ilkKacirmaGosterildi: false, ilkCezaGosterildi: false,
    gizlendi: 0, seedInt: 0, bitti: false, viewportH: 800,
    snapHedef: null as number | null,   // fling bitince oturulacak kart sınırı
    hitstopBitis: 0,                    // yakalama anında 80ms donma
    trauma: 0,                          // sarsıntı yoğunluğu (shake = trauma³)
  });

  const bitir = useCallback(() => {
    const s = S.current;
    if (s.bitti) return;
    s.bitti = true;
    const acik = s.takvim.length - s.sonrakiSpawn + (s.aktifGercek ? 1 : 0);
    const ozet: TurOzeti = {
      kart: s.kart, yakalanan: s.yakalanan, kacan: s.kacan + acik,
      yanlisDokunma: s.yanlisDokunma, sureMs: TUR_SURESI_MS,
    };
    const olaylar = [...s.olaylar];
    for (let i = 0; i < acik; i++) olaylar.push('kacir');
    setDurum('bitti');
    onBitti({ ozet, olaylar, skor: hesaplaSkor(ozet, olaylar).skor, sessionId });
  }, [onBitti, sessionId]);

  // ── rAF ──
  useEffect(() => {
    if (durum !== 'oynaniyor') return;
    const s = S.current;
    s.baslangic = performance.now();
    s.seedInt = seedToInt(seed);
    s.takvim = spawnTakvimi(seed, ilkTur);
    s.viewportH = window.innerHeight;

    /**
     * POZ MODU — `?poz=<saniye>` ile tek kare boyar, döngü çalışmaz.
     *
     * Sebep: denetim ortamında tarayıcı paneli daima gizli olduğu için
     * requestAnimationFrame HİÇ ateşlenmiyor (ölçüldü: 800ms'de 0 frame).
     * Yani oyunun görsel durumları — boşalma yayı, gerçek işareti, Bean fazları —
     * canlı olarak hiç gözlenemiyordu. Bu kapı her saniyeyi ekran görüntüsüyle
     * denetlenebilir kılar. Üretimde tetiklenmez: parametre yoksa hiç çalışmaz.
     */
    const poz = new URLSearchParams(window.location.search).get('poz');
    const pozSn = poz === null ? null : Number(poz);

    let raf = 0, sonFrame = s.baslangic, sonHud = 0;

    const dongu = (t: number) => {
      const dtMs = Math.min(t - sonFrame, 50);
      sonFrame = t;
      const gecen = t - s.baslangic;
      if (gecen >= TUR_SURESI_MS) { bitir(); return; }

      // ── Hareket ──
      // HITSTOP: yakalama anında 80ms akış donar (Vlambeer "juice" — web değeri
      // 60-80ms; masaüstü 0.2sn web'de fazla uzun). Tur saati DURMAZ, yalnız
      // hareket durur: 12 yakalama × 80ms = 960ms < aklaYatkin ±2sn toleransı.
      const donmus = t < s.hitstopBitis;
      if (!s.surukleniyor && !donmus) {
        s.hiz = sonumUygula(s.hiz, dtMs);
        const onceki = s.offset;

        if (s.hiz === 0 && s.snapHedef !== null) {
          // Fling bitti → en yakın kart sınırına otur (reel sayfalama hissi).
          // Snap fling BİTTİKTEN sonra girer, sürüklemeye ASLA karışmaz.
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

      // ── Sarsıntı: shake = trauma³ (Eiserloh). YALNIZ olumsuz olaylarda. ──
      if (s.trauma > 0 && !reduced) {
        s.trauma = Math.max(0, s.trauma - dtMs / 200);
        const g = s.trauma ** 3;
        kokRef.current?.style.setProperty(
          '--sarsinti',
          `${(Math.random() * 2 - 1) * g * 12}px, ${(Math.random() * 2 - 1) * g * 12}px`
        );
      } else if (kokRef.current?.style.getPropertyValue('--sarsinti')) {
        kokRef.current.style.setProperty('--sarsinti', '0px, 0px');
      }

      // ── Spawn ──
      while (s.sonrakiSpawn < s.takvim.length && gecen >= s.takvim[s.sonrakiSpawn]) {
        if (s.aktifGercek) { s.kacan++; s.olaylar.push('kacir'); s.seri = 0; }
        const r = rng(s.seedInt + s.sonrakiSpawn * 104729);
        s.aktifGercek = {
          basladi: t,
          kartIndex: Math.floor(s.offset / KART_H) + 2,
          metin: GERCEK_DAVETLER[Math.floor(r() * GERCEK_DAVETLER.length)],
          renk: Math.floor(r() * 360),
        };
        s.sonrakiSpawn++;
        const im = isaretRef.current;
        if (im) {
          (im.children[0] as HTMLElement).textContent = 'GERÇEK — dokun';
          const ic = im.children[1] as HTMLElement;
          (ic.children[0] as HTMLElement).style.background = `hsl(${s.aktifGercek.renk} 45% 30%)`;
          (ic.children[1] as HTMLElement).textContent = s.aktifGercek.metin;
          // Giriş belirginliği: 2000px/sn akışta 0.1-0.3sn parlayan işaret
          // algılanamıyordu — "kaçan gerçek = piyango" hissinin doğrudan kaynağı.
          im.style.transition = 'none';
          im.style.scale = '0.9';
          im.style.borderColor = '#A8E600';
          requestAnimationFrame(() => {
            if (!im) return;
            im.style.transition = 'scale 250ms cubic-bezier(0.05,0.7,0.1,1), opacity 120ms linear, border-color 250ms';
            im.style.scale = '1.03';
            setTimeout(() => { if (im) im.style.scale = '1'; }, 250);
          });
        }
        setAnons('Gerçek belirdi — dokun ya da boşluk');
      }
      if (s.aktifGercek && t - s.aktifGercek.basladi > YAKALAMA_PENCERESI_MS) {
        // Seri koparken sarsıntı daha sert: skorun ~%70'ini yöneten olay bu
        if (s.seri > 0) s.trauma = Math.max(s.trauma, 0.5);
        s.aktifGercek = null; s.kacan++; s.olaylar.push('kacir'); s.seri = 0;
        const im = isaretRef.current;
        if (im) { im.style.borderColor = '#3A3A3A'; im.style.scale = '0.97'; }
        setAnons('Kaçtı');
        if (!s.ilkKacirmaGosterildi) {
          s.ilkKacirmaGosterildi = true;
          setIpucu('Az önce bir gerçek kaçırdın. Dokunarak yakalanır.');
          setTimeout(() => setIpucu(null), 1700);
        }
      }

      // ── Kartlar ──
      const ilkIndex = Math.floor(s.offset / KART_H);
      const kademe = kademeIcin(gecen);
      // Kademe sınırında 10 kartın tamamı aynı karede yeniden yazılıyordu
      // (textContent + 8 stil ×10). Kare başına 3 kart kotası: geçiş bir-iki
      // kare yayılır, gözle fark edilmez, frame bütçesi korunur.
      let yazimKotasi = 3;
      for (let i = 0; i < HAVUZ; i++) {
        const el = kartRef.current[i];
        if (!el) continue;
        const index = ilkIndex + i - 1;
        el.style.transform = `translate3d(0,${index * KART_H - s.offset}px,0)`;
        const anahtar = `${index}:${kademe}`;
        if (el.dataset.k === anahtar) continue;
        if (yazimKotasi <= 0) continue;
        yazimKotasi--;
        // Geri dönüşüm (index değişti) anlık olmalı; yalnız AYNI kartta kademe
        // değişimi yumuşak geçsin — yoksa her kart hayalet gibi belirir.
        const ayniKart = el.dataset.k?.split(':')[0] === String(index);
        el.style.transition = ayniKart && !reduced ? 'opacity 400ms' : 'none';
        el.dataset.k = anahtar;

        const d = kartVerisi(index, kademe, s.seedInt);
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
        // Boş kutu: siyah delik değil, iskelet
        (el.lastElementChild as HTMLElement).style.opacity = kademe === 'boskutu' ? '1' : '0';
      }

      // ── Gerçek işareti: görünmez ölmesin ──
      const im = isaretRef.current;
      if (im) {
        if (s.aktifGercek) {
          let y = s.aktifGercek.kartIndex * KART_H - s.offset;
          if (y < -KART_H || y > s.viewportH) {
            // Ekrandan taştı: akış yönünde GİREN slota taşı. basladi DEĞİŞMEZ.
            s.aktifGercek.kartIndex =
              y > s.viewportH
                ? Math.floor(s.offset / KART_H) + 1
                : Math.floor(s.offset / KART_H) + Math.ceil(s.viewportH / KART_H) - 1;
            y = s.aktifGercek.kartIndex * KART_H - s.offset;
          }
          const kalan = 1 - (t - s.aktifGercek.basladi) / YAKALAMA_PENCERESI_MS;
          im.style.opacity = '1';
          im.style.transform = `translate3d(0,${y}px,0)`;
          // transform:scaleX — style.width her frame LAYOUT tetikliyordu ve bu
          // 1.8 saniyelik yakalama penceresi boyunca her karede oluyordu.
          (im.children[2] as HTMLElement).style.transform = `scaleX(${Math.max(0, kalan)})`;
        } else if (im.style.opacity !== '0') {
          im.style.opacity = '0';
        }
      }

      if (t - sonHud > 250) {
        sonHud = t;
        const o: TurOzeti = {
          kart: s.kart, yakalanan: s.yakalanan, kacan: s.kacan,
          yanlisDokunma: s.yanlisDokunma, sureMs: Math.round(gecen),
        };
        setHud({
          skor: hesaplaSkor(o, s.olaylar).skor,
          kalan: Math.max(0, Math.ceil((TUR_SURESI_MS - gecen) / 1000)),
          faz: beanFazi(gecen),
        });
      }
      // Poz modu: zaman DONAR. Ekran goruntusu almak kareyi zorluyor ve bekleyen
      // rAF calisiyordu — istenen saniye yerine ilerlemis bir kare yakalaniyordu.
      if (pozSn !== null) return;
      raf = requestAnimationFrame(dongu);
    };
    if (pozSn !== null && Number.isFinite(pozSn) && pozSn >= 0 && pozSn < 59) {
      // Verilen saniyedeki hâli kur ve TEK kare boya
      s.baslangic = performance.now() - pozSn * 1000;
      s.offset = pozSn * 240;
      // Yarım saniyeli pozlarda (ör. 20.5) gerçek işaretini de göster
      if (pozSn % 1 !== 0) {
        const r = rng(s.seedInt);
        s.aktifGercek = {
          basladi: performance.now() - 400,
          kartIndex: Math.floor(s.offset / KART_H) + 2,
          metin: GERCEK_DAVETLER[Math.floor(r() * GERCEK_DAVETLER.length)],
          renk: Math.floor(r() * 360),
        };
      }
      dongu(performance.now());
      return () => cancelAnimationFrame(raf);
    }

    raf = requestAnimationFrame(dongu);
    return () => cancelAnimationFrame(raf);
  }, [durum, seed, ilkTur, bitir, reduced]);

  useEffect(() => {
    if (durum !== 'oynaniyor') return;
    const el = () => {
      const s = S.current;
      if (document.visibilityState === 'hidden') s.gizlendi = performance.now();
      else if (s.gizlendi) {
        const d = performance.now() - s.gizlendi;
        s.baslangic += d;
        if (s.aktifGercek) s.aktifGercek.basladi += d;
        s.gizlendi = 0; s.hiz = 0; s.ornekler = [];
      }
    };
    document.addEventListener('visibilitychange', el);
    return () => document.removeEventListener('visibilitychange', el);
  }, [durum]);

  // ── Yakalama + görünür imzalar ──
  const yakalamaDene = useCallback((t: number, x?: number, y?: number) => {
    const s = S.current;
    const im = isaretRef.current;
    if (s.aktifGercek && t - s.aktifGercek.basladi <= YAKALAMA_PENCERESI_MS) {
      const carpan = CARPAN_MERDIVENI[Math.min(s.seri, CARPAN_MERDIVENI.length - 1)];
      const puan = Math.round(YAKALAMA_TABAN * carpan);
      s.aktifGercek = null; s.yakalanan++; s.seri++; s.olaylar.push('yakala');
      s.hitstopBitis = t + 80; // akış 80ms donar — vuruşun ağırlığı
      if (im) {
        (im.children[0] as HTMLElement).textContent = `+${puan}  ×${carpan.toFixed(1)}`;
        im.style.transition = 'scale 90ms cubic-bezier(0.05,0.7,0.1,1)';
        im.style.scale = '1.12';
        setTimeout(() => {
          if (!im) return;
          im.style.transition = 'scale 160ms cubic-bezier(0.3,0,0.8,0.15)';
          im.style.scale = '1';
        }, 90);
      }
      setAnons(`Yakaladın, ${puan} puan. Toplam ${s.yakalanan}`);
      navigator.vibrate?.(50);
    } else {
      s.yanlisDokunma++;
      s.trauma = Math.max(s.trauma, 0.3); // trauma³ → ~%3 genlik, 6-8px
      // Dokunulan noktada yüzen ceza + skor çipinde flash
      const c = cezaRef.current;
      if (c && x !== undefined && y !== undefined) {
        // left/top yerine translate3d — ikisi de layout tetikliyordu
        const r = c.parentElement?.getBoundingClientRect();
        const lx = x - (r?.left ?? 0), ly = y - (r?.top ?? 0);
        c.style.transition = 'none';
        c.style.transform = `translate3d(${lx}px, ${ly}px, 0) translate(-50%,-50%)`;
        c.style.opacity = '1';
        requestAnimationFrame(() => {
          c.style.transition = 'opacity 600ms, transform 600ms';
          c.style.opacity = '0';
          c.style.transform = `translate3d(${lx}px, ${ly - 70}px, 0) translate(-50%,-50%)`;
        });
      }
      const sk = skorRef.current;
      if (sk) { sk.style.color = '#e8654f'; setTimeout(() => { if (sk) sk.style.color = ''; }, 150); }
      if (!s.ilkCezaGosterildi) {
        s.ilkCezaGosterildi = true;
        setIpucu('Gerçek yokken dokunmak 20 puan yakar.');
        setTimeout(() => setIpucu(null), 1900);
      }
      setAnons('Boşa gitti, 20 puan eksi');
    }
  }, []);

  // ── Girdi: parmak sahipliği + devir ──
  const onDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (durum !== 'oynaniyor') return;
    const s = S.current;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    s.basiliPointerlar.set(e.pointerId, e.clientY);
    const t = performance.now();

    if (s.surukleniyor && s.aktifPointer !== null && s.aktifPointer !== e.pointerId) {
      // DEVİR: ikinci başparmak. Yoksaymak B parmağını ölü bırakır, ışınlanma
      // ise A'nın son konumundan B'ye zıplamaktan doğar — sürekliliği kur.
      s.aktifPointer = e.pointerId;
      s.sonY = e.clientY;
      s.ornekler = [{ t, y: e.clientY }];
      s.basT = -Infinity; // devir dokunuşu ASLA tap sayılmasın
      return;
    }
    s.aktifPointer = e.pointerId;
    s.surukleniyor = true;
    s.hizOnDown = s.hiz; // fren tespiti için bırakmadan önceki hızı sakla
    s.hiz = 0;
    s.basY = s.sonY = e.clientY;
    s.basT = t;
    s.ornekler = [{ t, y: e.clientY }];
  }, [durum]);

  const onMove = useCallback((e: React.PointerEvent) => {
    const s = S.current;
    if (s.basiliPointerlar.has(e.pointerId)) s.basiliPointerlar.set(e.pointerId, e.clientY);
    if (!s.surukleniyor || e.pointerId !== s.aktifPointer) return;
    const onceki = s.offset;
    s.offset = konumIlerlet(s.offset, s.sonY - e.clientY, s.viewportH);
    const g = Math.floor(s.offset / KART_H) - Math.floor(onceki / KART_H);
    if (g > 0) s.kart += g;
    s.sonY = e.clientY;
    // Chrome pointermove'u frame başına 1'e birleştirir; ara örnekler
    // getCoalescedEvents() ile alınır. 90ms pencerede 5-6 yerine 12-15 örnek.
    const ham = (e.nativeEvent as PointerEvent).getCoalescedEvents?.() ?? [];
    if (ham.length > 1) for (const c of ham) s.ornekler.push({ t: c.timeStamp, y: c.clientY });
    else s.ornekler.push({ t: performance.now(), y: e.clientY });
    while (s.ornekler.length > 32) s.ornekler.shift();
  }, []);

  const onUp = useCallback((e: React.PointerEvent) => {
    const s = S.current;
    s.basiliPointerlar.delete(e.pointerId);
    if (e.pointerId !== s.aktifPointer) return;

    // Sahip kalktı ama başka parmak hâlâ basılı → sürükleme SÜRSÜN, sahiplik devret
    const kalan = s.basiliPointerlar.entries().next();
    if (!kalan.done) {
      const [pid, y] = kalan.value;
      s.aktifPointer = pid;
      s.sonY = y;
      s.ornekler = [{ t: performance.now(), y }];
      s.basT = -Infinity;
      return;
    }

    s.surukleniyor = false;
    s.aktifPointer = null;
    const t = performance.now();
    const mesafe = Math.abs(e.clientY - s.basY);
    const sure = t - s.basT;
    const fling = firlatmaHizi(s.ornekler, t);

    const tapSayilir =
      (mesafe < TAP_ESIGI_PX && sure < TAP_SURESI_MS) ||
      (mesafe < GEVSEK_TAP_PX && Math.abs(fling) < GEVSEK_TAP_HIZ);

    if (tapSayilir) {
      s.hiz = 0;
      // Akan akışı durdurmak için yapılan dokunuş CEZASIZ — reel'in en doğal ritmi
      const frenliyor = Math.abs(s.hizOnDown) > FREN_ESIGI && !s.aktifGercek;
      if (!frenliyor) yakalamaDene(t, e.clientX, e.clientY);
    } else if (Math.abs(e.clientY - s.basY) < MIN_MOMENTUM_MESAFESI) {
      // better-scroll momentumLimitDistance: çok kısa hareket momentum vermez
      s.hiz = 0;
      s.snapHedef = snapHedefi(s.offset, 0, KART_H);
    } else {
      s.hiz = fling;
      s.snapHedef = snapHedefi(s.offset, fling, KART_H);
    }
    s.ornekler = [];
    s.hizOnDown = 0;
  }, [yakalamaDene]);

  useEffect(() => {
    if (durum !== 'oynaniyor') return;
    const el = (e: KeyboardEvent) => {
      const s = S.current;
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); yakalamaDene(performance.now()); }
      else if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); s.hiz = 1900; }
      else if (e.key === 'ArrowUp') { e.preventDefault(); s.hiz = -1200; }
    };
    window.addEventListener('keydown', el);
    return () => window.removeEventListener('keydown', el);
  }, [durum, yakalamaDene]);

  if (durum === 'itiraf') {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center gap-7 px-6 text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-ghost">Sosyal Obezite</p>
        <BeanCozulme faz={0} size={110} reduced={reduced} />
        <div className="max-w-md space-y-3">
          <p className="text-xl font-semibold leading-snug text-white">{ITIRAF.satir1}</p>
          <p className="text-xl font-semibold leading-snug text-acid">{ITIRAF.satir2}</p>
        </div>
        <p className="max-w-xs font-mono text-xs leading-relaxed text-ghost">{TANIM_SATIRI}</p>
        {/* Yarışmanın hedefi burada görünür: kimi geçmeye çalıştığını bilmeden
            oynanan 60 saniye "skorla yarış" mekaniğini çalıştırmaz. */}
        <HedefKutusu rakip={rakip} lider={lider} yuklendi={hedefYuklendi} />
        <button
          type="button"
          onClick={() => setDurum('oynaniyor')}
          className="min-h-[52px] rounded-full bg-acid px-10 font-semibold text-midnight active:scale-95"
        >
          60 saniye
        </button>
        <p className="font-mono text-[11px] leading-relaxed text-ghost">
          Kaydır. Yeşil çerçeve belirince dokun — o bir davet.
          <br />Klavye: ↓ kaydırır, boşluk yakalar.
        </p>
      </div>
    );
  }

  if (durum === 'bitti') {
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
      {/* Üst maske — HUD'u akıştan ayırır. backdrop-blur YOK: her frame yeniden hesaplanıyordu.
          DÜZELTME: maske 96px yüksekliğinde ve düz bölgesi %28'de (27px) bitiyordu; HUD kutuları
          ise 84px'e iniyordu. Aradaki 57px'te kart metni skor kutularının arasından okunuyor,
          ekranın tepesi her turda "bozuk sayfa" gibi görünüyordu. Artık düz bölge HUD'un altına
          (84px) kadar iner, geçiş 132px'te biter — üstelik güvenli alan kadar aşağı kayar. */}
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
        className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between gap-3 p-4"
        style={{ paddingTop: 'calc(1rem + env(safe-area-inset-top, 0px))' }}
      >
        <div className="rounded-2xl border border-border bg-elevated px-3 py-2">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ghost">skor</p>
          <p ref={skorRef} className="font-mono text-xl font-bold tabular-nums text-white transition-colors">
            {hud.skor}
          </p>
        </div>
        <BeanCozulme faz={hud.faz} size={62} reduced={reduced} />
        <div className="rounded-2xl border border-border bg-elevated px-3 py-2 text-right">
          <p className="font-mono text-[10px] uppercase tracking-widest text-ghost">kalan</p>
          <p className="font-mono text-xl font-bold tabular-nums text-acid">{hud.kalan}</p>
        </div>
      </div>

      <div
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        className="absolute inset-0"
        style={{ touchAction: 'none' }}
        role="application"
        aria-label="Sosyal obezite akışı. Kaydır, gerçek belirince dokun."
        tabIndex={0}
      >
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
            <div className="mb-6 h-16 w-full shrink-0 rounded-lg" style={{ display: 'none' }} />
            <div className="absolute inset-x-4 bottom-3 flex gap-4 font-mono text-[11px] text-ghost">
              <span /><span /><span />
            </div>
            {/* Boş kutu iskeleti — siyah delik yerine ölü bir gönderi taslağı */}
            <div className="pointer-events-none absolute inset-x-4 top-4" style={{ opacity: 0 }} aria-hidden>
              <span className="block h-8 w-8 rounded-full bg-[#1A1A1A]" />
              <span className="mt-3 block h-2 w-3/5 rounded bg-[#1A1A1A]" />
              <span className="mt-2 block h-2 w-2/5 rounded bg-[#1A1A1A]" />
            </div>
          </div>
        ))}

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
          <span className="self-start rounded-full bg-acid px-2 py-0.5 font-mono text-[10px] font-bold text-midnight" />
          <div className="flex flex-1 items-center gap-3">
            <span className="block h-9 w-9 shrink-0 rounded-full" />
            <p className="text-[16px] font-medium leading-snug text-white" />
          </div>
          <span className="mb-3 self-start font-mono text-[10px] uppercase tracking-widest text-acid/70">
            dokun ve kurtar
          </span>
          <span
            className="absolute bottom-0 left-0 h-1 w-full bg-acid"
            style={{ transformOrigin: 'left', transform: 'scaleX(1)' }}
          />
        </div>
      </div>

      {/* Yüzen ceza */}
      <div
        ref={cezaRef}
        aria-hidden
        className="pointer-events-none absolute z-30 font-mono text-lg font-bold"
        style={{ left: 0, top: 0, opacity: 0, color: '#e8654f' }}
      >
        −20
      </div>

      <p
        aria-live="assertive"
        aria-atomic="true"
        className="pointer-events-none absolute h-px w-px overflow-hidden"
        style={{ clip: 'rect(0 0 0 0)', clipPath: 'inset(50%)', whiteSpace: 'nowrap' }}
      >
        {anons}
      </p>

      {/* İpucunun kendi zemini var: alt maskenin şeffaf bölgesine denk geldiği
          için ipucu doğrudan kartın metninin üstünde okunuyordu ve iki metin
          birbirine karışıyordu. Öğretici mesajın okunamaması, öğretmemesi
          demektir. */}
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

      {/* Alt maske: tur mesajı zeminsizdi ve kartların üstüne binip okunmuyordu.
          DÜZELTME: iPhone güvenli alanı hiç hesaba katılmıyordu — mesaj ana ekran çubuğu
          bölgesine giriyor, 2. turdan itibaren (mesaj uzayınca) satır sarıp kartların
          üstüne biniyordu. Maske de mesaj da artık güvenli alan kadar yukarı itiliyor. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10"
        style={{
          height: 'calc(7rem + env(safe-area-inset-bottom, 0px))',
          background: 'linear-gradient(transparent, #050505 62%)',
        }}
      />
      <p
        className="pointer-events-none absolute inset-x-0 z-20 px-6 text-center font-mono text-[11px] leading-relaxed text-ghost"
        style={{ bottom: 'calc(1.25rem + env(safe-area-inset-bottom, 0px))' }}
      >
        {turMesaji(turNo, toplamSaniyeOnce)}
      </p>
    </div>
  );
}
