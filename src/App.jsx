import { useRef, useState, useCallback } from 'react';
import content from './data/content';
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';
import { useMercuryAnimations } from './hooks/useMercuryAnimations';
import { Preloader } from './components/Preloader';
import { Cursor } from './components/Cursor';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { SkillsMarquee } from './components/SkillsMarquee';
import { About } from './components/About';
import { Projects } from './components/Projects';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

/**
 * Composición del portafolio. Equivale a front-page.php: solo ensambla
 * las secciones y orquesta el preloader + las animaciones globales.
 */
export default function App() {
  const rootRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();
  const [showPreloader, setShowPreloader] = useState(true);

  const handlePreloaderDone = useCallback(() => setShowPreloader(false), []);

  // GSAP: preloader, reveals al scroll y micro-interacciones.
  useMercuryAnimations(rootRef, reducedMotion, handlePreloaderDone);

  return (
    <div ref={rootRef}>
      {showPreloader && <Preloader />}
      <Cursor reducedMotion={reducedMotion} />

      <Header brand={content.brand} nav={content.nav} />

      <main className="site-main" id="main">
        <Hero hero={content.hero} reducedMotion={reducedMotion} />
        <SkillsMarquee skills={content.skills} />
        <About about={content.about} />
        <Projects projects={content.projects} />
        <Contact contact={content.contact} />
      </main>

      <Footer social={content.social} footer={content.footer} />
    </div>
  );
}
