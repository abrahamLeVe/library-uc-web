"use client";
import { Calendar, Layers, Tag, User } from "lucide-react";

export const menuListOptions = [
  {
    label: "Fecha de publicación",
    href: "/books/anio",
    shortcut: "⇧⌘F",
    icon: <Calendar className="h-4 w-4" />,
  },
  {
    label: "Autor",
    href: "/books/author",
    shortcut: "⌘A",
    icon: <User className="h-4 w-4" />,
  },
  {
    label: "Sub categoría",
    href: "/books/sub-category",
    shortcut: "⌘S",
    icon: <Layers className="h-4 w-4" />,
  },
  {
    label: "Tema",
    href: "/books/theme",
    shortcut: "⌘T",
    icon: <Tag className="h-4 w-4" />,
  },
];

export const menuAuthOptions = [
  {
    label: "Ingresar",
    href: "/login",
    shortcut: "⌘L",
    icon: <User className="h-4 w-4" />,
  },
];

export const menuSessionOptions = [
  {
    label: "Dashboard",
    href: "/dashboard",
    shortcut: "⌘D",
    icon: <User className="h-4 w-4" />,
  },
];
