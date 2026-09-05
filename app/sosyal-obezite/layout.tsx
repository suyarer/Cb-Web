/**
 * Oyun segmenti düzeni — global süs katmanı CSS'ini SUNUCUDA kapatır.
 *
 * `html[data-oyun]` işareti hidrasyon sonrası geliyordu; yavaş cihazda ilk 1.65 sn
 * boyunca grain-overlay oyunun üstünde açık kalıyordu (denetim site-4). Bu <style>
 * SSR HTML'de gelir, JS beklemez. CSP style-src 'unsafe-inline' zaten izinli.
 */
export default function OyunDuzeni({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{'.grain-overlay{display:none}'}</style>
      {children}
    </>
  );
}
