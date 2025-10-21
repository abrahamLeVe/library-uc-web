import { sql } from "../db";
import { Entity, FetchEntityOptions, LibroPorAnio } from "../definitions";

/**
 * Entidades genéricas con total de libros (facultad, carrera, especialidad, autor)
 */
export async function fetchEntityConLibrosAll({
  table,
  joinTable,
  joinColumn,
}: FetchEntityOptions): Promise<Entity[]> {
  try {
    // Definir la columna que vamos a contar según la tabla
    let countColumn = "id"; // default
    if (table === "autores") countColumn = "libro_id";
    else countColumn = "id"; // para facultades, carreras, especialidades

    const data = await sql<Entity[]>`
      SELECT 
        e.id,
        e.nombre,
        COUNT(le.${sql(countColumn)}) AS total_libros
      FROM ${sql(table)} e
      LEFT JOIN ${sql(joinTable)} le 
        ON e.id = le.${sql(joinColumn)}
      GROUP BY e.id, e.nombre
      ORDER BY total_libros DESC, e.nombre ASC;
    `;

    return data;
  } catch (error) {
    console.error("❌ Database Error (fetchEntityConLibrosAll):", error);
    throw new Error(`Failed to fetch all ${table}.`);
  }
}

/**
 * Libros agrupados por año
 */
export async function fetchLibrosPorAnioAll(): Promise<Entity[]> {
  try {
    const data = await sql<LibroPorAnio[]>`
      SELECT 
        COALESCE(anio_publicacion::text, 'Sin año') AS anio,
        COUNT(*) AS total_libros
      FROM libros
      GROUP BY anio_publicacion
      ORDER BY anio_publicacion DESC NULLS LAST;
    `;

    return data.map((item) => ({
      id: item.anio,
      nombre: item.anio,
      total_libros: item.total_libros,
    }));
  } catch (error) {
    console.error("❌ Database Error (fetchLibrosPorAnioAll):", error);
    throw new Error("Failed to fetch libros por año.");
  }
}
