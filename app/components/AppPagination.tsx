import { useNavigate } from "react-router";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";

interface AppPaginationProps {
  currentPage: number;
  totalPages: number;
  /** Default: "page" — the URL query param name, e.g. ?page=2 */
  paramName?: string;
  /** Override navigation entirely (e.g. if you need extra params) */
  onPageChange?: (page: number) => void;
  className?: string;
}

function getPageNumbers(
  currentPage: number,
  totalPages: number,
): (number | "ellipsis")[] {
  const delta = 1;
  const range: number[] = [];

  for (
    let i = Math.max(2, currentPage - delta);
    i <= Math.min(totalPages - 1, currentPage + delta);
    i++
  ) {
    range.push(i);
  }

  if (currentPage - delta > 2) range.unshift(-1);
  if (currentPage + delta < totalPages - 1) range.push(-2);

  const result: (number | "ellipsis")[] = [1];
  for (const r of range) {
    result.push(r < 0 ? "ellipsis" : r);
  }
  if (totalPages > 1) result.push(totalPages);

  return result;
}

const AppPagination = ({
  currentPage,
  totalPages,
  paramName = "page",
  onPageChange,
  className,
}: AppPaginationProps) => {
  const navigate = useNavigate();

  if (totalPages <= 1) return null;

  const goTo = (page: number) => {
    if (page < 1 || page > totalPages) return;
    if (onPageChange) {
      onPageChange(page);
    } else {
      navigate(`?${paramName}=${page}`);
    }
  };

  const pages = getPageNumbers(currentPage, totalPages);

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => goTo(currentPage - 1)}
            aria-disabled={currentPage === 1}
            className={
              currentPage === 1
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>

        {pages.map((p, idx) =>
          p === "ellipsis" ? (
            <PaginationItem key={`ellipsis-${idx}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={p}>
              <PaginationLink
                isActive={p === currentPage}
                onClick={() => goTo(p)}
                className="cursor-pointer"
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationNext
            onClick={() => goTo(currentPage + 1)}
            aria-disabled={currentPage === totalPages}
            className={
              currentPage === totalPages
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default AppPagination;
