import { useMutation } from '@tanstack/react-query';
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
