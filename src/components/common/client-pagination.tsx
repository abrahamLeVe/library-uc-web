"use client";

import {
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Pagination as ShadPagination,
} from "@/components/ui/pagination";
import { generatePagination } from "@/lib/utils";

interface ClientPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function ClientPagination({
  currentPage,
  totalPages,
  onPageChange,
}: ClientPaginationProps) {
  if (totalPages <= 1) return null;

  const pages = generatePagination(currentPage, totalPages);

  return (
    <ShadPagination>
      <PaginationContent>
        {/* Botón anterior */}
        <PaginationItem>
          {currentPage > 1 ? (
            <PaginationPrevious onClick={() => onPageChange(currentPage - 1)} />
          ) : null}
        </PaginationItem>

        {/* Números y puntos suspensivos */}
        {pages.map((p) => (
          <PaginationItem key={p}>
            <PaginationLink
              onClick={() => onPageChange(Number(p))}
              isActive={currentPage === p}
            >
              {p}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* Botón siguiente */}
        <PaginationItem>
          {currentPage < totalPages ? (
            <PaginationNext onClick={() => onPageChange(currentPage + 1)} />
          ) : null}
        </PaginationItem>
      </PaginationContent>
    </ShadPagination>
  );
}
