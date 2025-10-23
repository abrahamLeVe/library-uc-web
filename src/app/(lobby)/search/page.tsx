import { TableBooksSkeleton } from "@/components/common/skeleton-entity";
import Pagination from "@/components/search/pagination";
import Search from "@/components/search/search";

import SearchTable from "@/components/search/table";
import { fetchBooksGlobalPages } from "@/lib/data/search.data";
import { FilterParams } from "@/lib/definitions";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Todos los libros",
};

export default async function Page(props: {
  searchParams?: Promise<FilterParams>;
}) {
  const searchParams = await props.searchParams;

  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  // ✅ AHORA PASAMOS LOS NUEVOS FILTROS TAMBIÉN A LA PAGINACIÓN
  const totalPages = await fetchBooksGlobalPages({
    query,
    facultadId: Number(searchParams?.facultadId) || null,
    carreraId: Number(searchParams?.carreraId) || null,
    especialidadId: Number(searchParams?.especialidadId) || null,
    yearMin: Number(searchParams?.yearMin) || null,
    yearMax: Number(searchParams?.yearMax) || null,
  });

  return (
    <>
      <h2 className="text-xl md:text-2xl pb-1">Todos los libros</h2>
      {/* <Search placeholder="Buscar libros..." /> */}

      <Suspense key={query + currentPage} fallback={<TableBooksSkeleton />}>
        <SearchTable
          query={query}
          currentPage={currentPage}
          facultadId={Number(searchParams?.facultadId) || null}
          carreraId={Number(searchParams?.carreraId) || null}
          especialidadId={Number(searchParams?.especialidadId) || null}
          yearMin={Number(searchParams?.yearMin) || null}
          yearMax={Number(searchParams?.yearMax) || null}
          sortBy={searchParams?.sortBy || "az"}
        />
      </Suspense>

      <div className="flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </>
  );
}
