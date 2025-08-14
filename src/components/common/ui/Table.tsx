// Types
export interface Column<T> {
  key: keyof T | string;
  title: string;
  width?: string;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  rowKey: keyof T | ((record: T) => string);
  className?: string;
  onSort?: (field: string, order: 'asc' | 'desc') => void;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
}

export const Table = <T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  rowKey,
  className = '',
  onSort,
  sortField,
  sortOrder,
}: TableProps<T>) => {
  // Get row key
  const getRowKey = (record: T, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return String(record[rowKey] || index);
  };

  // Handle sort
  const handleSort = (field: string) => {
    if (!onSort) return;

    if (sortField === field) {
      onSort(field, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      onSort(field, 'asc');
    }
  };

  if (loading) {
    return (
      <div
        className={`rounded-lg border border-gray-200 bg-white ${className}`}
      >
        <div className="flex h-64 items-center justify-center">
          <div className="text-gray-500">読み込み中...</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`overflow-hidden rounded-lg border border-gray-200 bg-white ${className}`}
    >
      <div className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 overflow-x-auto">
        <table className="w-full min-w-max">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              {columns.map((column, index) => (
                <th
                  key={String(column.key) || index}
                  className={`whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-700 ${
                    column.align === 'center'
                      ? 'text-center'
                      : column.align === 'right'
                        ? 'text-right'
                        : 'text-left'
                  } ${column.sortable ? 'cursor-pointer select-none hover:bg-gray-100' : ''} transition-colors`}
                  style={{
                    width: column.width,
                    minWidth: column.width || '120px', // Ensure minimum width
                  }}
                  onClick={() =>
                    column.sortable && handleSort(String(column.key))
                  }
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.title}</span>
                    {column.sortable && sortField === column.key && (
                      <span className="text-blue-500">
                        {sortOrder === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
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
                      className={`whitespace-nowrap px-4 py-3 text-sm text-gray-900 ${
                        column.align === 'center'
                          ? 'text-center'
                          : column.align === 'right'
                            ? 'text-right'
                            : 'text-left'
                      }`}
                      style={{ minWidth: column.width || '120px' }}
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
                  データがありません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

Table.displayName = 'Table';
