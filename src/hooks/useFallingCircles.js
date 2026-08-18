import { useEffect } from 'react';

/**
 * Fondo de círculos con física real (Matter.js): caen por gravedad,
 * chocan entre sí y contra los bordes del contenedor, y se pueden
 * arrastrar con el mouse/dedo. Pensado para secciones tipo "hero" con
 * un color de fondo sólido (ver .now en main.css).
 *
 * Matter.js se carga con `import()` dinámico (no en el bundle principal)
 * y solo cuando la sección está por entrar en pantalla, así no le resta
 * nada al tiempo de carga inicial del sitio.
 *
 * Pausa la simulación fuera de viewport / pestaña oculta, y no arranca
 * nada si el usuario pidió movimiento reducido (los círculos son
 * decorativos, no contenido).
 */
export function useFallingCircles(containerRef, reducedMotion) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container || reducedMotion) return undefined;

    let cancelled = false;
    let cleanupSim = null;

    // No cargues ni un byte de Matter.js hasta que la sección esté cerca
    // del viewport.
    const preloadObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        preloadObserver.disconnect();
        import('matter-js').then((mod) => {
          if (!cancelled) cleanupSim = setupSimulation(mod.default ?? mod, container);
        });
      },
      { rootMargin: '400px 0px' }
    );
    preloadObserver.observe(container);

    return () => {
      cancelled = true;
      preloadObserver.disconnect();
      if (cleanupSim) cleanupSim();
    };
  }, [containerRef, reducedMotion]);
}

/** Arma el engine, el canvas y el loop de render; devuelve una función de cleanup. */
function setupSimulation(Matter, container) {
  const { Engine, Runner, World, Bodies, Mouse, MouseConstraint, Events } = Matter;

  const engine = Engine.create();
  engine.gravity.y = 0.1;

  const canvas = document.createElement('canvas');
  canvas.className = 'now-canvas';
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let width = 0;
  let height = 0;
  let ground = null;
  let leftWall = null;
  let rightWall = null;
  let circles = [];

  const wallOptions = { isStatic: true, restitution: 0.35, friction: 0.2 };

  function buildWalls() {
    if (ground) World.remove(engine.world, [ground, leftWall, rightWall]);
    ground = Bodies.rectangle(width / 2, height + 40, width * 2, 80, wallOptions);
    leftWall = Bodies.rectangle(-40, height / 2, 80, height * 2, wallOptions);
    rightWall = Bodies.rectangle(width + 40, height / 2, 80, height * 2, wallOptions);
    World.add(engine.world, [ground, leftWall, rightWall]);
  }

  function spawnCircles() {
    if (circles.length) World.remove(engine.world, circles);
    const small = width < 640;
    const count = small ? 9 : 15;
    circles = Array.from({ length: count }, () => {
      const r = small ? 14 + Math.random() * 20 : 20 + Math.random() * 48;
      const x = r + Math.random() * (width - r * 2);
      const y = -60 - Math.random() * height;
      return Bodies.circle(x, y, r, {
        restitution: 0.45,
        friction: 0.25,
        frictionAir: 0.01,
      });
    });
    World.add(engine.world, circles);
  }

  function resize() {
    width = container.clientWidth;
    height = container.clientHeight;
    if (width === 0 || height === 0) return;
    const dpr = Math.min(window.devicePixelRatio, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildWalls();
  }

  resize();
  spawnCircles();

  // Arrastrar círculos con el mouse (Matter trae esto resuelto).
  const mouse = Mouse.create(canvas);
  mouse.pixelRatio = Math.min(window.devicePixelRatio, 2);
  const mouseConstraint = MouseConstraint.create(engine, {
    mouse,
    constraint: { stiffness: 0.2, render: { visible: false } },
  });
  World.add(engine.world, mouseConstraint);
  // El drag no debe robarle el scroll a la página en touch.
  mouse.element.removeEventListener('touchmove', mouse.mousemove);
  mouse.element.removeEventListener('touchstart', mouse.mousedown);
  mouse.element.removeEventListener('touchend', mouse.mouseup);

  const inkColor =
    getComputedStyle(document.documentElement).getPropertyValue('--ink').trim() || '#08090a';

  let rafId = null;
  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = inkColor;
    for (const body of circles) {
      ctx.beginPath();
      ctx.arc(body.position.x, body.position.y, body.circleRadius, 0, Math.PI * 2);
      ctx.fill();
    }
    rafId = requestAnimationFrame(draw);
  }

  const runner = Runner.create();
  let running = false;
  function start() {
    if (running) return;
    running = true;
    Runner.run(runner, engine);
    rafId = requestAnimationFrame(draw);
  }
  function stop() {
    running = false;
    Runner.stop(runner);
    if (rafId !== null) cancelAnimationFrame(rafId);
    rafId = null;
  }

  let resizeTimer = null;
  const onResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  };
  window.addEventListener('resize', onResize, { passive: true });

  const visibilityObserver = new IntersectionObserver(
    ([entry]) => (entry.isIntersecting ? start() : stop()),
    { threshold: 0 }
  );
  visibilityObserver.observe(container);

  const onVisibility = () => (document.hidden ? stop() : start());
  document.addEventListener('visibilitychange', onVisibility);

  return () => {
    stop();
    clearTimeout(resizeTimer);
    visibilityObserver.disconnect();
    window.removeEventListener('resize', onResize);
    document.removeEventListener('visibilitychange', onVisibility);
    Events.off(engine);
    World.clear(engine.world, false);
    Engine.clear(engine);
    if (canvas.parentNode === container) container.removeChild(canvas);
  };
}

export default useFallingCircles;
