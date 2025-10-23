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
import { Card } from "../ui/card";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";

interface LibrosTableProps {
  libros: Libros[];
  showFilters?: boolean;
}
type SortByOption = "az" | "za" | "anioDesc" | "anioAsc";

export default function LibrosTable({
  libros,
  showFilters = true,
}: LibrosTableProps) {
  const ITEMS_PER_PAGE = 8;

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [sortBy, setSortBy] = useState<SortByOption>("anioDesc");
  const [faculty, setFaculty] = useState<string | null>(null);
  const [career, setCareer] = useState<string | null>(null);
  const [speciality, setSpeciality] = useState<string | null>(null);
  const [yearRange, setYearRange] = useState<[number, number]>(() => {
    const years = libros.map((l) => l.anio_publicacion ?? 0).filter((y) => y);
    return [Math.min(...years), Math.max(...years)];
  });

  const facultiesList = Array.from(
    new Set(libros.map((l) => l.facultad).filter(Boolean))
  );
  const careersList = Array.from(
    new Set(libros.map((l) => l.carrera).filter(Boolean))
  );
  const specialitiesList = Array.from(
    new Set(libros.map((l) => l.especialidad).filter(Boolean))
  );

  const filtered = useMemo(() => {
    return libros
      .filter((l) => {
        if (
          search &&
          !`${l.titulo} ${l.autores ?? ""}`
            .toLowerCase()
            .includes(search.toLowerCase())
        )
          return false;
        if (faculty && l.facultad !== faculty) return false;
        if (career && l.carrera !== career) return false;
        if (speciality && l.especialidad !== speciality) return false;
        if (
          l.anio_publicacion !== null &&
          (l.anio_publicacion < yearRange[0] ||
            l.anio_publicacion > yearRange[1])
        )
          return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "az") return a.titulo.localeCompare(b.titulo);
        if (sortBy === "za") return b.titulo.localeCompare(a.titulo);
        if (sortBy === "anioDesc")
          return (b.anio_publicacion ?? 0) - (a.anio_publicacion ?? 0);
        if (sortBy === "anioAsc")
          return (a.anio_publicacion ?? 0) - (b.anio_publicacion ?? 0);
        return 0;
      });
  }, [libros, search, sortBy, faculty, career, speciality, yearRange]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = useMemo(
    () => filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE),
    [page, filtered]
  );

  const clearFilters = () => {
    setSortBy("anioDesc");
    setFaculty(null);
    setCareer(null);
    setSpeciality(null);
    const years = libros.map((l) => l.anio_publicacion ?? 0).filter((y) => y);
    setYearRange([Math.min(...years), Math.max(...years)]);
    setPage(1);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full">
      {showFilters && (
        <Card className="w-full md:w-64 p-4 flex flex-col gap-4">
          <h4 className="font-semibold text-lg">Filtros</h4>

          <Label className="flex flex-col gap-1">
            Orden
            <Select
              name="orden"
              value={sortBy}
              onValueChange={(v: SortByOption) => setSortBy(v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Ordenar" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="anioDesc">Año (mayor a menor)</SelectItem>
                <SelectItem value="anioAsc">Año (menor a mayor)</SelectItem>
                <SelectItem value="az">Título A-Z</SelectItem>
                <SelectItem value="za">Título Z-A</SelectItem>
              </SelectContent>
            </Select>
          </Label>
          <Label className="flex flex-col gap-1">
            Facultad
            <Select
              name="facultad"
              value={faculty ?? "all"}
              onValueChange={(v) => setFaculty(v === "all" ? null : v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">— Todas —</SelectItem>
                {facultiesList.map((f) => (
                  <SelectItem key={f} value={f || ""}>
                    {f}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Label>
          <Label className="flex flex-col gap-1">
            Carrera
            <Select
              name="carrera"
              value={career ?? "all"}
              onValueChange={(v) => setCareer(v === "all" ? null : v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">— Todas —</SelectItem>
                {careersList.map((c) => (
                  <SelectItem key={c} value={c || ""}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Label>
          <Label className="flex flex-col gap-1">
            Especialidad
            <Select
              name="especialidad"
              value={speciality ?? "all"}
              onValueChange={(v) => setSpeciality(v === "all" ? null : v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">— Todas —</SelectItem>
                {specialitiesList.map((s) => (
                  <SelectItem key={s} value={s || ""}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Label>

          <Label className="flex flex-col gap-1">
            Rango de años
            <Slider
              name="year-range"
              value={yearRange}
              onValueChange={(v: [number, number]) => setYearRange(v)}
              min={Math.min(
                ...libros.map((l) => l.anio_publicacion ?? 0).filter((y) => y)
              )}
              max={Math.max(
                ...libros.map((l) => l.anio_publicacion ?? 0).filter((y) => y)
              )}
              step={1}
            />
          </Label>

          {/* Mostrar los años seleccionados debajo del slider */}
          <div className="flex justify-between text-sm text-gray-600 mt-1">
            <span>{isFinite(yearRange[0]) ? yearRange[0] : "-"}</span>
            <span>{isFinite(yearRange[1]) ? yearRange[1] : "-"}</span>
          </div>

          <Button variant="outline" onClick={clearFilters}>
            Limpiar filtros
          </Button>
        </Card>
      )}

      <div className="flex-1 space-y-4 overflow-auto">
        {/* Mantener search original */}
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
                  <TableCell>{libro.anio_publicacion ?? "-"}</TableCell>
                  <TableCell>
                    <Link
                      href={`/book/${libro.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {libro.titulo}
                    </Link>
                  </TableCell>
                  <TableCell>{libro.autores ?? "-"}</TableCell>
                  <TableCell>{libro.facultad ?? "-"}</TableCell>
                  <TableCell>{libro.carrera ?? "-"}</TableCell>
                  <TableCell>{libro.especialidad ?? "-"}</TableCell>
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

        {totalPages > 1 && (
          <ClientPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </div>
    </div>
  );
}
