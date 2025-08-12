import { fetchFilteredBooks } from "@/lib/data/search.data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

export default async function SearchTable({
  query,
  currentPage,
}: {
  query: string;
  currentPage: number;
}) {
  const libros = await fetchFilteredBooks(query, currentPage);

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Vista previa</TableHead>
            <TableHead>Año</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Autores</TableHead>
            <TableHead>Sub categoría</TableHead>
            <TableHead>Temas</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {libros.length === 0 ? (
            <TableNoResults />
          ) : (
            libros.map((libro, i) => (
              <TableRow key={i}>
                <TableCell>{libro.vista_previa}</TableCell>
                <TableCell>{libro.anio ?? "-"}</TableCell>
                <TableCell>{libro.titulo}</TableCell>
                <TableCell>{libro.autores ?? "-"}</TableCell>
                <TableCell>{libro.categoria_hija}</TableCell>
                <TableCell>{libro.temas ?? "-"}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function TableNoResults() {
  return (
    <>
      <TableRow>
        <TableCell colSpan={6} className="text-center py-6 text-gray-500">
          <div className="flex flex-col items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-medium">No se encontraron resultados</span>
            <span className="text-sm text-gray-400">
              Intenta ajustar tu búsqueda o filtrar de otra manera.
            </span>
          </div>
        </TableCell>
      </TableRow>
    </>
  );
}
