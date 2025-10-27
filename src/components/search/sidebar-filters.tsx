"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarFiltersProps } from "@/lib/definitions";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function SidebarFilters({
  facultades,
  carreras,
  especialidades,
  carrerasEspecialidades,
  initialFilters,
  showYearRange = false,
}: SidebarFiltersProps) {
  const [query, setQuery] = useState(initialFilters?.query ?? "");
  const [facultadId, setFacultadId] = useState<number | null>(
    initialFilters?.facultadId ?? null
  );
  const [carreraId, setCarreraId] = useState<number | null>(
    initialFilters?.carreraId ?? null
  );
  const [especialidadId, setEspecialidadId] = useState<number | null>(
    initialFilters?.especialidadId ?? null
  );
  const [yearMin, setYearMin] = useState<number | null>(
    initialFilters?.yearMin ?? null
  );
  const [yearMax, setYearMax] = useState<number | null>(
    initialFilters?.yearMax ?? null
  );
  const [sortBy, setSortBy] = useState<"az" | "za" | "popular">(
    initialFilters?.sortBy ?? "popular"
  );

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const updateUrl = useDebouncedCallback(() => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");

    if (query) {
      params.set("query", query);
    } else {
      params.delete("query");
    }

    if (facultadId) {
      params.set("facultadId", String(facultadId));
    } else {
      params.delete("facultadId");
    }

    if (carreraId) {
      params.set("carreraId", String(carreraId));
    } else {
      params.delete("carreraId");
    }

    if (especialidadId) {
      params.set("especialidadId", String(especialidadId));
    } else {
      params.delete("especialidadId");
    }

    if (yearMin) {
      params.set("yearMin", String(yearMin));
    } else {
      params.delete("yearMin");
    }

    if (yearMax) {
      params.set("yearMax", String(yearMax));
    } else {
      params.delete("yearMax");
    }

    if (sortBy) {
      params.set("sortBy", sortBy);
    } else {
      params.delete("sortBy");
    }

    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const facultadesFiltradas = useMemo(() => {
    if (!carreraId && !especialidadId) return facultades;

    const ids = new Set<number>();

    if (carreraId) {
      const carrera = carreras.find((c) => c.id === carreraId);
      if (carrera) ids.add(carrera.facultad_id);
    }

    if (especialidadId) {
      const relaciones = carrerasEspecialidades.filter(
        (ce) => ce.especialidad_id === especialidadId
      );
      relaciones.forEach((r) => {
        const carrera = carreras.find((c) => c.id === r.carrera_id);
        if (carrera) ids.add(carrera.facultad_id);
      });
    }

    return facultades.filter((f) => ids.has(f.id));
  }, [facultades, carreras, carreraId, especialidadId, carrerasEspecialidades]);

  const carrerasFiltradas = useMemo(() => {
    let filtered = carreras;

    if (facultadId)
      filtered = filtered.filter((c) => c.facultad_id === facultadId);

    if (especialidadId) {
      const relaciones = carrerasEspecialidades.filter(
        (ce) => ce.especialidad_id === especialidadId
      );
      const ids = new Set(relaciones.map((r) => r.carrera_id));
      filtered = filtered.filter((c) => ids.has(c.id));
    }

    return filtered;
  }, [carreras, facultadId, especialidadId, carrerasEspecialidades]);

  const especialidadesFiltradas = useMemo(() => {
    let filtered = especialidades;

    if (carreraId) {
      const relaciones = carrerasEspecialidades.filter(
        (ce) => ce.carrera_id === carreraId
      );
      const ids = new Set(relaciones.map((r) => r.especialidad_id));
      filtered = filtered.filter((e) => ids.has(e.id));
    } else if (facultadId) {
      const carrerasIds = carreras
        .filter((c) => c.facultad_id === facultadId)
        .map((c) => c.id);

      const relaciones = carrerasEspecialidades.filter((ce) =>
        carrerasIds.includes(ce.carrera_id)
      );
      const ids = new Set(relaciones.map((r) => r.especialidad_id));
      filtered = filtered.filter((e) => ids.has(e.id));
    }

    return filtered;
  }, [especialidades, carreras, facultadId, carreraId, carrerasEspecialidades]);

  useEffect(() => {
    setCarreraId(null);
    setEspecialidadId(null);
  }, [facultadId]);

  useEffect(() => {
    setEspecialidadId(null);
  }, [carreraId]);

  function clearFilters() {
    setQuery("");
    setFacultadId(null);
    setCarreraId(null);
    setEspecialidadId(null);
    setYearMin(null);
    setYearMax(null);
    setSortBy("popular");

    const params = new URLSearchParams(searchParams);
    params.delete("query");
    params.delete("facultadId");
    params.delete("carreraId");
    params.delete("especialidadId");
    params.delete("yearMin");
    params.delete("yearMax");
    params.set("sortBy", "popular");
    params.set("page", "1");
    replace(`${pathname}?${params.toString()}`);
  }

  return (
    <aside className="w-full md:w-72 p-4 border rounded-lg space-y-4 bg-card">
      <h3 className="text-lg font-semibold">Filtros</h3>

      {/* Buscar */}
      <div>
        <Label htmlFor="sf-query">Buscar</Label>
        <Input
          id="sf-query"
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            updateUrl();
          }}
          placeholder="Título, autor, palabra..."
        />
      </div>

      {/* Facultad */}
      <div>
        <Label htmlFor="sf-facultad">Facultad</Label>
        <Select
          value={facultadId ? String(facultadId) : "all"}
          onValueChange={(v) => {
            setFacultadId(v === "all" ? null : Number(v));
            setCarreraId(null);
            setEspecialidadId(null);
            updateUrl();
          }}
        >
          <SelectTrigger id="sf-facultad" className="w-full">
            <SelectValue placeholder="Todas las facultades" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">— Todas —</SelectItem>
            {facultadesFiltradas.map((f) => (
              <SelectItem key={f.id} value={String(f.id)}>
                {f.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Carrera */}
      <div>
        <Label htmlFor="sf-carrera">Carrera</Label>
        <Select
          value={carreraId ? String(carreraId) : "all"}
          onValueChange={(v) => {
            setCarreraId(v === "all" ? null : Number(v));
            setEspecialidadId(null);
            updateUrl();
          }}
        >
          <SelectTrigger id="sf-carrera" className="w-full">
            <SelectValue
              placeholder={
                facultadId || especialidadId
                  ? "Todas las carreras"
                  : "Selecciona una facultad o especialidad primero"
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">— Todas —</SelectItem>
            {carrerasFiltradas.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>
                {c.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Especialidad */}
      <div>
        <Label htmlFor="sf-especialidad">Especialidad</Label>
        <Select
          value={especialidadId ? String(especialidadId) : "all"}
          onValueChange={(v) => {
            setEspecialidadId(v === "all" ? null : Number(v));
            updateUrl();
          }}
        >
          <SelectTrigger id="sf-especialidad" className="w-full">
            <SelectValue
              placeholder={
                carreraId || facultadId
                  ? "Todas las especialidades"
                  : "Selecciona una carrera o facultad primero"
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">— Todas —</SelectItem>
            {especialidadesFiltradas.map((s) => (
              <SelectItem key={s.id} value={String(s.id)}>
                {s.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Orden */}
      <div>
        <Label htmlFor="sf-sort">Orden</Label>
        <Select
          value={sortBy}
          onValueChange={(v) => {
            setSortBy(v as "az" | "za" | "popular");
            updateUrl();
          }}
        >
          <SelectTrigger id="sf-sort" className="w-full">
            <SelectValue placeholder="Ordenar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popular">Popular (más asignaciones)</SelectItem>
            <SelectItem value="az">A - Z</SelectItem>
            <SelectItem value="za">Z - A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Rango de años */}
      {showYearRange && (
        <div>
          <Label>Rango de años</Label>
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Desde"
              value={yearMin ?? ""}
              onChange={(e) => {
                setYearMin(e.target.value ? Number(e.target.value) : null);
                updateUrl();
              }}
            />
            <Input
              type="number"
              placeholder="Hasta"
              value={yearMax ?? ""}
              onChange={(e) => {
                setYearMax(e.target.value ? Number(e.target.value) : null);
                updateUrl();
              }}
            />
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Button variant="outline" onClick={clearFilters}>
          Limpiar
        </Button>
      </div>
    </aside>
  );
}
