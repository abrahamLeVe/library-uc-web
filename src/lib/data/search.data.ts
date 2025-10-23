import { sql } from "../db";
import { FilterParams, Libros } from "../definitions";

const ITEMS_PER_PAGE = 8;

export async function fetchFilteredBooksGlobal({
  query = "",
  currentPage = 1,
  sortBy = "az",
  facultadId = null,
  carreraId = null,
  especialidadId = null,
  yearMin = null,
  yearMax = null,
}: FilterParams): Promise<Libros[]> {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  let whereClauses = sql``;

  // 🔍 Búsqueda por texto
  if (query) {
    whereClauses = sql`${whereClauses} AND (
      l.titulo ILIKE ${`%${query}%`} OR
      l.descripcion ILIKE ${`%${query}%`} OR
      l.isbn ILIKE ${`%${query}%`} OR
      f.nombre ILIKE ${`%${query}%`} OR
      c.nombre ILIKE ${`%${query}%`} OR
      e.nombre ILIKE ${`%${query}%`} OR
      a.nombre ILIKE ${`%${query}%`}
    )`;
  }

  // 🏫 Filtros exactos
  if (facultadId)
    whereClauses = sql`${whereClauses} AND l.facultad_id = ${facultadId}`;
  if (carreraId)
    whereClauses = sql`${whereClauses} AND l.carrera_id = ${carreraId}`;
  if (especialidadId)
    whereClauses = sql`${whereClauses} AND l.especialidad_id = ${especialidadId}`;

  // 📅 Rango de años
  if (yearMin)
    whereClauses = sql`${whereClauses} AND l.anio_publicacion >= ${yearMin}`;
  if (yearMax)
    whereClauses = sql`${whereClauses} AND l.anio_publicacion <= ${yearMax}`;

  // 🔤 Orden
  let orderClause = sql`ORDER BY l.id ASC`;
  if (sortBy === "az") orderClause = sql`ORDER BY l.titulo ASC`;
  if (sortBy === "za") orderClause = sql`ORDER BY l.titulo DESC`;
  if (sortBy === "popular") orderClause = sql`ORDER BY l.created_at DESC`;

  try {
    const results = await sql<Libros[]>`
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
      WHERE 1=1
      ${whereClauses}
      GROUP BY l.id, f.nombre, c.nombre, e.nombre
      ${orderClause}
      LIMIT ${ITEMS_PER_PAGE}
      OFFSET ${offset};
    `;

    return results;
  } catch (error) {
    console.error("Database Error (fetchFilteredBooksGlobal):", error);
    throw new Error("Failed to fetch filtered books globally.");
  }
}

export async function fetchBooksGlobalPages({
  query = "",
  facultadId = null,
  carreraId = null,
  especialidadId = null,
  yearMin = null,
  yearMax = null,
}: FilterParams): Promise<number> {
  let whereClauses = sql``;

  if (query) {
    whereClauses = sql`${whereClauses} AND (
      l.titulo ILIKE ${`%${query}%`} OR
      l.descripcion ILIKE ${`%${query}%`} OR
      l.isbn ILIKE ${`%${query}%`} OR
      f.nombre ILIKE ${`%${query}%`} OR
      c.nombre ILIKE ${`%${query}%`} OR
      e.nombre ILIKE ${`%${query}%`} OR
      a.nombre ILIKE ${`%${query}%`}
    )`;
  }

  if (facultadId)
    whereClauses = sql`${whereClauses} AND l.facultad_id = ${facultadId}`;
  if (carreraId)
    whereClauses = sql`${whereClauses} AND l.carrera_id = ${carreraId}`;
  if (especialidadId)
    whereClauses = sql`${whereClauses} AND l.especialidad_id = ${especialidadId}`;
  if (yearMin)
    whereClauses = sql`${whereClauses} AND l.anio_publicacion >= ${yearMin}`;
  if (yearMax)
    whereClauses = sql`${whereClauses} AND l.anio_publicacion <= ${yearMax}`;

  try {
    const countResult = await sql<{ total: number }[]>`
      SELECT COUNT(DISTINCT l.id) AS total
      FROM libros l
      LEFT JOIN facultades f ON l.facultad_id = f.id
      LEFT JOIN carreras c ON l.carrera_id = c.id
      LEFT JOIN especialidades e ON l.especialidad_id = e.id
      LEFT JOIN libros_autores la ON l.id = la.libro_id
      LEFT JOIN autores a ON la.autor_id = a.id
      WHERE 1=1
      ${whereClauses};
    `;

    const total = Number(countResult[0]?.total || 0);
    return Math.ceil(total / ITEMS_PER_PAGE);
  } catch (error) {
    console.error("Database Error (fetchBooksGlobalPages):", error);
    throw new Error("Failed to count global books pages.");
  }
}
