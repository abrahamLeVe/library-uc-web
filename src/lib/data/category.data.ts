import postgres from "postgres";
import { Categoria } from "../definitions";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function fetchCategoriasPadre() {
  try {
    return await sql<Categoria[]>`
      SELECT 
        c.id,
        c.codigo,
        c.nombre,
        c.created_at
      FROM categorias c
      WHERE c.parent_id IS NULL
      ORDER BY c.nombre ASC
    `;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch parent categories.");
  }
}
