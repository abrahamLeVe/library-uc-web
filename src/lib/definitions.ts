export interface Categoria {
  id: string;
  codigo: string;
  nombre: string;
  parent_id?: string | null;
  categoria_padre?: string | null;
}

export interface Libros {
  vista_previa: string;
  anio: number | null;
  titulo: string;
  autores: string | null;
  categoria_hija: string;
  temas: string | null;
}

export interface Entity {
  id: number;
  nombre: string;
  total_libros: number;
}

export interface FetchEntityOptions {
  table: "autores" | "temas";
  joinTable: "libros_autores" | "libros_temas";
  joinColumn: "autor_id" | "tema_id";
}
export interface LibroPorAnio {
  id: string;
  anio: string;
  total_libros: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "CLIENT" | "ADMIN" | string; // puedes restringir más si sabes todos los roles
  dni: string | null;
  telefono: string | null;
  direccion: string | null;
  fecha_nacimiento: Date | null;
  is_verified: boolean;
  verification_code: string | null;
  verification_expires: Date | null;
  created_at: Date;
  updated_at: Date;
}
