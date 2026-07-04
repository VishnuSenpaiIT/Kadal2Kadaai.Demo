import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../axios';

export interface ShippingRange {
  id: number;
  from_distance: number;
  to_distance: number;
  shipping_price: number;
  status: boolean;
  created_at?: string;
  updated_at?: string;
}

export function useAdminShippingRanges() {
  return useQuery<ShippingRange[]>({
    queryKey: ['admin', 'shipping-ranges'],
    queryFn: async () => {
      const res = await apiClient.get('/v1/admin/shipping-ranges');
      return res.data.data as ShippingRange[];
    },
  });
}

export function useCreateShippingRange() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<ShippingRange>) => {
      const res = await apiClient.post('/v1/admin/shipping-ranges', payload);
      return res.data.data as ShippingRange;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'shipping-ranges'] });
    },
  });
}

export function useUpdateShippingRange() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: Partial<ShippingRange> }) => {
      const res = await apiClient.put(`/v1/admin/shipping-ranges/${id}`, payload);
      return res.data.data as ShippingRange;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'shipping-ranges'] });
    },
  });
}

export function useDeleteShippingRange() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await apiClient.delete(`/v1/admin/shipping-ranges/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'shipping-ranges'] });
    },
  });
}
