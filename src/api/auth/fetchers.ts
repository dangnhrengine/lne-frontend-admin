import type { IAuthLoginResponseDto, ILoginRequestDto } from '@/api/auth/types';
import { API_ENDPOINT } from '@/api/common';
import type { BaseResponseDto } from '@/api/common/types';
import { axiosClient, withApiErrorHandling } from '@/api/lib';

export const loginRequest = async (payload: ILoginRequestDto) => {
  return withApiErrorHandling(async () => {
    const { data } = await axiosClient.post<
      BaseResponseDto<IAuthLoginResponseDto>
    >(API_ENDPOINT.AUTH.LOGIN, payload);
    
    // API wrapper returns { code, message, data }
    if (!data?.data) {
      throw new Error(data?.message || 'Login failed - no data returned');
    }
    
    return data.data;
  });
};
