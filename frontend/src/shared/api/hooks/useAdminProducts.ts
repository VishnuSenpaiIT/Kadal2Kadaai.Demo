import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../axios';

export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  sale_price: number | null;
  discount_type: string | null;
  discount_value: number | null;
  discount_start_date?: string | null;
  discount_end_date?: string | null;
  available_quantity: number;
  weight_unit: string;
  stock_status: string;
  product_status: string;
  category: { id: string; name: string; slug: string };
  seller: { id: string; first_name: string; last_name: string };
  is_featured: boolean;
  is_popular: boolean;
  is_top_selling: boolean;
  is_todays_purchase: boolean;
}

export function useAdminProducts(page = 1, perPage = 20, search = '') {
  return useQuery({
    queryKey: ['admin-products', page, perPage, search],
    queryFn: async () => {
      const { data } = await apiClient.get('/v1/admin/products', {
        params: { page, per_page: perPage, search: search || undefined },
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

export interface ProductAttributes {
  sku?: string;
  scientific_name?: string;
  catch_location?: string;
  fishing_harbor?: string;
  catch_date?: string;
  landing_date?: string;
  fishing_method?: string;
  freshness_type?: string;
  processing_method?: string;
  quality_grade?: string;
  gross_weight?: string;
  net_weight?: string;
  estimated_yield?: string;
  calories?: string;
  protein?: string;
  fat?: string;
  omega_3?: string;
  carbohydrates?: string;
  sodium?: string;
  cholesterol?: string;
  storage_instructions?: string;
  refrigeration_guidelines?: string;
  shelf_life?: string;
  best_before?: string;
  delivery_availability?: string;
  packaging_type?: string;
  cold_chain_info?: string;
}

export interface ProductVariant {
  name: string;
  price_modifier: number;
  shipping_modifier: number;
  max_distance: number | null;
}

export interface CreateProductPayload {
  seller_id: string;
  category_id: string;
  name: string;
  slug: string;
  price: number;
  discount_type?: string | null;
  discount_value?: number | null;
  available_quantity: number;
  weight_unit: string;
  stock_status: string;
  product_status: string;
  is_top_selling?: boolean;
  is_todays_purchase?: boolean;
  short_description?: string;
  variants?: ProductVariant[];
  attributes?: ProductAttributes;
  tags?: string[];
  image?: File | null;
  origin_harbor_id?: number | string | null;
  max_transit_hours?: number | string | null;
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateProductPayload) => {
      const formData = new FormData();

      // Append scalar fields
      const scalarFields: (keyof CreateProductPayload)[] = [
        'seller_id', 'category_id', 'name', 'slug', 'price',
        'discount_type', 'discount_value',
        'available_quantity', 'weight_unit', 'stock_status', 'product_status',
        'is_top_selling', 'is_todays_purchase',
        'short_description', 'origin_harbor_id', 'max_transit_hours'
      ];

      for (const key of scalarFields) {
        const value = payload[key];
        if (value !== undefined && value !== null) {
          if (typeof value === 'boolean') {
            formData.append(key, value ? '1' : '0');
          } else {
            formData.append(key, String(value));
          }
        }
      }

      // Append variants array
      if (payload.variants && payload.variants.length > 0) {
        payload.variants.forEach((v, index) => {
          formData.append(`variants[${index}][name]`, v.name);
          formData.append(`variants[${index}][price_modifier]`, String(v.price_modifier));
          formData.append(`variants[${index}][shipping_modifier]`, String(v.shipping_modifier));
          if (v.max_distance !== null && v.max_distance !== undefined) {
            formData.append(`variants[${index}][max_distance]`, String(v.max_distance));
          }
        });
      }

      // Append attributes as JSON string if exists
      if (payload.attributes && Object.keys(payload.attributes).length > 0) {
        formData.append('attributes', JSON.stringify(payload.attributes));
      }

      // Append tags array (by name — backend creates if not exist)
      if (payload.tags && payload.tags.length > 0) {
        payload.tags.forEach((t) => formData.append('tags[]', t));
      }

      // Append image file
      if (payload.image) {
        formData.append('image', payload.image);
      }

      const { data } = await apiClient.post('/v1/admin/products', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
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

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
      const { data } = await apiClient.put(`/v1/admin/products/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
