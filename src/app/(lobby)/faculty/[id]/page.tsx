import LibrosTable from "@/components/common/libros-table";
import { LibrosTableSkeleton } from "@/components/common/skeleton-entity";
import {
  fetchFacultades,
  fetchLibrosPorFacultad,
} from "@/lib/data/faculty.data";
import { Libros } from "@/lib/definitions";
import { getPdfUrl } from "@/lib/s3";
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

  // 📚 Traer libros por facultad
  const libros = await fetchLibrosPorFacultad(Number(id));

  // 🖼️ Generar URL firmada solo para la imagen
  const librosConImagen = await Promise.all(
    libros.map(async (libro: Libros) => {
      const imagen_url_signed = libro.imagen
        ? await getPdfUrl(libro.imagen, 604800) // 7 días de validez
        : null;

      return { ...libro, imagen: imagen_url_signed };
    })
  );

  return (
    <>
      <h2 className="text-xl md:text-2xl pb-2">Libros por facultad</h2>
      <Suspense fallback={<LibrosTableSkeleton />}>
        {/* ✅ Pasamos los libros con imagen firmada */}
        <LibrosTable libros={librosConImagen} />
      </Suspense>
    </>
  );
}
