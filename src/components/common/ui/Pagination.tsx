import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface PaginationProps {
  current: number;
  total: number;
  pageSize: number;
  onChange: (page: number, pageSize: number) => void;
  showSizeChanger?: boolean;
  pageSizeOptions?: number[];
  className?: string;
}

// Pagination component
export const Pagination: React.FC<PaginationProps> = ({
  current,
  total,
  pageSize,
  onChange,
  showSizeChanger = true,
  pageSizeOptions = [10, 20, 50, 100],
  className = '',
}) => {
  const totalPages = Math.ceil(total / pageSize);
  const startItem = (current - 1) * pageSize + 1;
  const endItem = Math.min(current * pageSize, total);

  const getPageNumbers = () => {
    const pages = [];
    const showPages = 5; // Number of page buttons to show

    let start = Math.max(1, current - Math.floor(showPages / 2));
    let end = Math.min(totalPages, start + showPages - 1);

    if (end - start + 1 < showPages) {
      start = Math.max(1, end - showPages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div
      className={`flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 ${className}`}
    >
      <div className="flex items-center text-sm text-gray-500">
        <span>
          表示 {startItem}-{endItem} / {total}件
        </span>
        {showSizeChanger && (
          <select
            value={pageSize}
            onChange={(e) => onChange(1, Number(e.target.value))}
            className="ml-4 rounded border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}件/页
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="flex items-center space-x-1">
        <button
          onClick={() => onChange(current - 1, pageSize)}
          disabled={current <= 1}
          className="rounded border border-gray-300 px-2 py-1 text-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onChange(page, pageSize)}
            className={`rounded border px-3 py-1 text-sm transition-colors ${
              page === current
                ? 'border-blue-500 bg-blue-500 text-white'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}

        {totalPages > 5 && current < totalPages - 2 && (
          <>
            <span className="px-2 text-gray-400">...</span>
            <button
              onClick={() => onChange(totalPages, pageSize)}
              className="rounded border border-gray-300 px-3 py-1 text-sm transition-colors hover:bg-gray-50"
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => onChange(current + 1, pageSize)}
          disabled={current >= totalPages}
          className="rounded border border-gray-300 px-2 py-1 text-sm transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

Pagination.displayName = 'Pagination';
