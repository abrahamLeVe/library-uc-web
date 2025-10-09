import { sql } from "../db";
import { Libros } from "../definitions";

/**
 * Traer todas las facultades
 */
export async function fetchFacultades() {
  try {
    const data = await sql<{ id: number; nombre: string }[]>`
      SELECT id, nombre
      FROM facultades
      ORDER BY nombre ASC
    `;
    return data;
  } catch (error) {
    console.error("Database Error (fetchFacultades):", error);
    throw new Error("Failed to fetch faculties.");
  }
}

/**
 * Traer libros filtrados por facultad
 */
export async function fetchLibrosPorFacultad(facultadId: number) {
  try {
    const data = await sql<Libros[]>`
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
      WHERE l.facultad_id = ${facultadId}
      GROUP BY l.id, f.nombre, c.nombre, e.nombre
      ORDER BY l.anio_publicacion DESC, l.titulo ASC
    `;
    return data;
  } catch (error) {
    console.error("Database Error (fetchLibrosPorFacultad):", error);
    throw new Error("Failed to fetch books by faculty.");
  }
}
