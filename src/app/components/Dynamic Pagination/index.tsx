import { FC } from 'react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from '@/components/ui/pagination';
import { useRouter, useSearchParams } from 'next/navigation';

interface DynamicPaginationProps {
  totalPages: number
  setPages: (pages: number) => void
}

const DynamicPagination : FC<DynamicPaginationProps> = ({totalPages, setPages}) => {

  const searchParams = useSearchParams();
  const router = useRouter();

  const pageParam = Number(searchParams.get("page") || "0");
  const currentPage = pageParam + 1;

  const handlePageChange = (page: number) => {
    if (page < 0 || page > totalPages) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", (page - 1).toString());
    router.push(`?${params.toString()}`);

    setPages(page - 1);
  };

  const handleEllipsis = (page: number) => {
    handlePageChange(page);
  }

  // Calculate page range  (only show 3 page number, the rest will be ellipsis)
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