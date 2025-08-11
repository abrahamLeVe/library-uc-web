import { TableSkeleton } from "@/components/common/skeleton-entity";
import TableEntity from "@/components/common/table-entity";
import { fetchEntityConLibrosAll } from "@/lib/data/entity.data";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Libros por tema",
};

export const revalidate = 60;

export default async function Page() {
  const temasData = await fetchEntityConLibrosAll({
    table: "temas",
    joinTable: "libros_temas",
    joinColumn: "tema_id",
  });

  return (
    <>
      <h2 className="text-xl md:text-2xl pb-1">Buscar por tema</h2>
      <div className="flex justify-center">
        <Suspense fallback={<TableSkeleton col1="Tema" />}>
          <TableEntity
            titleCol="Tema"
            basePath="/books/theme"
            data={temasData}
          />
        </Suspense>
      </div>
    </>
  );
}
