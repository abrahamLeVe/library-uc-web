import LibrosTable from "@/components/common/libros-table";
import { LibrosTableSkeleton } from "@/components/common/skeleton-entity";
import {
  fetchEspecialidades,
  fetchLibrosPorEspecialidad,
} from "@/lib/data/speciality.data";
import { Libros } from "@/lib/definitions";
import { getPdfUrl } from "@/lib/s3";
import { Suspense } from "react";

export const revalidate = 60;

/**
 * Generar rutas estáticas para cada especialidad
 */
export async function generateStaticParams() {
  const especialidades = await fetchEspecialidades();

  return especialidades.map((especialidad) => ({
    id: especialidad.id.toString(),
  }));
}

/**
 * Página de libros filtrados por especialidad
 */
export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  // 🔹 Traer los libros de la especialidad
  const libros = await fetchLibrosPorEspecialidad(Number(id));

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
      <h1 className="text-xl font-bold mb-4">Libros por subcategoría</h1>
      <Suspense fallback={<LibrosTableSkeleton />}>
        {/* ✅ Pasamos los libros con la URL firmada de la imagen */}
        <LibrosTable libros={librosConImagen} />
      </Suspense>
    </>
  );
}
