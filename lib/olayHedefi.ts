/**
 * @governing_law PLATFORM_ANAYASASI — pencere/document dinleyicilerinde olay hedefi Element olmayabilir
 * (Document, Text, Window); `.closest()` yalnız Element'te vardır (Sentry CB-WEB-1 / CB-WEB-5).
 * Metot varlığıyla sınanır ki DOM'suz Node testinde de koşsun (`scripts/olayHedefi.test.mts`).
 */

function closestTasir(x: unknown): x is Element {
  return typeof x === 'object' && x !== null && typeof (x as Element).closest === 'function';
}

export function hedefElemani(hedef: EventTarget | null): Element | null {
  if (closestTasir(hedef)) return hedef;
  const ebeveyn = (hedef as Node | null)?.parentElement ?? null;
  return closestTasir(ebeveyn) ? ebeveyn : null;
}
