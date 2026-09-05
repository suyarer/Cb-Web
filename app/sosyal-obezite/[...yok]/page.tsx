import { notFound } from 'next/navigation';

/**
 * /sosyal-obezite/<bilinmeyen> → segment içi not-found.
 * Global not-found bu yolda React #418 hidrasyon hatası üretiyordu (denetim site-3).
 */
export default function Page() {
  notFound();
}
