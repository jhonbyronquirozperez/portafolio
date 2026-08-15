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
    line2: 'Solution AI ',
    line3: 'Engineer ',
    subtitle: 'Desarrollador con enfoque IA-first',
    coords: '6.1846° N, 75.5991° W',
    element: 'Hg · 80 · quicksilver',
  },

  // Cinta de skills en movimiento continuo.
  skills: [
    'React',
    'PHP',
    'Python',
    'APIs',
    'FAST API',
    'Backend',
    'Frontend',
    'IA-first',
    'GitHub',
    'Laravel',
    'MySQL',
    'Docker',
    'ETL',
    'Data pipelines',
    'AWS',
    'LLMs',
    'Chatbots',
    'Automatizaciones',
  
  ],

  about: {
    profileImage: '/images/about/Perfiljhonbyron2.webp',
    photoCaption: 'Medellín, Colombia - Jhon Byron Quiroz',
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
        label: 'Software Engineering',
        icons: ['python', 'fastapi', 'react', 'git', 'docker'],
        items: ['Python', 'APIs / FastAPI', 'Backend', 'Frontend', 'Git', 'Docker','Arquitectura','Integraciones'  ],
      },
      {
        label: 'Data Engineering',
        icons: ['postgresql', 'mysql', 'dbeaver', 'googlecloud'],
        items: ['PostgreSQL', 'ETL/ELT', 'Data pipelines', 'APIs', 'fuentes de datos',  'cloud', 'AWS', 'GCP'],
      },
      {
        label: 'AI Engineering',
        icons: ['langchain', 'anthropic', 'huggingface', 'n8n'],
        items: ['LLMs', 'Chatbots', 'Automatizaciones', 'RAG','Agentes', 'MCPs', 'LangChain', 'HuggingFace', 'Anthropic', 'n8n'],
      },
    ],
  },

  // Cada proyecto: title, category, year, image (URL) y link (externo, opcional).
  // Si un proyecto no tiene link, se renderiza como bloque no clicable.
  projects: [
    {
      title: 'Ingenieria de datos y ETL',
      category: 'Ingenieria de datos',
      year: '2023',
      image: '/images/projects/velezproject.webp',
      link: 'https://www.velez.com.co/',
    },
    {
      title: 'E-learning Platform',
      category: 'Web Development',
      year: '2022',
      image: '/images/projects/aulasproject.webp',
      link: 'https://aulasamigas.com/',
    },
    {
      title: 'Tomi Digital',
      category: 'Full Stack App',
      year: '2020',
      image: '/images/projects/tommiproject.webp',
      link: 'https://tomi.digital/es',
    },
    {
      title: 'Portal Alianza Francesa',
      category: 'Desarrollo Web',
      year: '2021',
      image: '/images/projects/alianzafrancesaproject.webp',
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
