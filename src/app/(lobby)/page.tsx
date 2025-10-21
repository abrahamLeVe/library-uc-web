import { KeywordBadgesAdvanced } from "@/components/common/keywords-badges";
import { TableSkeleton } from "@/components/common/skeleton-entity";
import TableEntity from "@/components/common/table-entity";
import {
  fetchEntityConLibrosAll,
  fetchLibrosPorAnioAll,
} from "@/lib/data/entity.data";
import { fetchPalabrasClaveFullData } from "@/lib/data/Keywords.data";

import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Estadísticas Académicas",
};

export const revalidate = 60;

export default async function StatisticsPage() {
  const [carrerasData, especialidadesData, autoresData, aniosData] =
    await Promise.all([
      fetchEntityConLibrosAll({
        table: "carreras",
        joinTable: "libros",
        joinColumn: "carrera_id",
      }),
      fetchEntityConLibrosAll({
        table: "especialidades",
        joinTable: "libros",
        joinColumn: "especialidad_id",
      }),
      fetchEntityConLibrosAll({
        table: "autores",
        joinTable: "libros_autores",
        joinColumn: "autor_id",
      }),
      fetchLibrosPorAnioAll(),
    ]);

  const palabrasClaveData = await fetchPalabrasClaveFullData();

  return (
    <>
      <h2 className="text-xl md:text-2xl pb-4">Estadísticas de Biblioteca</h2>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Suspense fallback={<TableSkeleton col2="Carrera" />}>
          <TableEntity
            titleCol="Carrera"
            basePath="/books/career"
            data={carrerasData}
          />
        </Suspense>

        <Suspense fallback={<TableSkeleton col2="Especialidad" />}>
          <TableEntity
            titleCol="Especialidad"
            basePath="/books/speciality"
            data={especialidadesData}
          />
        </Suspense>

        <Suspense fallback={<TableSkeleton col2="Autor" />}>
          <TableEntity
            titleCol="Autor"
            basePath="/books/author"
            data={autoresData}
          />
        </Suspense>

        <Suspense fallback={<TableSkeleton col2="Año" />}>
          <TableEntity titleCol="Año" basePath="/books/anio" data={aniosData} />
        </Suspense>
      </div>

      <KeywordBadgesAdvanced data={palabrasClaveData} />
    </>
  );
}
