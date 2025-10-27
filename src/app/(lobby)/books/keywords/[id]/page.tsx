import LibrosTable from "@/components/common/libros-table";
import { LibrosTableSkeleton } from "@/components/common/skeleton-entity";
import { fetchLibrosPorPalabraClave } from "@/lib/data/Keywords.data";
import { sql } from "@/lib/db";
import { Libros } from "@/lib/definitions";
import { getPdfUrl } from "@/lib/s3";
import { Suspense } from "react";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const palabraId = Number(id);

  // 1️⃣ Traer el nombre de la palabra clave
  const [palabra] = await sql<{ id: number; nombre: string }[]>`
    SELECT id, nombre FROM palabras_clave WHERE id = ${palabraId}
  `;

  const palabraNombre = palabra?.nombre ?? "Desconocida";

  // 2️⃣ Traer libros asociados
  const libros = await fetchLibrosPorPalabraClave(palabraId);

  // 3️⃣ Firmar la imagen de cada libro
  const librosConImagen = await Promise.all(
    libros.map(async (libro: Libros) => {
      const imagen_url_signed = libro.imagen
        ? await getPdfUrl(libro.imagen, 604800)
        : null;
      return { ...libro, imagen: imagen_url_signed };
    })
  );

  return (
    <>
      <h2 className="text-xl md:text-2xl pb-2">
        {`Libros asociados a la palabra clave "${palabraNombre}"`}
      </h2>
      <Suspense fallback={<LibrosTableSkeleton />}>
        <LibrosTable libros={librosConImagen} />
      </Suspense>
    </>
  );
}
