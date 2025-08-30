"use client";
import { Categoria } from "@/lib/definitions";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "../ui/button";
interface HeaderNavProps {
  categorias: Categoria[];
  pathname: string;
}
export function CategoriesNav({ categorias, pathname }: HeaderNavProps) {
  const isExactPath = (href: string) => pathname === href;

  const variantForPath = (href: string) =>
    isExactPath(href) ? "default" : "outline";
  return (
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
  );
}
