import LibrosTable from "@/components/common/libros-table";
import { LibrosTableSkeleton } from "@/components/common/skeleton-entity";
import { fetchCarreras, fetchLibrosPorCarrera } from "@/lib/data/career.data";
import { Libros } from "@/lib/definitions";
import { getPdfUrl } from "@/lib/s3";
import { Suspense } from "react";

export const revalidate = 60;

export async function generateStaticParams() {
  const carreras = await fetchCarreras();

  return carreras.map((carrera) => ({
    id: carrera.id.toString(),
  }));
}

export default async function Page(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ name?: string }>;
}) {
  const { id } = await props.params;
  const { name } = await props.searchParams;

  // 🔹 Traer los libros de la carrera
  const libros = await fetchLibrosPorCarrera(Number(id));

  // 🖼️ Firmar solo la imagen
  const librosConImagen = await Promise.all(
    libros.map(async (libro: Libros) => {
      const imagen_url_signed = libro.imagen
        ? await getPdfUrl(libro.imagen, 604800) // 7 días
        : null;

      return { ...libro, imagen: imagen_url_signed };
    })
  );

  return (
    <>
      <h2 className="text-xl md:text-2xl pb-2">Libros por Carrera {name}</h2>
      <Suspense fallback={<LibrosTableSkeleton />}>
        {/* ✅ Pasamos los libros con imagen firmada */}
        <LibrosTable libros={librosConImagen} />
      </Suspense>
    </>
  );
}
