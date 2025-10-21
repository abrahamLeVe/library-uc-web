"use client";
import { Calendar, KeyRound, Layers, Tag, User } from "lucide-react";

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
    label: "Carrera",
    href: "/books/career",
    shortcut: "⌘C",
    icon: <Layers className="h-4 w-4" />,
  },
  {
    label: "Especialidad",
    href: "/books/speciality",
    shortcut: "⌘P",
    icon: <Tag className="h-4 w-4" />,
  },
  {
    label: "Palabras clave",
    href: "/books/keywords",
    shortcut: "⌘E",
    icon: <KeyRound className="h-4 w-4" />,
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
