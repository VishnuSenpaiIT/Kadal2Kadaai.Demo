'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api-client';
import { Category } from '@/types/marketplace.types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ApiResponse } from '@/types/api.types';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await api.get<ApiResponse<Category[]>>('/v1/admin/categories');
      setCategories(res.data.data);
    } catch (error) {
      console.error('Failed to load categories', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    try {
      await api.delete(`/v1/admin/categories/${id}`);
      loadCategories();
    } catch (error) {
      console.error('Failed to delete category');
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold font-heading">Category Management</h1>
        <Button>Add Category</Button>
      </div>

      <div className="bg-card border rounded-lg overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Loading categories...</div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-4">Icon</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 text-2xl">{cat.icon}</td>
                  <td className="px-6 py-4 font-medium">{cat.name}</td>
                  <td className="px-6 py-4 text-muted-foreground">{cat.description}</td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="sm" className="text-red-500" onClick={() => deleteCategory(cat.id)}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
