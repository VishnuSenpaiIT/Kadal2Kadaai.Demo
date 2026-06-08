import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../axios';

export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  sale_price: number | null;
  available_quantity: number;
  weight_unit: string;
  stock_status: string;
  product_status: string;
  category: { id: string; name: string; slug: string };
  seller: { id: string; first_name: string; last_name: string };
  is_featured: boolean;
  is_popular: boolean;
}

export function useAdminProducts(page = 1, perPage = 20) {
  return useQuery({
    queryKey: ['admin-products', page, perPage],
    queryFn: async () => {
      const { data } = await apiClient.get('/v1/admin/products', {
        params: { page, per_page: perPage },
      });
      return {
        data: data.data.data as AdminProduct[],
        meta: {
          current_page: data.data.current_page,
          last_page: data.data.last_page,
          total: data.data.total,
        },
      };
    },
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newProduct: Partial<AdminProduct> & { seller_id: string; category_id: string }) => {
      const { data } = await apiClient.post('/v1/admin/products', newProduct);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] }); // Invalidate consumer products too
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/v1/admin/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
