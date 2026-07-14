import { useEffect, useRef } from 'react';

/**
 * Cursor personalizado (port de main.js).
 *
 * Anillo que persigue al puntero con suavizado + punto sólido instantáneo.
 * Solo se activa en punteros precisos (mouse) y sin movimiento reducido.
 * Crece al pasar sobre enlaces, botones y filas de proyecto.
 */
export function Cursor({ reducedMotion }) {
  const ringRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return undefined;
    if (reducedMotion) return undefined;
    if (!window.matchMedia('(pointer: fine)').matches) return undefined;

    document.body.classList.add('has-custom-cursor');

    const pos = { x: -100, y: -100 };
    const target = { x: -100, y: -100 };

    const onMove = (e) => {
      target.x = e.clientX;
      target.y = e.clientY;
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    let raf;
    const follow = () => {
      pos.x += (target.x - pos.x) * 0.16;
      pos.y += (target.y - pos.y) * 0.16;
      ring.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(follow);
    };
    follow();

    const hoverEls = document.querySelectorAll('a, button, [data-project]');
    const onEnter = () => ring.classList.add('is-hover');
    const onLeave = () => ring.classList.remove('is-hover');
    hoverEls.forEach((el) => {
      el.addEventListener('pointerenter', onEnter);
      el.addEventListener('pointerleave', onLeave);
    });

    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
      hoverEls.forEach((el) => {
        el.removeEventListener('pointerenter', onEnter);
        el.removeEventListener('pointerleave', onLeave);
      });
      document.body.classList.remove('has-custom-cursor');
    };
  }, [reducedMotion]);

  return (
    <>
      <div className="cursor" ref={ringRef} aria-hidden="true" />
      <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
    </>
  );
}

export default Cursor;
