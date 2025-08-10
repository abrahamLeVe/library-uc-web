import { TableSkeleton } from "@/components/common/skeleton-entity";
import TableEntity from "@/components/common/table-entity";
import HeaderMain from "@/components/nav-bar/header";
import {
  fetchEntityConLibrosAll,
  fetchLibrosPorAnioAll,
  fetchLibrosPorCategoriaAll,
} from "@/lib/data/entity.data";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Estadísticas de Libros",
};

export default async function Home() {
  const autoresData = await fetchEntityConLibrosAll({
    table: "autores",
    joinTable: "libros_autores",
    joinColumn: "autor_id",
  });

  const temasData = await fetchEntityConLibrosAll({
    table: "temas",
    joinTable: "libros_temas",
    joinColumn: "tema_id",
  });

  const aniosData = await fetchLibrosPorAnioAll();

  const categoriesData = await fetchLibrosPorCategoriaAll();

  return (
    <div className="min-h-screen">
      <HeaderMain />
      <main className="container mx-auto p-2">
        <div className="grid-cols-4">
          <h2 className="text-xl md:text-2xl pb-1">Descubrir</h2>
          <div
            className="grid gap-4 
                 grid-cols-1 
                 sm:grid-cols-2 
                 lg:grid-cols-3 
                 xl:grid-cols-4"
          >
            <Suspense fallback={<TableSkeleton col1="Autor" />}>
              <TableEntity
                titleCol="Autor"
                basePath="/author"
                data={autoresData}
              />
            </Suspense>

            <Suspense fallback={<TableSkeleton col1="Tema" />}>
              <TableEntity titleCol="Tema" basePath="/tema" data={temasData} />
            </Suspense>

            <Suspense fallback={<TableSkeleton col1="Año" />}>
              <TableEntity titleCol="Año" basePath="/anio" data={aniosData} />
            </Suspense>

            <Suspense fallback={<TableSkeleton col1="Categoría" />}>
              <TableEntity
                titleCol="Categoría"
                basePath="/category"
                data={categoriesData}
              />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}
