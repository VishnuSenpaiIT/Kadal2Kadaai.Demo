'use client';

import { useEffect, useState } from 'react';
import { adminProductService } from '@/services/admin-product.service';
import { Product, ProductStatus } from '@/types/marketplace.types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await adminProductService.getProducts(1, 50);
      setProducts(res.data);
    } catch (error) {
      console.error('Failed to load products', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFeature = async (id: string, currentStatus: boolean) => {
    try {
      await adminProductService.updateStatus(id, undefined, !currentStatus);
      loadProducts();
    } catch (error) {
      console.error('Failed to update feature status');
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await adminProductService.updateStatus(id, newStatus);
      loadProducts();
    } catch (error) {
      console.error('Failed to update product status');
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold font-heading mb-8">Product Management</h1>

      <div className="bg-card border rounded-lg overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Loading products...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Seller</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Featured</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-medium text-slate-900">{product.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {product.seller ? `${product.seller.first_name} ${product.seller.last_name}` : 'Unknown'}
                    </td>
                    <td className="px-6 py-4">₹{product.price}</td>
                    <td className="px-6 py-4">
                      <Badge variant={product.product_status === ProductStatus.PUBLISHED ? 'default' : 'secondary'}>
                        {product.product_status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Button 
                        variant={product.is_featured ? "default" : "outline"} 
                        size="sm"
                        onClick={() => toggleFeature(product.id, product.is_featured)}
                      >
                        {product.is_featured ? 'Yes' : 'No'}
                      </Button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <select 
                        className="p-1 border rounded-md text-xs"
                        value={product.product_status}
                        onChange={(e) => updateStatus(product.id, e.target.value)}
                      >
                        <option value="DRAFT">Draft</option>
                        <option value="PUBLISHED">Published</option>
                        <option value="DISABLED">Disabled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
