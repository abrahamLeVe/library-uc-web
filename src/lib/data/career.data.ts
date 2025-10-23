import { sql } from "../db";
import { Carrera, Libros } from "../definitions";

/**
 * Traer todas las carreras
 */
export async function fetchCarreras(): Promise<Carrera[]> {
  try {
    const data = await sql<Carrera[]>`
      SELECT id, nombre, facultad_id
      FROM carreras
      ORDER BY nombre ASC
    `;
    return data;
  } catch (error) {
    console.error("Database Error (fetchCarreras):", error);
    throw new Error("Failed to fetch careers.");
  }
}

/**
 * Traer libros filtrados por carrera
 */
export async function fetchLibrosPorCarrera(carreraId: number) {
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
      WHERE l.carrera_id = ${carreraId}
      GROUP BY l.id, f.nombre, c.nombre, e.nombre
      ORDER BY l.anio_publicacion DESC, l.titulo ASC
    `;
    return data;
  } catch (error) {
    console.error("Database Error (fetchLibrosPorCarrera):", error);
    throw new Error("Failed to fetch books by career.");
  }
}
