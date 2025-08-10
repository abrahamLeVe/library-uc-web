import { fetchCategoriasPadre } from "@/lib/data/category.data";
import Image from "next/image";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

import MobileMenu from "./mobile-menu";
import { ModeToggle } from "../toggle";

export default async function HeaderMain() {
  const categorias = await fetchCategoriasPadre();
  return (
    <header>
      <nav className="sticky top-0 z-50 bg-gray-950 shadow-xs">
        <div className="container flex items-center justify-end h-14 p-1 m-auto gap-2">
          <ModeToggle />
          <div className="xl:hidden">
            <MobileMenu />
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
          {categorias.map((categoria) => (
            <Button key={categoria.id} variant="outline">
              {categoria.nombre}
            </Button>
          ))}
        </div>
      </div>
      <Separator className="my-4" />
    </header>
  );
}
