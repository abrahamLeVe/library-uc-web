import LibrosTable from "@/components/common/libros-table";
import { LibrosTableSkeleton } from "@/components/common/skeleton-entity";
import { fetchCarreras, fetchLibrosPorCarrera } from "@/lib/data/career.data";
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

  const libros = await fetchLibrosPorCarrera(Number(id));

  return (
    <>
      <h1 className="text-xl font-bold mb-4">Libros por Carrera</h1>
      <Suspense fallback={<LibrosTableSkeleton />}>
        <LibrosTable libros={libros} />
      </Suspense>
    </>
  );
}
