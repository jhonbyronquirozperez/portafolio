const BLADE =
  'M42.96,36.76 L28.40,9.39 A46,46 0 0 1 71.60,9.39 L57.04,36.76 A15,15 0 0 0 42.96,36.76 Z';

/**
 * Símbolo de radiación (trébol nuclear) como marca del sitio.
 * Reemplaza el "Hg" en el header y el preloader.
 */
export function NuclearSymbol({ className }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true" focusable="false">
      <circle cx="50" cy="50" r="15" fill="currentColor" />
      <path d={BLADE} fill="currentColor" />
      <path d={BLADE} fill="currentColor" transform="rotate(120 50 50)" />
      <path d={BLADE} fill="currentColor" transform="rotate(240 50 50)" />
    </svg>
  );
}

export default NuclearSymbol;
