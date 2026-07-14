/**
 * Divide un texto en <span class="char"> por carácter, de forma declarativa.
 *
 * Reemplaza a la función splitChars() del tema original (que mutaba el DOM):
 * aquí los caracteres se renderizan directamente, GSAP solo los anima.
 * Mantiene la accesibilidad: aria-label en el contenedor, aria-hidden en
 * cada carácter, y espacios no separables para no colapsar el layout.
 */
export function SplitText({ as: Tag = 'span', text, className = '', ...rest }) {
  return (
    <Tag className={className} aria-label={text} {...rest}>
      {[...String(text)].map((ch, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <span key={i} className="char" aria-hidden="true">
          {ch === ' ' ? '\u00A0' : ch}
        </span>
      ))}
    </Tag>
  );
}

export default SplitText;
