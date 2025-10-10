import LibrosTable from "@/components/common/libros-table";
import { LibrosTableSkeleton } from "@/components/common/skeleton-entity";
import { fetchAutores, fetchLibrosPorAutor } from "@/lib/data/author.data";
import { Libros } from "@/lib/definitions";
import { getPdfUrl } from "@/lib/s3";
import { Suspense } from "react";

export const revalidate = 60;

export async function generateStaticParams() {
  const autores = await fetchAutores();

  return autores.map((autor) => ({
    id: autor.id.toString(),
  }));
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  // 🔹 Traer los libros por autor
  const libros = await fetchLibrosPorAutor(Number(id));

  // 🖼️ Firmar solo la imagen de cada libro
  const librosConImagen = await Promise.all(
    libros.map(async (libro: Libros) => {
      const imagen_url_signed = libro.imagen
        ? await getPdfUrl(libro.imagen, 604800) // 7 días
        : null;

      return { ...libro, imagen: imagen_url_signed };
    })
  );

  return (
    <>
      <h2 className="text-xl md:text-2xl pb-1">Libros por autor</h2>
      <Suspense fallback={<LibrosTableSkeleton />}>
        {/* ✅ Pasamos los libros con URL firmada */}
        <LibrosTable libros={librosConImagen} />
      </Suspense>
    </>
  );
}
