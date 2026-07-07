'use client';

import React, { useState, useRef } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { useCategories } from '@/shared/api/hooks/useCategories';
import { useHarbors } from '@/shared/api/hooks/useHarbors';
import { useCreateProduct, CreateProductPayload, ProductVariant, ProductAttributes } from '@/shared/api/hooks/useAdminProducts';
import { useAuth } from '@/providers/AuthProvider';
import { Plus, Loader2, Upload, X, Tag, CheckSquare } from 'lucide-react';
import { toast } from 'sonner';
import { ImageCropper } from '@/components/ui/image-cropper';

// Predefined variant options for seafood (used as suggestions)
const PRESET_VARIANTS = [
  'Fresh', 'Frozen', 'Live', 'Cleaned', 'Cut', 'Whole', 'Dried', 'Smoked',
];

export function AddProductDialog() {
  const [open, setOpen] = useState(false);
  const { data: categories } = useCategories();
  const { data: harbors } = useHarbors();
  const { mutate: createProduct, isPending } = useCreateProduct();
  const { user } = useAuth();

  // Image
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Tags
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  // Variants (Complex objects)
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [newVariant, setNewVariant] = useState<ProductVariant>({
    name: '',
    price_modifier: 0,
    shipping_modifier: 0,
    max_distance: null,
  });

  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    price: '',
    available_quantity: '',
    weight_unit: 'kg',
    stock_status: 'IN_STOCK',
    product_status: 'PUBLISHED',
    is_top_selling: false,
    is_todays_purchase: false,
    short_description: '',
    origin_harbor_id: '',
    max_transit_hours: '',
  });

  const [attributes, setAttributes] = useState<ProductAttributes>({});
  const [activeTab, setActiveTab] = useState('basic');

  // Cropping State
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCropImageSrc(reader.result as string);
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input so same file can be selected again
  };

  const handleCropComplete = (croppedFile: File) => {
    setImageFile(croppedFile);
    setImagePreview(URL.createObjectURL(croppedFile));
    setCropImageSrc(null);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => setTags(tags.filter(t => t !== tag));

  const addVariant = () => {
    if (!newVariant.name.trim()) return;
    setVariants([...variants, { ...newVariant, name: newVariant.name.trim() }]);
    setNewVariant({ name: '', price_modifier: 0, shipping_modifier: 0, max_distance: null });
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const reset = () => {
    setFormData({ name: '', category_id: '', price: '', available_quantity: '', weight_unit: 'kg', stock_status: 'IN_STOCK', product_status: 'PUBLISHED', is_top_selling: false, is_todays_purchase: false, short_description: '', origin_harbor_id: '', max_transit_hours: '' });
    setTags([]);
    setTagInput('');
    setVariants([]);
    setAttributes({});
    setNewVariant({ name: '', price_modifier: 0, shipping_modifier: 0, max_distance: null });
    setActiveTab('basic');
    removeImage();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const payload: CreateProductPayload = {
      seller_id: user.id,
      category_id: formData.category_id,
      name: formData.name,
      slug: generateSlug(formData.name),
      price: parseFloat(formData.price),
      available_quantity: parseFloat(formData.available_quantity),
      weight_unit: formData.weight_unit,
      stock_status: formData.stock_status,
      product_status: formData.product_status,
      is_top_selling: formData.is_top_selling,
      is_todays_purchase: formData.is_todays_purchase,
      short_description: formData.short_description,
      origin_harbor_id: formData.origin_harbor_id ? parseInt(formData.origin_harbor_id) : null,
      max_transit_hours: formData.max_transit_hours ? parseInt(formData.max_transit_hours) : null,
      variants,
      attributes,
      tags,
      image: imageFile,
    };

    createProduct(payload, {
      onSuccess: () => {
        toast.success('Product created successfully!');
        setOpen(false);
        reset();
      },
      onError: (err: any) => {
        toast.error(err.response?.data?.message || 'Failed to create product');
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
      <DialogTrigger render={<Button className="shrink-0 bg-primary-900 hover:bg-primary-800" />}>
        <Plus className="h-4 w-4 mr-2" />
        Add Product
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add New Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 pt-2">
          
          <div className="w-full flex flex-col">
            <div className="grid w-full grid-cols-4 mb-4 gap-2 bg-muted p-1 rounded-lg">
              {[
                { id: 'basic', label: 'Basic & Media' },
                { id: 'variants', label: 'Variants' },
                { id: 'seafood', label: 'Seafood Info' },
                { id: 'extra', label: 'Nutrition & Storage' }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === tab.id ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground hover:bg-muted-foreground/10'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
            {activeTab === 'basic' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
              {/* ── IMAGE UPLOAD ── */}
              <div className="grid gap-2">
                <Label>Product Image</Label>
                {imagePreview ? (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border group">
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 h-7 w-7 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-36 rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-colors flex flex-col items-center justify-center gap-2 text-muted-foreground cursor-pointer"
                  >
                    <Upload className="h-8 w-8" />
                    <span className="text-sm font-medium">Click to upload image</span>
                    <span className="text-xs">PNG, JPG, WEBP up to 5MB</span>
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>

              {/* ── BASIC INFO ── */}
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Premium King Fish"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="short_description">Short Description</Label>
                  <Textarea
                    id="short_description"
                    value={formData.short_description}
                    onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                    placeholder="Briefly describe the product..."
                    className="h-20 resize-none"
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
              </div>

              {/* ── PRICING & STOCK ── */}
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
                  </select>
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

              {/* ── CUSTOM TAGS ── */}
              <div className="grid gap-3">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-primary" />
                  <Label className="text-base font-semibold">Custom Tags</Label>
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., Coastal Catch, Premium, Festival..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                    className="text-sm"
                  />
                  <Button type="button" variant="outline" size="sm" onClick={addTag}>Add</Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span key={tag} className="flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-primary/10 text-primary border border-primary/20">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive transition-colors">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              </div>
            )}
            
            {activeTab === 'variants' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
              {/* ── VARIANTS (ADVANCED GRID) ── */}
              <div className="grid gap-3">
                <div className="flex items-center gap-2">
                  <CheckSquare className="h-4 w-4 text-primary" />
                  <Label className="text-base font-semibold">Product Variants</Label>
                </div>
                <p className="text-xs text-muted-foreground -mt-1">Define advanced variants with custom pricing and shipping modifiers.</p>
                
                {/* Added Variants List */}
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

                {/* Add New Variant Form */}
                <div className="grid grid-cols-12 gap-2 mt-2 items-end bg-muted/30 p-3 rounded-lg border border-dashed border-border">
                  <div className="col-span-12 lg:col-span-3 grid gap-1">
                    <Label className="text-xs text-muted-foreground">Name (e.g. Smoked)</Label>
                    <Input 
                      value={newVariant.name} 
                      onChange={(e) => setNewVariant({ ...newVariant, name: e.target.value })}
                      placeholder="Variant name" 
                      className="h-8 text-sm" 
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
                      className="h-8 text-sm" 
                    />
                  </div>
                  <div className="col-span-4 lg:col-span-3 grid gap-1">
                    <Label className="text-xs text-muted-foreground">+ Shipping (₹)</Label>
                    <Input 
                      type="number" min="0" value={newVariant.shipping_modifier} 
                      onChange={(e) => setNewVariant({ ...newVariant, shipping_modifier: Number(e.target.value) })}
                      className="h-8 text-sm" 
                    />
                  </div>
                  <div className="col-span-4 lg:col-span-2 grid gap-1">
                    <Label className="text-xs text-muted-foreground">Max Dist (km)</Label>
                    <Input 
                      type="number" min="0" value={newVariant.max_distance || ''} 
                      onChange={(e) => setNewVariant({ ...newVariant, max_distance: e.target.value ? Number(e.target.value) : null })}
                      className="h-8 text-sm" placeholder="Any"
                    />
                  </div>
                  <div className="col-span-12 lg:col-span-1 flex justify-end">
                    <Button type="button" onClick={addVariant} size="sm" className="h-8 w-full lg:w-auto" disabled={!newVariant.name.trim()}>Add</Button>
                  </div>
                </div>
              </div>
              </div>
            )}

            {activeTab === 'seafood' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>SKU</Label>
                  <Input value={attributes.sku || ''} onChange={e => setAttributes({...attributes, sku: e.target.value})} placeholder="K2K-VAN-001" />
                </div>
                <div className="grid gap-2">
                  <Label>Scientific Name</Label>
                  <Input value={attributes.scientific_name || ''} onChange={e => setAttributes({...attributes, scientific_name: e.target.value})} placeholder="Scomberomorus commerson" />
                </div>
                <div className="grid gap-2">
                  <Label>Catch Location</Label>
                  <Input value={attributes.catch_location || ''} onChange={e => setAttributes({...attributes, catch_location: e.target.value})} placeholder="Bay of Bengal" />
                </div>
                <div className="grid gap-2">
                  <Label>Origin Harbor (Geo-Routing)</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={formData.origin_harbor_id} onChange={e => setFormData({...formData, origin_harbor_id: e.target.value})}>
                    <option value="">Select Harbor...</option>
                    {harbors?.map((harbor) => (
                      <option key={harbor.id} value={harbor.id}>{harbor.name} ({harbor.city || harbor.pincode})</option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label>Max Transit Time (Hours)</Label>
                  <Input type="number" min="0" value={formData.max_transit_hours} onChange={e => setFormData({...formData, max_transit_hours: e.target.value})} placeholder="e.g. 12" />
                </div>
                <div className="grid gap-2">
                  <Label>Fishing Harbor (Metadata)</Label>
                  <Input value={attributes.fishing_harbor || ''} onChange={e => setAttributes({...attributes, fishing_harbor: e.target.value})} placeholder="Kasimedu" />
                </div>
                <div className="grid gap-2">
                  <Label>Catch Date</Label>
                  <Input type="date" value={attributes.catch_date || ''} onChange={e => setAttributes({...attributes, catch_date: e.target.value})} />
                </div>
                <div className="grid gap-2">
                  <Label>Landing Date</Label>
                  <Input type="date" value={attributes.landing_date || ''} onChange={e => setAttributes({...attributes, landing_date: e.target.value})} />
                </div>
                <div className="grid gap-2">
                  <Label>Fishing Method</Label>
                  <Input value={attributes.fishing_method || ''} onChange={e => setAttributes({...attributes, fishing_method: e.target.value})} placeholder="Line Caught" />
                </div>
                <div className="grid gap-2">
                  <Label>Freshness Type</Label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={attributes.freshness_type || ''} onChange={e => setAttributes({...attributes, freshness_type: e.target.value})}>
                    <option value="">Select...</option>
                    <option value="Fresh">Fresh</option>
                    <option value="Chilled">Chilled</option>
                    <option value="Frozen">Frozen</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <Label>Processing Method</Label>
                  <Input value={attributes.processing_method || ''} onChange={e => setAttributes({...attributes, processing_method: e.target.value})} placeholder="Whole Fish" />
                </div>
                <div className="grid gap-2">
                  <Label>Quality Grade</Label>
                  <Input value={attributes.quality_grade || ''} onChange={e => setAttributes({...attributes, quality_grade: e.target.value})} placeholder="A Grade" />
                </div>
              </div>
              </div>
            )}

            {activeTab === 'extra' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Gross Weight</Label>
                  <Input value={attributes.gross_weight || ''} onChange={e => setAttributes({...attributes, gross_weight: e.target.value})} placeholder="1 KG" />
                </div>
                <div className="grid gap-2">
                  <Label>Net Weight</Label>
                  <Input value={attributes.net_weight || ''} onChange={e => setAttributes({...attributes, net_weight: e.target.value})} placeholder="850 g" />
                </div>
                <div className="grid gap-2">
                  <Label>Estimated Yield</Label>
                  <Input value={attributes.estimated_yield || ''} onChange={e => setAttributes({...attributes, estimated_yield: e.target.value})} placeholder="85%" />
                </div>
                <div className="grid gap-2">
                  <Label>Calories</Label>
                  <Input value={attributes.calories || ''} onChange={e => setAttributes({...attributes, calories: e.target.value})} placeholder="200 kcal" />
                </div>
                <div className="grid gap-2">
                  <Label>Protein</Label>
                  <Input value={attributes.protein || ''} onChange={e => setAttributes({...attributes, protein: e.target.value})} placeholder="20g" />
                </div>
                <div className="grid gap-2">
                  <Label>Fat</Label>
                  <Input value={attributes.fat || ''} onChange={e => setAttributes({...attributes, fat: e.target.value})} placeholder="10g" />
                </div>
                <div className="grid gap-2">
                  <Label>Omega-3</Label>
                  <Input value={attributes.omega_3 || ''} onChange={e => setAttributes({...attributes, omega_3: e.target.value})} placeholder="2g" />
                </div>
                <div className="grid gap-2">
                  <Label>Storage Instructions</Label>
                  <Input value={attributes.storage_instructions || ''} onChange={e => setAttributes({...attributes, storage_instructions: e.target.value})} placeholder="Store below 4°C" />
                </div>
                <div className="grid gap-2">
                  <Label>Shelf Life</Label>
                  <Input value={attributes.shelf_life || ''} onChange={e => setAttributes({...attributes, shelf_life: e.target.value})} placeholder="48 hours" />
                </div>
                <div className="grid gap-2">
                  <Label>Packaging Type</Label>
                  <Input value={attributes.packaging_type || ''} onChange={e => setAttributes({...attributes, packaging_type: e.target.value})} placeholder="Insulated Packaging" />
                </div>
              </div>
              </div>
            )}

          </div>

          {/* ── ACTIONS ── */}
          <div className="flex justify-end gap-3 pt-2 border-t border-border mt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={isPending} className="bg-primary-900 hover:bg-primary-800 min-w-28">
              {isPending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : 'Save Product'}
            </Button>
          </div>
        </form>
      </DialogContent>

      {cropImageSrc && (
        <ImageCropper
          imageSrc={cropImageSrc}
          onCropComplete={handleCropComplete}
          onCancel={() => setCropImageSrc(null)}
          aspectRatio={4 / 3}
        />
      )}
    </Dialog>
  );
}
