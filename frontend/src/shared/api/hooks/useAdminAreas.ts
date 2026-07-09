import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../axios';

export interface Area {
  id: number;
  name: string;
  shipping_price: number;
  created_at?: string;
  updated_at?: string;
}

export function useAdminAreas() {
  return useQuery<Area[]>({
    queryKey: ['admin', 'areas'],
    queryFn: async () => {
      const res = await apiClient.get('/v1/admin/areas');
      return res.data.data as Area[];
    },
  });
}

export function useCreateArea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Area>) => {
      const res = await apiClient.post('/v1/admin/areas', payload);
      return res.data.data as Area;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'areas'] });
    },
  });
}

export function useUpdateArea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: Partial<Area> }) => {
      const res = await apiClient.put(`/v1/admin/areas/${id}`, payload);
      return res.data.data as Area;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'areas'] });
    },
  });
}

export function useDeleteArea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const res = await apiClient.delete(`/v1/admin/areas/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'areas'] });
    },
  });
}

export async function fetchPlacesAutocomplete(input: string) {
  if (!input.trim()) return [];
  const res = await apiClient.get('/v1/marketplace/shipping/places-autocomplete', {
    params: { input },
  });
  return res.data.predictions || [];
}
