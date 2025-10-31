"use client";
import { MessagesProvider } from "./messages.provider";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return <MessagesProvider>{children}</MessagesProvider>;
}
