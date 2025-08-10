import postgres from "postgres";
import { Libros } from "../definitions";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function fetchLibrosPorCategoriaHija(categoriaId: number) {
  try {
    return await sql<Libros[]>`
      SELECT 
        'sin VP' AS vista_previa,
        l.anio,
        l.titulo,
        STRING_AGG(DISTINCT a.nombre, ', ') AS autores,
        c.nombre AS categoria_hija,
        STRING_AGG(DISTINCT t.nombre, ', ') AS temas
      FROM libros l
      JOIN categorias c ON l.categoria_id = c.id
      LEFT JOIN libros_autores la ON l.id = la.libro_id
      LEFT JOIN autores a ON la.autor_id = a.id
      LEFT JOIN libros_temas lt ON l.id = lt.libro_id
      LEFT JOIN temas t ON lt.tema_id = t.id
      WHERE c.parent_id IS NOT NULL
        AND c.id = ${categoriaId}
      GROUP BY l.id, c.nombre, l.anio, l.titulo
      ORDER BY l.anio DESC, l.titulo ASC
    `;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch books by child category.");
  }
}
