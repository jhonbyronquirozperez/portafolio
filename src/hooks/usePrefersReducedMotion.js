import { useEffect, useState } from 'react';

/**
 * Detecta la preferencia de movimiento reducido del sistema.
 * Se evalúa una sola vez al montar (igual que el tema original): si el
 * usuario la activa a mitad de sesión, basta recargar.
 */
export function usePrefersReducedMotion() {
  const [reduced] = useState(() =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  return reduced;
}

export default usePrefersReducedMotion;
