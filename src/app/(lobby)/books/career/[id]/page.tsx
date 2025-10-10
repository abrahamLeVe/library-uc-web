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

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

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
      <h1 className="text-xl font-bold mb-4">Libros por Carrera</h1>
      <Suspense fallback={<LibrosTableSkeleton />}>
        {/* ✅ Pasamos los libros con imagen firmada */}
        <LibrosTable libros={librosConImagen} />
      </Suspense>
    </>
  );
}
