import { useEffect, useState } from 'react';

/**
 * Footer con enlaces sociales y reloj local en vivo (port de footer.php
 * + el reloj de main.js). El reloj refleja la zona horaria configurada
 * en content.footer.timezone.
 */
export function Footer({ social, footer }) {
  const [time, setTime] = useState('--:--');

  useEffect(() => {
    const tick = () => {
      setTime(
        new Date().toLocaleTimeString(footer.locale || 'es-CO', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: footer.timezone,
        })
      );
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, [footer.locale, footer.timezone]);

  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <p className="footer-copy">
          © {year} {footer.name}
        </p>
        <ul className="footer-links">
          {social.github && (
            <li>
              <a
                href={social.github}
                target="_blank"
                rel="noopener noreferrer"
                data-magnetic
              >
                GitHub
              </a>
            </li>
          )}
          {social.linkedin && (
            <li>
              <a
                href={social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                data-magnetic
              >
                LinkedIn
              </a>
            </li>
          )}
        </ul>
        <p className="footer-meta mono">
          {footer.location} — <span>{time}</span>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
