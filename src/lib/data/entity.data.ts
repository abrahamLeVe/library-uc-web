import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export interface Entity {
  id: number;
  nombre: string;
  total_libros: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

interface FetchEntityOptions {
  table: "autores" | "temas"; // más adelante puedes agregar "categorias"
  joinTable: "libros_autores" | "libros_temas";
  joinColumn: "autor_id" | "tema_id";
}

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

/* ===========================
   LIBROS por AÑO (sin paginación)
   =========================== */
export interface LibroPorAnio {
  anio: string;
  total_libros: number;
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

    // Adaptamos al formato Entity para mantener consistencia
    return data.map((item, index) => ({
      id: index + 1,
      nombre: item.anio,
      total_libros: item.total_libros,
    }));
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("❌ Failed to fetch all libros por año.");
  }
}

/* ===========================
   LIBROS por CATEGORÍA (no padres)
   =========================== */

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

    // Mapeo opcional, por si quieres mantener el formato estándar
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
