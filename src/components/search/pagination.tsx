"use client";

import {
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  Pagination as ShadPagination,
} from "@/components/ui/paginationssr";
import { generatePagination } from "@/lib/utils";
import { usePathname, useSearchParams } from "next/navigation";

export default function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const allPages = generatePagination(currentPage, totalPages);

  return (
    <ShadPagination>
      <PaginationContent>
        {/* Botón anterior */}
        <PaginationItem>
          {currentPage > 1 ? (
            <PaginationPrevious href={createPageURL(currentPage - 1)} />
          ) : null}
        </PaginationItem>

        {/* Números y puntos suspensivos */}
        {allPages.map((page) => {
          return (
            <PaginationItem key={page}>
              <PaginationLink
                href={createPageURL(page)}
                isActive={currentPage === page}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {/* Botón siguiente */}
        <PaginationItem>
          {currentPage < totalPages ? (
            <PaginationNext href={createPageURL(currentPage + 1)} />
          ) : null}
        </PaginationItem>
      </PaginationContent>
    </ShadPagination>
  );
}
