import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex h-screen flex-col items-center justify-center gap-4 text-center px-4">
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="9" y1="9" x2="13" y2="13" />
          <line x1="13" y1="9" x2="9" y2="13" />
        </svg>
      </div>

      <h1 className="text-3xl font-bold text-gray-800">
        404 - Página no encontrada
      </h1>

      <p className="max-w-md text-gray-600 leading-relaxed">
        Lo sentimos, el recurso que buscas no existe o ha sido eliminado.
        Verifica la dirección o regresa a la página de inicio.
      </p>

      <Link
        href="/"
        className={cn(
          buttonVariants({
            variant: "default",
          })
        )}
      >
        Volver al inicio
      </Link>
    </main>
  );
}
