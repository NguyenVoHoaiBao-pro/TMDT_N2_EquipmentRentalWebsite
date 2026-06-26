// @/features/product/components/Pagination.tsx
import React from 'react';
import {
  Pagination as ShadcnPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/shared_components/ui/pagination';
import { DEFAULT_MAX_VISIBLE_PAGES } from '@/features/product/constants/defaultValues.ts';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function ProductPagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages: React.ReactNode[] = [];
    const maxVisiblePages = DEFAULT_MAX_VISIBLE_PAGES;

    // Case 1: If totalPages <= maxVisiblePages, render all pages
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(renderLink(i));
      }
      return pages;
    }

    // Case 2: If totalPages > maxVisiblePages, render 5 pages around the current page, floating windows
    let start = currentPage - 2;
    let end = currentPage + 2;

    // If the start is less than 1, adjust it to 1 and adjust end accordingly
    if (start < 1) {
      start = 1;
      end = maxVisiblePages;
    }

    // If the end is greater than totalPages, adjust it to totalPages and adjust start accordingly
    if (end > totalPages) {
      end = totalPages;
      start = totalPages - maxVisiblePages + 1;
    }

    // Add ellipsis if the start is greater than 1
    if (start > 1) {
      pages.push(renderLink(1));
      pages.push(<PaginationItem key="ellipsis-start"><PaginationEllipsis /></PaginationItem>);
    }

    for (let i = start; i <= end; i++) {
      pages.push(renderLink(i));
    }

    // If reach the end of the loop, add ellipsis if end is less than totalPages
    if (end < totalPages) {
      pages.push(<PaginationItem key="ellipsis-end"><PaginationEllipsis /></PaginationItem>);
      pages.push(renderLink(totalPages));
    }

    return pages;
  };


  const renderLink = (page: number) => (
    <PaginationItem key={page}>
      <PaginationLink
        href="#"
        isActive={page === currentPage}
        onClick={(e) => {
          e.preventDefault();
          onPageChange(page);
        }}
      >
        {page}
      </PaginationLink>
    </PaginationItem>
  );

  return (
    <ShadcnPagination className="mt-8">
      <PaginationContent className="w-full justify-between md:justify-center md:gap-1">
        {/* Previous Page */}
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage > 1) onPageChange(currentPage - 1);
            }}
            className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>

        <span className="text-sm font-medium md:hidden text-muted-foreground select-none">
          Trang {currentPage} / {totalPages}
        </span>

        <div className="hidden md:flex items-center gap-1">
          {renderPageNumbers()}
        </div>

        {/* Next Page */}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (currentPage < totalPages) onPageChange(currentPage + 1);
            }}
            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
      </PaginationContent>
    </ShadcnPagination>
  );
}
