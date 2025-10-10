import { fetchAllLibros, fetchLibroPorId } from "@/lib/data/book.data";
import { getPdfUrl } from "@/lib/s3";
import { getYouTubeEmbedUrl } from "@/lib/utils";
import { Metadata } from "next";

export async function generateStaticParams() {
  // Traer todos los IDs de libros
  const libros = await fetchAllLibros();
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
  const embedUrl = getYouTubeEmbedUrl(libro.video_url);
  // 👇 Generar URLs firmadas (válidas por 7 días)
  const imagen_url_signed = libro.imagen
    ? await getPdfUrl(libro.imagen, 604800)
    : null;

  const pdf_url_signed = libro.pdf_url
    ? await getPdfUrl(libro.pdf_url, 604800)
    : null;

  const examen_url_signed = libro.examen_pdf_url
    ? await getPdfUrl(libro.examen_pdf_url, 604800)
    : null;

  return (
    <div className="space-y-6 p-4 md:p-8">
      {/* Encabezado */}
      <h1 className="text-2xl md:text-4xl font-bold">{libro.titulo}</h1>

      {/* Contenedor principal */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Imagen */}
        <div className="flex-shrink-0 md:sticky top-1 h-full">
          {imagen_url_signed ? (
            <img
              src={imagen_url_signed}
              alt={libro.titulo}
              className="w-64 h-auto rounded shadow bg-gray-200"
            />
          ) : (
            <div className="w-64 h-80 bg-gray-200 flex items-center justify-center text-gray-500">
              Sin imagen
            </div>
          )}
        </div>

        {/* Información del libro */}
        <div className="flex-1 space-y-3">
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
            {pdf_url_signed && (
              <a
                href={pdf_url_signed}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Descargar PDF
              </a>
            )}
            {examen_url_signed && (
              <a
                href={examen_url_signed}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Descargar Material
              </a>
            )}
          </div>

          {/* Video de YouTube */}
          {libro.video_url && (
            <div className="mt-6">
              <h2 className="font-semibold text-lg mb-2">Video relacionado:</h2>

              {embedUrl && (
                <div className="aspect-video rounded-xl overflow-hidden shadow-lg mt-4">
                  <iframe
                    src={embedUrl}
                    title="Video relacionado"
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
