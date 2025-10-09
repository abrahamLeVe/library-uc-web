import LibrosTable from "@/components/common/libros-table";
import { LibrosTableSkeleton } from "@/components/common/skeleton-entity";
import {
  fetchFacultades,
  fetchLibrosPorFacultad,
} from "@/lib/data/faculty.data";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Libros por facultad",
};

export const revalidate = 60;

export async function generateStaticParams() {
  const facultades = await fetchFacultades();

  return facultades.map((facultad) => ({
    id: facultad.id.toString(),
  }));
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const libros = await fetchLibrosPorFacultad(Number(id));

  return (
    <>
      <h2 className="text-xl md:text-2xl pb-1">Libros por facultad</h2>
      <Suspense fallback={<LibrosTableSkeleton />}>
        <LibrosTable libros={libros} />
      </Suspense>
    </>
  );
}
