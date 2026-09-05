/**
 * "Bugün" skor tablosunun gün anahtarı.
 *
 * Türkiye kalıcı olarak UTC+3 (2016'dan beri DST yok) — bu yüzden sabit
 * ofset güvenli. UTC kullanılsa tablo Türkiye saatiyle 03:00'te sıfırlanır,
 * yani gece oynayanların skoru "dünün" tablosuna yazılır.
 *
 * Not: route dosyalarından fonksiyon export etmek Next.js'te route ihracı
 * sayılabildiği için bu yardımcı ayrı dosyada durur.
 */
export const TR_OFSET_MS = 3 * 60 * 60 * 1000;

export function trGunu(now: Date = new Date()): string {
  return new Date(now.getTime() + TR_OFSET_MS).toISOString().slice(0, 10);
}
