/**
 * @module lib/hazirGiris
 * @governing_law GUVENLIK_ANAYASASI, KVKK_ANAYASASI, KIMLIK_ANAYASASI
 * @sprint CB2026 hazir-hesap-giris-baglantisi-2026-10-06 (kullanıcı kararı B: web + bir dokunuş)
 *
 * /hazir sayfasının SAF kararları (içe aktarım yok — `node scripts/hazirGiris.test.mts`).
 * Yönetici panelinde açılan hazır hesabın giriş bağlantısı `https://www.clubbeans.com/hazir#k=<anahtar>`:
 *  - sayfa yüklemede AĞ ÇAĞRISI YOK (bağlantı önizleme botu hakkı yakmasın); hak yalnız dokunuşla harcanır,
 *  - "Hesabına gir" → CB2026 edge `hazir-giris` → oturum jetonları → uygulamanın mağazadaki sürümünün
 *    zaten tanıdığı `clubbeans://auth/callback?access_token&refresh_token` yolu (OTA/derleme gerekmez).
 * Anahtar ve jetonlar HİÇBİR log, Sentry, analitik alanına yazılmaz (Sentry'de `olayMaskele`).
 */

/** CB2026 `supabase/functions/hazir-giris/karar.ts` ANAHTAR_RE ile AYNI: 32 bayt base64url = 43 karakter. */
export const ANAHTAR_RE = /^[A-Za-z0-9_-]{43}$/;
export const PLAY = 'https://play.google.com/store/apps/details?id=com.clubbeans';
export const APP_STORE = 'https://apps.apple.com/app/id6778042472';
/** CB2026 `growth_os/lib/hazirHesapDm.ts` WEB_GIR_DUGMESI ile AYNI — DM bu düğmeyi adıyla anar. */
export const GIR_DUGMESI = 'Hesabına gir';
/**
 * /auth/callback (CB2026 google-donus-acil 2026-10-09): şifre sıfırlama / giriş bağlantısı / Google dönüşü kodu (?code=)
 * adreste taşır — kod içeren adres hiçbir izleyiciye gitmez (Meta Pikseli/CAPI, PostHog, çerez bandı, Vercel ölçümü).
 */
export const IZLEYICISIZ_ROTALAR = ['/hazir', '/auth/callback'];

/** Uygulama içi tarayıcılar: özel şema/intent'i engelleyebilir; "Tarayıcıda aç" adres çubuğundaki adresi taşır. */
const UYGULAMA_ICI_KAYNAK = 'Instagram|FBAN|FBAV|FB_IAB|FBIOS|musical_ly|BytedanceWebview|Snapchat|Line\\/|Twitter';
const UYGULAMA_ICI_RE = new RegExp(UYGULAMA_ICI_KAYNAK, 'i');

export function izleyicisizMi(pathname: string | null): boolean {
  if (!pathname) return false;
  return IZLEYICISIZ_ROTALAR.some((r) => pathname === r || pathname.startsWith(`${r}/`));
}

export const uygulamaIciMi = (ua: string): boolean => UYGULAMA_ICI_RE.test(ua);

export type Cihaz = 'ios' | 'android' | 'masaustu';

export function cihazSinifi(ua: string, dokunmaNoktasi: number): Cihaz {
  if (/android/i.test(ua)) return 'android';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'ios';
  if (/Macintosh/i.test(ua) && dokunmaNoktasi > 1) return 'ios'; // iPadOS, masaüstü UA'sı gönderir
  return 'masaustu';
}

/**
 * Sayfa HTML'ine gömülen satır içi betik — React, Sentry ve analitikten ÖNCE koşar: anahtarı belleğe
 * (`window.__hazirK`) alır ve adres çubuğundan siler. İSTİSNA: uygulama içi tarayıcıda (Instagram vb.)
 * adres KORUNUR — kişi "Tarayıcıda aç"ı seçtiğinde anahtar dış tarayıcıya taşınabilsin.
 */
export function temizlemeBetigi(): string {
  return (
    '(function(){try{var w=window,l=w.location,' +
    'm=/(?:^#|&)k=([A-Za-z0-9_-]{43})(?:&|$)/.exec(l.hash)||/(?:^\\?|&)k=([A-Za-z0-9_-]{43})(?:&|$)/.exec(l.search);' +
    'w.__hazirK=m?m[1]:null;' +
    `if((l.hash||l.search)&&!/${UYGULAMA_ICI_KAYNAK}/i.test(navigator.userAgent))w.history.replaceState(null,'',l.pathname)` +
    '}catch(e){}})();'
  );
}

export type Jetonlar = { access_token: string; refresh_token: string };

const JWT_RE = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;
const YENILEME_RE = /^[A-Za-z0-9._~-]{8,1024}$/;

/** Edge yanıtı → jetonlar; biçim dışıysa null (yarım/bozuk yanıt uygulamaya aktarılmaz). */
export function jetonlariAl(v: unknown): Jetonlar | null {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return null;
  const o = v as Record<string, unknown>;
  if (typeof o.access_token !== 'string' || !JWT_RE.test(o.access_token)) return null;
  if (typeof o.refresh_token !== 'string' || !YENILEME_RE.test(o.refresh_token)) return null;
  return { access_token: o.access_token, refresh_token: o.refresh_token };
}

/** Uygulamayı açan adres: YALNIZ iki jeton parametresi. Android'de intent:// (uygulama yoksa Play'e düşer). */
export function oturumAdresi(cihaz: Cihaz, j: Jetonlar): string {
  const sorgu = `?access_token=${encodeURIComponent(j.access_token)}&refresh_token=${encodeURIComponent(j.refresh_token)}`;
  return cihaz === 'android'
    ? `intent://auth/callback${sorgu}#Intent;scheme=clubbeans;package=com.clubbeans;S.browser_fallback_url=${encodeURIComponent(PLAY)};end`
    : `clubbeans://auth/callback${sorgu}`;
}

export type HataBilgisi = { metin: string; tekrarDenenir: boolean };

const YEDEK = "DM'deki yedek giriş bilgileriyle uygulamadan giriş yapabilirsin.";

/** Edge yanıtı (durum + kod) → kişiye gösterilecek metin. durum 0 = ağa ulaşılamadı. */
export function hataBilgisi(durum: number, kod: unknown): HataBilgisi {
  switch (kod) {
    case 'BAGLANTI_KULLANILDI':
      return { metin: `Bu bağlantı kullanıldı. Uygulama açıldıysa zaten hesabındasın; açılmadıysa ${YEDEK}`, tekrarDenenir: false };
    case 'BAGLANTI_SURESI_DOLDU':
      return { metin: `Bu bağlantının süresi doldu. ${YEDEK} Ya da bize yaz, yenisini gönderelim.`, tekrarDenenir: false };
    case 'BAGLANTI_IPTAL':
      return { metin: "Bu bağlantı artık geçerli değil; yerine yenisi gönderilmiş olabilir. DM'deki en son bağlantıyı kullan.", tekrarDenenir: false };
    case 'BAGLANTI_KENDI_GIRISI':
      return { metin: 'Hesabına zaten kendi bilgilerinle girmişsin, bu yüzden bağlantı kapandı. Uygulamayı açman yeterli.', tekrarDenenir: false };
    case 'BAGLANTI_BULUNAMADI':
    case 'GECERSIZ_ANAHTAR':
      return { metin: `Bu bağlantı tanınmadı. DM'deki bağlantıya yeniden dokun; olmazsa ${YEDEK}`, tekrarDenenir: false };
    case 'BAGLANTI_KAPALI':
      return { metin: `Giriş bağlantıları şu an kapalı. ${YEDEK}`, tekrarDenenir: false };
    case 'HESAP_KULLANILAMAZ':
      return { metin: 'Bu hesapla şu an giriş yapılamıyor. Bağlantıyı sana gönderen ClubBeans hesabına yaz.', tekrarDenenir: false };
    case 'COK_DENEME':
      return { metin: 'Çok sık denendi. Birkaç dakika bekleyip yeniden dokun.', tekrarDenenir: true };
  }
  if (durum === 0) return { metin: 'İnternete ulaşamadık. Bağlantını kontrol edip yeniden dokun.', tekrarDenenir: true };
  return { metin: `Şu an hesabını açamadık. Biraz sonra yeniden dokun; olmazsa ${YEDEK}`, tekrarDenenir: true };
}

/** Gizli değer taşıyabilecek parametreler (PKCE `code` dahil — google-donus-acil) + çıplak JWT. Sentry olaylarında maskelenir. */
const GIZLI_PARAM_RE = /((?:^|[#?&;\s"'(/\\])(?:k|access_token|refresh_token|token_hash|code)=)[^&#\s"'\\]+/g;
const JWT_GOVDE_RE = /eyJ[A-Za-z0-9_-]{5,}\.[A-Za-z0-9_-]{5,}\.[A-Za-z0-9_-]{5,}/g;

export const gizliMaskele = (s: string): string =>
  s.replace(GIZLI_PARAM_RE, '$1[maskeli]').replace(JWT_GOVDE_RE, '[maskeli-jwt]');

/**
 * Sentry olayını (hata ya da işlem) bütünüyle maskeler: URL, işlem adı, gezinme izleri (`/hazir#k=…`),
 * span açıklamaları. Serileştirilemeyen olayda bilinen alanlara düşer — ham anahtar asla geçmez.
 */
export function olayMaskele<T>(olay: T): T {
  try {
    const ham = JSON.stringify(olay);
    const temiz = gizliMaskele(ham);
    return temiz === ham ? olay : (JSON.parse(temiz) as T);
  } catch {
    return alanlariMaskele(olay);
  }
}

function alanlariMaskele<T>(olay: T): T {
  const o = olay as {
    request?: { url?: string; query_string?: unknown };
    transaction?: string;
    breadcrumbs?: Array<{ message?: string; data?: Record<string, unknown> }>;
  };
  if (o.request?.url) o.request.url = gizliMaskele(o.request.url);
  if (o.request && o.request.query_string !== undefined) o.request.query_string = '[maskeli]';
  if (o.transaction) o.transaction = gizliMaskele(o.transaction);
  for (const b of o.breadcrumbs ?? []) {
    if (b.message) b.message = gizliMaskele(b.message);
    for (const [a, v] of Object.entries(b.data ?? {})) if (typeof v === 'string' && b.data) b.data[a] = gizliMaskele(v);
  }
  return olay;
}
