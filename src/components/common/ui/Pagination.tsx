import { cn } from '@/utils';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import React, { useCallback } from 'react';
import { Button } from './Button';

interface PaginationProps {
  current: number;
  totalPages: number;
  onChange: (page: number) => void;
  className?: string;
}

interface ButtonPaginationProps {
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick: () => void;
}

const ButtonPagination = ({
  disabled,
  className = '',
  children,
  onClick,
}: ButtonPaginationProps) => {
  return (
    <Button
      variant="outline"
      size="md"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex-center size-12 cursor-pointer rounded border border-gray-500 bg-white !p-0 text-gray-900 hover:bg-gray-200 disabled:!cursor-not-allowed',
        className
      )}
    >
      {children}
    </Button>
  );
};

export const Pagination: React.FC<PaginationProps> = ({
  current,
  totalPages,
  onChange,
  className = '',
}) => {
  const getPageNumbers = useCallback(() => {
    const pages = [];
    const showPages = 5; // Number of page buttons to show

    let start = Math.max(1, current - Math.floor(showPages / 2));
    const end = Math.min(totalPages, start + showPages - 1);

    if (end - start + 1 < showPages) {
      start = Math.max(1, end - showPages + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }, [current, totalPages]);

  if (!totalPages) {
    return null;
  }

  return (
    <div className={`flex-center mt-6 w-full px-4 py-3 ${className}`}>
      <div className="flex items-center space-x-2">
        <ButtonPagination onClick={() => onChange(1)} disabled={current === 1}>
          <ChevronsLeft className="size-5" />
        </ButtonPagination>

        <ButtonPagination
          onClick={() => onChange(current - 1)}
          disabled={current <= 1}
        >
          <ChevronLeft className="size-5" />
        </ButtonPagination>
        {getPageNumbers().map((page) => (
          <ButtonPagination
            key={page}
            onClick={() => onChange(page)}
            className={cn('!border-none', {
              'bg-gray-900 text-white': page === current,
              'bg-transparent text-gray-900': page !== current,
            })}
          >
            {page}
          </ButtonPagination>
        ))}

        {totalPages > 5 && current < totalPages - 2 && (
          <>
            <span className="px-2 text-gray-400">...</span>
            <ButtonPagination
              onClick={() => onChange(totalPages)}
              className="border-none"
            >
              {totalPages}
            </ButtonPagination>
          </>
        )}
        <ButtonPagination
          onClick={() => onChange(current + 1)}
          disabled={current >= totalPages}
        >
          <ChevronRight className="size-5" />
        </ButtonPagination>
        <ButtonPagination
          onClick={() => onChange(totalPages)}
          disabled={current === totalPages || !totalPages}
        >
          <ChevronsRight className="size-5" />
        </ButtonPagination>
      </div>
    </div>
  );
};

Pagination.displayName = 'Pagination';
