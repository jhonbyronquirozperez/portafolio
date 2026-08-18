import { useRef, useState } from 'react';
import { useFallingCircles } from '../hooks/useFallingCircles';

const ICONS = {
  video: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M8 6.5v11l9-5.5-9-5.5Z" fill="currentColor" />
    </svg>
  ),
  document: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 3.5h7l4 4V20a.5.5 0 0 1-.5.5h-11A.5.5 0 0 1 6 20V4a.5.5 0 0 1 .5-.5H7Z"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path d="M14 3.5V8h4.2" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  ),
  image: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="4" y="5" width="16" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="9" cy="10" r="1.6" fill="currentColor" />
      <path d="M5.5 17.5 10 12l3 3.2 2.3-2.6 3.2 3.9" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  ),
  link: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 17L17 7M17 7H8M17 7V16" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
};

/** Miniatura del item: usa el media real si carga; si no, cae al ícono. */
function NowCardMedia({ item }) {
  const [failed, setFailed] = useState(false);
  const showMedia = Boolean(item.media) && !failed;

  return (
    <div className="now-card-media">
      {showMedia && item.type === 'video' && (
        <video
          src={item.media}
          muted
          loop
          autoPlay
          playsInline
          onError={() => setFailed(true)}
        />
      )}
      {showMedia && item.type === 'image' && (
        <img src={item.media} alt="" loading="lazy" onError={() => setFailed(true)} />
      )}
      <span className="now-card-icon">{ICONS[item.type] ?? ICONS.link}</span>
    </div>
  );
}

/**
 * Sección "Ahora": últimos proyectos / en qué se está trabajando, con
 * fondo de círculos animados por física (Matter.js) — homenaje al hero
 * de patrickheng.com, con la paleta nuclear del sitio.
 */
export function Now({ now, reducedMotion }) {
  const containerRef = useRef(null);
  useFallingCircles(containerRef, reducedMotion);

  return (
    <section className="now section" id="now" data-snap-section ref={containerRef}>
      <div className="now-content">
        <p className="now-eyebrow mono" data-reveal>
          {now.eyebrow}
        </p>
        <h2 className="now-title" data-reveal>
          {now.title}
        </h2>
        <p className="now-subtitle" data-reveal>
          {now.subtitle}
        </p>

        <div className="now-items">
          {now.items.map((item) => {
            const Tag = item.href ? 'a' : 'div';
            const linkProps = item.href
              ? { href: item.href, target: '_blank', rel: 'noopener noreferrer' }
              : {};
            return (
              <Tag key={item.title} className="now-card" data-reveal {...linkProps}>
                <NowCardMedia item={item} />
                <span className="now-card-date mono">{item.date}</span>
                <h3 className="now-card-title">{item.title}</h3>
                <p className="now-card-desc">{item.description}</p>
              </Tag>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Now;
