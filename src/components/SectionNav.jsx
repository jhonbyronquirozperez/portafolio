import { useEffect, useState } from 'react';

/**
 * Indicador de progreso por sección (dots fijos al borde derecho, estilo
 * "capítulos"). Resalta la sección visible con IntersectionObserver y
 * hace scroll suave (vía Lenis si está activo) al hacer click.
 */
export function SectionNav({ sections, lenisRef, reducedMotion }) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter(Boolean);
    if (els.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sections]);

  const goTo = (id) => {
    const target = document.getElementById(id);
    if (!target) return;
    if (lenisRef?.current) {
      lenisRef.current.scrollTo(target, { offset: -90, duration: 1.2 });
    } else {
      target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="section-nav" aria-label="Progreso de sección">
      {sections.map((s) => (
        <button
          key={s.id}
          type="button"
          className={`section-nav-dot${active === s.id ? ' is-active' : ''}`}
          onClick={() => goTo(s.id)}
          aria-current={active === s.id ? 'true' : undefined}
        >
          <span className="section-nav-label mono">{s.label}</span>
        </button>
      ))}
    </nav>
  );
}

export default SectionNav;
