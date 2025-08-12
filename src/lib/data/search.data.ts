import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

const ITEMS_PER_PAGE = 6;

export async function fetchFilteredBooks(query: string, currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const libros = await sql`
      SELECT
        libros.id,
        libros.codigo,
        'Sin VP' AS vista_previa, -- valor fijo porque la columna no existe
        COALESCE(libros.anio::text, '-') AS anio,
        libros.titulo,
        COALESCE(STRING_AGG(DISTINCT a.nombre, ', '), 'Sin autores') AS autores,
        c.nombre AS categoria_hija,
        COALESCE(STRING_AGG(DISTINCT t.nombre, ', '), 'Sin temas') AS temas,
        cp.nombre AS categoria_padre
      FROM libros
      JOIN categorias c ON libros.categoria_id = c.id
      LEFT JOIN categorias cp ON c.parent_id = cp.id
      LEFT JOIN libros_autores la ON libros.id = la.libro_id
      LEFT JOIN autores a ON la.autor_id = a.id
      LEFT JOIN libros_temas lt ON libros.id = lt.libro_id
      LEFT JOIN temas t ON lt.tema_id = t.id
      WHERE
        libros.anio::text ILIKE ${`%${query}%`} OR
        libros.titulo ILIKE ${`%${query}%`} OR
        a.nombre ILIKE ${`%${query}%`} OR
        c.nombre ILIKE ${`%${query}%`} OR
        cp.nombre ILIKE ${`%${query}%`} OR
        t.nombre ILIKE ${`%${query}%`}
      GROUP BY
        libros.id, libros.codigo, libros.anio,
        libros.titulo, c.nombre, cp.nombre
      ORDER BY libros.codigo ASC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset};
    `;

    return libros;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch filtered books.");
  }
}

/**
 * Total de páginas según la búsqueda
 */
export async function fetchBooksPages(query: string) {
  try {
    const countResult = await sql`
      SELECT COUNT(DISTINCT libros.id) AS total
      FROM libros
      JOIN categorias c ON libros.categoria_id = c.id
      LEFT JOIN categorias cp ON c.parent_id = cp.id
      LEFT JOIN libros_autores la ON libros.id = la.libro_id
      LEFT JOIN autores a ON la.autor_id = a.id
      LEFT JOIN libros_temas lt ON libros.id = lt.libro_id
      LEFT JOIN temas t ON lt.tema_id = t.id
      WHERE
        libros.anio::text ILIKE ${`%${query}%`} OR
        libros.titulo ILIKE ${`%${query}%`} OR
        a.nombre ILIKE ${`%${query}%`} OR
        c.nombre ILIKE ${`%${query}%`} OR
        cp.nombre ILIKE ${`%${query}%`} OR
        t.nombre ILIKE ${`%${query}%`};
    `;

    const total = Number(countResult[0]?.total || 0);
    return Math.ceil(total / ITEMS_PER_PAGE);
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to count books pages.");
  }
}
