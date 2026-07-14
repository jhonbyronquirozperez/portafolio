import { useEffect, useRef, useState } from 'react';
import { NuclearSymbol } from './NuclearSymbol';

/**
 * Header inteligente (port de header.php + la lógica de main.js).
 *
 * - Se vuelve sólido (blur) al pasar de 60px de scroll.
 * - Se oculta al bajar y reaparece al subir (pasados 200px).
 * - Menú móvil a pantalla completa con toggle accesible (aria-expanded).
 */
export function Header({ brand, nav }) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastScroll = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      // Actualizaciones con bail-out: setState con el mismo valor no re-renderiza.
      setScrolled((prev) => (prev === y > 60 ? prev : y > 60));
      setHidden((prev) => {
        const next = y > 200 && y > lastScroll.current;
        return prev === next ? prev : next;
      });
      lastScroll.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const headerClass = [
    'site-header',
    scrolled && 'is-scrolled',
    hidden && 'is-hidden',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <header className={headerClass} id="site-header">
      <div className="header-inner">
        <a href="#hero" className="logo" aria-label="Inicio">
          <NuclearSymbol className="logo-mark" />
          <span className="logo-text">{brand.text}</span>
        </a>

        <nav
          className={`main-nav${menuOpen ? ' is-open' : ''}`}
          id="main-nav"
          aria-label="Navegación principal"
        >
          <ul className="nav-list">
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} data-nav onClick={() => setMenuOpen(false)}>
                  <span className="nav-index">{item.index}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          className={`menu-toggle${menuOpen ? ' is-open' : ''}`}
          id="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="main-nav"
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}

export default Header;
