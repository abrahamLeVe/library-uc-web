import { NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";
import { ratelimit } from "./lib/rate-limiter";

export async function middleware() {
  const identifier = "api";
  const { success, pending } = await ratelimit.limit(identifier);

  // pending is a promise for handling the analytics submission
  waitUntil(pending);

  try {
    if (!success) {
      return new NextResponse("Estás haciendo solicitudes demasiado rápido.", {
        status: 429,
      });
    }
  } catch {
    return new NextResponse(
      "Lo sentimos, algo salió mal al procesar tu solicitud. Por favor, inténtalo de nuevo más tarde.",
      { status: 500 }
    );
  }
}

export const config = {
  matcher: ["/api/chat/:path*"],
};
