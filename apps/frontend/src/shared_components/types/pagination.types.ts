// Pagination types
export interface PaginationParams {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  filters?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Pagination state for UI
export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}

