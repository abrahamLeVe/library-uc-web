"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useMemo, useState } from "react";
import { buttonVariants } from "../ui/button";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { ClientPagination } from "./client-pagination";
import { TableNoResults } from "./table-no-results";

interface TableEntityProps {
  titleCol: string;
  basePath: string;
  data: { id: string | number; nombre: string; total_libros: number }[]; // 🔹 id puede ser string o number
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
        <label htmlFor={`search-${titleCol}`} className="sr-only">
          Buscar
        </label>
        <Input
          id={`search-${titleCol}`}
          type="search"
          placeholder="Buscar..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1); // Reset a la primera página al buscar
          }}
        />
      </div>

      <Table className="w-full border-collapse text-sm">
        <TableHeader>
          <TableRow>
            <TableHead className="px-4 py-2 text-left">Libros</TableHead>
            <TableHead className="px-4 py-2 text-left">{titleCol}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.length > 0 ? (
            paginatedData.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="px-4 py-2">
                  <Link
                    href={`${basePath}/${item.id.toString()}`} // 🔹 convertir id a string
                    className={cn(buttonVariants({ variant: "default" }))}
                  >
                    {item.total_libros}
                  </Link>
                </TableCell>
                <TableCell className="px-4 py-2 font-medium truncate">
                  {item.nombre}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableNoResults />
          )}
        </TableBody>
      </Table>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center p-3 border-t">
          <ClientPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
