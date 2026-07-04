import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../axios';

export interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string;
  link_url: string | null;
  product_id: string | null;
  order_index: number;
  product?: {
    id: string;
    name: string;
    slug: string;
    price: number;
    sale_price: number | null;
  } | null;
}

export function useBanners() {
  return useQuery<Banner[]>({
    queryKey: ['banners'],
    queryFn: async () => {
      const { data } = await apiClient.get('/v1/marketplace/banners');
      return data.data as Banner[];
    },
    staleTime: 60_000,
  });
}
