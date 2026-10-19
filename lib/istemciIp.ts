/**
 * @module istemciIp
 * İstemci IP'si — sitedeki TEK okuma yeri (scripts/ip-bekcisi.mjs başka yerde IP başlığı okumayı derlemede reddeder).
 *
 * clubbeans.com Cloudflare proxy'sinin arkasında; Vercel `x-forwarded-for` ve `x-real-ip`'i Cloudflare çıkış IP'siyle
 * EZİYOR. Bu iki kez canlıda yaşandı: oyunda tüm oyuncular tek hız-sınırı kovasına düşüyordu (ab7c2c8, denetim
 * site-regresyon-1), 19.10'da sayaç + abonelik + Meta CAPI aynı hatayı taşıyordu (CB2026 site-ip-cloudflare-2026-10-19).
 *
 * Sıra: Cloudflare'dan gelen istekte (`cf-ray` var) `cf-connecting-ip` · sonra Vercel platform başlıkları
 * (`x-real-ip`, `x-vercel-forwarded-for` ilk değeri). XFF'in sol ucu istemci tarafından uydurulabildiği için hiç
 * okunmaz (oyun spec §5.3). Doğrudan Vercel kökenine `cf-ray` uyduran istek bilinçli kabul edilen risk.
 * IP hiç yoksa null; çağıran taraf ayrı bir 'ipsiz' kova kullanır.
 *
 * @governing_law clubbeans-privacy-v1
 */

export type IpKaynagi = 'cf' | 'real' | 'vercel' | 'yok';

export function istemciIpKaynagi(req: Request): { ip: string | null; kaynak: IpKaynagi } {
  if (req.headers.get('cf-ray')) {
    const cf = req.headers.get('cf-connecting-ip')?.trim();
    if (cf) return { ip: cf, kaynak: 'cf' };
  }
  const real = req.headers.get('x-real-ip')?.trim();
  if (real) return { ip: real, kaynak: 'real' };
  const vercel = req.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim();
  if (vercel) return { ip: vercel, kaynak: 'vercel' };
  return { ip: null, kaynak: 'yok' };
}

export function istemciIp(req: Request): string | null {
  return istemciIpKaynagi(req).ip;
}
