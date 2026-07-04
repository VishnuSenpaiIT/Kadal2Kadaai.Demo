import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

export interface AdminDashboardStats {
  total_users: number;
  total_sellers: number;
  total_products: number;
  total_orders: number;
  recent_orders?: any[];
  recent_activity?: any[];
  today: {
    profit: number;
    orders_added: number;
    orders_delivered: number;
    orders_reached: number;
    consumers_count: number;
  };
  selected: {
    profit: number;
    revenue: number;
    orders_added: number;
    orders_delivered: number;
    orders_reached: number;
    consumers_count: number;
  };
  status_breakdown: Array<{
    status: string;
    label: string;
    count: number;
  }>;
  trend: Array<{
    date: string;
    orders_added: number;
    revenue: number;
    profit: number;
    orders_delivered: number;
    orders_reached: number;
    consumers_registered: number;
  }>;
  users: {
    consumers: number;
    sellers: number;
  };
  products: {
    active: number;
    low_stock: number;
  };
  top: {
    categories: any[];
    sellers: any[];
    products: any[];
  };
}

export function useAdminAnalytics(startDate?: string, endDate?: string) {
  return useQuery<AdminDashboardStats>({
    queryKey: ['admin', 'dashboard', startDate, endDate],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);
      
      const queryString = params.toString() ? `?${params.toString()}` : '';
      const res = await apiClient.get(`/v1/admin/dashboard${queryString}`);
      return (res as unknown as { data: AdminDashboardStats }).data;
    },
  });
}
