/**
 * Contenido del portafolio.
 *
 * Esto reemplaza al Customizer de WordPress: edita los textos, enlaces,
 * skills y proyectos aquí y todo el sitio se actualiza. Es el único
 * archivo que necesitas tocar para personalizar el portafolio.
 */

export const content = {
  // Marca tipográfica del header (si quisieras un logo en imagen, cámbialo
  // en Header.jsx). "Hg" es el símbolo químico del mercurio.
  brand: {
    mark: 'Hg',
    text: 'byroncodes',
  },

  // Navegación principal. Los href apuntan a las anclas de cada sección.
  nav: [
    { index: '01', label: 'Sobre mí', href: '#about' },
    { index: '02', label: 'Proyectos', href: '#projects' },
    { index: '03', label: 'Contacto', href: '#contact' },
  ],

  hero: {
    eyebrow: 'Disponible para proyectos',
    // El título se divide en tres líneas; la tercera lleva el acento solar.
    line1: 'JHON BYRON',
    line2: 'Full-stack ',
    line3: 'Developer',
    subtitle: 'Desarrollador con enfoque IA-first',
    coords: '6.1846° N, 75.5991° W',
    element: 'Hg · 80 · quicksilver',
  },

  // Cinta de skills en movimiento continuo.
  skills: [
    'React',
    'PHP',
    'WordPress',
    'Three.js',
    'GSAP',
    'Node.js',
    'IA-first',
    'Vtex',
    'Laravel',
    'MySQL',
  ],

  about: {
    profileImage: 'https://jhonbyronquiroz.com/wp-content/uploads/2025/07/Fotoperfil.png',
    photoCaption: 'Medellín, Colombia',
    lead: 'Desarrollador full-stack comprometido con entregar soluciones de calidad que mejoren procesos y generen impacto empresarial.',
    body: 'Combino diseño visual impactante con código limpio y funcional para construir productos digitales que destacan.',
    facts: [
      { label: 'Enfoque', value: 'IA-first' },
      { label: 'Stack', value: 'React · PHP · WordPress · Node' },
      { label: 'Base', value: 'Medellín, CO' },
    ],
  },

  // Cada proyecto: title, category, year, image (URL) y link (externo, opcional).
  // Si un proyecto no tiene link, se renderiza como bloque no clicable.
  projects: [
    {
      title: 'E-Commerce Cueros Vélez',
      category: 'Web Development',
      year: '2022',
      image: 'https://jhonbyronquiroz.com/wp-content/uploads/2025/07/velez.png',
      link: 'https://www.velez.com.co/',
    },
    {
      title: 'E-learning Platform',
      category: 'Web Development',
      year: '2023',
      image: 'https://jhonbyronquiroz.com/wp-content/uploads/2025/07/Aulas-amigas.png',
      link: 'https://aulasamigas.com/',
    },
    {
      title: 'Tomi Digital',
      category: 'Full Stack App',
      year: '2023',
      image: 'https://jhonbyronquiroz.com/wp-content/uploads/2025/07/tomi.png',
      link: 'https://tomi.digital/es',
    },
    {
      title: 'Portal Alianza Francesa',
      category: 'Desarrollo Web',
      year: '2025',
      image: 'https://jhonbyronquiroz.com/wp-content/uploads/2025/07/alianza.png',
      link: 'https://medellin.alianzafrancesa.edu.co/',
    },
  ],

  contact: {
    // Solo dígitos. Se usa para el enlace https://wa.me/<numero>.
    whatsapp: '573053662904',
    // Si lo dejas vacío, el botón de email no aparece.
    email: '',
  },

  social: {
    github: 'https://github.com/jhonbyronquirozperez',
    linkedin: '',
  },

  footer: {
    name: 'Jhon Byron Quiroz — byroncodes',
    location: 'Medellín, CO',
    // Zona horaria del reloj en vivo del footer.
    timezone: 'America/Bogota',
    locale: 'es-CO',
  },
};

export default content;
