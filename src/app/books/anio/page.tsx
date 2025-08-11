import { TableSkeleton } from "@/components/common/skeleton-entity";
import TableEntity from "@/components/common/table-entity";
import { fetchLibrosPorAnioAll } from "@/lib/data/entity.data";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Libros por fecha de publicación",
};

export const revalidate = 60;

export default async function Page() {
  const aniosData = await fetchLibrosPorAnioAll();

  return (
    <>
      <h2 className="text-xl md:text-2xl pb-1">
        Buscar por Fecha de publicación
      </h2>
      <div className="flex justify-center">
        <Suspense fallback={<TableSkeleton col1="Año" />}>
          <TableEntity titleCol="Año" basePath="/books/anio" data={aniosData} />
        </Suspense>
      </div>
    </>
  );
}
