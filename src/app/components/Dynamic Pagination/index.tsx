"use client"

import { useState } from 'react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from '@/components/ui/pagination';

const DynamicPagination = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  const handlePageChange = (page: number) => {
    if(page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleEllipsis = (page: number) => {
    setCurrentPage(page);
  }

  const getPageRange = () => {
    let startPage = currentPage - 1;
    let endPage = currentPage + 1;

    if (currentPage === 1) {
      startPage = 1;
      endPage = 3;
    } else if (currentPage === totalPages - 1) {
      startPage = totalPages - 2;
      endPage = totalPages;
    } else if (currentPage === totalPages) {
      startPage = totalPages - 2;
      endPage = totalPages;
    }

    startPage = Math.max(startPage, 1);
    endPage = Math.min(endPage, totalPages);

    return Array.from({length: endPage - startPage + 1}, (_, i) => startPage + i);
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href='#'
            onClick={() => handlePageChange(currentPage - 1)}
          />
        </PaginationItem>

        {/* Left ellipsis */}
        {totalPages > 3 && currentPage > 2 &&
          <PaginationItem
          onClick={() => handleEllipsis(1)}
          >
            <PaginationEllipsis/>
          </PaginationItem>
        }

        {getPageRange().map((page) => (
          <PaginationItem
                key={page}
              >
                <PaginationLink
                  isActive={currentPage === page}
                  onClick={() => handlePageChange(page)}
                >{page}</PaginationLink>
              </PaginationItem>
        ))}

        {/* Right ellipsis */}
        {totalPages > 3 && currentPage < totalPages - 1 &&
          <PaginationItem onClick={() => handleEllipsis(totalPages)}>
            <PaginationEllipsis />
          </PaginationItem>
        }
        <PaginationItem>
          <PaginationNext
            onClick={() => handlePageChange(currentPage + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default DynamicPagination;