import { IMember } from '@/api/members/types';

export interface IMemberRegisterRequestDto extends IMember {}

export interface IMemberRegisterResponseDto extends IMember {
  loginId: string;
}
