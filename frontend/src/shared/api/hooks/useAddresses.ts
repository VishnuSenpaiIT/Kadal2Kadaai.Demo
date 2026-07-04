import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export interface Address {
  id: string;
  full_name: string;
  mobile_number: string;
  
  house_flat_number: string;
  street_name: string;
  area_locality: string;
  landmark?: string | null;
  city: string;
  district: string;
  state: string;
  pincode: string;

  latitude: number;
  longitude: number;
  
  address_type: 'Home' | 'Work' | 'Other';
  delivery_instructions?: string | null;
  is_default: boolean;
}

export function useAddresses() {
  return useQuery<Address[]>({
    queryKey: ['addresses'],
    queryFn: async () => {
      const res = await apiClient.get('/v1/addresses');
      return (res as unknown as { data: Address[] }).data;
    },
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    // Wait, the payload will exclude 'id'
    mutationFn: async (payload: Omit<Address, 'id'>) => {
      const res = await apiClient.post('/v1/addresses', payload);
      return (res as unknown as { data: Address }).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: Partial<Address> }) => {
      const res = await apiClient.put(`/v1/addresses/${id}`, payload);
      return (res as unknown as { data: Address }).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/v1/addresses/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });
}

export function useSetDefaultAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.put(`/v1/addresses/${id}`, { is_default: true });
      return (res as unknown as { data: Address }).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
    },
  });
}
