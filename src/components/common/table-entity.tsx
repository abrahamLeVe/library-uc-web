"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
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
  const [search, setSearch] = useState("");

  // Filtrar datos según búsqueda
  const filteredData = useMemo(() => {
    return data.filter((item) =>
      item.nombre.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, data]);

  // Calcular total de páginas después de filtrar
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  // Obtener datos paginados
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [currentPage, filteredData]);

  return (
    <div className="w-full md:max-w-lg border rounded-md">
      {/* Barra de búsqueda */}
      <div className="p-3 border-b">
        <input
          type="text"
          placeholder="Buscar..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // Reset a la primera página al buscar
          }}
          className="w-full px-3 py-2 border rounded-md text-sm"
        />
      </div>

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
                    <Link
                      href={`${basePath}/${isNaN(item.id) ? "SF" : item.id}`}
                    >
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
      {totalPages > 1 && (
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
      )}
    </div>
  );
}
