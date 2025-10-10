import { sql } from "../db";
import { Libros } from "../definitions";

/**
 * Traer todos los libros (para generar static params)
 */
export async function fetchAllLibros(): Promise<Pick<Libros, "id">[]> {
  try {
    const libros = await sql<Pick<Libros, "id">[]>`
      SELECT id
      FROM libros
      ORDER BY id ASC
    `;
    return libros;
  } catch (error) {
    console.error("Database Error (fetchAllLibros):", error);
    throw new Error("Failed to fetch all books.");
  }
}

/**
 * Traer un libro por su ID (detalle)
 */
export async function fetchLibroPorId(id: number): Promise<Libros | null> {
  try {
    const [libro] = await sql<Libros[]>`
      SELECT
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
        l.video_url,
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
      WHERE l.id = ${id}
      GROUP BY l.id, f.nombre, c.nombre, e.nombre
      LIMIT 1
    `;
    return libro || null;
  } catch (error) {
    console.error("Database Error (fetchLibroPorId):", error);
    throw new Error("Failed to fetch book by ID.");
  }
}
