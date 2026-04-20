import Features from '@/components/Features';
import FooterLegal from '@/components/FooterLegal';
import Hero from '@/components/Hero';
import Launch from '@/components/Launch';
import Manifesto from '@/components/Manifesto';
import Nav from '@/components/Nav';
import Showcase from '@/components/Showcase';

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Manifesto />
        <Features />
        <Showcase />
        <Launch />
      </main>
      <FooterLegal />
    </>
  );
}
