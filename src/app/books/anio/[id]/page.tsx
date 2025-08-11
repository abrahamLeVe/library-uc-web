import LibrosTable from "@/components/common/libros-table";
import { LibrosTableSkeleton } from "@/components/common/skeleton-entity";
import { fetchAnios, fetchLibrosPorAnio } from "@/lib/data/anio.data";
import { Suspense } from "react";

export const revalidate = 60;

export async function generateStaticParams() {
  const anios = await fetchAnios();

  return anios.map((anio) => ({
    id: anio.toString(),
  }));
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const libros = await fetchLibrosPorAnio(id);

  return (
    <>
      <h1 className="text-xl font-bold mb-4 hi">Libros por año</h1>
      <Suspense fallback={<LibrosTableSkeleton />}>
        <LibrosTable libros={libros} />
      </Suspense>
    </>
  );
}
