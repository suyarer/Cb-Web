/**
 * Faz-5 Bean — paylaşım görsellerinin ortak parçası.
 *
 * Dağılmış piksel ızgarası: asit yeşili YOK, şişme YOK. Şişkin Bean'in
 * paylaşım kartında yer alması üç uzmanın ortak 1 numaralı riskiydi
 * ("obeziteyle dalga geçiyorlar" okuması) — kartta yalnız çözülme görünür.
 *
 * İKİ DÜZELTME (üretilen PNG'ye bakılarak, 2026-08-18):
 *
 * 1) SİLUET YOKTU. Blok opaklığı merkeze uzaklıktan hesaplanıyordu, yani
 *    ızgara bir baklava dilimi çiziyordu. Kartta "çözülen Bean" değil,
 *    tanımsız koyu bir leke görünüyordu. Artık gerçek bir filiz maskesi
 *    (iki yaprak + sap + gövde) kullanılıyor; çözülme o maskenin ÜZERİNE
 *    uygulanıyor, böylece hem Bean okunuyor hem dağıldığı görülüyor.
 *
 * 2) KONTRAST ÇOK DÜŞÜKTÜ. #3A3A3A zemin #050505 üzerinde ~1.9 oranındaydı;
 *    küçültülmüş önizlemede hiç seçilmiyordu. Taban #6E6E6E'ye çekildi.
 *
 * ⚠️ SATORI KURALI: `next/og` içindeki HER `<div>`, birden fazla çocuk düğümü
 * varsa AÇIK `display` almak zorunda. JSX'te `skor {k.skor}` gibi bir gövde
 * İKİ çocuk üretir (metin + ifade) ve bu kural sessizce ihlal edilir; sonuç
 * çalışma anında "failed to pipe response" ve görselin HİÇ üretilmemesidir.
 * Bu yüzden bu klasördeki metinler tek şablon dizesi olarak yazılır ve her
 * div açık `display` taşır.
 */

/** 9×7 filiz maskesi — 1 = gövde/yaprak var. */
const MASKE = [
  '..#....#.',
  '...#..#..',
  '....#....',
  '.#######.',
  '.#######.',
  '..#####..',
  '...###...',
] as const;

export function PikselBean({ olcek = 1 }: { olcek?: number }) {
  const blok = Math.round(18 * olcek);
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: blok * 9,
        height: blok * MASKE.length,
      }}
    >
      {MASKE.map((satir, y) => (
        <div key={y} style={{ display: 'flex' }}>
          {satir.split('').map((h, x) => {
            // Çözülme: aşağı ve kenarlara doğru blok kaybolur
            const dagilma = (y / (MASKE.length - 1)) * 0.45 + (Math.abs(x - 4) / 4) * 0.35;
            const o = h === '#' ? Math.max(0.14, 1 - dagilma) : 0;
            return (
              <div
                key={x}
                style={{
                  display: 'flex',
                  width: blok,
                  height: blok,
                  background: o > 0 ? '#6E6E6E' : 'transparent',
                  opacity: o,
                }}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
