import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../axios';

export interface Harbor {
  id: number;
  name: string;
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  pincode: string | null;
  created_at: string;
  updated_at: string;
}

export const useHarbors = () => {
  return useQuery({
    queryKey: ['harbors'],
    queryFn: async () => {
      const response = await apiClient.get('/v1/admin/harbors');
      return response.data.data as Harbor[];
    },
  });
};
