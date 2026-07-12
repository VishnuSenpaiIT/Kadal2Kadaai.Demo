import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OrderItem {
  id: string;
  product_id: string;
  quantity: string;
  unit_price: string;
  total_price: string;
  product_snapshot: {
    name: string;
    price: number;
    weight_unit: string;
    category?: string;
  };
}

export interface Order {
  id: string;
  order_number: string;
  status: string;
  subtotal: string;
  tax_amount: string;
  delivery_fee: string;
  total: string;
  notes: string | null;
  created_at: string;
  items: OrderItem[];
  address?: {
    house_flat_number: string;
    street_name: string;
    area_locality: string;
    city: string;
    district: string;
    state: string;
    pincode: string;
    landmark?: string | null;
  };
  seller?: {
    id: string;
    first_name: string;
    last_name: string;
  };
  consumer?: {
    id: string;
    first_name: string;
    last_name: string;
    contact_number?: string;
  };
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

export function useOrders(page = 1) {
  return useQuery<{ data: Order[]; current_page: number; last_page: number; total: number }>({
    queryKey: ['orders', page],
    queryFn: async () => {
      const { data } = await apiClient.get(`/v1/orders?page=${page}`) as any;
      return data as { data: Order[]; current_page: number; last_page: number; total: number };
    },
  });
}

export function useOrder(id: string | null) {
  return useQuery<Order>({
    queryKey: ['order', id],
    enabled: !!id,
    queryFn: async () => {
      const res = await apiClient.get(`/v1/orders/${id}`);
      return (res as unknown as { data: Order }).data;
    },
  });
}

export function useCheckout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { address_id: string; harbour_id?: number | null; notes?: string }) => {
      const res = await apiClient.post('/v1/checkout', payload);
      return (res as unknown as { data: Order | Order[] }).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      const res = await apiClient.post(`/v1/orders/${id}/cancel`, { reason });
      return (res as unknown as { data: Order }).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}
