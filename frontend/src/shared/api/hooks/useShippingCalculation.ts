import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '../axios';

export interface ShippingCalculationRequest {
  harbour_id?: number | null;
  latitude: number;
  longitude: number;
  subtotal?: number;
  address_id?: string;
}

export interface ShippingCalculationResponse {
  shipping_charge: number;
  tax_amount: number;
  subtotal: number;
  total_amount: number;
  free_shipping_threshold: number;
  is_free_shipping: boolean;
  area_name?: string;
}

export function useCalculateShipping() {
  return useMutation<ShippingCalculationResponse, Error, ShippingCalculationRequest>({
    mutationFn: async (payload: ShippingCalculationRequest) => {
      const res = await apiClient.post('/v1/shipping/calculate', payload);
      return res.data.data as ShippingCalculationResponse;
    },
  });
}

export function useGoogleMapsKey() {
  return useQuery<{ google_maps_api_key: string | null }>({
    queryKey: ['googleMapsKey'],
    queryFn: async () => {
      const res = await apiClient.get('/v1/shipping/google-maps-key');
      return res.data.data as { google_maps_api_key: string | null };
    },
  });
}
