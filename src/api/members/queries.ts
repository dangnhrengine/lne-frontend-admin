import { QUERY_KEYS } from '@/constants';
import { useQuery } from '@tanstack/react-query';
import type { IFilterMembersDto } from '@/api/members/types';
import { filterMembers } from '@/api/members/members.service';

export const useFilterMembersQuery = (filter: IFilterMembersDto) => {
  return useQuery({
    queryKey: [QUERY_KEYS.FILTER_MEMBERS, filter],
    queryFn: () => filterMembers(filter),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
    refetchOnWindowFocus: false,
  });
};
