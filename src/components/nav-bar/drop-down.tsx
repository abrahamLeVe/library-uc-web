import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export function DropdownMenuCategories() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Listar</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel>Listar items por</DropdownMenuLabel>
        <DropdownMenuGroup>
          <Link href={`/books/anio`}>
            <DropdownMenuItem>
              Fecha de publicación
              <DropdownMenuShortcut>⇧⌘F</DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
          <Link href={`/books/author`}>
            <DropdownMenuItem>
              Autor
              <DropdownMenuShortcut>⌘A</DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
          <Link href={`/books/sub-category`}>
            <DropdownMenuItem>
              Sub categoría
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
          <Link href={`/books/theme`}>
            <DropdownMenuItem>
              Tema
              <DropdownMenuShortcut>⌘T</DropdownMenuShortcut>
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
