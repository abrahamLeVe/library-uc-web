import { sql } from "../db";
import { Libros } from "../definitions";

/**
 * Traer todos los años disponibles de los libros
 */
export async function fetchAnios(): Promise<number[]> {
  try {
    const result = await sql<{ anio: number }[]>`
      SELECT DISTINCT anio_publicacion AS anio
      FROM libros
      WHERE anio_publicacion IS NOT NULL
      ORDER BY anio_publicacion DESC
    `;
    return result.map((row) => row.anio);
  } catch (error) {
    console.error("Database Error (fetchAnios):", error);
    throw new Error("Failed to fetch years.");
  }
}

/**
 * Traer libros filtrados por año
 */
export async function fetchLibrosPorAnio(anio: string): Promise<Libros[]> {
  const anioNum = parseInt(anio);

  try {
    const data = isNaN(anioNum)
      ? // 📘 Si no es un número → libros sin año
        await sql<Libros[]>`
            SELECT
              'sin VP' AS vista_previa,
              l.id,
              l.anio_publicacion,
              l.titulo,
              l.descripcion,
              l.isbn,
              l.editorial,
              l.idioma,
              l.paginas,
              l.pdf_url,
              l.examen_pdf_url,
              l.imagen,
              STRING_AGG(DISTINCT a.nombre, ', ') AS autores,
              f.nombre AS facultad,
              c.nombre AS carrera,
              e.nombre AS especialidad
            FROM libros l
            LEFT JOIN libros_autores la ON l.id = la.libro_id
            LEFT JOIN autores a ON la.autor_id = a.id
            LEFT JOIN facultades f ON l.facultad_id = f.id
            LEFT JOIN carreras c ON l.carrera_id = c.id
            LEFT JOIN especialidades e ON l.especialidad_id = e.id
            WHERE l.anio_publicacion IS NULL
            GROUP BY l.id, f.nombre, c.nombre, e.nombre
            ORDER BY l.titulo ASC
          `
      : // 📗 Si es un número → libros de ese año
        await sql<Libros[]>`
            SELECT
              'sin VP' AS vista_previa,
              l.id,
              l.anio_publicacion,
              l.titulo,
              l.descripcion,
              l.isbn,
              l.editorial,
              l.idioma,
              l.paginas,
              l.pdf_url,
              l.examen_pdf_url,
              l.imagen,
              STRING_AGG(DISTINCT a.nombre, ', ') AS autores,
              f.nombre AS facultad,
              c.nombre AS carrera,
              e.nombre AS especialidad
            FROM libros l
            LEFT JOIN libros_autores la ON l.id = la.libro_id
            LEFT JOIN autores a ON la.autor_id = a.id
            LEFT JOIN facultades f ON l.facultad_id = f.id
            LEFT JOIN carreras c ON l.carrera_id = c.id
            LEFT JOIN especialidades e ON l.especialidad_id = e.id
            WHERE l.anio_publicacion = ${anioNum}
            GROUP BY l.id, f.nombre, c.nombre, e.nombre
            ORDER BY l.anio_publicacion DESC, l.titulo ASC
          `;

    return data;
  } catch (error) {
    console.error("Database Error (fetchLibrosPorAnio):", error);
    throw new Error("Failed to fetch books by year.");
  }
}
