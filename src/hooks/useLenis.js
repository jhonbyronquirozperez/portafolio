import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import Snap from 'lenis/snap';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll suave (Lenis) sincronizado con el ticker de GSAP/ScrollTrigger,
 * más un ajuste por sección (Snap en modo "proximity": solo asienta el
 * scroll cuando ya te detuviste cerca del borde de una sección — no
 * atrapa al usuario dentro de secciones largas como Proyectos).
 *
 * Los enlaces internos (`href="#seccion"`) quedan con scroll suave y un
 * offset para no tapar el contenido bajo el header fijo.
 *
 * Se desactiva por completo con prefers-reduced-motion: el scroll queda
 * nativo, instantáneo.
 */
export function useLenis(rootRef, reducedMotion) {
  const lenisRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || reducedMotion) return undefined;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => 1 - (1 - t) ** 3,
      smoothWheel: true,
      touchMultiplier: 1.15,
      anchors: { offset: -90, duration: 1.2 },
    });
    lenisRef.current = lenis;

    const snap = new Snap(lenis, {
      type: 'proximity',
      duration: 1,
      distanceThreshold: '35%',
    });
    const unsubscribers = Array.from(root.querySelectorAll('[data-snap-section]')).map((el) =>
      snap.addElement(el, { align: 'start' })
    );

    lenis.on('scroll', ScrollTrigger.update);

    function raf(time) {
      lenis.raf(time * 1000);
    }
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      unsubscribers.forEach((unsub) => unsub());
      snap.destroy();
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [rootRef, reducedMotion]);

  return lenisRef;
}

export default useLenis;
