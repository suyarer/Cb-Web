import FooterLegal from '@/components/FooterLegal';
import FoundersNote from '@/components/FoundersNote';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import Launch from '@/components/Launch';
import Nav from '@/components/Nav';
import Problems from '@/components/Problems';
import SelfCheck from '@/components/SelfCheck';
import StickyCTA from '@/components/StickyCTA';
import SubpageTeasers from '@/components/SubpageTeasers';
import TrustScore from '@/components/TrustScore';

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
