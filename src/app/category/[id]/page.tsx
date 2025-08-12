import LibrosTable from "@/components/common/libros-table";
import { LibrosTableSkeleton } from "@/components/common/skeleton-entity";
import HeaderMain from "@/components/nav-bar/header";
import {
  fetchCategoriasPadreId,
  fetchLibrosPorCategoriaPadre,
} from "@/lib/data/category.data";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Libros por categoría",
};

export const revalidate = 60;

export async function generateStaticParams() {
  const categoriasPadre = await fetchCategoriasPadreId();

  return categoriasPadre.map((categoria) => ({
    id: categoria.id.toString(),
  }));
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const libros = await fetchLibrosPorCategoriaPadre(Number(id));

  return (
    <>
      <HeaderMain id={id} />
      <main className="container mx-auto p-2">
        <h2 className="text-xl md:text-2xl pb-1">Libros por categoría</h2>
        <Suspense fallback={<LibrosTableSkeleton />}>
          <LibrosTable libros={libros} />
        </Suspense>
      </main>
    </>
  );
}
