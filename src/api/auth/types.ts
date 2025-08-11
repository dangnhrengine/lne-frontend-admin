import { IUser } from '@/api/users';

export interface IAuthLoginResponseDto {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}

export interface ILoginRequestDto {
  loginId: string;
  password: string;
}
