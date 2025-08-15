import { IBase } from '../common';

export interface IMember extends IBase {
  name: string;
  gender: 'male' | 'female';
  birthDate: string;
  email: string;
  customPhone: string;
  lnePhone: string;
  membershipFeeRate: number;
  referrerLoginId: string | null;
  introducedFeeRate: number;
  lnePersonId: string;
}
