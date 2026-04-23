import BeanSprout from '@/components/BeanSprout';

export default function Loading() {
  return (
    <main
      className="min-h-screen flex items-center justify-center px-6"
      role="status"
      aria-live="polite"
      aria-label="Yükleniyor"
    >
      <div className="text-center">
        <div className="flex justify-center mb-5 animate-pulse">
          <BeanSprout size={56} />
        </div>
        <div className="text-[10.5px] font-mono uppercase tracking-[0.3em] text-zinc-500">
          Yükleniyor…
        </div>
      </div>
    </main>
  );
}
