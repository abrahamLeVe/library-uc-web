import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};

export function getYouTubeEmbedUrl(url: string | null) {
  if (!url) return null;

  // Maneja enlaces tipo watch?v=, live/, shorts/, etc.
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/live\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
  }

  // Si no coincide con ningún patrón, devuelve el original
  return url;
}

const randomMessages = [
  "¡Hola! Bienvenido a la biblioteca de la universidad 📚",
  "¿Buscas un libro, artículo o tesis? Puedo ayudarte a encontrarlo.",
  "Estoy aquí para asistirte con tus búsquedas en la biblioteca.",
  "¿Necesitas ayuda para ubicar un material en el catálogo?",

  "¿Te gustaría conocer nuestras novedades bibliográficas?",
  "Hablemos, ¿qué tipo de material estás buscando hoy?",
  "¿Quieres acceder a recursos digitales o bases de datos académicas?",
  "Estoy listo para ayudarte con información sobre autores o temas específicos.",
  "Tu aprendizaje es importante. ¿Sobre qué tema necesitas información?",
  "Puedo recomendarte libros según tu carrera o área de estudio.",
  "¡Hola! Soy tu asistente de la biblioteca. ¿En qué puedo ayudarte hoy?",
  "¿Buscas información para tu tesis o trabajo académico?",
  "Estoy aquí para ayudarte a aprovechar todos los recursos de la biblioteca.",
  "¿Deseas saber el horario o los servicios disponibles en la biblioteca?",
  "Explícame qué necesitas y te ayudaré a encontrar el material adecuado.",
  "Puedo mostrarte los libros más consultados de tu facultad.",
  "¿Te gustaría aprender a usar el catálogo en línea o la biblioteca virtual?",
  "Hablemos, estoy aquí para apoyarte en tu búsqueda académica.",
  "¿Tienes alguna duda sobre los servicios de la biblioteca de la universidad?",
];

export function getRandomMessage() {
  const randomIndex = Math.floor(Math.random() * randomMessages.length);
  return randomMessages[randomIndex];
}
