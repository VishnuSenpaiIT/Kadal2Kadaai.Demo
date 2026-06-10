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
import { Plus, Loader2, X, Image as ImageIcon } from 'lucide-react';
import { apiClient } from '@/shared/api/axios';

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
    product_status: 'PUBLISHED',
  });

  const [tagsString, setTagsString] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const [customOptions, setCustomOptions] = useState<{key: string, value: boolean}[]>([
    { key: 'Available as Frozen Package', value: false } // Default old option
  ]);
  const [newOptionKey, setNewOptionKey] = useState('');

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleAddOption = () => {
    if (newOptionKey.trim() && !customOptions.find(o => o.key.toLowerCase() === newOptionKey.trim().toLowerCase())) {
      setCustomOptions([...customOptions, { key: newOptionKey.trim(), value: true }]);
      setNewOptionKey('');
    }
  };

  const removeOption = (index: number) => {
    setCustomOptions(customOptions.filter((_, i) => i !== index));
  };

  const toggleOption = (index: number, value: boolean) => {
    const newOptions = [...customOptions];
    newOptions[index].value = value;
    setCustomOptions(newOptions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert('You must be logged in to create a product.');
    
    const tags = tagsString.split(',').map(t => t.trim()).filter(Boolean);
    const custom_options = Object.fromEntries(customOptions.map(o => [o.key, o.value]));

    createProduct({
      ...formData,
      slug: generateSlug(formData.name),
      price: parseFloat(formData.price),
      available_quantity: parseFloat(formData.available_quantity),
      seller_id: user.id,
      tags,
      custom_options
    }, {
      onSuccess: async (response) => {
        const productId = response.data?.id;
        
        // Upload image if selected
        if (productId && imageFile) {
          try {
            const formData = new FormData();
            formData.append('image', imageFile);
            await apiClient.post(`/admin/products/${productId}/images`, formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
            });
          } catch (err) {
            console.error("Failed to upload image", err);
            alert("Product created, but failed to upload image.");
          }
        }

        setOpen(false);
        setFormData({
          name: '',
          category_id: '',
          price: '',
          available_quantity: '',
          weight_unit: 'kg',
          stock_status: 'IN_STOCK',
          product_status: 'PUBLISHED',
        });
        setTagsString('');
        setImageFile(null);
        setCustomOptions([{ key: 'Available as Frozen Package', value: false }]);
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
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-4">
          
          <div className="grid gap-2">
            <Label htmlFor="image">Product Image</Label>
            <div className="flex items-center gap-4">
              {imageFile ? (
                <div className="relative w-16 h-16 rounded overflow-hidden border">
                  <img src={URL.createObjectURL(imageFile)} alt="Preview" className="object-cover w-full h-full" />
                  <button type="button" onClick={() => setImageFile(null)} className="absolute top-0 right-0 bg-red-500 text-white rounded-bl p-0.5">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center w-16 h-16 rounded border border-dashed bg-muted">
                  <ImageIcon className="w-6 h-6 text-muted-foreground" />
                </div>
              )}
              <Input 
                id="image" 
                type="file" 
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="flex-1"
              />
            </div>
          </div>

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

          <div className="grid gap-2">
            <Label htmlFor="tags">Tags (Comma separated)</Label>
            <Input 
              id="tags" 
              value={tagsString}
              onChange={(e) => setTagsString(e.target.value)}
              placeholder="e.g., Organic, Deep Sea, Fresh Catch" 
            />
          </div>

          <div className="space-y-3 pt-2 border-t">
            <Label>Custom Output Options (Toggle Buttons)</Label>
            <div className="flex items-center gap-2">
              <Input 
                placeholder="New option (e.g. Flesh Cut)" 
                value={newOptionKey}
                onChange={(e) => setNewOptionKey(e.target.value)}
                onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); handleAddOption(); } }}
              />
              <Button type="button" variant="secondary" onClick={handleAddOption}>Add</Button>
            </div>
            
            <div className="space-y-2 mt-3">
              {customOptions.map((option, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded-md bg-slate-50">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id={`custom_opt_${index}`} 
                      className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      checked={option.value}
                      onChange={(e) => toggleOption(index, e.target.checked)}
                    />
                    <Label htmlFor={`custom_opt_${index}`} className="text-sm font-medium leading-none cursor-pointer">
                      {option.key}
                    </Label>
                  </div>
                  <button type="button" onClick={() => removeOption(index)} className="text-muted-foreground hover:text-red-500">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {customOptions.length === 0 && <p className="text-xs text-muted-foreground italic">No custom options added.</p>}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
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
