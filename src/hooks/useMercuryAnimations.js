import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Orquestación de animaciones (port de assets/js/animations.js).
 *
 * Secuencia: preloader con contador → revelado del hero por caracteres →
 * reveals al scroll (ScrollTrigger) → scroll horizontal pineado de
 * Proyectos → micro-interacciones (botones magnéticos).
 *
 * Todo vive dentro de un gsap.context() acotado al root, así el cleanup
 * de React revierte tweens y ScrollTriggers automáticamente. Los event
 * listeners crudos se limpian aparte.
 *
 * @param {React.RefObject<HTMLElement>} rootRef  Contenedor de la app.
 * @param {boolean} reducedMotion                 prefers-reduced-motion.
 * @param {(done: boolean) => void} setPreloaderDone  Oculta el preloader.
 */
export function useMercuryAnimations(rootRef, reducedMotion, setPreloaderDone) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    // --- Movimiento reducido: mostrar todo y salir. --------------------
    if (reducedMotion) {
      setPreloaderDone(true);
      gsap.set('[data-reveal], .char, [data-clip]', { clearProps: 'all', opacity: 1 });
      return undefined;
    }

    const cleanups = [];

    const ctx = gsap.context(() => {
      // ----------------------------------------------------------------
      // 1. Preloader con contador + entrada del hero.
      // ----------------------------------------------------------------
      const counter = document.getElementById('preloader-counter');
      const preloader = document.getElementById('preloader');
      const intro = gsap.timeline({ defaults: { ease: 'power3.out' } });
      const progress = { value: 0 };

      intro
        .to(progress, {
          value: 100,
          duration: 1.1,
          ease: 'power2.inOut',
          onUpdate: () => {
            if (counter) counter.textContent = String(Math.round(progress.value));
          },
        })
        .to(preloader, {
          yPercent: -100,
          duration: 0.7,
          ease: 'power4.inOut',
          onComplete: () => setPreloaderDone(true),
        })
        .to('.hero-line .char', {
          y: 0,
          duration: 0.9,
          stagger: 0.022,
          ease: 'power4.out',
        }, '-=0.25')
        .to('.hero [data-reveal]', {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
        }, '-=0.5');

      // ----------------------------------------------------------------
      // 2. Reveals genéricos al hacer scroll.
      // ----------------------------------------------------------------
      gsap.utils.toArray('.section [data-reveal], .site-footer [data-reveal]').forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
        });
      });

      // Títulos de sección por caracteres.
      gsap.utils.toArray('.section-title[data-split], .contact-title .hero-line').forEach((el) => {
        gsap.to(el.querySelectorAll('.char'), {
          y: 0,
          duration: 0.8,
          stagger: 0.018,
          ease: 'power4.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
        });
      });

      // Imágenes con revelado tipo "cortina" (clip-path).
      gsap.utils.toArray('[data-clip]').forEach((el) => {
        gsap.to(el, {
          clipPath: 'inset(0 0 0% 0)',
          duration: 1.2,
          ease: 'power4.inOut',
          scrollTrigger: { trigger: el, start: 'top 82%' },
        });
      });

      // Proyectos: en desktop, pinea el riel y traduce las cards en X a
      // medida que el usuario hace scroll vertical (scroll-jacking, como
      // en lenis.dev). En móvil, .projects-rail cae a un carrusel nativo
      // (ver main.css), así que este bloque no aplica ahí.
      const projectsRail = root.querySelector('[data-projects-rail]');
      const projectsTrack = root.querySelector('[data-projects-track]');
      if (projectsRail && projectsTrack) {
        ScrollTrigger.matchMedia({
          '(min-width: 861px)': () => {
            const getDistance = () => projectsTrack.scrollWidth - projectsRail.clientWidth;
            gsap.to(projectsTrack, {
              x: () => -getDistance(),
              ease: 'none',
              scrollTrigger: {
                trigger: projectsRail,
                start: 'top top',
                end: () => `+=${getDistance()}`,
                scrub: 0.6,
                pin: true,
                invalidateOnRefresh: true,
              },
            });
          },
        });
      }

      // ----------------------------------------------------------------
      // 3 + 4. Micro-interacciones (solo punteros precisos).
      // ----------------------------------------------------------------
      if (window.matchMedia('(pointer: fine)').matches) {
        // Botones y enlaces magnéticos.
        document.querySelectorAll('[data-magnetic]').forEach((el) => {
          const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'elastic.out(1, 0.4)' });
          const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'elastic.out(1, 0.4)' });

          const onMove = (e) => {
            const rect = el.getBoundingClientRect();
            xTo((e.clientX - rect.left - rect.width / 2) * 0.35);
            yTo((e.clientY - rect.top - rect.height / 2) * 0.35);
          };
          const onLeave = () => {
            xTo(0);
            yTo(0);
          };

          el.addEventListener('pointermove', onMove);
          el.addEventListener('pointerleave', onLeave);
          cleanups.push(() => {
            el.removeEventListener('pointermove', onMove);
            el.removeEventListener('pointerleave', onLeave);
          });
        });
      }
    }, root);

    return () => {
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, [rootRef, reducedMotion, setPreloaderDone]);
}

export default useMercuryAnimations;
