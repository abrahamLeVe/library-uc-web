"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

interface Libro {
  vista_previa: string;
  anio: number | null;
  titulo: string;
  autores: string | null;
  categoria_hija: string;
  temas: string | null;
}

export default function LibrosTable({ libros }: { libros: Libro[] }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const filtered = libros.filter((libro) =>
    `${libro.titulo} ${libro.autores} ${libro.categoria_hija} ${libro.temas}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-4">
      {/* Buscador */}
      <input
        type="text"
        placeholder="Buscar..."
        className="border rounded p-2 w-full"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

      {/* Tabla */}
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
          {paginated.length === 0 ? (
            <TableNoResults />
          ) : (
            paginated.map((libro, i) => (
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

      {/* Paginación */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={() => setPage(i + 1)}
                  isActive={page === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
          </PaginationContent>
        </Pagination>
      )}
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
