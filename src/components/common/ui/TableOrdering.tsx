import { BaseResponseListDto, OrderBy } from '@/api/common/types';
import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from './Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './DropdownMenu';

export interface OrderOption<T> {
  label: string;
  value: keyof T;
  orderBy: OrderBy;
}

interface TableOrderingProps<T> extends BaseResponseListDto<T> {
  orderOptions: OrderOption<T>[];
  handleOrderChange: (value: keyof T) => void;
}

export const TableOrdering = <T,>({
  orderOptions,
  total,
  pagingCounter,
  limit,
  page,
  handleOrderChange,
}: TableOrderingProps<T>) => {
  const t = useTranslations('ui.table');
  return (
    <div className="mb-4 flex w-full items-center justify-between">
      <p className="text-sm text-gray-900">
        {t('totalItems', {
          total: total || 0,
          from: pagingCounter || 0,
          to: page && limit ? page * limit : 0,
        })}
      </p>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex w-[200px] items-center justify-between gap-2 rounded-md border-gray-300 max-sm:px-2"
          >
            {orderOptions[0].label}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 rounded-md border bg-white p-1 shadow-lg"
        >
          {orderOptions.map((option, index) => (
            <DropdownMenuItem
              key={index}
              onClick={() => handleOrderChange(option.value)}
              className="flex cursor-pointer items-center gap-2 rounded-sm px-3 py-2 text-sm transition-colors hover:bg-gray-50 hover:text-gray-700 focus:bg-gray-50 focus:text-gray-700 focus:outline-none"
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
