import dynamic from 'next/dynamic';
import Hero from '@/components/Hero';
import Nav from '@/components/Nav';

// Below-the-fold: dynamic import — ilk render'da yüklenmez, viewport'a girdiğinde yüklenir
// Bundle'ı kritik path'ten çıkararak Hero + Form yükleme süresini düşürür
const Problems = dynamic(() => import('@/components/Problems'), {
  loading: () => <div className="min-h-[400px]" aria-hidden />,
});
const SelfCheck = dynamic(() => import('@/components/SelfCheck'), {
  loading: () => <div className="min-h-[400px]" aria-hidden />,
});
const HowItWorks = dynamic(() => import('@/components/HowItWorks'), {
  loading: () => <div className="min-h-[400px]" aria-hidden />,
});
const TrustScore = dynamic(() => import('@/components/TrustScore'), {
  loading: () => <div className="min-h-[400px]" aria-hidden />,
});
const SubpageTeasers = dynamic(() => import('@/components/SubpageTeasers'), {
  loading: () => <div className="min-h-[300px]" aria-hidden />,
});
const FoundersNote = dynamic(() => import('@/components/FoundersNote'), {
  loading: () => <div className="min-h-[400px]" aria-hidden />,
});
const Launch = dynamic(() => import('@/components/Launch'), {
  loading: () => <div className="min-h-[400px]" aria-hidden />,
});
const FooterLegal = dynamic(() => import('@/components/FooterLegal'));
const StickyCTA = dynamic(() => import('@/components/StickyCTA'));

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Problems />
        <SelfCheck />
        <HowItWorks />
        <TrustScore />
        <SubpageTeasers />
        <FoundersNote />
        <Launch />
      </main>
      <FooterLegal />
      <StickyCTA />
    </>
  );
}
