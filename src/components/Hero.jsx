import { MercuryBlob } from './MercuryBlob';
import { SplitText } from './SplitText';

/**
 * Sección hero: blob de mercurio (Three.js) + título dividido por
 * caracteres + datos técnicos al pie. Port de template-parts/hero.php.
 */
export function Hero({ hero, reducedMotion }) {
  return (
    <section className="hero" id="hero">
      <MercuryBlob reducedMotion={reducedMotion} />

      <div className="hero-content">
        <p className="hero-eyebrow mono" data-reveal>
          <span className="dot" />
          {hero.eyebrow}
        </p>

        <h1 className="hero-title">
          <SplitText as="span" className="hero-line" data-split text={hero.line1} />
          <SplitText
            as="span"
            className="hero-line hero-line-highlight is-solar"
            data-split
            text={hero.line2}
          />
          <SplitText
            as="span"
            className="hero-line hero-line-highlight is-solar"
            data-split
            text={hero.line3}
          />
        </h1>

        <p className="hero-subtitle" data-reveal>
          {hero.subtitle}
        </p>
      </div>

      <div className="hero-footer">
        <span className="mono hero-coords" data-reveal>
          {hero.coords}
        </span>
        <div className="scroll-hint" aria-hidden="true">
          <span className="mono">SCROLL</span>
          <span className="scroll-hint-line" />
        </div>
        <span className="mono hero-element" data-reveal>
          {hero.element}
        </span>
      </div>
    </section>
  );
}

export default Hero;
