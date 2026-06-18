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

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function ProductPagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages: React.ReactNode[] = [];
    const maxVisiblePages = 5; // Maximum number of visible page links

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(renderLink(i));
      }
    } else {
      // Always show the first page
      pages.push(renderLink(1));

      if (currentPage > 3) {
        pages.push(<PaginationItem key="ellipsis-start"><PaginationEllipsis /></PaginationItem>);
      }

      // Render pages around the current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(renderLink(i));
      }

      if (currentPage < totalPages - 2) {
        pages.push(<PaginationItem key="ellipsis-end"><PaginationEllipsis /></PaginationItem>);
      }

      // Always show the last page
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
      <PaginationContent>
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

        {/* List of Page Links */}
        {renderPageNumbers()}

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
