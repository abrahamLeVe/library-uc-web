"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Menu } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";

export default function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="relative" title="Menú" variant={"outline"}>
          <span className="absolute -inset-0.5" />
          <span className="sr-only">Open menu</span>
          <Menu aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md p-4">
        <ScrollArea className="h-full pr-2">
          <SheetHeader className="flex flex-row justify-between items-baseline">
            <SheetTitle>Menú</SheetTitle>
            <SheetDescription className="text-gray-100">
              Navegación
            </SheetDescription>
          </SheetHeader>
          <Separator className="my-4" />
          <Accordion type="single" collapsible className="w-full">
            <AccordionItemComponent
              value={"producto"}
              title={"Productos"}
              limit={15}
              description={"Producto"}
            />
            <AccordionItemComponent
              value={"marca"}
              title={"Marcas"}
              limit={20}
              description={"Marca"}
            />
            <AccordionItemComponent
              value={"category"}
              title={"Categorías"}
              limit={25}
              description={"Categoría"}
            />
          </Accordion>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

interface accordionItemProps {
  value: string;
  title: string;
  limit: number;
  description: string;
}

export function AccordionItemComponent({
  value,
  title,
  limit,
  description,
}: accordionItemProps) {
  return (
    <AccordionItem value={value}>
      <AccordionTrigger>{title}</AccordionTrigger>
      {Array.from({ length: limit }).map((_, index) => (
        <AccordionContent
          key={index}
          className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
        >
          <span className="text-sm font-semibold">
            {description}-{index + 1}
          </span>
        </AccordionContent>
      ))}
    </AccordionItem>
  );
}
