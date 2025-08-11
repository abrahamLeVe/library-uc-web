import postgres from "postgres";
import { Entity, FetchEntityOptions, LibroPorAnio } from "../definitions";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function fetchEntityConLibrosAll({
  table,
  joinTable,
  joinColumn,
}: FetchEntityOptions): Promise<Entity[]> {
  try {
    const data = await sql<Entity[]>`
      SELECT 
        e.id,
        e.nombre,
        COUNT(le.libro_id) AS total_libros
      FROM ${sql(table)} e
      LEFT JOIN ${sql(joinTable)} le 
        ON e.id = le.${sql(joinColumn)}
      GROUP BY e.id, e.nombre
      ORDER BY total_libros DESC, e.nombre ASC;
    `;

    return data;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error(`❌ Failed to fetch all ${table}.`);
  }
}

export async function fetchLibrosPorAnioAll(): Promise<Entity[]> {
  try {
    const data = await sql<LibroPorAnio[]>`
      SELECT 
        COALESCE(anio, 'Sin año') AS anio,
        COUNT(*) AS total_libros
      FROM libros
      GROUP BY anio
      ORDER BY anio DESC;
    `;

    return data.map((item) => ({
      id: Number(item.anio),
      nombre: item.anio,
      total_libros: item.total_libros,
    }));
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("❌ Failed to fetch all libros por año.");
  }
}

export async function fetchLibrosPorCategoriaAll(): Promise<Entity[]> {
  try {
    const data = await sql<Entity[]>`
      SELECT 
        c.id,
        c.nombre,
        COUNT(l.id) AS total_libros
      FROM categorias c
      JOIN libros l ON l.categoria_id = c.id
      WHERE c.parent_id IS NOT NULL -- Solo categorías que no son padre
      GROUP BY c.id, c.nombre
      HAVING COUNT(l.id) > 0 -- 🔑 solo categorías con libros
      ORDER BY total_libros DESC, c.nombre ASC;
    `;

    return data.map((item) => ({
      id: item.id,
      nombre: item.nombre,
      total_libros: item.total_libros,
    }));
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("❌ Failed to fetch all libros por categoría.");
  }
}
