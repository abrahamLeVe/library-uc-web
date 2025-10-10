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
  total_libros?: number; // opcional si quieres mostrar libros por facultad
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
  palabras_clave: string[];
  pdf_url: string;
  examen_pdf_url: string;
  imagen: string | null; // URL de la imagen (puede ser null)
  facultad_id: number;
  carrera_id: number;
  especialidad_id: number;
  created_at: string;
  video_url: string | null; // 👈 nuevo

  // Campos adicionales para mostrar en la tabla
  vista_previa?: string; // por defecto 'sin VP'
  autores?: string; // lista de autores concatenados
  facultad?: string; // nombre de la facultad
  carrera?: string; // nombre de la carrera
  especialidad?: string; // nombre de la especialidad
}
