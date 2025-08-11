export interface BaseResponseDto<T> {
  code?: string | number;
  message?: string;
  data?: T;
  errors?: unknown;
}

export interface BaseResponseListDto<T> {
  code?: string | number;
  message?: string;
  errors?: unknown;
  data?: T[];
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export interface IBase {
  id?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}
