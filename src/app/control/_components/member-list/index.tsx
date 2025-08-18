import { BaseResponseListDto, OrderBy } from '@/api/common';
import { IFilterMembersDto, IMember } from '@/api/members';
import {
  Button,
  Pagination,
  Table,
  TableOrdering,
} from '@/components/common/ui';
import { Column } from '@/components/common/ui/Table';
import { OrderOption } from '@/components/common/ui/TableOrdering';
import { ROUTES } from '@/constants';
import { Translation } from '@/hooks/useFormSchemaWithTranslation';
import { MEMBER_STATUS } from '@/types/members';
import { cn, isNotEmpty } from '@/utils';
import { formatDatePretty } from '@/utils/date';
import { Trash, Undo, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { memo, useCallback, useMemo, useRef } from 'react';

interface SwitchStatusProps {
  value: boolean;
  onToggle: () => void;
  t: Translation;
}

interface SwitchButtonProps {
  text: string;
  isActive: boolean;
  disabled: boolean;
  onToggle: () => void;
}

const SwitchButton = ({
  text,
  disabled,
  isActive,
  onToggle,
}: SwitchButtonProps) => {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={cn(
        'cursor-pointer rounded bg-white px-4 py-2 text-sm font-medium text-gray-800 transition-all duration-200 ease-in-out hover:bg-gray-50 focus:outline-none',
        {
          'bg-gray-900 text-white hover:bg-gray-700': isActive,
          'cursor-not-allowed': disabled,
        }
      )}
    >
      {text}
    </button>
  );
};

const SwitchStatus: React.FC<SwitchStatusProps> = ({ value, onToggle, t }) => {
  return (
    <div className="inline-flex gap-x-0.5 overflow-hidden rounded border border-gray-300 bg-white p-0.5 shadow-sm">
      <SwitchButton
        text={t('status-valid')}
        isActive={value}
        disabled={value}
        onToggle={onToggle}
      />
      <SwitchButton
        text={t('status-invalid')}
        isActive={!value}
        disabled={!value}
        onToggle={onToggle}
      />
    </div>
  );
};

export const MemberList = memo(
  ({
    isLoading,
    filterMemberResponse,
    filter,
    onChangeFilters,
    handleSwitchStatus,
    handleShowArchiveModal,
  }: {
    isLoading: boolean;
    filterMemberResponse?: BaseResponseListDto<IMember>;
    filter: IFilterMembersDto;
    onChangeFilters: (filter: IFilterMembersDto) => void;
    handleSwitchStatus: (record: IMember, status: MEMBER_STATUS) => void;
    handleShowArchiveModal: (record: IMember) => void;
  }) => {
    const t = useTranslations('pages.members');
    const tOrdering = useTranslations('ordering');
    const isDefaultOrderRef = useRef(true);

    const { data, page, totalPages, total, limit, pagingCounter } =
      filterMemberResponse || {};
    const { sortBy, orderBy } = filter;

    const columns: Column<IMember>[] = useMemo(
      () => [
        {
          key: 'loginId',
          title: t('loginId'),
          width: '100px',
          sortable: false,
        },
        {
          key: 'name',
          title: t('name'),
          width: '150px',
          sortable: false,
          render: (value: string) => (
            <p className="text-center font-medium text-primary-800">{value}</p>
          ),
        },
        {
          key: 'lnePhone',
          title: t('lnePhone'),
          width: '120px',
          sortable: false,
        },
        {
          key: 'membershipFeeRate',
          title: t('membershipFeeRate'),
          width: '90px',
          sortable: false,
          render: (value: number) => <p>{Number(value) || 0}%</p>,
        },
        {
          key: 'transactionsDate',
          title: t('transactionsDate'),
          width: '130px',
          className: '!whitespace-pre-line',
          render: (_, record) =>
            isNotEmpty(record.transactionCount) &&
            isNotEmpty(record.lastDateTransaction) ? (
              <div className="flex flex-col items-center">
                <p>
                  {t('transactionCount', {
                    count: record.transactionCount || 0,
                  })}
                </p>
                <p>
                  {formatDatePretty({
                    value: record.lastDateTransaction || '',
                  })}
                </p>
              </div>
            ) : (
              <p>-</p>
            ),
        },
        {
          key: 'referrerDate',
          title: t('referrerDate'),
          width: '100px',
          className: '!whitespace-pre-line',
          render: (_, record) => (
            <div className="flex flex-col items-center">
              <p>
                {record?.referrer?.name
                  ? record?.referrer?.name
                  : t('lneReferrer')}
              </p>
              <div className="flex items-center gap-x-1">
                <User className="h-4 w-4 text-gray-400" />
                {formatDatePretty({
                  value: record.createdAt || '',
                })}
              </div>
            </div>
          ),
        },
        {
          key: 'introducedFeeRate',
          title: t('introducedFeeRate'),
          width: '90px',
          sortable: false,
          render: (value: number) => <p>{Number(value) || 0}%</p>,
        },
        {
          key: 'status',
          title: t('status'),
          width: '100px',
          sortable: false,
          render: (value, record) => {
            const isValidValue = value === MEMBER_STATUS.VALID;
            const handleToggle = () => {
              handleSwitchStatus(
                record,
                isValidValue ? MEMBER_STATUS.INVALID : MEMBER_STATUS.VALID
              );
            };
            return (
              <SwitchStatus
                value={isValidValue}
                onToggle={handleToggle}
                t={t}
              />
            );
          },
        },
        {
          key: 'edit-actions',
          title: t('edit'),
          width: '80px',
          render: (_, record) => (
            <Link href={ROUTES.EDIT_MEMBER.replace(':id', record.id)}>
              <Button className="h-[42px] rounded-md px-6 transition-colors">
                {t('change')}
              </Button>
            </Link>
          ),
        },
        {
          key: 'delete-actions',
          title: t('delete'),
          width: '80px',
          render: (_, record) => {
            const isActive = record.isActive;
            return (
              <Button
                className={cn(
                  'flex-center w-full !bg-transparent text-primary-500 transition-colors hover:text-primary-700',
                  {
                    isArchived: !record.isActive,
                  }
                )}
                onClick={() => handleShowArchiveModal(record)}
              >
                {isActive ? (
                  <Trash fill="currentColor" />
                ) : (
                  <Undo className="text-red-500 hover:text-red-800" />
                )}
              </Button>
            );
          },
        },
      ],
      [handleShowArchiveModal, handleSwitchStatus, t]
    );

    const orderOptions: OrderOption<IMember>[] = useMemo(() => {
      return [
        {
          label: `${t('orderFields.membershipFeeRate')}${tOrdering('asc')}`,
          value: 'membershipFeeRate',
          orderBy: 'ASC',
        },
        {
          label: `${t('orderFields.membershipFeeRate')}${tOrdering('desc')}`,
          value: 'membershipFeeRate',
          orderBy: 'DESC',
        },
        {
          label: `${t('orderFields.transactionsNumber')}${tOrdering('asc')}`,
          value: 'transactionCount',
          orderBy: 'ASC',
        },
        {
          label: `${t('orderFields.transactionsNumber')}${tOrdering('desc')}`,
          value: 'transactionCount',
          orderBy: 'DESC',
        },
        {
          label: `${t('orderFields.transactionsDate')}${tOrdering('asc')}`,
          value: 'lastDateTransaction' as keyof IMember,
          orderBy: 'ASC',
        },
        {
          label: `${t('orderFields.transactionsDate')}${tOrdering('desc')}`,
          value: 'lastDateTransaction' as keyof IMember,
          orderBy: 'DESC',
        },
        {
          label: `${t('orderFields.createdAt')}${tOrdering('asc')}`,
          value: 'createdAt',
          orderBy: 'ASC',
        },
        {
          label: `${t('orderFields.createdAt')}${tOrdering('desc')}`,
          value: 'createdAt',
          orderBy: 'DESC',
        },
        {
          label: `${t('orderFields.introducedFeeRate')}${tOrdering('asc')}`,
          value: 'introducedFeeRate',
          orderBy: 'ASC',
        },
        {
          label: `${t('orderFields.introducedFeeRate')}${tOrdering('desc')}`,
          value: 'introducedFeeRate',
          orderBy: 'DESC',
        },
      ];
    }, [t, tOrdering]);

    const orderLabel = useMemo(() => {
      const defaultLabel = t('orderFields.default');
      if (isDefaultOrderRef.current && sortBy === 'createdAt') {
        return defaultLabel;
      }
      const currentOption = orderOptions.find(
        (option) => option.value === sortBy
      );
      return currentOption?.label || defaultLabel;
    }, [orderOptions, sortBy, isDefaultOrderRef, t]);

    const handlePageChange = useCallback(
      (page: number) => {
        onChangeFilters({
          ...filter,
          currentPage: String(page),
        });
      },
      [filter, onChangeFilters]
    );

    const handleOrderChange = useCallback(
      (field: keyof IMember, order: OrderBy) => {
        isDefaultOrderRef.current = false;
        onChangeFilters({
          ...filter,
          sortBy: field,
          orderBy: order,
        });
      },
      [filter, onChangeFilters]
    );

    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <TableOrdering
          orderLabel={orderLabel}
          total={total}
          pagingCounter={pagingCounter}
          limit={limit}
          page={page}
          orderOptions={orderOptions}
          handleOrderChange={handleOrderChange}
        />

        <Table
          loading={isLoading}
          data={data || []}
          columns={columns}
          rowKey="id"
          sortField={sortBy}
          sortOrder={orderBy}
          className="shadow-sm"
        />

        <Pagination
          current={page || 1}
          totalPages={totalPages || 0}
          onChange={handlePageChange}
        />
      </div>
    );
  }
);

MemberList.displayName = 'MemberList';
