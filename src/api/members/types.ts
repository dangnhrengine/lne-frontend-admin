import type { IBase, IPaginationDto } from '@/api/common/types';
import { ILnePersonsResponseDto } from '@/api/lne-persons/types';
import { MEMBER_STATUS } from '@/types/members';

export interface IFilterMembersDto extends IPaginationDto<IMember> {
  loginId?: string;
  name?: string;
  lnePhone?: string;
  transactionsNumber?: number;
  referrerId?: string;
  lnePersonId?: string;
  status?: MEMBER_STATUS;
}

export interface IMember extends IBase {
  id: string;
  loginId: string;
  name: string;
  email: string;
  gender: 'male' | 'female';
  customPhone: string;
  lnePhone: string;
  dateOfBirth: Date;
  transactionsNumber: number;
  referrerId: string;
  lnePersonId: string;
  status: MEMBER_STATUS;
  membershipFeeRate: number;
  introducedFeeRate: number;
  lnePerson: ILnePersonsResponseDto;
  isActive: boolean;
  referrer?: IMember;
  createdByAdminId?: string;
}

export interface ISwitchMemberStatusDto {
  id: string;
  status: MEMBER_STATUS;
}

export type IMemberRegistration = Pick<
  IMember,
  | 'name'
  | 'email'
  | 'gender'
  | 'customPhone'
  | 'lnePhone'
  | 'dateOfBirth'
  | 'referrerId'
  | 'lnePersonId'
  | 'membershipFeeRate'
  | 'introducedFeeRate'
>;
