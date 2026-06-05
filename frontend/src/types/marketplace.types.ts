export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  image: string | null;
  products_count?: number;
  children?: Category[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  sale_price: string | null;
  unit: string;
  minimum_order: string;
  status: string;
  is_featured: boolean;
  is_popular: boolean;
  origin: string | null;
  freshness_notes: string | null;
  weight_options: string[] | null;
  view_count: number;
  meta_title?: string;
  meta_description?: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  seller: {
    id: string;
    first_name: string;
    last_name: string;
    sellerProfile?: {
      store_name: string;
      rating: number;
    }
  };
  images: Array<{
    id: string;
    url: string;
    is_primary: boolean;
  }>;
}

export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}
