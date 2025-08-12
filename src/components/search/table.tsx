import { fetchFilteredBooks } from "@/lib/data/search.data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { TableNoResults } from "../common/table-no-results";

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
