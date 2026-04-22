import Compare from '@/components/Compare';
import FAQ from '@/components/FAQ';
import Features from '@/components/Features';
import FooterLegal from '@/components/FooterLegal';
import ForHosts from '@/components/ForHosts';
import FoundersNote from '@/components/FoundersNote';
import Hero from '@/components/Hero';
import HowItWorks from '@/components/HowItWorks';
import KabileTicker from '@/components/KabileTicker';
import Launch from '@/components/Launch';
import Lexicon from '@/components/Lexicon';
import LonelinessQuiz from '@/components/LonelinessQuiz';
import Manifesto from '@/components/Manifesto';
import Nav from '@/components/Nav';
import Problems from '@/components/Problems';
import Roadmap from '@/components/Roadmap';
import ScreenLifeConverter from '@/components/ScreenLifeConverter';
import Showcase from '@/components/Showcase';
import TrustScore from '@/components/TrustScore';

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Problems />
        <LonelinessQuiz />
        <HowItWorks />
        <ForHosts />
        <Manifesto />
        <ScreenLifeConverter />
        <TrustScore />
        <Showcase />
        <Features />
        <KabileTicker />
        <Compare />
        <Roadmap />
        <FAQ />
        <Lexicon />
        <FoundersNote />
        <Launch />
      </main>
      <FooterLegal />
    </>
  );
}
