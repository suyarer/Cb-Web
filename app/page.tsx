import Features from '@/components/Features';
import FooterLegal from '@/components/FooterLegal';
import Hero from '@/components/Hero';
import Launch from '@/components/Launch';
import Lexicon from '@/components/Lexicon';
import Manifesto from '@/components/Manifesto';
import Nav from '@/components/Nav';
import Problems from '@/components/Problems';
import Showcase from '@/components/Showcase';
import Values from '@/components/Values';

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Problems />
        <Manifesto />
        <Values />
        <Features />
        <Lexicon />
        <Showcase />
        <Launch />
      </main>
      <FooterLegal />
    </>
  );
}
