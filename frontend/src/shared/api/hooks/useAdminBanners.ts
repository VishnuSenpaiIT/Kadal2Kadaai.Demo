import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../axios';

export interface AdminBanner {
  id: string;
  title: string;
  subtitle: string | null;
  image_url: string;
  link_url: string | null;
  product_id: string | null;
  is_active: boolean;
  order_index: number;
  product?: {
    id: string;
    name: string;
    slug: string;
    price: number;
    sale_price: number | null;
  } | null;
}

export interface CreateBannerPayload {
  title: string;
  subtitle?: string | null;
  link_url?: string | null;
  product_id?: string | null;
  is_active?: boolean;
  order_index?: number;
  image: File;
}

export interface UpdateBannerPayload {
  title?: string;
  subtitle?: string | null;
  link_url?: string | null;
  product_id?: string | null;
  is_active?: boolean;
  order_index?: number;
  image?: File | null;
}

export function useAdminBanners() {
  return useQuery<AdminBanner[]>({
    queryKey: ['admin', 'banners'],
    queryFn: async () => {
      const { data } = await apiClient.get('/v1/admin/banners');
      return data.data as AdminBanner[];
    },
  });
}

export function useCreateBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateBannerPayload) => {
      const formData = new FormData();
      formData.append('title', payload.title);
      if (payload.subtitle) formData.append('subtitle', payload.subtitle);
      if (payload.link_url) formData.append('link_url', payload.link_url);
      if (payload.product_id) formData.append('product_id', payload.product_id);
      if (payload.is_active !== undefined) formData.append('is_active', payload.is_active ? '1' : '0');
      if (payload.order_index !== undefined) formData.append('order_index', String(payload.order_index));
      formData.append('image', payload.image);

      const { data } = await apiClient.post('/v1/admin/banners', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data.data as AdminBanner;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'banners'] });
      queryClient.invalidateQueries({ queryKey: ['banners'] });
    },
  });
}

export function useUpdateBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: UpdateBannerPayload }) => {
      const formData = new FormData();
      
      // Laravel requires PUT/PATCH requests with files to be sent as POST with _method=PUT
      formData.append('_method', 'PUT');

      if (payload.title !== undefined) formData.append('title', payload.title);
      if (payload.subtitle !== undefined) formData.append('subtitle', payload.subtitle || '');
      if (payload.link_url !== undefined) formData.append('link_url', payload.link_url || '');
      if (payload.product_id !== undefined) formData.append('product_id', payload.product_id || '');
      if (payload.is_active !== undefined) formData.append('is_active', payload.is_active ? '1' : '0');
      if (payload.order_index !== undefined) formData.append('order_index', String(payload.order_index));
      if (payload.image) {
        formData.append('image', payload.image);
      }

      const { data } = await apiClient.post(`/v1/admin/banners/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data.data as AdminBanner;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'banners'] });
      queryClient.invalidateQueries({ queryKey: ['banners'] });
    },
  });
}

export function useDeleteBanner() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/v1/admin/banners/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'banners'] });
      queryClient.invalidateQueries({ queryKey: ['banners'] });
    },
  });
}
