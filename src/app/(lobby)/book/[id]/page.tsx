import { fetchAllLibros, fetchLibroPorId } from "@/lib/data/book.data";
import { Metadata } from "next";

export async function generateStaticParams() {
  // Traer todos los IDs de libros
  const libros = await fetchAllLibros(); // o una función que traiga todos los libros
  return libros.map((libro) => ({ id: libro.id.toString() }));
}

export const metadata: Metadata = {
  title: "Detalles del libro",
};

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  const libro = await fetchLibroPorId(Number(id));

  if (!libro) {
    return <p>Libro no encontrado.</p>;
  }

  return (
    <div className="space-y-6 p-4 md:p-8">
      {/* Encabezado */}
      <h1 className="text-2xl md:text-4xl font-bold">{libro.titulo}</h1>

      {/* Contenedor principal */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Imagen */}
        <div className="flex-shrink-0">
          {libro.imagen ? (
            <img
              src={libro.imagen}
              alt={libro.titulo}
              className="w-64 h-auto rounded shadow"
            />
          ) : (
            <div className="w-64 h-80 bg-gray-200 flex items-center justify-center text-gray-500">
              Sin imagen
            </div>
          )}
        </div>

        {/* Información del libro */}
        <div className="flex-1 space-y-3">
          {/* Datos generales */}
          <p>
            <span className="font-semibold">Año de publicación:</span>{" "}
            {libro.anio_publicacion ?? "-"}
          </p>
          <p>
            <span className="font-semibold">Autores:</span>{" "}
            {libro.autores ?? "-"}
          </p>
          <p>
            <span className="font-semibold">Facultad:</span>{" "}
            {libro.facultad ?? "-"}
          </p>
          <p>
            <span className="font-semibold">Carrera:</span>{" "}
            {libro.carrera ?? "-"}
          </p>
          <p>
            <span className="font-semibold">Especialidad:</span>{" "}
            {libro.especialidad ?? "-"}
          </p>
          <p>
            <span className="font-semibold">ISBN:</span> {libro.isbn ?? "-"}
          </p>
          <p>
            <span className="font-semibold">Editorial:</span>{" "}
            {libro.editorial ?? "-"}
          </p>
          <p>
            <span className="font-semibold">Idioma:</span> {libro.idioma ?? "-"}
          </p>
          <p>
            <span className="font-semibold">Número de páginas:</span>{" "}
            {libro.paginas ?? "-"}
          </p>

          {/* Descripción */}
          <div>
            <h2 className="font-semibold text-lg">Descripción:</h2>
            <p>{libro.descripcion ?? "No disponible"}</p>
          </div>

          {/* Descargas */}
          <div className="space-x-4 pt-2">
            {libro.pdf_url && (
              <a
                href={libro.pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Descargar PDF
              </a>
            )}
            {libro.examen_pdf_url && (
              <a
                href={libro.examen_pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Descargar Examen
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
