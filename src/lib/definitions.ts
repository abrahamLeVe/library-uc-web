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
