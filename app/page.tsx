import Compare from '@/components/Compare';
import FAQ from '@/components/FAQ';
import FooterLegal from '@/components/FooterLegal';
import ForHosts from '@/components/ForHosts';
import FoundersNote from '@/components/FoundersNote';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import Launch from '@/components/Launch';
import Manifesto from '@/components/Manifesto';
import Nav from '@/components/Nav';
import Problems from '@/components/Problems';
import Roadmap from '@/components/Roadmap';
import SelfCheck from '@/components/SelfCheck';
import Showcase from '@/components/Showcase';
import StickyCTA from '@/components/StickyCTA';
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
        <ForHosts />
        <Manifesto />
        <TrustScore />
        <Showcase />
        <Compare />
        <Roadmap />
        <FAQ />
        <FoundersNote />
        <Launch />
      </main>
      <FooterLegal />
      <StickyCTA />
    </>
  );
}
