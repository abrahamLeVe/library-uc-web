import { TableBooksSkeleton } from "@/components/common/skeleton-entity";
import Pagination from "@/components/search/pagination";
import Search from "@/components/search/search";

import SearchTable from "@/components/search/table";
import { fetchBooksGlobalPages } from "@/lib/data/search.data";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Todos los libros",
};

export default async function Page(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = await fetchBooksGlobalPages(query);

  return (
    <>
      <h2 className="text-xl md:text-2xl pb-1">Todos los libros</h2>
      <div className="space-y-4">
        <Search placeholder="Buscar libros..." />

        <Suspense key={query + currentPage} fallback={<TableBooksSkeleton />}>
          <SearchTable query={query} currentPage={currentPage} />
        </Suspense>
        <div className="flex w-full justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    </>
  );
}
