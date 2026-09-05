'use client';

import { useEffect, useRef } from 'react';
import BeanCozulme from '@/components/game/BeanCozulme';
import type { Rakip } from '@/components/game/HedefKutusu';
import SkorTablosu from '@/components/game/SkorTablosu';
import {
  ITIRAF, rakipHukmu, TANIM_SATIRI, TUR_SONU, turMesaji, turSonuGovde,
} from '@/content/sosyal-obezite-feed';
import type { TurOzeti } from '@/lib/game/engine';

/**
 * Tur sonu ekranı — hiyerarşi ZORUNLU (spec-v2 §7): (1) kurtarılan gerçek BÜYÜK,
 * (2) akışa verilen süre ORTA, (3) skor KÜÇÜK. Karar-7 tur mesajı burada (oyun
 * içinde "60 saniye gitti" demiyoruz artık).
 *
 * CTA kuralı: ekranda daima TEK dolu asit hap.
 *   Tur 1  → paylaşım birincil (viral döngüyü besle), store üçüncül
 *   Tur 2+ → store birincil (karar 12), paylaşım ikincil
 *   Rakip  → yenilgide 'Tekrar dene' birincil; galibiyette 'Cevabını gönder'
 * 'bir tur daha' her durumda ≥48 px ve katlanma içinde (restart sürtünmesi — oyun-5).
 *
 * Erişilebilirlik: h1 odak alır + role=alert tek cümle (SR oyunun bittiğini duyar).
 */

export type TurSonucu = {
  ozet: TurOzeti; olaylar: Array<'yakala' | 'kacir'>; skor: number; sessionId: string;
};
export type Kayit = { runId?: string; sira?: number; toplamOyuncu?: number; hata?: string };
export type Magaza = { ios: string; android: string; oncelik: 'ios' | 'android' | 'ikisi' };

type Props = {
  sonuc: TurSonucu; kayit: Kayit | null; turNo: number; toplamSaniye: number;
  takmaAd: string; setTakmaAd: (v: string) => void; gonderiliyor: boolean; skoruGonder: () => void;
  paylas: (kanal: 'genel' | 'meydan' | 'cevap') => void; xIntent: (kanal: 'x' | 'meydan') => string;
  kopyalandi: boolean; rakip: Rakip; seri: number; magaza: Magaza;
  indirTikla: (store: 'ios' | 'android') => void; birTurDaha: () => void; reduced: boolean;
};

const BIRINCIL = 'min-h-[52px] w-full rounded-full bg-acid px-6 font-semibold text-midnight active:scale-95';
const IKINCIL = 'min-h-[48px] flex-1 rounded-xl border border-white/20 px-3 text-center text-[15px] font-medium leading-[46px] text-white/90';
const UCUNCUL = 'min-h-[44px] flex-1 rounded-xl border border-border px-3 text-center font-mono text-xs leading-[42px] text-white/75';

export default function TurSonu({
  sonuc, kayit, turNo, toplamSaniye, takmaAd, setTakmaAd, gonderiliyor, skoruGonder,
  paylas, xIntent, kopyalandi, rakip, magaza, indirTikla, birTurDaha, reduced,
}: Props) {
  const h1Ref = useRef<HTMLHeadingElement>(null);
  useEffect(() => { h1Ref.current?.focus({ preventScroll: true }); }, []);

  const ilkKosu = turNo <= 1;
  const dk = Math.max(1, Math.round(toplamSaniye / 60));
  const toplamGercek = sonuc.ozet.yakalanan + sonuc.ozet.kacan;
  const kaydedildi = !!kayit?.runId;
  const tabloAcik = !!sonuc.sessionId;
  const rakipVar = !!rakip;
  const rakipGecildi = rakipVar && sonuc.skor > rakip.skor;

  const StoreDugmeleri = ({ birincil }: { birincil: boolean }) => {
    const sira: Array<'ios' | 'android'> =
      magaza.oncelik === 'android' ? ['android', 'ios'] : ['ios', 'android'];
    const goster = magaza.oncelik === 'ikisi' ? sira : birincil ? [sira[0]] : sira;
    return (
      <div className="flex gap-2">
        {goster.map((store) => (
          <a
            key={store}
            href={store === 'ios' ? magaza.ios : magaza.android}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => indirTikla(store)}
            aria-label={`ClubBeans’i ${store === 'ios' ? 'App Store' : 'Google Play'}’den indir`}
            className={
              birincil
                ? 'min-h-[52px] flex-1 rounded-full bg-acid text-center font-semibold leading-[52px] text-midnight active:scale-95'
                : UCUNCUL
            }
          >
            {store === 'ios' ? TUR_SONU.storeAppleEtiket : TUR_SONU.storeGoogleEtiket}
            {birincil ? '’dan indir' : ''}
          </a>
        ))}
        {birincil && magaza.oncelik !== 'ikisi' && (
          <a
            href={sira[1] === 'ios' ? magaza.ios : magaza.android}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => indirTikla(sira[1])}
            className={UCUNCUL + ' max-w-[38%]'}
          >
            {sira[1] === 'ios' ? TUR_SONU.storeAppleEtiket : TUR_SONU.storeGoogleEtiket}
          </a>
        )}
      </div>
    );
  };

  return (
    <div className="mx-auto flex min-h-[100dvh] max-w-md flex-col justify-center gap-6 px-6 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 ref={h1Ref} tabIndex={-1} className="font-mono text-xs uppercase tracking-widest text-ghost outline-none">
            {TUR_SONU.baslik}
          </h1>
          <p role="alert" className="sr-only">
            {`${TUR_SONU.baslik} ${sonuc.ozet.yakalanan} de ${toplamGercek} gerçek kurtardın, skor ${sonuc.skor}.`}
          </p>
          {/* Karar-7 tur mesajı — artık oyunun içinde değil, burada */}
          <p className="mt-2 text-[15px] leading-snug text-white/85">{turMesaji(turNo, toplamSaniye)}</p>
        </div>
        <div className="flex shrink-0 flex-col items-center gap-1">
          <BeanCozulme faz={5} size={64} reduced={reduced} />
          <span className="font-mono text-[9px] uppercase tracking-widest text-ghost">akışa karıştı</span>
        </div>
      </div>

      {/* (1) BÜYÜK */}
      <div>
        <p className="font-mono text-[11px] uppercase tracking-widest text-ghost">kurtardığın gerçek</p>
        <p className="font-mono text-6xl font-bold tabular-nums leading-none text-acid">
          {sonuc.ozet.yakalanan}
          <span className="text-2xl text-ghost">/{toplamGercek}</span>
        </p>
      </div>
      <p className="text-[15px] leading-relaxed text-white/85">
        {turSonuGovde(sonuc.ozet.kart, sonuc.ozet.yakalanan, sonuc.ozet.kacan)}
      </p>
      {/* (2) ORTA */}
      <p className="text-[17px] leading-snug text-white/90">
        Akış <span className="font-semibold text-white">{dk} dakikanı</span> aldı.
      </p>
      {/* (3) KÜÇÜK */}
      <p className="font-mono text-[11px] text-ghost">
        skor <span className="tabular-nums text-white/60">{sonuc.skor}</span>
        {kayit?.sira ? <> · sıra <span className="text-white/60">{kayit.sira}</span></> : null}
      </p>

      {rakip && (
        <div className="rounded-2xl border border-acid/30 bg-acid/5 p-4">
          <p className={`text-[17px] font-semibold leading-snug ${rakipGecildi ? 'text-acid' : 'text-white'}`}>
            {rakipHukmu(rakip.ad, sonuc.skor, rakip.skor)}
          </p>
          <p className="mt-1 font-mono text-xs text-ghost">
            {sonuc.skor} — {rakip.skor}
            {rakip.ayniGun === false && ' · bu skor başka bir günün akışından'}
          </p>
          {!rakipGecildi && (
            <button type="button" onClick={birTurDaha} className={`${BIRINCIL} mt-3`}>
              Tekrar dene
            </button>
          )}
        </div>
      )}

      <p className="border-l-2 border-acid/40 pl-3 text-[15px] italic leading-relaxed text-white/70">
        {TUR_SONU.kopruSatiri}
      </p>

      {/* Takma ad — CTA bloğunun İÇİNDE, öneriyle dolu; aydınlatma satırı hemen altında */}
      {tabloAcik && !kaydedildi && (
        <div className="space-y-2">
          <label htmlFor="ad" className="font-mono text-[11px] uppercase tracking-widest text-ghost">
            takma ad
          </label>
          <div className="flex gap-2">
            <input
              id="ad"
              value={takmaAd}
              onChange={(e) => setTakmaAd(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); skoruGonder(); } }}
              maxLength={20}
              autoCapitalize="none"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="send"
              placeholder="tabloya yazılacak ad"
              className="min-h-[48px] min-w-0 flex-1 rounded-xl border border-border bg-raised px-3 text-white placeholder:text-ghost focus:border-acid focus:outline-none"
            />
            <button
              type="button"
              onClick={skoruGonder}
              disabled={gonderiliyor || takmaAd.trim().length < 2}
              className="min-h-[48px] rounded-xl border border-white/20 px-4 font-semibold text-white disabled:opacity-40"
            >
              {gonderiliyor ? '…' : 'yaz'}
            </button>
          </div>
          <p className="text-[12px] leading-relaxed text-white/60">
            {TUR_SONU.kvkkSatiri}{' '}
            <a href="/sosyal-obezite/kvkk" className="underline decoration-dotted underline-offset-2 text-white/75">
              {TUR_SONU.kvkkLink}
            </a>
          </p>
          {kayit?.hata && <p role="alert" className="font-mono text-xs text-[#e8654f]">{kayit.hata}</p>}
        </div>
      )}

      <SkorTablosu key={kayit?.runId ?? 'ilk'} benimSkorum={sonuc.skor} />

      <div className="flex flex-col gap-3 pt-2">
        {rakipVar && rakipGecildi ? (
          <button type="button" onClick={() => paylas('cevap')} className={BIRINCIL}>
            {kopyalandi ? 'Panoya kopyalandı ✓' : 'Cevabını gönder'}
          </button>
        ) : ilkKosu && !(rakipVar && !rakipGecildi) ? (
          <button type="button" onClick={() => paylas('genel')} className={BIRINCIL}>
            {kopyalandi ? 'Panoya kopyalandı ✓' : kaydedildi || !tabloAcik ? 'Kartını paylaş' : 'Adını yaz, kartını paylaş'}
          </button>
        ) : (
          <>
            <p className="text-center font-mono text-[11px] leading-relaxed text-ghost">{TUR_SONU.ctaUstu}</p>
            <StoreDugmeleri birincil />
          </>
        )}

        <div className="flex gap-2">
          <button type="button" onClick={() => paylas('meydan')} className={IKINCIL}>
            Meydan oku
          </button>
          <a href={xIntent('x')} target="_blank" rel="noopener noreferrer" className={IKINCIL}>
            X’e at
          </a>
          {(!ilkKosu || (rakipVar && !rakipGecildi)) && (
            <button type="button" onClick={() => paylas('genel')} className={IKINCIL}>
              {kopyalandi ? 'Kopyalandı ✓' : 'Paylaş'}
            </button>
          )}
        </div>

        {ilkKosu && !(rakipVar && !rakipGecildi) && (
          <>
            <p className="text-center font-mono text-[11px] leading-relaxed text-ghost">{TUR_SONU.ctaUstu}</p>
            <StoreDugmeleri birincil={false} />
          </>
        )}

        {!(rakipVar && !rakipGecildi) && (
          <button type="button" onClick={birTurDaha} className={IKINCIL + ' w-full'}>
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
        <a
          href="/sosyal-obezite/kvkk"
          className="mt-2 inline-block py-2 font-mono text-[12px] text-ghost underline decoration-dotted"
        >
          {TUR_SONU.kvkkLink}
        </a>
      </div>
    </div>
  );
}
