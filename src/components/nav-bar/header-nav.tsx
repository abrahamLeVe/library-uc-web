"use client";

import { Categoria } from "@/lib/definitions";
import { cn } from "@/lib/utils";
import { HomeIcon, Search, User } from "lucide-react";
import { Session } from "next-auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "../common/toggle";
import { buttonVariants } from "../ui/button";
import { Separator } from "../ui/separator";
import { CategoriesNav } from "./categories-nav";
import { DropdownMenuGeneric } from "./drop-down";
import { menuListOptions, menuSessionOptions } from "./menu-options";
import MobileMenu from "./mobile-menu";

interface HeaderNavProps {
  categorias: Categoria[];
  session: Session | null;
}

export default function HeaderNav({ categorias, session }: HeaderNavProps) {
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
            {session ? (
              <DropdownMenuGeneric
                triggerLabel="Mi cuenta"
                menuLabel="Opciones de cuenta"
                options={menuSessionOptions}
                session={session}
              />
            ) : (
              <Link
                href="/login"
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                <User size={18} />
                <span className="hidden sm:block">Mi cuenta</span>
              </Link>
            )}
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

            <ModeToggle />
            <div className="md:hidden">
              <MobileMenu />
            </div>
          </div>
        </div>
      </nav>

      <CategoriesNav categorias={categorias} pathname={pathname} />

      <Separator className="my-4" />
    </header>
  );
}
