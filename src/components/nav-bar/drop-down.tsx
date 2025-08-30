"use client";
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
import { Session } from "next-auth";
import Link from "next/link";
import { ReactNode } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { PowerIcon } from "lucide-react";
import { signOut } from "next-auth/react";

interface MenuOption {
  label: string;
  href: string;
  shortcut?: string;
  icon?: ReactNode;
}

interface DropdownMenuGenericProps {
  triggerLabel?: string;
  menuLabel: string;
  options: MenuOption[];
  session?: Session | null;
}

export function DropdownMenuGeneric({
  triggerLabel,
  menuLabel,
  options,
  session,
}: DropdownMenuGenericProps) {
  const user = session?.user;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {!user ? (
          <Button variant="outline">{triggerLabel}</Button>
        ) : (
          <Avatar className="h-9 w-9 rounded-lg">
            <AvatarImage src={user.image ?? ""} alt={user.name ?? "Usuario"} />
            <AvatarFallback>
              {user.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
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
          {session?.user && (
            <DropdownMenuItem
              onClick={() => signOut()}
              className="cursor-pointer"
            >
              <PowerIcon className="w-6 mr-2" />
              <span>Cerrar sesión</span>
              <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
            </DropdownMenuItem>
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
