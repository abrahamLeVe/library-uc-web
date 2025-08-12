"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

interface SearchBarProps {
  isMobile?: boolean;
}

export default function SearchBar({ isMobile = false }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (query.trim() !== "") {
      router.push(`/books/search?page=1&query=${encodeURIComponent(query)}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="relative flex flex-1 flex-shrink-0">
      <label htmlFor={`search-${isMobile}`} className="sr-only">
        Buscar
      </label>
      <Input
        id={`search-${isMobile}`}
        type="search"
        placeholder="Buscar en todo..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="text-white rounded-r-none"
      />
      <Button
        onClick={handleSearch}
        variant={"outline"}
        className="rounded-l-none"
      >
        <Search size={18} />
        Buscar
      </Button>
    </div>
  );
}
