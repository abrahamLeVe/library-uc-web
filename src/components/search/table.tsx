import Link from "next/link";
import { fetchFilteredBooksGlobal } from "@/lib/data/search.data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { TableNoResults } from "../common/table-no-results";
import { getPdfUrl } from "@/lib/s3";
import { Libros } from "@/lib/definitions";

export default async function SearchTableGlobal({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  // 1️⃣ Obtener libros desde la base de datos
  const libros = await fetchFilteredBooksGlobal(query, currentPage);

  // 2️⃣ Generar solo la URL firmada de la imagen
  const librosConImagen = await Promise.all(
    libros.map(async (libro: Libros) => {
      const imagen_url_signed = libro.imagen
        ? await getPdfUrl(libro.imagen, 604800) // URL válida por 7 días
        : null;

      return { ...libro, imagen: imagen_url_signed };
    })
  );

  // 3️⃣ Renderizar la tabla
  return (
    <div className="space-y-4 overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vista previa</TableHead>
            <TableHead>Año</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Autores</TableHead>
            <TableHead>Facultad</TableHead>
            <TableHead>Carrera</TableHead>
            <TableHead>Especialidad</TableHead>
            <TableHead>Detalles</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {librosConImagen.length === 0 ? (
            <TableNoResults />
          ) : (
            librosConImagen.map((libro: Libros) => (
              <TableRow key={libro.id}>
                {/* 🖼️ Vista previa */}
                <TableCell>
                  {libro.imagen ? (
                    <img
                      src={libro.imagen}
                      alt={libro.titulo}
                      className="w-16 h-20 object-cover rounded bg-gray-200"
                    />
                  ) : (
                    <div className="w-16 h-20 bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                      Sin imagen
                    </div>
                  )}
                </TableCell>

                <TableCell>{libro.anio_publicacion ?? "-"}</TableCell>

                {/* 📘 Enlace al detalle */}
                <TableCell>
                  <Link
                    href={`/book/${libro.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {libro.titulo}
                  </Link>
                </TableCell>

                <TableCell>{libro.autores ?? "-"}</TableCell>
                <TableCell>{libro.facultad ?? "-"}</TableCell>
                <TableCell>{libro.carrera ?? "-"}</TableCell>
                <TableCell>{libro.especialidad ?? "-"}</TableCell>

                {/* 🔗 Ver detalle */}
                <TableCell>
                  <Link
                    href={`/book/${libro.id}`}
                    className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
                  >
                    Ver detalle
                  </Link>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
