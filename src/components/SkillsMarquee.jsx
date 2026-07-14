import { Fragment } from 'react';

/**
 * Cinta de skills en movimiento continuo (CSS animation).
 * El listado se duplica para que el loop sea perfecto. Port de
 * template-parts/skills-marquee.php.
 */
export function SkillsMarquee({ skills }) {
  // Duplicado para loop continuo (la animación CSS desplaza -50%).
  const loop = [...skills, ...skills];

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track" id="marquee-track">
        {loop.map((skill, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <Fragment key={i}>
            <span className="marquee-item">{skill}</span>
            <span className="marquee-sep">◆</span>
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default SkillsMarquee;
