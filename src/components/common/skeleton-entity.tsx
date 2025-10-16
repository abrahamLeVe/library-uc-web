import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface TableSkeletonProps {
  rows?: number;
  col1?: string;
  col2?: string;
  pages?: number;
}

export function TableSkeleton({
  rows = 10,
  col1 = "Nombre",
  col2 = "Libros",
  pages = 3,
}: TableSkeletonProps) {
  return (
    <div className="w-full md:max-w-lg border rounded-md">
      {/* Buscador skeleton */}
      <div className="p-3 border-b">
        <Skeleton className="h-9 w-full" />
      </div>
      <Table className="w-full border-collapse text-sm">
        <TableHeader>
          <TableRow>
            <TableHead className="px-4 py-2 text-left">{col1}</TableHead>
            <TableHead className="px-4 py-2 text-left">{col2}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, i) => (
            <TableRow key={i}>
              {/* Columna Libros (botón pequeño) */}
              <TableCell className="px-4 py-[6.9px]">
                <Skeleton className="h-[39px] w-[39px] rounded-md" />
              </TableCell>

              {/* Columna Nombre (texto largo) */}
              <TableCell className="px-4 py-[6.9px]">
                <Skeleton className="h-[22px] w-[150px]" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Paginación skeleton */}
      <div className="flex justify-center p-3 border-t">
        <Pagination>
          <PaginationContent>
            {Array.from({ length: pages }).map((_, i) => (
              <PaginationItem key={i}>
                <Skeleton className="h-8 w-8 rounded-md" />
              </PaginationItem>
            ))}
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}

export function LibrosTableSkeleton() {
  return (
    <div className="space-y-4">
      {/* Buscador skeleton */}
      <Skeleton className="h-10 w-full" />

      {/* Tabla skeleton */}
      <TableBooksSkeleton />
    </div>
  );
}

export function TableBooksSkeleton() {
  return (
    <>
      {/* Tabla skeleton */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-28">Vista previa</TableHead>
            <TableHead className="w-14">Año</TableHead>
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
                  <Skeleton
                    className={cn(j < 2 ? "w-14" : "w-[100px]", "h-5")}
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
