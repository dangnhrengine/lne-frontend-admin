import { API_ENDPOINT } from '@/api/common';
import type { BaseResponseDto } from '@/api/common/types';
import { axiosClient, withApiErrorHandling } from '@/api/lib';
import type { ILnePersonsResponseDto } from '@/api/lne-persons/types';

export const getAllLnePersons = async () => {
  return withApiErrorHandling(async () => {
    const { data } = await axiosClient.get<
      BaseResponseDto<ILnePersonsResponseDto[]>
    >(API_ENDPOINT.LNE_PERSONS.GET_ALL);

    // API wrapper returns { code, message, data }
    if (!data?.data) {
      throw new Error(data?.message || 'Failed to fetch all Lne persons');
    }

    return data.data;
  });
};
