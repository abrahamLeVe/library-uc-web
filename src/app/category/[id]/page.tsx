import LibrosTable from "@/components/common/libros-table";
import { LibrosTableSkeleton } from "@/components/common/skeleton-entity";
import HeaderMain from "@/components/nav-bar/header";
import { fetchLibrosPorCategoriaPadre } from "@/lib/data/category.data";
import { Suspense } from "react";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const libros = await fetchLibrosPorCategoriaPadre(Number(id));

  return (
    <>
      <HeaderMain id={id} />
      <main className="container mx-auto p-2">
        <h1 className="text-xl font-bold mb-4 hi">Libros por categoría</h1>
        <Suspense fallback={<LibrosTableSkeleton />}>
          <LibrosTable libros={libros} />
        </Suspense>
      </main>
    </>
  );
}
