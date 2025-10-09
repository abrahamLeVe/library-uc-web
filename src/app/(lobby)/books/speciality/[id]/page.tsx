import LibrosTable from "@/components/common/libros-table";
import { LibrosTableSkeleton } from "@/components/common/skeleton-entity";
import {
  fetchEspecialidades,
  fetchLibrosPorEspecialidad,
} from "@/lib/data/speciality.data";
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

  const libros = await fetchLibrosPorEspecialidad(Number(id));

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Libros por sub categoría</h1>
      <Suspense fallback={<LibrosTableSkeleton />}>
        <LibrosTable libros={libros} />
      </Suspense>
    </>
  );
}
