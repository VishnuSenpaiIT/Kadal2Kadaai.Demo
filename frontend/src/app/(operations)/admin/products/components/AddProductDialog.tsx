'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCategories } from '@/shared/api/hooks/useCategories';
import { useCreateProduct } from '@/shared/api/hooks/useAdminProducts';
import { useAuth } from '@/providers/AuthProvider';
import { Plus, Loader2 } from 'lucide-react';

export function AddProductDialog() {
  const [open, setOpen] = useState(false);
  const { data: categories } = useCategories();
  const { mutate: createProduct, isPending } = useCreateProduct();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    price: '',
    available_quantity: '',
    weight_unit: 'kg',
    stock_status: 'IN_STOCK',
    product_status: 'PUBLISHED'
  });

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert('You must be logged in to create a product.');
    
    createProduct({
      ...formData,
      slug: generateSlug(formData.name),
      price: parseFloat(formData.price),
      available_quantity: parseFloat(formData.available_quantity),
      seller_id: user.id
    }, {
      onSuccess: () => {
        setOpen(false);
        setFormData({
          name: '',
          category_id: '',
          price: '',
          available_quantity: '',
          weight_unit: 'kg',
          stock_status: 'IN_STOCK',
          product_status: 'PUBLISHED'
        });
      },
      onError: (err: any) => {
        alert(err.response?.data?.message || 'Failed to create product');
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button className="shrink-0 bg-primary-900 hover:bg-primary-800" />}>
        <Plus className="h-4 w-4 mr-2" />
        Add Product
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Product Name</Label>
            <Input 
              id="name" 
              required 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g., Premium King Fish" 
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <select 
              id="category"
              required
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.category_id}
              onChange={(e) => setFormData({...formData, category_id: e.target.value})}
            >
              <option value="" disabled>Select Category</option>
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="price">Price (₹)</Label>
              <Input 
                id="price" 
                type="number" 
                min="0" 
                step="0.01"
                required 
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="qty">Available Qty</Label>
              <Input 
                id="qty" 
                type="number" 
                min="0"
                required 
                value={formData.available_quantity}
                onChange={(e) => setFormData({...formData, available_quantity: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="weight_unit">Weight Unit</Label>
              <select 
                id="weight_unit"
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={formData.weight_unit}
                onChange={(e) => setFormData({...formData, weight_unit: e.target.value})}
              >
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="pieces">pieces</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <select 
                id="status"
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={formData.product_status}
                onChange={(e) => setFormData({...formData, product_status: e.target.value})}
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Product
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
