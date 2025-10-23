import LibrosTable from "@/components/common/libros-table";
import { LibrosTableSkeleton } from "@/components/common/skeleton-entity";
import { fetchAnios, fetchLibrosPorAnio } from "@/lib/data/anio.data";
import { Libros } from "@/lib/definitions";
import { getPdfUrl } from "@/lib/s3";
import { Suspense } from "react";

export const revalidate = 60;

export async function generateStaticParams() {
  const anios = await fetchAnios();

  return anios.map((anio) => ({
    id: anio.toString(),
  }));
}

export default async function Page(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ name?: string }>;
}) {
  const { id } = await props.params;
  const { name } = await props.searchParams;

  // 🔹 Obtener libros por año
  const libros = await fetchLibrosPorAnio(id);

  // 🖼️ Firmar solo la imagen (válida por 7 días)
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
      <h2 className="text-xl md:text-2xl pb-2 ">Libros por año {name}</h2>
      <Suspense fallback={<LibrosTableSkeleton />}>
        {/* ✅ Pasamos los libros con URL firmada */}
        <LibrosTable libros={librosConImagen} />
      </Suspense>
    </>
  );
}
