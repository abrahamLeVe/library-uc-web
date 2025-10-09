import { sql } from "../db";
import { Facultad } from "../definitions";

export async function fetchFacultades(): Promise<Facultad[]> {
  try {
    const data = await sql<Facultad[]>`
      SELECT 
        f.id,
        f.nombre,
        COUNT(l.id) AS total_libros
      FROM facultades f
      LEFT JOIN libros l
        ON f.id = l.facultad_id
      GROUP BY f.id, f.nombre
      ORDER BY f.nombre ASC;
    `;
    return data;
  } catch (error) {
    console.error("❌ Error fetching facultades:", error);
    return [];
  }
}
