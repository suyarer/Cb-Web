/**
 * @route /auth/callback (layout)
 * @governing_law PLATFORM_ANAYASASI, KVKK_ANAYASASI · CB2026 İP-H (2026-09-30)
 *
 * Dönüş adresi tek kullanımlık kod (?code=) taşır — arama motoruna kapalı. Sayfa istemci bileşeni olduğu
 * için metadata buradan verilir. Apex'te 308 muafiyeti (proxy.ts 1b) bu yüzden SEO'yu etkilemez.
 */
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AuthCallbackLayout({ children }: { children: ReactNode }) {
  return children;
}
