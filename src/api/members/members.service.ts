import { API_ENDPOINT } from '@/api/common';
import type {
  BaseResponseDto,
  BaseResponseListDto,
  BaseResponseWithoutDataDto,
} from '@/api/common/types';
import { axiosClient, withApiErrorHandling } from '@/api/lib';
import type {
  IFilterMembersDto,
  IMember,
  IMemberFormData,
  ISwitchMemberStatusDto,
} from '@/api/members/types';
import { isNotEmpty } from '@/utils';
import pickBy from 'lodash.pickby';
import queryString from 'query-string';

export const filterMembers = async (filter: IFilterMembersDto) => {
  return withApiErrorHandling(async () => {
    const queryParams = queryString.stringify(
      pickBy(filter, (v) => isNotEmpty(v))
    );
    const { data } = await axiosClient.get<BaseResponseListDto<IMember>>(
      `${API_ENDPOINT.MEMBERS.FILTER}?${queryParams}`
    );

    // API wrapper returns { code, message, data }
    if (!data?.data) {
      throw new Error(data?.message || 'Failed to filter members');
    }

    return data;
  });
};

export const switchStatus = async (props: ISwitchMemberStatusDto) => {
  return withApiErrorHandling(async () => {
    const { data } = await axiosClient.put<Promise<BaseResponseWithoutDataDto>>(
      `${API_ENDPOINT.MEMBERS.SWITCH_STATUS.replace(':id', props.id)}`,
      {
        status: props.status,
      }
    );

    return data;
  });
};

export const toggleArchiveMember = async (id: string) => {
  return withApiErrorHandling(async () => {
    const { data } = await axiosClient.put<Promise<BaseResponseWithoutDataDto>>(
      `${API_ENDPOINT.MEMBERS.TOGGLE_ARCHIVE.replace(':id', id)}`
    );

    return data;
  });
};

export const registerMember = async (payload: IMemberFormData) => {
  return withApiErrorHandling(async () => {
    const { data } = await axiosClient.post<
      Promise<BaseResponseWithoutDataDto>
    >(API_ENDPOINT.MEMBERS.REGISTER, payload);

    return data;
  });
};

export const getMemberByLoginId = async (loginId: string) => {
  return withApiErrorHandling(async () => {
    const { data } = await axiosClient.get<BaseResponseDto<IMember>>(
      `${API_ENDPOINT.MEMBERS.GET_BY_LOGIN_ID.replace(':loginId', loginId)}`
    );

    if (!data?.data) {
      throw new Error(data?.message || 'Get member failed - no data returned');
    }

    const member = {
      ...data.data,
      dateOfBirth: new Date(data.data.dateOfBirth),
    };
    return member;
  });
};

export const editMember = async (loginId: string, payload: IMemberFormData) => {
  return withApiErrorHandling(async () => {
    const { data } = await axiosClient.put<Promise<BaseResponseWithoutDataDto>>(
      `${API_ENDPOINT.MEMBERS.EDIT.replace(':loginId', loginId)}`,
      payload
    );

    return data;
  });
};
