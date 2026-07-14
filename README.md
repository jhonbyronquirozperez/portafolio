# Mercury Portfolio — React

Portafolio "Quicksilver" reconstruido en **React + Vite**, portado desde el
tema de WordPress homónimo. Mantiene todo lo que hacía especial al original:

- **Blob de metal líquido en Three.js** — icosaedro deformado por ruido
  simplex en el vertex shader (GPU) con matcap cromado generado en canvas
  (sin texturas externas que descargar), partículas, parallax con el mouse
  y reacción al scroll.
- **Animaciones GSAP + ScrollTrigger** — preloader con contador, revelado
  del título por caracteres, reveals al hacer scroll, botones magnéticos y
  preview de proyecto que sigue al cursor.
- **Detalles de oficio** — cursor personalizado, header inteligente que se
  oculta al bajar, marquee de skills, reloj local en vivo y soporte de
  `prefers-reduced-motion`.

A diferencia del tema de WordPress, aquí no hay PHP ni base de datos: es un
sitio estático que compila a HTML/CSS/JS y se aloja gratis.

## Requisitos

- **Node.js 18 o superior** (recomendado 20+).

## Arranque

```bash
npm install      # instala dependencias
npm run dev      # servidor de desarrollo en http://localhost:5173
npm run build    # genera la versión de producción en /dist
npm run preview  # sirve /dist localmente para revisar el build
```

## Personalización

**Todo el contenido vive en un solo archivo: `src/data/content.js`.**
Esto reemplaza al Customizer de WordPress. Ahí editas:

- Marca del header (`brand`) y enlaces de navegación (`nav`).
- Textos del hero (`hero`): las tres líneas del título, subtítulo, etc.
- Skills de la cinta (`skills`).
- Sección "Sobre mí" (`about`): foto, textos y los datos en lista.
- Proyectos (`projects`): título, categoría, año, imagen y enlace externo.
  Si un proyecto no tiene `link`, se muestra sin ser clicable.
- Contacto (`contact`): número de WhatsApp (solo dígitos) y email opcional.
- Redes (`social`) y datos del footer (`footer`), incluida la zona horaria
  del reloj en vivo.

No necesitas tocar ningún componente para cambiar el contenido.

### Cambiar la paleta o tipografía

El sistema de diseño está en `src/styles/main.css`, arriba del todo, como
variables CSS (`--ink`, `--silver`, `--solar`, las fuentes…). Las fuentes se
cargan desde Google Fonts en `index.html`.

## Estructura

```
src/
├── main.jsx                  # Punto de entrada
├── App.jsx                   # Composición de secciones (≈ front-page.php)
├── data/content.js           # 👈 TODO el contenido editable
├── styles/main.css           # Sistema de diseño "Quicksilver"
├── hooks/
│   ├── usePrefersReducedMotion.js
│   └── useMercuryAnimations.js   # Orquestación GSAP (preloader, reveals…)
└── components/
    ├── MercuryBlob.jsx       # Escena Three.js (shader + matcap procedural)
    ├── Hero.jsx · SkillsMarquee.jsx · About.jsx · Projects.jsx · Contact.jsx
    ├── Header.jsx · Footer.jsx
    ├── Cursor.jsx · Preloader.jsx
    └── SplitText.jsx         # Divide texto en <span class="char">
```

## Despliegue (gratis)

Compila a estático, así que cualquier host de sitios estáticos sirve. La
opción recomendada es **Cloudflare Pages** por su ancho de banda ilimitado
en el plan gratuito (importa porque la escena 3D pesa).

**Cloudflare Pages:**

1. Sube este proyecto a un repositorio de GitHub.
2. En el panel de Cloudflare: *Workers & Pages → Create → Pages → Connect to
   Git* y elige el repo.
3. Configuración de build:
   - **Framework preset:** Vite
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Deploy. Cada `git push` redepliega solo.

El mismo `dist/` funciona igual en Netlify, Vercel o GitHub Pages.

## Notas técnicas

- El bundle ronda los ~216 KB gzip, casi todo Three.js + GSAP. Si quisieras
  recortar la carga inicial, puedes hacer code-splitting del `MercuryBlob`
  con `React.lazy` + `Suspense` para que Three.js se cargue aparte.
- `prefers-reduced-motion` desactiva preloader, animaciones, cursor y el
  loop de render (queda un frame estático del blob).
- La escena 3D pausa su render cuando la pestaña está oculta o el hero sale
  del viewport, y limita el `pixelRatio` a 2.
- No se incluyeron las plantillas de WordPress para página de proyecto
  individual ni 404, porque en este portafolio los proyectos enlazan a
  sitios externos. Si más adelante quieres páginas de caso de estudio
  internas, se añaden con un router (p. ej. React Router).
```
