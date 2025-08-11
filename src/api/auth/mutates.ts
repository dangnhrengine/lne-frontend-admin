import { loginRequest, type ILoginRequestDto } from '@/api/auth';
import { useMutation } from '@tanstack/react-query';

export const useLoginMutation = () =>
  useMutation({
    mutationFn: (payload: ILoginRequestDto) => loginRequest(payload),
  });
