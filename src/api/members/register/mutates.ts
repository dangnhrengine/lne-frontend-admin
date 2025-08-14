import { useMutation } from '@tanstack/react-query';
import { registerMemberRequest } from './fetchers';
import { IMemberRegisterRequestDto } from './types';

export const useRegisterMemberMutation = () =>
  useMutation({
    mutationFn: (payload: IMemberRegisterRequestDto) =>
      registerMemberRequest(payload),
  });
