import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '../axios';

export interface ShippingCalculationRequest {
  harbour_id?: number | null;
  latitude: number;
  longitude: number;
  subtotal?: number;
}

export interface ShippingCalculationResponse {
  distance: number;
  shipping_charge: number;
  total_amount: number;
  matched_range: {
    id: number;
    from_distance: number;
    to_distance: number;
    shipping_price: number;
  };
  harbour: {
    id: number;
    harbour_name: string;
    address: string | null;
  };
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
