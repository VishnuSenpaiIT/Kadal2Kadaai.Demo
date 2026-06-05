export interface Pagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
  next_page_url: string | null;
  prev_page_url: string | null;
}

export interface Meta {
  version: string;
  timestamp: string;
  request_id: string;
  error_code?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  pagination?: Pagination;
  meta: Meta;
  errors?: Record<string, string[]>;
}
