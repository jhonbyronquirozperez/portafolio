import { SplitText } from './SplitText';

/**
 * Sección de proyectos: cards horizontales al estilo lenis.dev. En
 * desktop, useMercuryAnimations pinea `.projects-rail` y traduce
 * `.projects-track` en el eje X a medida que el usuario hace scroll
 * vertical normal (scroll-jacking clásico, sincronizado con Lenis). En
 * móvil, `.projects-rail` cae a un carrusel nativo con scroll-snap.
 * Port de template-parts/projects.php.
 */
export function Projects({ projects }) {
  return (
    <section className="projects section" id="projects" data-snap-section>
      <div className="section-head">
        <span className="section-label mono" data-reveal>
          02 / Proyectos
        </span>
        <SplitText as="h2" className="section-title" data-split text="TRABAJO SELECCIONADO" />
      </div>

      <div className="projects-rail" data-projects-rail>
        <div className="projects-track" data-projects-track>
          {projects.map((project, index) => {
            const hasLink = Boolean(project.link);
            const Tag = hasLink ? 'a' : 'div';
            const linkProps = hasLink
              ? { href: project.link, target: '_blank', rel: 'noopener noreferrer' }
              : {};

            return (
              <Tag key={project.title} className="project-card" data-project data-reveal {...linkProps}>
                <span className="project-card-media">
                  {project.image && <img src={project.image} alt="" loading="lazy" />}
                  <span className="project-card-arrow" aria-hidden="true">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M7 17L17 7M17 7H8M17 7V16" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </span>
                </span>
                <span className="project-card-index mono">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3 className="project-card-title">{project.title}</h3>
                <span className="project-card-meta mono">
                  {project.category}
                  <em>{project.year}</em>
                </span>
              </Tag>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Projects;
