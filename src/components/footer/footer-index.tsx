import { fetchFacultades } from "@/lib/data/facultad.data";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";

export default async function Footer() {
  const facultades = await fetchFacultades();

  const menuItems = [
    { label: "Fecha de publicación", href: "/books/anio" },
    { label: "Autor", href: "/books/author" },
    { label: "Carreras", href: "/books/career" },
    { label: "Especialidades", href: "/books/speciality" },
  ];

  return (
    <footer className="border-t  from-white/50 to-gray-50 mt-10">
      <div className="mx-auto w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 py-12 md:grid-cols-3">
          {/* Brand + description */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-blue-600 p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="white"
                  className="h-6 w-6"
                >
                  <path d="M3 5.25C3 4.00736 4.00736 3 5.25 3h13.5C19.9926 3 21 4.00736 21 5.25v13.5c0 1.2426-1.0074 2.25-2.25 2.25H5.25A2.25 2.25 0 013 18.75V5.25zM8.5 8.5h7v1.5h-7V8.5zm0 3.75h7v1.5h-7v-1.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Biblioteca</h3>
                <p className="text-sm text-muted-foreground">
                  Recursos académicos y libros.
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm">
              Accede a guías, PDFs y materiales seleccionados por facultad y
              carrera. Diseñado para estudiantes y profesores.
            </p>
          </div>

          {/* Links columns */}
          <div className="grid grid-cols-1 gap-6 md:col-span-2 md:grid-cols-3">
            <div>
              <h4 className="mb-3 text-sm font-semibold">Explorar</h4>
              <ul className="space-y-2 text-sm">
                {menuItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(buttonVariants({ variant: "link" }))}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="mb-3 text-sm font-semibold">Facultades</h4>
              <ul className="space-y-2 text-sm">
                {facultades.map((fac) => {
                  const href = `/faculty/${fac.id}`;
                  return (
                    <li key={fac.id}>
                      <Link
                        href={href}
                        className={cn(buttonVariants({ variant: "link" }))}
                      >
                        {fac.nombre}
                        <Badge variant="secondary" className="ml-2">
                          {fac.total_libros && fac.total_libros}
                        </Badge>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div></div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t py-6 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Biblioteca — by abrahamLeVe</p>
        </div>
      </div>
    </footer>
  );
}
