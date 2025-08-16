export interface BaseResponseWithoutDataDto {
  code?: string | number;
  message?: string;
  errors?: unknown;
}

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
  pagingCounter?: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}

export interface IBase {
  id?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export type OrderBy = 'DESC' | 'ASC';

export interface IPaginationDto<T> {
  search?: string;
  searchFields?: string[];
  limit: string;
  currentPage: string;
  sortBy?: keyof T;
  orderBy?: OrderBy;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
}
