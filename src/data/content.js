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
    'webflow',
    'Python',
    'IA-first',
    'Vtex',
    'Laravel',
    'MySQL',
    'java',
    'Next.js',
    'Tailwind',
    'Figma',
    'Docker',
  ],

  about: {
    profileImage: '/images/about/Perfiljhonbyron2.png',
    photoCaption: 'Medellín, Colombia',
    lead: 'Desarrollador full-stack con IA en el centro del proceso: más velocidad,  la misma obsesión por la calidad.',
    body: 'Chatbots que atienden clientes, automatizaciones que ahorran horas, contenido que se genera solo. Si has pensado "deberíamos estar usando IA", yo soy quien lo aterriza.',
    facts: [
      { label: 'Enfoque', value: 'IA-first' },
      { label: 'Base', value: 'Medellín, CO' },
    ],
    // Tecnologías agrupadas: cada grupo pinta unos logos representativos
    // (slugs de simple-icons) + las pills de texto con todo el detalle.
    techStack: [
      {
        label: 'Frontend',
        icons: ['react', 'nextdotjs', 'threedotjs', 'greensock', 'tailwindcss'],
        items: ['React', 'Next.js', 'Three.js', 'GSAP', 'Tailwind'],
      },
      {
        label: 'Backend',
        icons: ['php', 'laravel', 'python', 'mysql'],
        items: ['PHP', 'Laravel', 'Python', 'Java', 'MySQL'],
      },
      {
        label: 'Plataformas & herramientas',
        icons: ['wordpress', 'webflow', 'figma', 'docker'],
        items: ['WordPress', 'Webflow', 'Vtex', 'Figma', 'Docker'],
      },
    ],
  },

  // Cada proyecto: title, category, year, image (URL) y link (externo, opcional).
  // Si un proyecto no tiene link, se renderiza como bloque no clicable.
  projects: [
    {
      title: 'E-Commerce Cueros Vélez',
      category: 'Web Development',
      year: '2022',
      image: 'public/images/projects/velez.png',
      link: 'https://www.velez.com.co/',
    },
    {
      title: 'E-learning Platform',
      category: 'Web Development',
      year: '2023',
      image: 'public/images/projects/aulas-amigas.png',
      link: 'https://aulasamigas.com/',
    },
    {
      title: 'Tomi Digital',
      category: 'Full Stack App',
      year: '2023',
      image: 'public/images/projects/tomi.png',
      link: 'https://tomi.digital/es',
    },
    {
      title: 'Portal Alianza Francesa',
      category: 'Desarrollo Web',
      year: '2025',
      image: 'public/images/projects/alianza.png',
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
