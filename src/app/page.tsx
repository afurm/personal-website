import type { Metadata } from 'next';
import { Header } from '@/components/ui/header';
import { Footer } from '@/components/ui/footer';
import { Hero } from '@/components/sections/hero';
import { Experience } from '@/components/sections/experience';
import { Skills } from '@/components/sections/skills';
import { Education } from '@/components/sections/education';
import { Contact } from '@/components/sections/contact';
import { About } from '@/components/sections/about';
import { SkipToContent } from '@/components/ui/skip-to-content';

export const metadata: Metadata = {
  title: 'Andrii Furmanets - Senior Full-Stack Developer | React, Next.js & Ruby on Rails',
  description: 'Senior Full-Stack Developer skilled in React, Next.js & Ruby on Rails. Fintech & Web3 expert. Available for freelance projects.',
  alternates: {
    canonical: '/',
  },
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SkipToContent />
      <Header />
      <main id="main" className="flex-1">
        <Hero />
        <About />
        <Experience />
        <Skills />
        <Education />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
