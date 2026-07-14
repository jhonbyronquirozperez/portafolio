import { NuclearSymbol } from './NuclearSymbol';

/**
 * Preloader con símbolo de radiación y contador 0–100.
 * GSAP anima el contador y lo desliza hacia arriba; App lo desmonta
 * cuando la animación de entrada termina.
 */
export function Preloader() {
  return (
    <div className="preloader" id="preloader" aria-hidden="true">
      <div className="preloader-inner">
        <NuclearSymbol className="preloader-symbol" />
        <span className="preloader-counter" id="preloader-counter">0</span>
      </div>
    </div>
  );
}

export default Preloader;
