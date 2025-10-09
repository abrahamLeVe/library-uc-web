import { sql } from "../db";
import { Libros } from "../definitions";

const ITEMS_PER_PAGE = 8;

/**
 * Búsqueda global de libros con paginación
 */
export async function fetchFilteredBooksGlobal(
  query: string,
  currentPage: number
): Promise<Libros[]> {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const results = await sql<Libros[]>`
      SELECT
        'Sin VP' AS vista_previa,
        l.id,
        l.titulo,
        l.descripcion,
        l.isbn,
        l.anio_publicacion,
        l.editorial,
        l.idioma,
        l.paginas,
        l.pdf_url,
        l.examen_pdf_url,
        l.imagen,
        COALESCE(f.nombre, '-') AS facultad,
        COALESCE(c.nombre, '-') AS carrera,
        COALESCE(e.nombre, '-') AS especialidad,
        COALESCE(STRING_AGG(DISTINCT a.nombre, ', '), 'Sin autores') AS autores
      FROM libros l
      LEFT JOIN facultades f ON l.facultad_id = f.id
      LEFT JOIN carreras c ON l.carrera_id = c.id
      LEFT JOIN especialidades e ON l.especialidad_id = e.id
      LEFT JOIN libros_autores la ON l.id = la.libro_id
      LEFT JOIN autores a ON la.autor_id = a.id
      WHERE
        l.titulo ILIKE ${`%${query}%`} OR
        l.descripcion ILIKE ${`%${query}%`} OR
        l.isbn ILIKE ${`%${query}%`} OR
        f.nombre ILIKE ${`%${query}%`} OR
        c.nombre ILIKE ${`%${query}%`} OR
        e.nombre ILIKE ${`%${query}%`} OR
        a.nombre ILIKE ${`%${query}%`}
      GROUP BY l.id, f.nombre, c.nombre, e.nombre
      ORDER BY l.id ASC
      LIMIT ${ITEMS_PER_PAGE}
      OFFSET ${offset};
    `;

    return results;
  } catch (error) {
    console.error("Database Error (fetchFilteredBooksGlobal):", error);
    throw new Error("Failed to fetch filtered books globally.");
  }
}

/**
 * Contar total de páginas según búsqueda global
 */
export async function fetchBooksGlobalPages(query: string): Promise<number> {
  try {
    const countResult = await sql<{ total: number }[]>`
      SELECT COUNT(DISTINCT l.id) AS total
      FROM libros l
      LEFT JOIN facultades f ON l.facultad_id = f.id
      LEFT JOIN carreras c ON l.carrera_id = c.id
      LEFT JOIN especialidades e ON l.especialidad_id = e.id
      LEFT JOIN libros_autores la ON l.id = la.libro_id
      LEFT JOIN autores a ON la.autor_id = a.id
      WHERE
        l.titulo ILIKE ${`%${query}%`} OR
        l.descripcion ILIKE ${`%${query}%`} OR
        l.isbn ILIKE ${`%${query}%`} OR
        f.nombre ILIKE ${`%${query}%`} OR
        c.nombre ILIKE ${`%${query}%`} OR
        e.nombre ILIKE ${`%${query}%`} OR
        a.nombre ILIKE ${`%${query}%`};
    `;

    const total = Number(countResult[0]?.total || 0);
    return Math.ceil(total / ITEMS_PER_PAGE);
  } catch (error) {
    console.error("Database Error (fetchBooksGlobalPages):", error);
    throw new Error("Failed to count global books pages.");
  }
}
