"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Badge } from "../ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "../ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

interface TableEntityProps {
  titleCol: string;
  basePath: string;
  data: { id: number; nombre: string; total_libros: number }[];
}

export default function TableEntity({
  titleCol,
  basePath,
  data,
}: TableEntityProps) {
  const ITEMS_PER_PAGE = 10;

  const [currentPage, setCurrentPage] = useState(1);

  // Calcular total de páginas
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  // Obtener datos paginados
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return data.slice(start, start + ITEMS_PER_PAGE);
  }, [currentPage, data]);

  return (
    <div className="w-full md:max-w-lg border rounded-md">
      <Table className="w-full border-collapse text-sm">
        <TableHeader>
          <TableRow>
            <TableHead className="px-4 py-2 text-left">{titleCol}</TableHead>
            <TableHead className="px-4 py-2 text-left">Libros</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.length > 0 ? (
            paginatedData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="px-4 py-2 font-medium truncate">
                  {item.nombre}
                </TableCell>
                <TableCell className="px-4 py-2">
                  <Badge asChild>
                    <Link href={`${basePath}/${item.id}`}>
                      {item.total_libros}
                    </Link>
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={2} className="text-center py-4">
                No hay registros
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Paginación */}
      <div className="flex justify-center p-3 border-t">
        <Pagination>
          <PaginationContent>
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(i + 1);
                  }}
                  isActive={currentPage === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
