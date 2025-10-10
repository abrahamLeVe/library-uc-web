"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Link from "next/link";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils";

const menuItems = [
  { label: "Fecha de publicación", href: "/books/anio" },
  { label: "Autor", href: "/books/author" },
  { label: "Carreras", href: "/books/career" },
  { label: "Especialidades", href: "/books/speciality" },
];

export default function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative" title="Menú">
          <span className="sr-only">Abrir menú</span>
          <Menu aria-hidden="true" />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="sm:max-w-xs p-4">
        <ScrollArea className="h-full pr-2">
          <SheetHeader>
            <SheetTitle>Menú</SheetTitle>
            <SheetDescription>Navegación</SheetDescription>
          </SheetHeader>

          <Separator className="my-4" />

          <nav className="flex flex-col gap-3">
            {menuItems.map((item) => (
              <SheetClose asChild key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    buttonVariants({
                      variant: "outline",
                    }),
                    "w-full ml-0"
                  )}
                >
                  {item.label}
                </Link>
              </SheetClose>
            ))}
          </nav>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
