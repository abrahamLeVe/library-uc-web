"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PalabraClaveFull } from "@/lib/definitions";
import Link from "next/link";
import { SetStateAction, useMemo, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { XIcon } from "lucide-react";
import { Label } from "../ui/label";
import { Card } from "../ui/card";

interface KeywordBadgesAdvancedProps {
  data: PalabraClaveFull[];
  itemsPerPage?: number;
}

export function KeywordBadgesAdvanced({
  data,
  itemsPerPage = 50,
}: KeywordBadgesAdvancedProps) {
  // UI state
  const [search, setSearch] = useState("");
  const [letter, setLetter] = useState<string | null>(null);
  const [faculty, setFaculty] = useState<string | null>(null);
  const [career, setCareer] = useState<string | null>(null);
  const [speciality, setSpeciality] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(itemsPerPage);
  const [sortBy, setSortBy] = useState<"az" | "za" | "popular">("popular");

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const listRef = useRef<HTMLDivElement | null>(null);

  // --- Derived options for filters (dependent) ---
  const facultiesList = useMemo(() => {
    const s = new Set<string>();
    for (const k of data) k.facultades.forEach((f) => f && s.add(f));
    return Array.from(s).sort();
  }, [data]);

  const careersList = useMemo(() => {
    const s = new Set<string>();
    for (const k of data) {
      // if a faculty filter is active, only include careers of keywords that contain that faculty
      if (!faculty || k.facultades.includes(faculty)) {
        k.carreras.forEach((c) => c && s.add(c));
      }
    }
    return Array.from(s).sort();
  }, [data, faculty]);

  const specialitiesList = useMemo(() => {
    const s = new Set<string>();
    for (const k of data) {
      // require career if selected, otherwise filter only by faculty if present
      const facultyOk = !faculty || k.facultades.includes(faculty);
      const careerOk = !career || k.carreras.includes(career);
      if (facultyOk && careerOk) k.especialidades.forEach((e) => e && s.add(e));
    }
    return Array.from(s).sort();
  }, [data, faculty, career]);

  // --- Filtering pipeline ---
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return data
      .filter((k) => {
        // letter filter
        if (
          letter &&
          !k.nombre.charAt(0).toLowerCase().startsWith(letter.toLowerCase())
        )
          return false;
        // faculty / career / speciality filters: each is optional
        if (faculty && !k.facultades.includes(faculty)) return false;
        if (career && !k.carreras.includes(career)) return false;
        if (speciality && !k.especialidades.includes(speciality)) return false;
        // search text (on nombre)
        if (q && !k.nombre.toLowerCase().includes(q)) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "az") return a.nombre.localeCompare(b.nombre);
        if (sortBy === "za") return b.nombre.localeCompare(a.nombre);
        // popular
        return b.total_libros - a.total_libros;
      });
  }, [data, letter, faculty, career, speciality, search, sortBy]);

  // visible slice
  const visible = useMemo(
    () => filtered.slice(0, visibleCount),
    [filtered, visibleCount]
  );

  // helper: reset dependent filters when higher-level changes
  function selectFaculty(f: string | null) {
    setFaculty(f);
    setCareer(null);
    setSpeciality(null);
    setVisibleCount(itemsPerPage);
    setSearch("");
    setLetter(null);
  }
  function selectCareer(c: string | null) {
    setCareer(c);
    setSpeciality(null);
    setVisibleCount(itemsPerPage);
    setSearch("");
    setLetter(null);
  }

  // clear all
  function clearAll() {
    setFaculty(null);
    setCareer(null);
    setSpeciality(null);
    setSearch("");
    setLetter(null);
    setVisibleCount(itemsPerPage);
    setSortBy("popular");
  }

  // scroll into view when "ver más" loads more
  function handleVerMas() {
    setVisibleCount((prev) => {
      const next = prev + itemsPerPage;
      // after state update, scroll to the previous last element smoothly
      setTimeout(() => {
        if (listRef.current) {
          listRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
        }
      }, 80);
      return next;
    });
  }

  // small helpers to build chips
  const activeChips = [
    faculty
      ? { label: `Facultad: ${faculty}`, onRemove: () => selectFaculty(null) }
      : null,
    career
      ? { label: `Carrera: ${career}`, onRemove: () => selectCareer(null) }
      : null,
    speciality
      ? {
          label: `Especialidad: ${speciality}`,
          onRemove: () => setSpeciality(null),
        }
      : null,
    search
      ? { label: `Buscar: ${search}`, onRemove: () => setSearch("") }
      : null,
    letter
      ? { label: `Letra: ${letter}`, onRemove: () => setLetter(null) }
      : null,
  ].filter(Boolean) as { label: string; onRemove: () => void }[];

  const hasFilters =
    letter !== null ||
    faculty !== null ||
    career !== null ||
    speciality !== null ||
    search.trim() !== "" ||
    sortBy !== "popular";

  // --- Render ---
  return (
    <section className="mt-8 space-y-4">
      {/* Glass header */}
      <Card className="md:sticky top-4 z-20 backdrop-blur-md bg-white/40 dark:bg-neutral-900/40 p-4">
        <div className="flex flex-col md:flex-row items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl  font-semibold">Palabras clave</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Explora por facultad, carrera o especialidad
            </p>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <Label className="flex gap-2 items-center">
              Orden
              <Select
                name="orden"
                value={sortBy}
                onValueChange={(v) =>
                  setSortBy(v as SetStateAction<"az" | "za" | "popular">)
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Ordenar por..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Más usadas</SelectItem>
                  <SelectItem value="az">A - Z</SelectItem>
                  <SelectItem value="za">Z - A</SelectItem>
                </SelectContent>
              </Select>
            </Label>

            <Button
              variant={!hasFilters ? "outline" : "default"}
              size="sm"
              onClick={clearAll}
              aria-label="Limpiar filtros"
            >
              Limpiar filtros
            </Button>
          </div>
        </div>

        {/* Filters row */}
        <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-2 flex-wrap items-center">
            {/* Faculty */}
            <Label className="flex flex-col items-start">
              Facultad
              <Select
                name="facultad"
                value={faculty ?? "all"}
                onValueChange={(value) =>
                  selectFaculty(value === "all" ? null : value)
                }
              >
                <SelectTrigger className="min-w-[180px]">
                  <SelectValue placeholder="Filtrar por facultad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">— Todas —</SelectItem>
                  {facultiesList.map((f) => (
                    <SelectItem key={f} value={f}>
                      {f}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Label>

            {/* Career */}
            <Label className="flex flex-col items-start">
              Carrera
              <Select
                name="carrera"
                value={career ?? "all"}
                onValueChange={(value) =>
                  selectCareer(value === "all" ? null : value)
                }
              >
                <SelectTrigger className="min-w-[180px]">
                  <SelectValue placeholder="Filtrar por carrera" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">— Todas —</SelectItem>
                  {careersList.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Label>

            {/* Speciality */}
            <Label className="flex flex-col items-start">
              Especialidad
              <Select
                name="especialidad"
                value={speciality ?? "all"}
                onValueChange={(value) => {
                  setSpeciality(value === "all" ? null : value);
                  setVisibleCount(itemsPerPage);
                }}
              >
                <SelectTrigger className="min-w-[180px]">
                  <SelectValue placeholder="Filtrar por especialidad" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">— Todas —</SelectItem>
                  {specialitiesList.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Label>
          </div>

          {/* A-Z + search */}
          <div className="flex flex-col gap-2 items-start md:items-end">
            <div className="flex flex-wrap gap-1 items-center">
              <Button
                variant={!letter ? "default" : "outline"}
                onClick={() => {
                  setLetter(null);
                  setVisibleCount(itemsPerPage);
                }}
                aria-label="Mostrar todos"
              >
                Todos
              </Button>
              {alphabet.map((ch) => {
                const active = letter === ch;
                return (
                  <Button
                    key={ch}
                    variant={active ? "default" : "outline"}
                    onClick={() => {
                      setLetter(ch);
                      setSearch("");
                      setVisibleCount(itemsPerPage);
                    }}
                    aria-label={`Filtrar por letra ${ch}`}
                  >
                    {ch}
                  </Button>
                );
              })}
            </div>

            <Label className="flex flex-col items-start">
              Buscador
              <Input
                id="search-keyword"
                name="search"
                placeholder="Buscar palabra clave..."
                type="search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setVisibleCount(itemsPerPage);
                }}
                className="min-w-[260px]"
                aria-label="Buscar palabra clave"
              />
            </Label>
          </div>
        </div>

        {/* Active chips */}
        {activeChips.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {activeChips.map((c, i) => (
              <Badge
                key={i}
                variant="outline"
                className="px-3 py-1 cursor-pointer"
                onClick={c.onRemove}
              >
                {c.label}
                <XIcon />
              </Badge>
            ))}
          </div>
        )}
      </Card>

      {/* Result count */}
      <div className="text-sm text-slate-600 dark:text-slate-400">
        Mostrando{" "}
        <strong className="text-slate-800 dark:text-slate-200">
          {Math.min(filtered.length, visible.length)}
        </strong>{" "}
        de{" "}
        <strong className="text-slate-800 dark:text-slate-200">
          {filtered.length}
        </strong>{" "}
        palabras clave (total <strong>{data.length}</strong> en base)
      </div>

      {/* Badges list */}
      <Card>
        <div ref={listRef} className="flex flex-wrap gap-2 px-2">
          {visible.length > 0 ? (
            visible.map((k) => {
              // color strength by popularity
              const t = k.total_libros ?? 0;
              const variantClass =
                t >= 20
                  ? "bg-sky-800 text-white"
                  : t >= 8
                  ? "bg-sky-600 text-white"
                  : "bg-white/80 text-slate-800";

              return (
                <Link
                  key={k.id}
                  href={`/books/keywords/${k.id}`}
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${variantClass} shadow-sm hover:scale-105 transform transition`}
                >
                  <span className="font-medium">{k.nombre}</span>
                  <span className="text-xs opacity-80">({k.total_libros})</span>
                </Link>
              );
            })
          ) : (
            <p className="text-sm text-slate-500">
              No se encontraron palabras clave con estos filtros.
            </p>
          )}
        </div>
      </Card>

      {/* Ver más / Paginación ligera */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-600 dark:text-slate-400">
          Página: <strong>{Math.ceil(visibleCount / itemsPerPage)}</strong>
        </div>

        <div className="flex gap-2">
          {visibleCount < filtered.length && (
            <Button variant="outline" onClick={handleVerMas}>
              Ver más
            </Button>
          )}

          {visibleCount > itemsPerPage && (
            <Button
              variant="ghost"
              onClick={() => {
                setVisibleCount(itemsPerPage);
                // scroll to top of the list
                listRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
            >
              Volver al inicio
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
