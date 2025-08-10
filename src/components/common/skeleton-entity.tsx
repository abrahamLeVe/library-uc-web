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
              <TableCell className="px-4 py-2">
                <Skeleton className="h-[22.3px] w-[150px]" />
              </TableCell>
              <TableCell className="px-4 py-2">
                <Skeleton className="h-[22.3px] w-[50px]" />
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
