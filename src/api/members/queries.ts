import { exportCsv, filterMembers } from '@/api/members/members.service';
import type { IFilterMembersDto } from '@/api/members/types';
import { QUERY_KEYS } from '@/constants';
import { useQuery } from '@tanstack/react-query';

export const useFilterMembersQuery = (filter: IFilterMembersDto) => {
  return useQuery({
    queryKey: [QUERY_KEYS.FILTER_MEMBERS, filter],
    queryFn: () => filterMembers(filter),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useExportCsvQuery = (filter: IFilterMembersDto) => {
  return useQuery({
    queryKey: [QUERY_KEYS.EXPORT_CSV, filter],
    queryFn: () => exportCsv(filter),
    enabled: false,
    staleTime: 0,
    gcTime: 0,
  });
};
