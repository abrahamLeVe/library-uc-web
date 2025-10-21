import { KeywordBadgesAdvanced } from "@/components/keywords/keywords-badges";
import { TableSkeleton } from "@/components/common/skeleton-entity";
import { fetchPalabrasClaveFullData } from "@/lib/data/Keywords.data";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Libros por palabras clave",
};

export const revalidate = 60;

export default async function Page() {
  const palabrasClaveData = await fetchPalabrasClaveFullData();

  return (
    <>
      <Suspense fallback={<TableSkeleton col1="Especialidad" />}>
        <KeywordBadgesAdvanced data={palabrasClaveData} />
      </Suspense>
    </>
  );
}
