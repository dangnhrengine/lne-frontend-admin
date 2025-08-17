import { OrderBy } from '@/api/common';
import { Spinner } from '@/components/common/ui/';
import { cn } from '@/utils';
import { useTranslations } from 'next-intl';
import { useCallback } from 'react';

// Types
export interface Column<T> {
  key: keyof T | string;
  title: string;
  width?: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (value: any, record: T, index: number) => React.ReactNode;
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  rowKey: keyof T | ((record: T) => string);
  className?: string;
  onSort?: (field: keyof T, order: OrderBy) => void;
  sortField?: string;
  sortOrder?: OrderBy;
}

export const Table = <T,>({
  data,
  columns,
  loading = false,
  rowKey,
  className = '',
  onSort,
  sortField,
  sortOrder,
}: TableProps<T>) => {
  const t = useTranslations('ui.table');

  const getRowKey = useCallback(
    (record: T, index: number): string => {
      if (typeof rowKey === 'function') {
        return rowKey(record);
      }
      return String(record[rowKey] || index);
    },
    [rowKey]
  );

  return (
    <div
      className={`overflow-hidden rounded-lg border border-gray-200 bg-white ${className}`}
    >
      <div className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 overflow-x-auto">
        <table className="w-full min-w-max">
          <thead className="border-b border-gray-100 bg-primary-100">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={String(column.key) || index}
                  className={cn(
                    `whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 transition-colors`,
                    {
                      'cursor-pointer select-none hover:bg-gray-100':
                        column?.sortable,
                    },
                    column?.className
                  )}
                  style={{
                    width: column.width,
                    minWidth: column.width || '120px', // Ensure minimum width
                  }}
                  onClick={() =>
                    column?.sortable &&
                    onSort?.(
                      column.key as keyof T,
                      sortOrder === 'ASC' ? 'DESC' : 'ASC'
                    )
                  }
                >
                  <p
                    className="space-x-1"
                    style={{ textAlign: column.align || 'center' }}
                  >
                    {column.title}
                    {column?.sortable && sortField === column.key && (
                      <span className="text-blue-500">
                        {sortOrder === 'ASC' ? '↑' : '↓'}
                      </span>
                    )}
                  </p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-6 text-center">
                  <div className="flex-center">
                    <Spinner />
                  </div>
                </td>
              </tr>
            ) : (
              <>
                {data.map((record, index) => (
                  <tr
                    key={getRowKey(record, index)}
                    className="transition-colors hover:bg-gray-50"
                  >
                    {columns.map((column, colIndex) => {
                      const value = record[column.key as keyof T];
                      const cellContent = column.render
                        ? column.render(value, record, index)
                        : String(value || '');

                      return (
                        <td
                          key={colIndex}
                          className={`whitespace-nowrap px-4 py-6 text-sm text-gray-900`}
                          style={{
                            minWidth: column.width || '120px',
                            textAlign: column.align || 'center',
                          }}
                        >
                          {cellContent}
                        </td>
                      );
                    })}
                  </tr>
                ))}

                {data.length === 0 && (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      {t('noData')}
                    </td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

Table.displayName = 'Table';
