import { TableSkeleton } from "@/components/common/skeleton-entity";
import TableEntity from "@/components/common/table-entity";
import { fetchLibrosPorCategoriaAll } from "@/lib/data/entity.data";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Libros por sub categoría",
};

export const revalidate = 60;

export default async function Page() {
  const categoriesData = await fetchLibrosPorCategoriaAll();

  return (
    <>
      <h2 className="text-xl md:text-2xl pb-1">Buscar por sub categoría</h2>
      <div className="flex justify-center">
        <Suspense fallback={<TableSkeleton col1="Sub categoría" />}>
          <TableEntity
            titleCol="Sub categoría"
            basePath="/books/sub-category"
            data={categoriesData}
          />
        </Suspense>
      </div>
    </>
  );
}
