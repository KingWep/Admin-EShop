import React from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';

export default function Pagination({
  pageNumber = 1,     // 1-indexed: first page is 1, not 0
  totalPages = 0,
  pageSize,
  totalResults,
  onPageChange,
}) {
  if (totalPages <= 1) return null;

  // 1-indexed page list: [1, 2, 3, ..., totalPages]
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const showResultsSummary = typeof pageSize === 'number' && typeof totalResults === 'number';
  const rangeStart = totalResults === 0 ? 0 : (pageNumber - 1) * pageSize + 1;
  const rangeEnd = Math.min(pageNumber * pageSize, totalResults);

  return (
    <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3 sm:px-6 mt-4 rounded-b-xl">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => onPageChange(pageNumber - 1)}
          disabled={pageNumber === 1}
          className="relative inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(pageNumber + 1)}
          disabled={pageNumber === totalPages}
          className="relative ml-3 inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-700">
            {showResultsSummary ? (
              <>
                Showing <span className="font-medium">{rangeStart}</span> to{' '}
                <span className="font-medium">{rangeEnd}</span> of{' '}
                <span className="font-medium">{totalResults}</span> results
              </>
            ) : (
              <>
                Showing page <span className="font-medium">{pageNumber}</span> of{' '}
                <span className="font-medium">{totalPages}</span>
              </>
            )}
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
            <button
              onClick={() => onPageChange(pageNumber - 1)}
              disabled={pageNumber === 1}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
            >
              <span className="sr-only">Previous</span>
              <HiChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>

            {pages.map(page => {
              const isEdge = page === 1 || page === totalPages;
              const isNearCurrent = page >= pageNumber - 1 && page <= pageNumber + 1;

              if (isEdge || isNearCurrent) {
                return (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                      pageNumber === page
                        ? 'z-10 bg-blue-600 text-white focus-visible:outline-blue-600'
                        : 'text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:outline-offset-0'
                    }`}
                  >
                    {page}
                  </button>
                );
              }

              if (page === pageNumber - 2 || page === pageNumber + 2) {
                return (
                  <span
                    key={page}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-inset ring-slate-300 focus:outline-offset-0"
                  >
                    ...
                  </span>
                );
              }

              return null;
            })}

            <button
              onClick={() => onPageChange(pageNumber + 1)}
              disabled={pageNumber === totalPages}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-slate-400 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
            >
              <span className="sr-only">Next</span>
              <HiChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}