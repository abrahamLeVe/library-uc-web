"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useMemo } from "react";
import { Input } from "../ui/input";
import { ClientPagination } from "./client-pagination";
import { TableNoResults } from "./table-no-results";
import { Libros } from "@/lib/definitions";
import Link from "next/link";

interface LibrosTableProps {
  libros: Libros[];
}

export default function LibrosTable({ libros }: LibrosTableProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  const filtered = useMemo(
    () =>
      libros.filter((libro) =>
        `${libro.titulo} ${libro.autores ?? ""} ${libro.facultad ?? ""} ${
          libro.carrera ?? ""
        } ${libro.especialidad ?? ""}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [search, libros]
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = useMemo(
    () => filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE),
    [page, filtered]
  );

  return (
    <div className="space-y-4 overflow-auto">
      {/* Buscador */}
      <label htmlFor="search-books" className="sr-only">
        Buscar
      </label>
      <Input
        id="search-books"
        type="search"
        placeholder="Buscar..."
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
            <TableHead>Facultad</TableHead>
            <TableHead>Carrera</TableHead>
            <TableHead>Especialidad</TableHead>
            <TableHead>Detalles</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.length === 0 ? (
            <TableNoResults />
          ) : (
            paginated.map((libro) => (
              <TableRow key={libro.id}>
                {/* Vista previa */}
                <TableCell>
                  {libro.imagen ? (
                    <img
                      src={libro.imagen}
                      alt={libro.titulo}
                      className="w-16 h-20 object-cover rounded bg-gray-200"
                    />
                  ) : (
                    <div className="w-16 h-20 bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                      Sin imagen
                    </div>
                  )}
                </TableCell>

                {/* Año */}
                <TableCell>{libro.anio_publicacion ?? "-"}</TableCell>

                {/* Título (link a detalle) */}
                <TableCell>
                  <Link
                    href={`/book/${libro.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {libro.titulo}
                  </Link>
                </TableCell>

                {/* Autores */}
                <TableCell>{libro.autores ?? "-"}</TableCell>

                {/* Facultad */}
                <TableCell>{libro.facultad ?? "-"}</TableCell>

                {/* Carrera */}
                <TableCell>{libro.carrera ?? "-"}</TableCell>

                {/* Especialidad */}
                <TableCell>{libro.especialidad ?? "-"}</TableCell>

                {/* Botón de detalle */}
                <TableCell>
                  <Link
                    href={`/book/${libro.id}`}
                    className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm"
                  >
                    Ver detalle
                  </Link>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Paginación */}
      {totalPages > 1 && (
        <ClientPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
