import LibrosTable from "@/components/common/libros-table";
import { LibrosTableSkeleton } from "@/components/common/skeleton-entity";
import { fetchAutoresId, fetchLibrosPorAutorId } from "@/lib/data/author.data";
import { Suspense } from "react";

export const revalidate = 60;

export async function generateStaticParams() {
  const autores = await fetchAutoresId();

  return autores.map((autor) => ({
    id: autor.id.toString(),
  }));
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const libros = await fetchLibrosPorAutorId(Number(id));

  return (
    <>
      <h2 className="text-xl md:text-2xl pb-1">Libros por author</h2>
      <Suspense fallback={<LibrosTableSkeleton />}>
        <LibrosTable libros={libros} />
      </Suspense>
    </>
  );
}
