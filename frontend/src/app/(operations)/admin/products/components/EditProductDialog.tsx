'use client';

import React, { useState, useEffect } from 'react';
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
import { useUpdateProduct, AdminProduct, ProductVariant } from '@/shared/api/hooks/useAdminProducts';
import { Edit, Loader2, CheckSquare, X } from 'lucide-react';
import { toast } from 'sonner';

const PRESET_VARIANTS = [
  'Fresh', 'Frozen', 'Live', 'Cleaned', 'Cut', 'Whole', 'Dried', 'Smoked',
];

export function EditProductDialog({ product }: { product: AdminProduct }) {
  const [open, setOpen] = useState(false);
  const { data: categories } = useCategories();
  const { mutate: updateProduct, isPending } = useUpdateProduct();

  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    price: '',
    available_quantity: '',
    weight_unit: 'kg',
    product_status: 'PUBLISHED',
    is_top_selling: false,
    is_todays_purchase: false,
  });

  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [newVariant, setNewVariant] = useState<ProductVariant>({
    name: '',
    price_modifier: 0,
    shipping_modifier: 0,
    max_distance: null,
  });

  useEffect(() => {
    if (open) {
      setFormData({
        name: product.name || '',
        category_id: product.category?.id || '',
        price: product.price?.toString() || '0',
        available_quantity: product.available_quantity?.toString() || '0',
        weight_unit: product.weight_unit || 'kg',
        product_status: product.product_status || 'PUBLISHED',
        is_top_selling: !!product.is_top_selling,
        is_todays_purchase: !!product.is_todays_purchase,
      });
      setVariants((product as any).variants || []);
    }
  }, [open, product]);

  const addVariant = () => {
    if (!newVariant.name.trim()) return;
    setVariants([...variants, { ...newVariant, name: newVariant.name.trim() }]);
    setNewVariant({ name: '', price_modifier: 0, shipping_modifier: 0, max_distance: null });
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      category_id: formData.category_id,
      price: parseFloat(formData.price),
      available_quantity: parseFloat(formData.available_quantity),
      weight_unit: formData.weight_unit,
      product_status: formData.product_status,
      is_top_selling: formData.is_top_selling,
      is_todays_purchase: formData.is_todays_purchase,
      variants: variants,
    };

    updateProduct({ id: product.id, payload }, {
      onSuccess: () => {
        toast.success('Product updated successfully!');
        setOpen(false);
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || err.message || 'Failed to update product');
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10" title="Edit" />}>
        <Edit className="h-4 w-4" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Category *</Label>
              <select
                id="category"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              >
                <option value="" disabled>Select Category</option>
                {categories?.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="price">Price (₹) *</Label>
                <Input id="price" type="number" min="0" step="0.01" required value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="qty">Available Qty *</Label>
                <Input id="qty" type="number" min="0" required value={formData.available_quantity}
                  onChange={(e) => setFormData({ ...formData, available_quantity: e.target.value })} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="weight_unit">Weight Unit</Label>
                <select id="weight_unit" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  value={formData.weight_unit} onChange={(e) => setFormData({ ...formData, weight_unit: e.target.value })}>
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                  <option value="pieces">pieces</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <select id="status" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  value={formData.product_status} onChange={(e) => setFormData({ ...formData, product_status: e.target.value })}>
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* ── FEATURED SECTIONS ── */}
          <div className="pt-2 flex flex-col gap-3">
            <Label className="text-sm font-semibold text-slate-800">Featured Placement</Label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  checked={formData.is_top_selling} 
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setFormData({ 
                      ...formData, 
                      is_top_selling: checked, 
                      ...(checked ? { is_todays_purchase: false } : {}) 
                    });
                  }} 
                />
                <span className="font-medium">Top Selling</span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer text-sm">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  checked={formData.is_todays_purchase} 
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setFormData({ 
                      ...formData, 
                      is_todays_purchase: checked, 
                      ...(checked ? { is_top_selling: false } : {}) 
                    });
                  }} 
                />
                <span className="font-medium">Today's Purchases</span>
              </label>
            </div>
          </div>

          {/* ── AVAILABILITY (UI ONLY) ── */}
          <div className="pt-2 flex flex-col gap-2">
            <Label className="text-sm font-semibold text-slate-800">Availability</Label>
            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="chennai">Exclusive for Chennai</option>
              <option value="outside">Exclusive for Outside Regions</option>
              <option value="both">Available for Chennai & Outside Regions</option>
            </select>
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-primary" />
              <Label className="text-base font-semibold">Product Variants</Label>
            </div>
            
            {variants.length > 0 && (
              <div className="rounded-md border overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted text-muted-foreground text-xs uppercase">
                    <tr>
                      <th className="px-3 py-2 font-medium">Variant Name</th>
                      <th className="px-3 py-2 font-medium">Extra Price (₹)</th>
                      <th className="px-3 py-2 font-medium">Extra Shipping (₹)</th>
                      <th className="px-3 py-2 font-medium">Max Distance (km)</th>
                      <th className="px-3 py-2 font-medium w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {variants.map((v, i) => (
                      <tr key={i} className="hover:bg-muted/50 transition-colors">
                        <td className="px-3 py-2 font-medium">{v.name}</td>
                        <td className="px-3 py-2 text-green-600 font-semibold">+{v.price_modifier}</td>
                        <td className="px-3 py-2 text-orange-600">+{v.shipping_modifier}</td>
                        <td className="px-3 py-2">{v.max_distance ? `${v.max_distance} km` : 'Any'}</td>
                        <td className="px-3 py-2">
                          <button type="button" onClick={() => removeVariant(i)} className="text-destructive hover:bg-destructive/10 p-1 rounded">
                            <X className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="grid grid-cols-12 gap-2 mt-2 items-end bg-muted/30 p-3 rounded-lg border border-dashed border-border">
              <div className="col-span-12 lg:col-span-3 grid gap-1">
                <Label className="text-xs text-muted-foreground">Name (e.g. Smoked)</Label>
                <Input 
                  value={newVariant.name} 
                  onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })}
                  placeholder="Variant name" 
                  className="h-8 text-sm bg-background" 
                  list="preset-variants"
                />
                <datalist id="preset-variants">
                  {PRESET_VARIANTS.map(v => <option key={v} value={v} />)}
                </datalist>
              </div>
              <div className="col-span-4 lg:col-span-3 grid gap-1">
                <Label className="text-xs text-muted-foreground">+ Price (₹)</Label>
                <Input 
                  type="number" min="0" value={newVariant.price_modifier} 
                  onChange={(e) => setNewVariant({ ...newVariant, price_modifier: Number(e.target.value) })}
                  className="h-8 text-sm bg-background" 
                />
              </div>
              <div className="col-span-4 lg:col-span-3 grid gap-1">
                <Label className="text-xs text-muted-foreground">+ Shipping (₹)</Label>
                <Input 
                  type="number" min="0" value={newVariant.shipping_modifier} 
                  onChange={(e) => setNewVariant({ ...newVariant, shipping_modifier: Number(e.target.value) })}
                  className="h-8 text-sm bg-background" 
                />
              </div>
              <div className="col-span-4 lg:col-span-2 grid gap-1">
                <Label className="text-xs text-muted-foreground">Max Dist (km)</Label>
                <Input 
                  type="number" min="0" value={newVariant.max_distance || ''} 
                  onChange={(e) => setNewVariant({ ...newVariant, max_distance: e.target.value ? Number(e.target.value) : null })}
                  className="h-8 text-sm bg-background" placeholder="Any"
                />
              </div>
              <div className="col-span-12 lg:col-span-1 flex justify-end">
                <Button type="button" onClick={addVariant} size="sm" className="h-8 w-full lg:w-auto" disabled={!newVariant.name.trim()}>Add</Button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border mt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isPending} className="bg-primary-900 hover:bg-primary-800">
              {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : 'Update Product'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
