import Compare from '@/components/Compare';
import Features from '@/components/Features';
import FooterLegal from '@/components/FooterLegal';
import ForHosts from '@/components/ForHosts';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import Launch from '@/components/Launch';
import Lexicon from '@/components/Lexicon';
import Manifesto from '@/components/Manifesto';
import Nav from '@/components/Nav';
import Problems from '@/components/Problems';
import Showcase from '@/components/Showcase';
import TrustScore from '@/components/TrustScore';
import Values from '@/components/Values';

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Problems />
        <HowItWorks />
        <ForHosts />
        <Manifesto />
        <TrustScore />
        <Showcase />
        <Features />
        <Compare />
        <Values />
        <Lexicon />
        <Launch />
      </main>
      <FooterLegal />
    </>
  );
}
