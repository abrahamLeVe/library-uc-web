import LibrosTable from "@/components/common/libros-table";
import { LibrosTableSkeleton } from "@/components/common/skeleton-entity";
import { fetchLibrosPorTemaId } from "@/lib/data/theme.data";
import { Suspense } from "react";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const libros = await fetchLibrosPorTemaId(Number(id));

  return (
    <>
      <h1 className="text-xl font-bold mb-4 hi">Libros por Tema</h1>
      <Suspense fallback={<LibrosTableSkeleton />}>
        <LibrosTable libros={libros} />
      </Suspense>
    </>
  );
}
