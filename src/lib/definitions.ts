// =============================
// DEFINICIONES DE ENTIDADES
// =============================
export interface Entity {
  id: number | string;
  nombre: string;
  total_libros: number;
}

export interface FetchEntityOptions {
  table: string;
  joinTable: string;
  joinColumn: string;
}

// Para agrupar libros por año
export interface LibroPorAnio {
  anio: string;
  total_libros: number;
}

export interface Facultad {
  id: number;
  nombre: string;
  total_libros?: number;
}

export interface Carrera {
  id: number;
  nombre: string;
  facultad_id: number;
}

export interface Especialidad {
  id: number;
  nombre: string;
  carrera_id: number;
}

export interface Autor {
  id: number;
  nombre: string;
  nacionalidad: string;
}

export interface Libros {
  id: number;
  titulo: string;
  descripcion: string;
  isbn: string;
  anio_publicacion: number;
  editorial: string;
  idioma: string;
  paginas: number;
  pdf_url: string;
  examen_pdf_url: string;
  imagen: string | null;
  facultad_id: number;
  carrera_id: number;
  especialidad_id: number;
  created_at: string;
  video_urls: string[];
  palabra_clave_name?: string[]; // ✅ ahora opcional y se obtiene de la tabla relación

  // Campos adicionales para mostrar en la tabla
  vista_previa?: string;
  autores?: string;
  facultad?: string;
  carrera?: string;
  especialidad?: string;
}

// ✅ NUEVO: Palabras clave
export interface PalabraClave {
  id: number;
  nombre: string;
}

// ✅ NUEVO: Relación libros ↔ palabras clave
export interface LibroPalabraClave {
  libro_id: number;
  palabra_id: number;
}

export interface PalabraClaveFull {
  id: number;
  nombre: string;
  total_libros: number;
  facultades: string[]; // e.g. ["Ingeniería", "Ciencias"]
  carreras: string[]; // e.g. ["Civil", "Sistemas"]
  especialidades: string[]; // e.g. ["Estructuras"]
}
