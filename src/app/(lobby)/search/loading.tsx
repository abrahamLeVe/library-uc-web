import { LibrosTableSkeleton } from "@/components/common/skeleton-entity";

export default function Loading() {
  return (
    <>
      <h2 className="text-xl md:text-2xl pb-1">Todos los libros</h2>
      <LibrosTableSkeleton />
    </>
  );
}
