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

export default async function SearchTableGlobal({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const libros = await fetchFilteredBooksGlobal(query, currentPage);

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
            <TableHead>PDF</TableHead>
            <TableHead>Examen PDF</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {libros.length === 0 ? (
            <TableNoResults />
          ) : (
            libros.map((libro, i) => (
              <TableRow key={i}>
                {/* Vista previa como imagen */}
                <TableCell>
                  {libro.imagen ? (
                    <img
                      src={libro.imagen}
                      alt={libro.titulo}
                      className="w-16 h-20 object-cover rounded"
                    />
                  ) : (
                    <div className="w-16 h-20 bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                      Sin imagen
                    </div>
                  )}
                </TableCell>

                {/* Año */}
                <TableCell>{libro.anio_publicacion ?? "-"}</TableCell>

                {/* Título */}
                <TableCell>{libro.titulo}</TableCell>

                {/* Autores */}
                <TableCell>{libro.autores ?? "-"}</TableCell>

                {/* Facultad */}
                <TableCell>{libro.facultad ?? "-"}</TableCell>

                {/* Carrera */}
                <TableCell>{libro.carrera ?? "-"}</TableCell>

                {/* Especialidad */}
                <TableCell>{libro.especialidad ?? "-"}</TableCell>

                {/* PDF */}
                <TableCell>
                  {libro.pdf_url ? (
                    <a
                      href={libro.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      PDF
                    </a>
                  ) : (
                    "-"
                  )}
                </TableCell>

                {/* Examen PDF */}
                <TableCell>
                  {libro.examen_pdf_url ? (
                    <a
                      href={libro.examen_pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Examen
                    </a>
                  ) : (
                    "-"
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
