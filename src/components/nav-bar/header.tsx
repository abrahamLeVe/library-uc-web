import { fetchCategoriasPadre } from "@/lib/data/category.data";
import { cn } from "@/lib/utils";
import { HomeIcon, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ModeToggle } from "../toggle";
import { buttonVariants } from "../ui/button";
import { Separator } from "../ui/separator";
import { DropdownMenuCategories } from "./drop-down";
import MobileMenu from "./mobile-menu";

export const revalidate = 60;

interface HeaderMainProps {
  id?: string;
  isHome?: boolean;
  isSearch?: boolean;
}

export default async function HeaderMain({
  id,
  isHome = false,
  isSearch = false,
}: HeaderMainProps) {
  const categorias = await fetchCategoriasPadre();

  return (
    <header>
      <nav className="sticky top-0 z-50 bg-gray-950 shadow-xs">
        <div className="container flex flex-wrap items-center justify-between md:h-14 p-1 m-auto gap-2">
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
            <div className="hidden md:block">
              <DropdownMenuCategories />
            </div>
          </div>
          <div className="flex gap-2">
            <div>
              <Link
                className={cn(
                  buttonVariants({
                    variant: isSearch ? "default" : "outline",
                  }),
                  isSearch && "pointer-events-none cursor-not-allowed"
                )}
                href={"/search"}
              >
                <Search size={18} />
                <span className="hidden sm:block">Buscar en todo</span>
              </Link>
            </div>
            <div>
              <ModeToggle />
            </div>
            <div className="md:hidden">
              <MobileMenu />
            </div>
          </div>
        </div>
      </nav>

      <div className="container flex flex-col lg:h-52 m-auto gap-2 p-2">
        <div className="flex items-end justify-between md:h-20">
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

        <div className="flex flex-wrap items-center lg:h-28 gap-2">
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
