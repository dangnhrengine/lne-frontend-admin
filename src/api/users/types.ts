import { IBase } from '@/api/common';

export interface IUser extends IBase {
  loginId: string;
  name: string;
}
