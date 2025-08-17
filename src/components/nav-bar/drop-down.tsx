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
import { ReactNode } from "react";

interface MenuOption {
  label: string;
  href: string;
  shortcut?: string;
  icon?: ReactNode;
}

interface DropdownMenuGenericProps {
  triggerLabel: string;
  menuLabel: string;
  options: MenuOption[];
}

export function DropdownMenuGeneric({
  triggerLabel,
  menuLabel,
  options,
}: DropdownMenuGenericProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{triggerLabel}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>{menuLabel}</DropdownMenuLabel>
        <DropdownMenuGroup>
          {options.map(({ label, href, shortcut, icon }) => (
            <Link key={href} href={href} passHref>
              <DropdownMenuItem>
                {icon && <span className="mr-2">{icon}</span>}
                <span>{label}</span>
                {shortcut && (
                  <DropdownMenuShortcut>{shortcut}</DropdownMenuShortcut>
                )}
              </DropdownMenuItem>
            </Link>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
