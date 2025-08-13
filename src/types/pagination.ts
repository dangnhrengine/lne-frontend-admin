export interface Pagination {
  search?: string;
  searchFields?: string[];
  limit: number;
  currentPage: number;
  sortBy?: string;
  orderBy?: 'DESC' | 'ASC';
}
