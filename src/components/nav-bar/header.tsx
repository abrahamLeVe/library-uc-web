import { fetchCategoriasPadre } from "@/lib/data/category.data";
import Image from "next/image";
import { buttonVariants } from "../ui/button";
import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils";
import { HomeIcon } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "../toggle";
import MobileMenu from "./mobile-menu";
import { DropdownMenuCategories } from "./drop-down";

export const revalidate = 60;

interface HeaderMainProps {
  id?: string;
  isHome?: boolean;
}

export default async function HeaderMain({
  id,
  isHome = false,
}: HeaderMainProps) {
  const categorias = await fetchCategoriasPadre();

  return (
    <header>
      <nav className="sticky top-0 z-50 bg-gray-950 shadow-xs">
        <div className="container flex items-center justify-between h-14 p-1 m-auto gap-2">
          <div className="flex gap-2">
            <div>
              <Link
                href={`/`}
                className={cn(
                  buttonVariants({
                    variant: isHome ? "default" : "outline",
                  }),
                  isHome && "pointer-events-none cursor-not-allowed"
                )}
              >
                <HomeIcon />
                Página de inicio
              </Link>
            </div>
            <div>
              <DropdownMenuCategories />
            </div>
          </div>
          <div className="flex gap-2">
            <ModeToggle />
            <div className="xl:hidden">
              <MobileMenu />
            </div>
          </div>
        </div>
      </nav>

      <div className="container flex flex-col lg:h-52 m-auto">
        <div className="flex items-end justify-between h-20 px-2 mb-5">
          <h1 className="text-2xl md:text-4xl font-semibold border-b pb-1">
            Biblioteca Torres Lara
          </h1>

          <Image
            src="/vercel.svg"
            alt="Library"
            width={60}
            height={60}
            className="w-14 h-14"
          />
        </div>

        <div className="flex flex-wrap items-center lg:h-28 gap-2 px-2">
          {categorias.map((categoria) => {
            const isActive = id && id === String(categoria.id);

            return (
              <Link
                key={categoria.id}
                href={`/category/${categoria.id}`}
                className={cn(
                  buttonVariants({
                    variant: isActive ? "default" : "outline",
                  }),
                  isActive && "pointer-events-none cursor-not-allowed"
                )}
              >
                {categoria.nombre}
              </Link>
            );
          })}
        </div>
      </div>
      <Separator className="my-4" />
    </header>
  );
}
