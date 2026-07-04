import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export interface Harbour {
  id: number;
  harbour_name: string;
  harbour_code: string | null;
  description: string | null;
  
  // Complete Address
  address_line_1: string;
  address_line_2: string | null;
  area_locality: string;
  landmark: string | null;
  city: string;
  district: string;
  state: string;
  country: string;
  pincode: string;

  // Location details
  latitude: number;
  longitude: number;
  google_place_id: string | null;
  google_plus_code: string | null;
  timezone: string | null;

  status: boolean;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
}

export function useAdminHarbours() {
  return useQuery<Harbour[]>({
    queryKey: ['adminHarbours'],
    queryFn: async () => {
      const res = await apiClient.get('/v1/admin/harbours');
      return (res as unknown as { data: Harbour[] }).data;
    },
  });
}

export function useCreateHarbour() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Omit<Harbour, 'id' | 'is_default'>) => {
      const res = await apiClient.post('/v1/admin/harbours', payload);
      return (res as unknown as { data: Harbour }).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminHarbours'] });
    },
  });
}

export function useUpdateHarbour() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: Partial<Harbour> }) => {
      const res = await apiClient.put(`/v1/admin/harbours/${id}`, payload);
      return (res as unknown as { data: Harbour }).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminHarbours'] });
    },
  });
}

export function useDeleteHarbour() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await apiClient.delete(`/v1/admin/harbours/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminHarbours'] });
    },
  });
}
