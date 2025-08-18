import { filterMembers, getMemberById } from '@/api/members/members.service';
import type { IFilterMembersDto } from '@/api/members/types';
import { QUERY_KEYS } from '@/constants';
import { useQuery } from '@tanstack/react-query';

export const useFilterMembersQuery = (filter: IFilterMembersDto) => {
  return useQuery({
    queryKey: [QUERY_KEYS.FILTER_MEMBERS, filter],
    queryFn: () => filterMembers(filter),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnMount: 'always',
  });
};

export const useGetMemberByIdQuery = (id: string) =>
  useQuery({
    queryKey: [QUERY_KEYS.GET_MEMBER_BY_ID, id],
    queryFn: () => getMemberById(id),
  });
