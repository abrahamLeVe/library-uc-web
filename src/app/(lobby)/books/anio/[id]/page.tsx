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
      <h2 className="text-xl md:text-2xl pb-1">Libros por año</h2>
      <Suspense fallback={<LibrosTableSkeleton />}>
        <LibrosTable libros={libros} />
      </Suspense>
    </>
  );
}
