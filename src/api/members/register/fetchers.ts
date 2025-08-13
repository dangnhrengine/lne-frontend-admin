import { API_ENDPOINT } from '@/api/common';
import type { BaseResponseDto } from '@/api/common/types';
import { axiosClient, withApiErrorHandling } from '@/api/lib';
import type {
  IMemberRegisterRequestDto,
  IMemberRegisterResponseDto,
} from './types';

export const registerMemberRequest = async (
  payload: IMemberRegisterRequestDto
): Promise<IMemberRegisterResponseDto> => {
  return withApiErrorHandling(async () => {
    const { data } = await axiosClient.post<
      BaseResponseDto<IMemberRegisterResponseDto>
    >(API_ENDPOINT.MEMBERS.REGISTER, payload);

    if (!data?.data) {
      throw new Error(data?.message || 'Register failed - no data returned');
    }

    return data.data;
  });
};
