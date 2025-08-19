import { getAllLnePersons } from '@/api/lne-persons';
import { QUERY_KEYS } from '@/constants';
import { useQuery } from '@tanstack/react-query';

export const useGetLnePersonsQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.LNE_PERSONS],
    queryFn: () => getAllLnePersons(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
