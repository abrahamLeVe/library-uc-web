import LibrosTable from "@/components/common/libros-table";
import { LibrosTableSkeleton } from "@/components/common/skeleton-entity";
import { fetchLibrosPorCategoriaHija } from "@/lib/data/sub-category.data";
import { Suspense } from "react";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const libros = await fetchLibrosPorCategoriaHija(Number(id));

  return (
    <>
      <h1 className="text-xl font-bold mb-4 hi">Libros por sub categoría</h1>
      <Suspense fallback={<LibrosTableSkeleton />}>
        <LibrosTable libros={libros} />
      </Suspense>
    </>
  );
}
