import type { MetadataRoute } from "next";
import { client_url } from "@/lib/urls";
import { fetchAllLibrosForChatbot } from "@/lib/data/book.data";

export const revalidate = 60; // 1 hora

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const libros = await fetchAllLibrosForChatbot();

  const urls = libros.map((libro) => ({
    url: `${client_url}/book/${libro.id}?${encodeURIComponent(
      libro.titulo
    )}?Autores:${encodeURIComponent(
      libro.autores
    )}?Facultad:${encodeURIComponent(
      libro.facultad
    )}?Carrera:${encodeURIComponent(
      libro.carrera
    )}?Especialidad:${encodeURIComponent(libro.especialidad)}`,
  }));

  return [...urls];
}
