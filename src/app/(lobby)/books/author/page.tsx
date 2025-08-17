import { TableSkeleton } from "@/components/common/skeleton-entity";
import TableEntity from "@/components/common/table-entity";
import { fetchEntityConLibrosAll } from "@/lib/data/entity.data";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Libros por autor",
};

export const revalidate = 60;

export default async function Page() {
  const autoresData = await fetchEntityConLibrosAll({
    table: "autores",
    joinTable: "libros_autores",
    joinColumn: "autor_id",
  });

  return (
    <>
      <h2 className="text-xl md:text-2xl pb-1">Buscar por autor</h2>
      <div className="flex justify-center">
        <Suspense fallback={<TableSkeleton col1="Autor" />}>
          <TableEntity
            titleCol="Autor"
            basePath="/books/author"
            data={autoresData}
          />
        </Suspense>
      </div>
    </>
  );
}
