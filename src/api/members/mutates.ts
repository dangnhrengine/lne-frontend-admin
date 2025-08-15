import {
  ISwitchMemberStatusDto,
  switchStatus,
  toggleArchiveMember,
} from '@/api/members';
import { useMutation } from '@tanstack/react-query';

export const useSwitchStatusMutation = () =>
  useMutation({
    mutationFn: (payload: ISwitchMemberStatusDto) => switchStatus(payload),
  });

export const useToggleArchiveMutation = () =>
  useMutation({
    mutationFn: (id: string) => toggleArchiveMember(id),
  });
