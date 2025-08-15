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
import { cn } from '@/utils';
import { formatDatePretty } from '@/utils/date';
import { Trash, Undo, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useCallback, useMemo } from 'react';

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
        'cursor-pointer rounded bg-white px-4 py-2 text-base font-medium text-gray-600 transition-all duration-200 ease-in-out hover:bg-gray-50 focus:outline-none',
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

export const MemberList = ({
  isLoading,
  filterMemberResponse,
  filter,
  setFilter,
  handleSwitchStatus,
  handleShowArchiveModal,
}: {
  isLoading: boolean;
  filterMemberResponse?: BaseResponseListDto<IMember>;
  filter: IFilterMembersDto;
  setFilter: (filter: IFilterMembersDto) => void;
  handleSwitchStatus: (record: IMember, status: MEMBER_STATUS) => void;
  handleShowArchiveModal: (record: IMember) => void;
}) => {
  const t = useTranslations('pages.members');
  const { data, page, totalPages, total, limit, pagingCounter } =
    filterMemberResponse || {};
  const { sortBy, orderBy } = filter;

  const columns: Column<IMember>[] = useMemo(
    () => [
      {
        key: 'loginId',
        title: t('loginId'),
        width: '100px',
        sortable: true,
      },
      {
        key: 'name',
        title: t('name'),
        width: '150px',
        sortable: true,
        render: (value: string) => (
          <p className="text-center font-medium text-gray-900">{value}</p>
        ),
      },
      {
        key: 'lnePhone',
        title: t('lnePhone'),
        width: '120px',
        sortable: true,
      },
      {
        key: 'membershipFeeRate',
        title: t('membershipFeeRate'),
        width: '90px',
        sortable: true,
        render: (value: number) => <p>{Number(value) || 0}%</p>,
      },
      {
        key: 'transactionsDate',
        title: t('transactionsDate'),
        width: '130px',
        className: '!whitespace-pre-line',
        render: () => <p>-</p>,
      },
      {
        key: 'referrerDate',
        title: t('referrerDate'),
        width: '100px',
        className: '!whitespace-pre-line',
        render: (value, record) => (
          <div className="flex flex-col items-center">
            <p>{value ? record?.referrer?.name || '-' : t('lneReferrer')}</p>
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
        sortable: true,
        render: (value: number) => <p>{Number(value) || 0}%</p>,
      },
      {
        key: 'status',
        title: t('status'),
        width: '100px',
        sortable: true,
        render: (value, record) => {
          const isValidValue = value === MEMBER_STATUS.VALID;
          const handleToggle = () => {
            handleSwitchStatus(
              record,
              isValidValue ? MEMBER_STATUS.INVALID : MEMBER_STATUS.VALID
            );
          };
          return (
            <SwitchStatus value={isValidValue} onToggle={handleToggle} t={t} />
          );
        },
      },
      {
        key: 'edit-actions',
        title: t('edit'),
        width: '80px',
        render: (_, record) => (
          <Link href={ROUTES.EDIT_MEMBER.replace(':id', record.id)}>
            <Button className="rounded px-6 transition-colors">
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
              className="flex-center w-full !bg-transparent text-primary-500 transition-colors hover:text-primary-700"
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
        label: '会員料率昇順',
        value: 'membershipFeeRate',
        orderBy: 'ASC',
      },
      {
        label: '会員料率降順',
        value: 'membershipFeeRate',
        orderBy: 'DESC',
      },
      {
        label: '取引回数昇順',
        value: 'transactionsNumber',
        orderBy: 'ASC',
      },
      {
        label: '取引回数降順',
        value: 'transactionsNumber',
        orderBy: 'DESC',
      },
      {
        label: '入会日昇順',
        value: 'createdAt',
        orderBy: 'ASC',
      },
      {
        label: '入会日降順',
        value: 'createdAt',
        orderBy: 'DESC',
      },
      {
        label: '紹介料率昇順',
        value: 'introducedFeeRate',
        orderBy: 'ASC',
      },
      {
        label: '紹介料率降順',
        value: 'introducedFeeRate',
        orderBy: 'DESC',
      },
    ];
  }, []);

  const handlePageChange = useCallback(
    (page: number) => {
      setFilter({
        ...filter,
        currentPage: String(page),
      });
    },
    [filter, setFilter]
  );

  const handleSort = useCallback(
    (field: keyof IMember, order: OrderBy) => {
      setFilter({
        ...filter,
        sortBy: field,
        orderBy: order,
      });
    },
    [filter, setFilter]
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <TableOrdering
        total={total}
        pagingCounter={pagingCounter}
        limit={limit}
        page={page}
        orderOptions={orderOptions}
        handleOrderChange={() => {}}
      />

      <Table
        loading={isLoading}
        data={data || []}
        columns={columns}
        rowKey="id"
        onSort={handleSort}
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
};
