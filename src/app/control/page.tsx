'use client';

import {
  IFilterMembersDto,
  IMember,
  useExportCsvQuery,
  useFilterMembersQuery,
  useSwitchStatusMutation,
  useToggleArchiveMutation,
} from '@/api/members';
import { ProtectedRoute } from '@/components/auth';
import { Alert, Button } from '@/components/common/ui';
import { AlertProps } from '@/components/common/ui/Alert';
import { QUERY_KEYS } from '@/constants';
import { MEMBER_STATUS } from '@/types/members';
import { logError } from '@/utils';
import { convertDateToISOString } from '@/utils/helpers';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowDownToLine } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useMemo, useState } from 'react';
import FilterMembersForm from './_components/filter-members-form';
import { FilterMemberFormData } from './_components/filter-members-form/form-schema';
import { MemberList } from './_components/member-list';
import { ToggleArchiveModal } from './_components/toggle-archive-modal';

export default function MembersPage() {
  const t = useTranslations('pages.members');
  const queryClient = useQueryClient();

  const [filter, setFilter] = useState<IFilterMembersDto>({
    limit: '50',
    currentPage: '1',
    searchFields: ['loginId', 'name', 'lnePhone', 'referrerId', 'lnePersonId'],
    search: '',
    isActive: true,
    startDate: undefined,
    endDate: undefined,
    orderBy: 'DESC',
    sortBy: 'createdAt',
    loginId: '',
    name: '',
    lnePhone: '',
    transactionsNumber: undefined,
    referrerId: '',
    lnePersonId: '',
    status: MEMBER_STATUS.VALID,
  });

  const [alertContext, setAlertContext] = useState<AlertProps>({
    open: false,
    title: '',
  });

  const [currentMember, setCurrentMember] = useState<IMember | null>(null);

  const isMemberActive = useMemo(
    () => !!currentMember?.isActive,
    [currentMember]
  );

  const { data: filterMemberResponse, isLoading: isLoadingFilter } =
    useFilterMembersQuery(filter);

  const { refetch: fetchCsvData, isLoading: isExportingCsv } =
    useExportCsvQuery(filter);
  const handleExportCsv = async () => {
    try {
      const { data: blob, isError, error } = await fetchCsvData();

      if (isError) {
        setAlertContext({
          open: true,
          title: t('export-csv-error'),
          variant: 'error',
        });
        throw error;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute(
        'download',
        `members-${new Date().toISOString().replace(/[:.]/g, '-')}.csv`
      );
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      logError('Failed to export CSV:', error);
    }
  };

  const { mutateAsync: switchStatus } = useSwitchStatusMutation();
  const { mutateAsync: toggleArchive, isPending: isLoadingArchive } =
    useToggleArchiveMutation();

  const handleSwitchStatus = useCallback(
    async (record: IMember, status: MEMBER_STATUS) => {
      try {
        const isValid = status === MEMBER_STATUS.VALID;
        await switchStatus({ id: record.id, status });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.FILTER_MEMBERS, filter],
        });
        setAlertContext({
          open: true,
          title: t(`status-${isValid ? 'valid' : 'invalid'}-message`, {
            name: record.name,
          }),
        });
      } catch (error) {
        logError('Failed to switch status:', error);
      }
    },
    [switchStatus, queryClient, t]
  );

  const handleShowArchiveModal = useCallback((record: IMember) => {
    setCurrentMember(record);
  }, []);

  const handleCloseArchiveModal = useCallback(() => {
    setCurrentMember(null);
  }, []);

  const handleToggleArchive = useCallback(async () => {
    if (!currentMember) {
      return;
    }
    try {
      await toggleArchive(currentMember.id);
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.FILTER_MEMBERS, filter],
      });
      setAlertContext({
        open: true,
        title: t(`${isMemberActive ? 'archive' : 'unarchive'}-member-message`, {
          name: currentMember.name,
        }),
      });

      setCurrentMember(null);
    } catch (error) {
      logError('Failed to toggle archive:', error);
    }
  }, [currentMember, toggleArchive, isMemberActive, filter, queryClient, t]);

  const onCloseAlert = useCallback(() => {
    setAlertContext({ open: false, title: '' });
  }, []);

  const onSubmitFilters = useCallback(
    (filter: FilterMemberFormData) => {
      setFilter((prev) => ({
        ...prev,
        ...(filter as IFilterMembersDto),
        isActive: !filter.isArchived,
        startDate: convertDateToISOString(filter.startDate),
        endDate: convertDateToISOString(filter.endDate),
      }));
    },
    [filter]
  );

  return (
    <ProtectedRoute requireAuth={true}>
      <div className="p-6">
        <div className="mb-6 flex w-full items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
          <Button
            size="lg"
            className="gap-x-2 font-semibold"
            onClick={handleExportCsv}
            loading={isExportingCsv}
            loadingText={t('exporting-csv')}
          >
            <div className="flex items-center gap-x-1">
              {t.rich('export-csv-button', {
                small: (chunks) => (
                  <span className="text-sm max-md:hidden">{chunks}</span>
                ),
              })}
            </div>
            <ArrowDownToLine />
          </Button>
        </div>
        <Alert
          {...alertContext}
          onClose={onCloseAlert}
          autoCloseMs={3000}
          className="mb-6"
        />

        <FilterMembersForm onSubmitFilters={onSubmitFilters} />
      </div>
      <MemberList
        isLoading={isLoadingFilter}
        filter={filter}
        filterMemberResponse={filterMemberResponse}
        setFilter={setFilter}
        handleSwitchStatus={handleSwitchStatus}
        handleShowArchiveModal={handleShowArchiveModal}
      />
      {currentMember && (
        <ToggleArchiveModal
          title={t(`${isMemberActive ? 'archive' : 'unarchive'}-member-title`)}
          description={t(
            `${isMemberActive ? 'archive' : 'unarchive'}-member-description`
          )}
          isLoading={isLoadingArchive}
          isOpen={!!currentMember}
          closeOnPressEscape={false}
          closeOnClickOutside={false}
          onClose={handleCloseArchiveModal}
          onSubmit={handleToggleArchive}
        />
      )}
    </ProtectedRoute>
  );
}
