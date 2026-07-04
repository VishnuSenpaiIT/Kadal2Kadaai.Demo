import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../axios';

export interface ShippingSetting {
  id: number;
  google_maps_api_key: string | null;
  default_harbour_id: number | null;
}

export function useAdminShippingSettings() {
  return useQuery<ShippingSetting>({
    queryKey: ['admin', 'shipping-settings'],
    queryFn: async () => {
      const res = await apiClient.get('/v1/admin/shipping-settings');
      return res.data.data as ShippingSetting;
    },
  });
}

export function useUpdateAdminShippingSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<ShippingSetting>) => {
      const res = await apiClient.put('/v1/admin/shipping-settings', payload);
      return res.data.data as ShippingSetting;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'shipping-settings'] });
    },
  });
}
