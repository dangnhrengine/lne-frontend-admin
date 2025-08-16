import {
  editMember,
  IMemberFormData,
  ISwitchMemberStatusDto,
  registerMember,
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

export const useRegisterMemberMutation = () =>
  useMutation({
    mutationFn: (payload: IMemberFormData) => registerMember(payload),
  });

export const useEditMemberMutation = () =>
  useMutation({
    mutationFn: ({
      loginId,
      payload,
    }: {
      loginId: string;
      payload: IMemberFormData;
    }) => editMember(loginId, payload),
  });
