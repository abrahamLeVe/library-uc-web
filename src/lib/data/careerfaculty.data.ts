import { sql } from "../db";

export interface CarreraEspecialidad {
  carrera_id: number;
  especialidad_id: number;
}

export async function fetchCarrerasEspecialidades(): Promise<
  CarreraEspecialidad[]
> {
  try {
    const result = await sql<CarreraEspecialidad[]>`
      SELECT carrera_id, especialidad_id
      FROM carreras_especialidades
      ORDER BY carrera_id ASC
    `;
    return result;
  } catch (error) {
    console.error("❌ Error al obtener carreras-especialidades:", error);
    return [];
  }
}
