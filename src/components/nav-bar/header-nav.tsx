"use client";

import { Categoria } from "@/lib/definitions";
import { cn } from "@/lib/utils";
import { HomeIcon, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "../toggle";
import { buttonVariants } from "../ui/button";
import { Separator } from "../ui/separator";
import { DropdownMenuGeneric } from "./drop-down";
import { menuAuthOptions, menuListOptions } from "./menu-options";
import MobileMenu from "./mobile-menu";

interface HeaderNavProps {
  categorias: Categoria[];
}

export default function HeaderNav({ categorias }: HeaderNavProps) {
  const pathname = usePathname();

  const isExactPath = (href: string) => pathname === href;

  const variantForPath = (href: string) =>
    isExactPath(href) ? "default" : "outline";

  return (
    <header>
      <nav className="sticky top-0 z-50 bg-gray-950 shadow-xs">
        <div className="container flex flex-wrap items-center justify-between md:h-14 p-1 m-auto gap-2">
          <div className="flex gap-2">
            {/* Home */}
            <Link
              href="/"
              className={cn(
                buttonVariants({ variant: variantForPath("/") }),
                isExactPath("/") && "pointer-events-none cursor-not-allowed"
              )}
            >
              <HomeIcon />
              Página de inicio
            </Link>

            <div className="hidden md:block">
              <DropdownMenuGeneric
                triggerLabel="Listar"
                menuLabel="Listar ítems por"
                options={menuListOptions}
              />
            </div>
          </div>

          <div className="flex gap-2">
            {/* Search */}
            <Link
              href="/search"
              className={cn(
                buttonVariants({ variant: variantForPath("/search") }),
                isExactPath("/search") &&
                  "pointer-events-none cursor-not-allowed"
              )}
            >
              <Search size={18} />
              <span className="hidden sm:block">Buscar en todo</span>
            </Link>

            <DropdownMenuGeneric
              triggerLabel="Mi cuenta"
              menuLabel=""
              options={menuAuthOptions}
            />

            <ModeToggle />
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
        </div>

        {/* Categorías */}
        <div className="flex flex-wrap items-center lg:h-28 gap-2">
          {categorias.map((categoria) => {
            const href = `/category/${categoria.id}`;
            return (
              <Link
                key={categoria.id}
                href={href}
                className={cn(
                  buttonVariants({ variant: variantForPath(href) }),
                  isExactPath(href) && "pointer-events-none cursor-not-allowed"
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
