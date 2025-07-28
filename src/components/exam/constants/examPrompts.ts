// Suggested exam topics/prompts organized by categories
export const EXAM_PROMPTS = {
  dailyLife: {
    title: "Vida Cotidiana",
    icon: "🏠",
    prompts: [
      "Rutinas diarias y hábitos",
      "Actividades en casa",
      "Compras y supermercado",
      "Transporte público",
      "Comunicación con amigos",
      "Tiempo libre y hobbies",
      "Salud y bienestar",
      "Tecnología en el día a día",
    ],
  },
  travel: {
    title: "Viajes y Turismo",
    icon: "✈️",
    prompts: [
      "Planificación de viajes",
      "Reservas de hotel",
      "Explorar una ciudad",
      "Comida local y restaurantes",
      "Transporte en el extranjero",
      "Actividades turísticas",
      "Emergencias durante viajes",
      "Cultura y costumbres locales",
    ],
  },
  work: {
    title: "Trabajo y Profesión",
    icon: "💼",
    prompts: [
      "Entrevistas de trabajo",
      "Presentaciones en la oficina",
      "Reuniones de equipo",
      "Emails profesionales",
      "Proyectos y deadlines",
      "Networking y contactos",
      "Desarrollo profesional",
      "Trabajo remoto y colaboración",
    ],
  },
  education: {
    title: "Educación y Aprendizaje",
    icon: "🎓",
    prompts: [
      "Estudiar en el extranjero",
      "Cursos online y MOOCs",
      "Investigación académica",
      "Presentaciones estudiantiles",
      "Debates en clase",
      "Trabajos en grupo",
      "Exámenes y evaluaciones",
      "Bibliotecas y recursos",
    ],
  },
  social: {
    title: "Social y Relaciones",
    icon: "👥",
    prompts: [
      "Hacer nuevos amigos",
      "Eventos sociales",
      "Redes sociales",
      "Dating y relaciones",
      "Familia y tradiciones",
      "Celebraciones y fiestas",
      "Voluntariado",
      "Clubes y asociaciones",
    ],
  },
  entertainment: {
    title: "Entretenimiento",
    icon: "🎬",
    prompts: [
      "Películas y series",
      "Música y conciertos",
      "Videojuegos",
      "Literatura y libros",
      "Arte y museos",
      "Deportes y fitness",
      "Cocina y recetas",
      "Fotografía y diseño",
    ],
  },
  business: {
    title: "Negocios y Emprendimiento",
    icon: "📈",
    prompts: [
      "Startups y emprendimiento",
      "Marketing digital",
      "Ventas y negociaciones",
      "Finanzas personales",
      "Inversiones",
      "E-commerce",
      "Consultoría",
      "Innovación tecnológica",
    ],
  },
  environment: {
    title: "Medio Ambiente",
    icon: "🌱",
    prompts: [
      "Sostenibilidad",
      "Cambio climático",
      "Energías renovables",
      "Reciclaje y residuos",
      "Conservación de especies",
      "Agricultura orgánica",
      "Transporte ecológico",
      "Vida verde",
    ],
  },
  technology: {
    title: "Tecnología",
    icon: "💻",
    prompts: [
      "Inteligencia artificial",
      "Desarrollo de software",
      "Ciberseguridad",
      "Redes sociales",
      "Dispositivos móviles",
      "Cloud computing",
      "Blockchain y criptomonedas",
      "Realidad virtual",
    ],
  },
  health: {
    title: "Salud y Medicina",
    icon: "🏥",
    prompts: [
      "Visitas al médico",
      "Nutrición y dieta",
      "Ejercicio y fitness",
      "Salud mental",
      "Medicamentos",
      "Emergencias médicas",
      "Prevención de enfermedades",
      "Bienestar integral",
    ],
  },
  culture: {
    title: "Cultura y Sociedad",
    icon: "🎭",
    prompts: [
      "Historia y tradiciones",
      "Arte y literatura",
      "Política y sociedad",
      "Religión y espiritualidad",
      "Festivales culturales",
      "Arquitectura",
      "Filosofía",
      "Antropología",
    ],
  },
  science: {
    title: "Ciencia e Investigación",
    icon: "🔬",
    prompts: [
      "Investigación científica",
      "Descubrimientos",
      "Experimentos",
      "Publicaciones académicas",
      "Conferencias científicas",
      "Laboratorios",
      "Innovación tecnológica",
      "Método científico",
    ],
  },
};

// Flatten all prompts for easier access
export const ALL_EXAM_PROMPTS = Object.values(EXAM_PROMPTS).flatMap(
  (category) =>
    category.prompts.map((prompt) => ({
      value: prompt,
      label: prompt,
      category: category.title,
      icon: category.icon,
    }))
);

// Get prompts by category
export const getPromptsByCategory = (categoryKey: string) => {
  return EXAM_PROMPTS[categoryKey as keyof typeof EXAM_PROMPTS]?.prompts || [];
};

// Get all category keys
export const getPromptCategoryKeys = () => Object.keys(EXAM_PROMPTS);

// Get category info
export const getPromptCategoryInfo = (categoryKey: string) => {
  return EXAM_PROMPTS[categoryKey as keyof typeof EXAM_PROMPTS];
};
