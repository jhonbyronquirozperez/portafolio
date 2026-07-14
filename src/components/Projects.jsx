import { SplitText } from './SplitText';

/**
 * Sección de proyectos: filas tipo índice con preview flotante que sigue
 * al cursor (la animación la maneja useMercuryAnimations). Cada fila es un
 * enlace si tiene `link`, o un div si no. Port de template-parts/projects.php.
 */
export function Projects({ projects }) {
  return (
    <section className="projects section" id="projects">
      <div className="section-head">
        <span className="section-label mono" data-reveal>
          02 / Proyectos
        </span>
        <SplitText as="h2" className="section-title" data-split text="TRABAJO SELECCIONADO" />
      </div>

      <div className="projects-list">
        {projects.map((project, index) => {
          const hasLink = Boolean(project.link);
          const Tag = hasLink ? 'a' : 'div';
          const linkProps = hasLink
            ? { href: project.link, target: '_blank', rel: 'noopener noreferrer' }
            : {};

          return (
            <Tag key={project.title} className="project-row" data-project {...linkProps}>
              <span className="project-index mono">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3 className="project-title">{project.title}</h3>
              <span className="project-meta mono">
                {project.category}
                <em>{project.year}</em>
              </span>
              <span className="project-arrow" aria-hidden="true">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M7 17L17 7M17 7H8M17 7V16" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </span>
              {project.image && (
                <span className="project-preview" aria-hidden="true">
                  <img src={project.image} alt="" loading="lazy" />
                </span>
              )}
            </Tag>
          );
        })}
      </div>
    </section>
  );
}

export default Projects;
