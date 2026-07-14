import { SplitText } from './SplitText';

/**
 * Sección "Sobre mí": foto con revelado de cortina + texto + datos.
 * Port de template-parts/about.php.
 */
export function About({ about }) {
  return (
    <section className="about section" id="about" data-snap-section>
      <div className="section-head">
        <span className="section-label mono" data-reveal>
          01 / Sobre mí
        </span>
        <SplitText as="h2" className="section-title" data-split text="QUIÉN ESTÁ DETRÁS" />
      </div>

      <div className="about-grid">
        <figure className="about-photo" data-clip>
          <img
            src={about.profileImage}
            alt="Jhon Byron Quiroz — foto de perfil"
            loading="lazy"
            width="640"
            height="800"
          />
          <figcaption className="mono">{about.photoCaption}</figcaption>
        </figure>

        <div className="about-text">
          <p className="about-lead" data-reveal>
            {about.lead}
          </p>
          <p className="about-body" data-reveal>
            {about.body}
          </p>

          <ul className="about-facts mono">
            {about.facts.map((fact) => (
              <li key={fact.label} data-reveal>
                <span>{fact.label}</span>
                {fact.value}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default About;
