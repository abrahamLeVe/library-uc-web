import postgres from "postgres";
import { Categoria, Libros } from "../definitions";

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

export async function fetchLibrosPorCategoriaPadre(parentCategoriaId: number) {
  try {
    return await sql<Libros[]>`
      SELECT 
        'sin VP' AS vista_previa,
        l.anio,
        l.titulo,
        STRING_AGG(DISTINCT a.nombre, ', ') AS autores,
        c_hijo.nombre AS categoria_hija,
        STRING_AGG(DISTINCT t.nombre, ', ') AS temas
      FROM libros l
      JOIN categorias c_hijo ON l.categoria_id = c_hijo.id
      JOIN categorias c_padre ON c_hijo.parent_id = c_padre.id
      LEFT JOIN libros_autores la ON l.id = la.libro_id
      LEFT JOIN autores a ON la.autor_id = a.id
      LEFT JOIN libros_temas lt ON l.id = lt.libro_id
      LEFT JOIN temas t ON lt.tema_id = t.id
      WHERE c_padre.id = ${parentCategoriaId}
      GROUP BY l.id, c_hijo.nombre, l.anio, l.titulo
      ORDER BY l.anio DESC, l.titulo ASC
    `;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch books by parent category.");
  }
}

export async function fetchCategoriasPadreId(): Promise<
  Pick<Categoria, "id">[]
> {
  try {
    const categorias = await sql<Pick<Categoria, "id">[]>`
      SELECT id
      FROM categorias
      WHERE parent_id IS NULL
    `;

    return categorias;
  } catch (error) {
    console.error("Error al traer categorías padre:", error);
    return [];
  }
}
