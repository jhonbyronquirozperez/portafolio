import {
  siPython,
  siFastapi,
  siGit,
  siReact,
  siDocker,
  siPostgresql,
  siMysql,
  siDbeaver,
  siGooglecloud,
  siLangchain,
  siAnthropic,
  siHuggingface,
  siN8n,
} from 'simple-icons';

// Imports nombrados (no `import *`): así Vite solo empaqueta los ~13
// íconos que usamos en vez de la librería completa (miles de logos).
// Las claves están en minúscula y deben coincidir con los slugs que se
// escriben en content.js (about.techStack[].icons).
const ICONS = {
  python: siPython,
  fastapi: siFastapi,
  git: siGit,
  react: siReact,
  docker: siDocker,
  postgresql: siPostgresql,
  mysql: siMysql,
  dbeaver: siDbeaver,
  googlecloud: siGooglecloud,
  langchain: siLangchain,
  anthropic: siAnthropic,
  huggingface: siHuggingface,
  n8n: siN8n,
};

// Luminancia percibida: si el color de marca es casi negro, se vuelve
// invisible sobre el fondo oscuro del sitio, así que cae a blanco.
function isTooDark(hex) {
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 40;
}

/** Ícono de marca (simple-icons) coloreado con su hex oficial. */
function BrandIcon({ slug }) {
  const icon = ICONS[slug];
  if (!icon) return null;

  const color = isTooDark(icon.hex) ? 'var(--white)' : `#${icon.hex}`;

  return (
    <span className="tech-icon" style={{ color }} title={icon.title}>
      <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
        <path d={icon.path} fill="currentColor" />
      </svg>
    </span>
  );
}

/**
 * Stack técnico agrupado por área: título + logos representativos en la
 * misma línea (alineados con el resto de la lista de datos), y las pills
 * de texto con el detalle completo debajo.
 */
export function TechStack({ groups }) {
  return (
    <div className="tech-stack">
      {groups.map((group) => (
        <div className="tech-group" key={group.label} data-reveal>
          <div className="tech-group-head">
            <h4 className="tech-group-label">{group.label}</h4>
            <div className="tech-group-icons">
              {group.icons.map((slug) => (
                <BrandIcon key={slug} slug={slug} />
              ))}
            </div>
          </div>
          <div className="tech-pills">
            {group.items.map((item) => (
              <span className="tech-pill mono" key={item}>
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default TechStack;
