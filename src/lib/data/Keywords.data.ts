import { sql } from "../db";
import { Entity, PalabraClaveFull } from "../definitions";
import { Libros } from "../definitions";
export async function fetchPalabrasClaveWithCount(): Promise<Entity[]> {
  try {
    const data = await sql<Entity[]>`
      SELECT
        k.id,
        k.nombre,
        COUNT(lk.libro_id) AS total_libros
      FROM palabras_clave k
      LEFT JOIN libros_palabras_clave lk
        ON k.id = lk.palabra_id
      GROUP BY k.id, k.nombre
      ORDER BY total_libros DESC, k.nombre ASC;
    `;
    return data;
  } catch (error) {
    console.error("❌ Error fetching palabras_clave:", error);
    return [];
  }
}

/**
 * Traer todos los libros asociados a una palabra clave específica
 */
export async function fetchLibrosPorPalabraClave(
  palabraId: number
): Promise<Libros[]> {
  try {
    const data = await sql<Libros[]>`
      SELECT
        l.*,
        STRING_AGG(a.nombre, ', ') AS autores,
        f.nombre AS facultad,
        c.nombre AS carrera,
        e.nombre AS especialidad
      FROM libros l
      LEFT JOIN libros_autores la ON l.id = la.libro_id
      LEFT JOIN autores a ON la.autor_id = a.id
      LEFT JOIN facultades f ON l.facultad_id = f.id
      LEFT JOIN carreras c ON l.carrera_id = c.id
      LEFT JOIN especialidades e ON l.especialidad_id = e.id
      LEFT JOIN libros_palabras_clave lk ON l.id = lk.libro_id
      WHERE lk.palabra_id = ${palabraId}
      GROUP BY l.id, f.nombre, c.nombre, e.nombre
      ORDER BY l.anio_publicacion DESC NULLS LAST, l.titulo ASC;
    `;
    return data;
  } catch (error) {
    console.error("❌ Error fetching libros por palabra clave:", error);
    return [];
  }
}

export async function fetchPalabrasClaveFullData(): Promise<
  PalabraClaveFull[]
> {
  try {
    const data = await sql<PalabraClaveFull[]>`
      SELECT
        k.id,
        k.nombre,
        COUNT(DISTINCT l.id) AS total_libros,
        ARRAY_REMOVE(ARRAY_AGG(DISTINCT f.nombre), NULL) AS facultades,
        ARRAY_REMOVE(ARRAY_AGG(DISTINCT c.nombre), NULL) AS carreras,
        ARRAY_REMOVE(ARRAY_AGG(DISTINCT e.nombre), NULL) AS especialidades
      FROM palabras_clave k
      LEFT JOIN libros_palabras_clave lk ON k.id = lk.palabra_id
      LEFT JOIN libros l ON lk.libro_id = l.id
      LEFT JOIN facultades f ON l.facultad_id = f.id
      LEFT JOIN carreras c ON l.carrera_id = c.id
      LEFT JOIN especialidades e ON l.especialidad_id = e.id
      GROUP BY k.id, k.nombre
      ORDER BY k.nombre ASC;
    `;
    return data;
  } catch (error) {
    console.error("❌ Error fetching palabras clave full data:", error);
    return [];
  }
}
