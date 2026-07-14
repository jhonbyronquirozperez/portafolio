import { SplitText } from './SplitText';

/**
 * Sección de contacto / CTA final: WhatsApp (siempre) + email (opcional).
 * Port de template-parts/contact.php.
 */
export function Contact({ contact }) {
  const whatsapp = String(contact.whatsapp).replace(/\D/g, '');

  return (
    <section className="contact section" id="contact" data-snap-section>
      <div className="section-head">
        <span className="section-label mono" data-reveal>
          03 / Contacto
        </span>
      </div>

      <div className="contact-content">
        <h2 className="contact-title">
          <SplitText as="span" className="hero-line" data-split text="HABLEMOS DE" />
          <SplitText
            as="span"
            className="hero-line hero-line-accent"
            data-split
            text="TU PROYECTO"
          />
        </h2>

        <div className="contact-actions" data-reveal>
          <a
            href={`https://wa.me/${whatsapp}`}
            className="btn-primary"
            data-magnetic
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Escribir por WhatsApp</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </a>
          {contact.email && (
            <a href={`mailto:${contact.email}`} className="btn-ghost" data-magnetic>
              {contact.email}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

export default Contact;
