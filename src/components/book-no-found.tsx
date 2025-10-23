import { BookX } from "lucide-react";
import Link from "next/link";

export default function LibroNoEncontrado() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16">
      <BookX className=" text-6xl mb-4" />
      <h2 className="text-2xl font-semibold ">Libro no encontrado</h2>
      <p className=" mt-2 max-w-md">
        El libro que estás buscando no existe o fue eliminado. Por favor, revisa
        el enlace o vuelve al inicio.
      </p>
      <Link
        href="/search"
        className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow transition"
      >
        Busqueda avanzada
      </Link>
    </div>
  );
}
