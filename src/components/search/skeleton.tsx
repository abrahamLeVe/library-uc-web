import { Skeleton } from "../ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

export function SearchTableSkeleton() {
  return (
    <div className="space-y-4">
      {/* Tabla skeleton */}
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
          {Array.from({ length: 8 }).map((_, i) => (
            <TableRow key={i}>
              {Array.from({ length: 6 }).map((_, j) => (
                <TableCell key={j}>
                  <Skeleton className="h-5 w-[100px]" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
