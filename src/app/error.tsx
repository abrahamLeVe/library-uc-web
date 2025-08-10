"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      {/* Ícono de advertencia */}
      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 text-red-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m0 3.75h.007M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
          />
        </svg>
      </div>

      {/* Mensaje de error */}
      <h2 className="text-2xl font-bold text-gray-800">¡Algo salió mal!</h2>
      <p className="max-w-md text-gray-600">
        Ocurrió un error inesperado. Por favor, intenta de nuevo o vuelve más
        tarde.
      </p>

      {/* Botón de reintento */}
      <Button onClick={reset}>Intentar otra vez</Button>
    </main>
  );
}
