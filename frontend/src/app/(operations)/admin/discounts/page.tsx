'use client';

import { useState } from 'react';
import { useAdminProducts, useUpdateProduct } from '@/shared/api/hooks/useAdminProducts';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import {
  useAdminBanners,
  useCreateBanner,
  useUpdateBanner,
  useDeleteBanner,
  AdminBanner,
} from '@/shared/api/hooks/useAdminBanners';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Loader2,
  Percent,
  Plus,
  Trash2,
  Edit2,
  Search,
  Image as ImageIcon,
  ExternalLink,
  Check,
  X,
  Tag as TagIcon
} from 'lucide-react';
import { toast } from 'sonner';
import { assetUrl } from '@/lib/asset-url';

const parseDbDate = (dateStr: string | null | undefined): Date | null => {
  if (!dateStr) return null;
  // Replace space with T to make it standard ISO and handle Z safely in Safari
  let cleanStr = dateStr.replace(' ', 'T');
  if (!cleanStr.endsWith('Z') && !cleanStr.includes('+')) {
    cleanStr += 'Z';
  }
  const dateObj = new Date(cleanStr);
  return isNaN(dateObj.getTime()) ? null : dateObj;
};

export default function AdminDiscountsPage() {
  const [activeTab, setActiveTab] = useState('products');
  const [productSearch, setProductSearch] = useState('');
  const [productPage, setProductPage] = useState(1);

  // API hooks for products
  const { data: productsData, isLoading: isProductsLoading } = useAdminProducts(productPage, 15, productSearch);
  const updateProductDiscount = useUpdateProduct();

  // API hooks for banners
  const { data: banners = [], isLoading: isBannersLoading } = useAdminBanners();
  const createBanner = useCreateBanner();
  const updateBanner = useUpdateBanner();
  const deleteBanner = useDeleteBanner();

  // Modals state
  const [discountModalOpen, setDiscountModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [discountType, setDiscountType] = useState<'percentage' | 'flat' | 'none'>('none');
  const [discountValue, setDiscountValue] = useState<string>('');
  // Single datetime-local values (YYYY-MM-DDTHH:mm) — no AM/PM confusion
  const [discountStartDateTime, setDiscountStartDateTime] = useState<string>('');
  const [discountEndDateTime, setDiscountEndDateTime] = useState<string>('');

  const [bannerModalOpen, setBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<AdminBanner | null>(null);
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerSubtitle, setBannerSubtitle] = useState('');
  const [bannerProductId, setBannerProductId] = useState('');
  const [bannerLinkUrl, setBannerLinkUrl] = useState('');
  const [bannerOrderIndex, setBannerOrderIndex] = useState('0');
  const [bannerIsActive, setBannerIsActive] = useState(true);
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
  const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(null);

  // Handle open discount modal
  const openDiscountModal = (product: any) => {
    setSelectedProduct(product);
    setDiscountType((product.discount_type as 'percentage' | 'flat') || 'none');
    setDiscountValue(product.discount_value ? String(product.discount_value) : '');

    // Load start date/time — parse using native Date so the browser handles UTC -> Local conversion
    if (product.discount_start_date) {
      // If it doesn't end with Z and doesn't contain a timezone offset, we append 'Z' to treat as UTC (since Laravel serializes to UTC)
      let startStr = product.discount_start_date;
      if (!startStr.endsWith('Z') && !startStr.includes('+') && startStr.includes('T')) {
        startStr += 'Z';
      } else if (!startStr.includes('T') && !startStr.endsWith('Z')) {
        // If it is in space-separated format (e.g. YYYY-MM-DD HH:mm:ss), replace space with T and append Z
        startStr = startStr.replace(' ', 'T') + 'Z';
      }
      
      const date = new Date(startStr);
      if (!isNaN(date.getTime())) {
        const y = date.getFullYear();
        const mo = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        const h = String(date.getHours()).padStart(2, '0');
        const mi = String(date.getMinutes()).padStart(2, '0');
        setDiscountStartDateTime(`${y}-${mo}-${d}T${h}:${mi}`);
      } else {
        setDiscountStartDateTime('');
      }
    } else {
      setDiscountStartDateTime('');
    }

    // Load end date/time
    if (product.discount_end_date) {
      let endStr = product.discount_end_date;
      if (!endStr.endsWith('Z') && !endStr.includes('+') && endStr.includes('T')) {
        endStr += 'Z';
      } else if (!endStr.includes('T') && !endStr.endsWith('Z')) {
        endStr = endStr.replace(' ', 'T') + 'Z';
      }
      
      const date = new Date(endStr);
      if (!isNaN(date.getTime())) {
        const y = date.getFullYear();
        const mo = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        const h = String(date.getHours()).padStart(2, '0');
        const mi = String(date.getMinutes()).padStart(2, '0');
        setDiscountEndDateTime(`${y}-${mo}-${d}T${h}:${mi}`);
      } else {
        setDiscountEndDateTime('');
      }
    } else {
      setDiscountEndDateTime('');
    }

    setDiscountModalOpen(true);
  };

  // Handle save discount
  const handleSaveDiscount = () => {
    if (!selectedProduct) return;

    const payload: any = {};
    if (discountType === 'none') {
      payload.discount_type = null;
      payload.discount_value = null;
      payload.discount_start_date = null;
      payload.discount_end_date = null;
    } else {
      const val = parseFloat(discountValue);
      if (isNaN(val) || val < 0) {
        toast.error('Please enter a valid positive number');
        return;
      }
      if (discountType === 'percentage' && val > 100) {
        toast.error('Percentage discount cannot exceed 100%');
        return;
      }
      payload.discount_type = discountType;
      payload.discount_value = val;

      // datetime-local returns 'YYYY-MM-DDTHH:mm' — convert to 'YYYY-MM-DD HH:mm:00'
      // This is already in LOCAL time, no UTC conversion needed.
      if (discountStartDateTime) {
        payload.discount_start_date = discountStartDateTime.replace('T', ' ') + ':00';
      } else {
        payload.discount_start_date = null;
      }

      if (discountEndDateTime) {
        payload.discount_end_date = discountEndDateTime.replace('T', ' ') + ':00';
      } else {
        payload.discount_end_date = null;
      }
    }

    updateProductDiscount.mutate(
      { id: selectedProduct.id, payload },
      {
        onSuccess: () => {
          toast.success('Discount updated successfully');
          setDiscountModalOpen(false);
        },
        onError: (err: any) => {
          const serverMsg = err?.response?.data?.message || err?.message || 'Failed to update discount';
          toast.error(serverMsg);
          console.error('Discount save error:', err?.response?.data || err);
        },
      }
    );
  };

  // Handle open banner modal (create/edit)
  const openBannerModal = (banner: AdminBanner | null = null) => {
    if (banner) {
      setEditingBanner(banner);
      setBannerTitle(banner.title);
      setBannerSubtitle(banner.subtitle || '');
      setBannerProductId(banner.product_id || '');
      setBannerLinkUrl(banner.link_url || '');
      setBannerOrderIndex(String(banner.order_index));
      setBannerIsActive(banner.is_active);
      setBannerImagePreview(assetUrl(banner.image_url));
      setBannerImageFile(null);
    } else {
      setEditingBanner(null);
      setBannerTitle('');
      setBannerSubtitle('');
      setBannerProductId('');
      setBannerLinkUrl('');
      setBannerOrderIndex('0');
      setBannerIsActive(true);
      setBannerImagePreview(null);
      setBannerImageFile(null);
    }
    setBannerModalOpen(true);
  };

  // Handle banner image change
  const handleBannerImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle save banner
  const handleSaveBanner = () => {
    if (!bannerTitle.trim()) {
      toast.error('Title is required');
      return;
    }

    if (!editingBanner && !bannerImageFile) {
      toast.error('Banner image file is required');
      return;
    }

    const orderIdx = parseInt(bannerOrderIndex);
    if (isNaN(orderIdx)) {
      toast.error('Order index must be a valid integer');
      return;
    }

    // Determine final link URL if product is selected
    let finalLinkUrl = bannerLinkUrl;
    if (bannerProductId && productsData?.data) {
      const selectedProd = productsData.data.find(p => p.id === bannerProductId);
      if (selectedProd) {
        finalLinkUrl = `/products/${selectedProd.slug}`;
      }
    }

    if (editingBanner) {
      // Update
      const payload: any = {
        title: bannerTitle,
        subtitle: bannerSubtitle,
        product_id: bannerProductId || null,
        link_url: finalLinkUrl || null,
        is_active: bannerIsActive,
        order_index: orderIdx,
      };
      if (bannerImageFile) {
        payload.image = bannerImageFile;
      }

      updateBanner.mutate(
        { id: editingBanner.id, payload },
        {
          onSuccess: () => {
            toast.success('Banner updated successfully');
            setBannerModalOpen(false);
          },
          onError: (err: any) => {
            toast.error(err?.message || 'Failed to update banner');
          },
        }
      );
    } else {
      // Create
      if (!bannerImageFile) return;
      const payload = {
        title: bannerTitle,
        subtitle: bannerSubtitle,
        product_id: bannerProductId || null,
        link_url: finalLinkUrl || null,
        is_active: bannerIsActive,
        order_index: orderIdx,
        image: bannerImageFile,
      };

      createBanner.mutate(payload, {
        onSuccess: () => {
          toast.success('Banner created successfully');
          setBannerModalOpen(false);
        },
        onError: (err: any) => {
          toast.error(err?.message || 'Failed to create banner');
        },
      });
    }
  };

  // Handle delete banner
  const handleDeleteBanner = (id: string) => {
    if (!confirm('Are you sure you want to delete this homepage banner?')) return;
    deleteBanner.mutate(id, {
      onSuccess: () => {
        toast.success('Banner deleted successfully');
      },
      onError: (err: any) => {
        toast.error(err?.message || 'Failed to delete banner');
      },
    });
  };

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-heading text-primary-900 flex items-center gap-3">
            <Percent className="w-8 h-8 text-accent-500" />
            Offers & Discounts
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage product-level promotional discounts and construct homepage marketing banners.
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col space-y-6">
        <TabsList className="grid grid-cols-2 max-w-md bg-slate-100 rounded-xl p-1 border">
          <TabsTrigger value="products" className="rounded-lg py-2 font-medium">
            Product Discounts
          </TabsTrigger>
          <TabsTrigger value="banners" className="rounded-lg py-2 font-medium">
            Homepage Banners
          </TabsTrigger>
        </TabsList>

        {/* ═══════════════════════════════════════════════════
            TAB 1: PRODUCT DISCOUNTS
            ═══════════════════════════════════════════════════ */}
        <TabsContent value="products">
          <Card className="border shadow-md rounded-2xl overflow-hidden">
            <CardHeader className="bg-slate-50 border-b pb-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-xl font-bold text-slate-800">Products Inventory & Deals</CardTitle>
                  <CardDescription>Select any product to apply, modify, or remove promotions.</CardDescription>
                </div>
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search products..."
                    className="pl-9 bg-white"
                    value={productSearch}
                    onChange={(e) => {
                      setProductSearch(e.target.value);
                      setProductPage(1);
                    }}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isProductsLoading ? (
                <div className="p-16 flex flex-col items-center justify-center text-muted-foreground">
                  <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary-600" />
                  <p className="font-medium animate-pulse">Retrieving catalog...</p>
                </div>
              ) : !productsData || productsData.data.length === 0 ? (
                <div className="p-16 text-center text-muted-foreground">
                  No products found. Add products to inventory first.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-slate-50 border-b">
                      <TableRow>
                        <TableHead className="py-4">Product</TableHead>
                        <TableHead className="py-4">Category</TableHead>
                        <TableHead className="py-4">Original Price</TableHead>
                        <TableHead className="py-4">Active Promo</TableHead>
                        <TableHead className="py-4">Sale Price</TableHead>
                        <TableHead className="py-4 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {productsData.data.map((prod) => {
                        const hasDiscount = prod.discount_type && prod.discount_value !== null;
                        
                        // Calculate promo status based on schedule dates
                        const now = new Date();
                        const startDate = parseDbDate(prod.discount_start_date);
                        const endDate = parseDbDate(prod.discount_end_date);
                        
                        let promoStatus: 'active' | 'scheduled' | 'expired' = 'active';
                        if (hasDiscount) {
                          if (startDate && now < startDate) {
                            promoStatus = 'scheduled';
                          } else if (endDate && now > endDate) {
                            promoStatus = 'expired';
                          }
                        }

                        return (
                          <TableRow key={prod.id} className="hover:bg-slate-50 transition-colors">
                            <TableCell className="font-semibold text-slate-900 py-3">{prod.name}</TableCell>
                            <TableCell className="py-3">
                              <Badge variant="outline" className="font-semibold text-[10px] uppercase">
                                {prod.category?.name || 'Uncategorized'}
                              </Badge>
                            </TableCell>
                            <TableCell className="py-3 font-medium">₹{prod.price}</TableCell>
                            <TableCell className="py-3">
                              {hasDiscount ? (
                                <div className="flex flex-col gap-1 items-start">
                                  <Badge className={`${
                                    promoStatus === 'active' ? 'bg-emerald-500 hover:bg-emerald-600' :
                                    promoStatus === 'scheduled' ? 'bg-blue-500 hover:bg-blue-600' :
                                    'bg-slate-400 hover:bg-slate-500'
                                  } text-white font-bold gap-1 shadow-sm`}>
                                    <Percent className="w-3 h-3" />
                                    {prod.discount_type === 'percentage' 
                                      ? `${prod.discount_value}% OFF`
                                      : `₹${prod.discount_value} OFF`}
                                  </Badge>
                                  {promoStatus === 'scheduled' && (
                                    <span className="text-[10px] text-blue-600 font-semibold">Scheduled</span>
                                  )}
                                  {promoStatus === 'expired' && (
                                    <span className="text-[10px] text-slate-500 font-medium">Expired</span>
                                  )}
                                </div>
                              ) : (
                                <span className="text-muted-foreground text-xs font-light">None</span>
                              )}
                            </TableCell>
                            <TableCell className="py-3 font-semibold text-slate-800">
                              {prod.sale_price !== null ? (
                                <span className="text-error-600 font-bold">₹{prod.sale_price}</span>
                              ) : (
                                <span className="text-slate-400 font-normal">₹{prod.price}</span>
                              )}
                            </TableCell>
                            <TableCell className="py-3 text-right">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openDiscountModal(prod)}
                                className="h-8 gap-1.5 font-semibold text-primary hover:text-primary-700 hover:bg-primary/5 border border-primary/20"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                                Edit Discount
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>

                  {/* Pagination */}
                  {productsData.meta && productsData.meta.last_page > 1 && (
                    <div className="p-4 border-t flex items-center justify-between bg-slate-50">
                      <span className="text-xs text-muted-foreground">
                        Showing page {productPage} of {productsData.meta.last_page} ({productsData.meta.total} products)
                      </span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={productPage === 1}
                          onClick={() => setProductPage(p => p - 1)}
                        >
                          Previous
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={productPage === productsData.meta.last_page}
                          onClick={() => setProductPage(p => p + 1)}
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ═══════════════════════════════════════════════════
            TAB 2: HOMEPAGE BANNERS
            ═══════════════════════════════════════════════════ */}
        <TabsContent value="banners">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Dynamic Slideshow Banners</h2>
              <p className="text-sm text-muted-foreground mt-0.5">Control the high-impact promotional carousel on the consumer landing page.</p>
            </div>
            <Button
              className="bg-accent-600 hover:bg-accent-700 text-white font-semibold gap-2 shadow-md rounded-xl"
              onClick={() => openBannerModal(null)}
            >
              <Plus className="w-4 h-4" /> Create Banner
            </Button>
          </div>

          <Card className="border shadow-md rounded-2xl overflow-hidden">
            <CardContent className="p-0">
              {isBannersLoading ? (
                <div className="p-16 flex flex-col items-center justify-center text-muted-foreground">
                  <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary-600" />
                  <p className="font-medium animate-pulse">Retrieving banners...</p>
                </div>
              ) : banners.length === 0 ? (
                <div className="p-16 text-center text-muted-foreground flex flex-col items-center justify-center gap-3">
                  <ImageIcon className="w-12 h-12 text-slate-300" />
                  <p className="font-semibold text-slate-400">No active homepage banners. Create your first promotion banner!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-slate-50 border-b">
                      <TableRow>
                        <TableHead className="py-4 w-32">Image</TableHead>
                        <TableHead className="py-4">Details</TableHead>
                        <TableHead className="py-4">Linked Landing Page</TableHead>
                        <TableHead className="py-4">Order</TableHead>
                        <TableHead className="py-4">Status</TableHead>
                        <TableHead className="py-4 text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {banners.map((banner) => (
                        <TableRow key={banner.id} className="hover:bg-slate-50 transition-colors">
                          <TableCell className="py-3">
                            <div className="aspect-[2/1] w-24 bg-slate-100 rounded-lg overflow-hidden border shadow-sm relative">
                              <img
                                src={assetUrl(banner.image_url) || undefined}
                                alt={banner.title}
                                className="object-cover w-full h-full"
                              />
                            </div>
                          </TableCell>
                          <TableCell className="py-3">
                            <div>
                              <p className="font-bold text-slate-800 text-sm">{banner.title}</p>
                              {banner.subtitle && (
                                <p className="text-xs text-muted-foreground line-clamp-1">{banner.subtitle}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="py-3">
                            {banner.product ? (
                              <div className="flex flex-col">
                                <span className="text-xs font-semibold text-primary flex items-center gap-1">
                                  <TagIcon className="w-3.5 h-3.5 text-accent-500" />
                                  Product: {banner.product.name}
                                </span>
                                {banner.product.sale_price !== null && (
                                  <span className="text-[10px] text-error-600 font-bold">
                                    Promotional Price: ₹{banner.product.sale_price}
                                  </span>
                                )}
                              </div>
                            ) : banner.link_url ? (
                              <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                                <ExternalLink className="w-3 h-3" />
                                URL: {banner.link_url}
                              </span>
                            ) : (
                              <span className="text-xs text-slate-400 font-light">None</span>
                            )}
                          </TableCell>
                          <TableCell className="py-3 font-semibold text-slate-700">
                            {banner.order_index}
                          </TableCell>
                          <TableCell className="py-3">
                            {banner.is_active ? (
                              <Badge className="bg-green-500 hover:bg-green-600 text-white font-bold gap-1 shadow-sm">
                                <Check className="w-3.5 h-3.5" />
                                Active
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="gap-1 font-bold text-slate-500 bg-slate-100 border">
                                <X className="w-3.5 h-3.5" />
                                Inactive
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell className="py-3 text-right space-x-1">
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8 hover:bg-slate-100"
                              onClick={() => openBannerModal(banner)}
                            >
                              <Edit2 className="w-3.5 h-3.5 text-slate-600" />
                            </Button>
                            <Button
                              size="icon"
                              variant="outline"
                              className="h-8 w-8 text-error-500 hover:bg-error-50 hover:text-error-600 border-error-100"
                              onClick={() => handleDeleteBanner(banner.id)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ═══════════════════════════════════════════════════
          MODAL: EDIT PRODUCT DISCOUNT
          ═══════════════════════════════════════════════════ */}
      <Dialog open={discountModalOpen} onOpenChange={setDiscountModalOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Percent className="w-5 h-5 text-accent-500" />
              Manage Discount
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-sm">
              Apply discount to <strong className="text-slate-800">{selectedProduct?.name}</strong>.
            </DialogDescription>
          </DialogHeader>

          {selectedProduct && (
            <div className="grid gap-4 py-4">
              <div className="flex items-center justify-between border-b pb-3 mb-2">
                <span className="text-sm font-semibold text-slate-500">Original Price:</span>
                <span className="text-lg font-bold text-slate-800">₹{selectedProduct.price}</span>
              </div>

              <div className="space-y-2">
                <Label htmlFor="discount-type" className="font-bold text-slate-700">Discount Model</Label>
                <select
                  id="discount-type"
                  className="w-full border rounded-xl px-3 py-2.5 bg-background shadow-sm text-sm"
                  value={discountType}
                  onChange={(e) => {
                    setDiscountType(e.target.value as any);
                    if (e.target.value === 'none') setDiscountValue('');
                  }}
                >
                  <option value="none">No Active Discount</option>
                  <option value="percentage">Percentage Discount (%)</option>
                  <option value="flat">Flat Value Discount (₹)</option>
                </select>
              </div>

              {discountType !== 'none' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="space-y-2">
                    <Label htmlFor="discount-value" className="font-bold text-slate-700">
                      {discountType === 'percentage' ? 'Discount Percentage (%)' : 'Flat Discount Value (₹)'}
                    </Label>
                    <Input
                      id="discount-value"
                      type="number"
                      placeholder={discountType === 'percentage' ? 'e.g. 15' : 'e.g. 50'}
                      className="rounded-xl h-11"
                      value={discountValue}
                      onChange={(e) => setDiscountValue(e.target.value)}
                    />
                    {discountType === 'percentage' && discountValue && (
                      <p className="text-xs text-muted-foreground font-semibold mt-1">
                        New Promotional Price: <span className="text-emerald-600 font-bold">₹{Math.max(0, parseFloat((selectedProduct.price * (1 - parseFloat(discountValue) / 100)).toFixed(2)) || 0)}</span>
                      </p>
                    )}
                    {discountType === 'flat' && discountValue && (
                      <p className="text-xs text-muted-foreground font-semibold mt-1">
                        New Promotional Price: <span className="text-emerald-600 font-bold">₹{Math.max(0, parseFloat((selectedProduct.price - parseFloat(discountValue)).toFixed(2)) || 0)}</span>
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-4 pt-2 border-t">
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">Schedule Discount (Optional)</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Leave blank to make the discount always active. Set both dates to schedule it for a specific time window.</p>
                    </div>
                    <div className="flex flex-col gap-4">
                      <DateTimePicker
                        label="From (Start Date & Time)"
                        value={discountStartDateTime}
                        onChange={setDiscountStartDateTime}
                        placeholder="Click to select start date & time"
                      />
                      <DateTimePicker
                        label="To (End Date & Time)"
                        value={discountEndDateTime}
                        onChange={setDiscountEndDateTime}
                        placeholder="Click to select end date & time"
                      />
                      {(discountStartDateTime || discountEndDateTime) && (
                        <button
                          type="button"
                          className="text-xs text-slate-400 underline hover:text-red-500 text-left w-fit transition-colors"
                          onClick={() => { setDiscountStartDateTime(''); setDiscountEndDateTime(''); }}
                        >
                          Clear schedule (make always active)
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button variant="outline" className="rounded-xl" onClick={() => setDiscountModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-primary hover:bg-primary-600 text-white rounded-xl font-semibold gap-1.5"
              onClick={handleSaveDiscount}
              disabled={updateProductDiscount.isPending}
            >
              {updateProductDiscount.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ═══════════════════════════════════════════════════
          MODAL: CREATE/EDIT BANNER
          ═══════════════════════════════════════════════════ */}
      <Dialog open={bannerModalOpen} onOpenChange={setBannerModalOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-accent-500" />
              {editingBanner ? 'Edit Promo Banner' : 'Create Promo Banner'}
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-sm">
              Design a banner link on the marketplace homepage slider.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="banner-title" className="font-bold text-slate-700">Banner Heading</Label>
              <Input
                id="banner-title"
                placeholder="e.g. Daily Deal on Fresh Catches"
                className="rounded-xl h-11"
                value={bannerTitle}
                onChange={(e) => setBannerTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="banner-subtitle" className="font-bold text-slate-700">Subheading / Description</Label>
              <Input
                id="banner-subtitle"
                placeholder="e.g. Save 15% on direct-from-harbor prawns today only"
                className="rounded-xl h-11"
                value={bannerSubtitle}
                onChange={(e) => setBannerSubtitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="banner-product" className="font-bold text-slate-700">Link directly to a Product</Label>
              <select
                id="banner-product"
                className="w-full border rounded-xl px-3 py-2.5 bg-background shadow-sm text-sm"
                value={bannerProductId}
                onChange={(e) => {
                  setBannerProductId(e.target.value);
                  if (e.target.value) setBannerLinkUrl(''); // Clear custom URL
                }}
              >
                <option value="">-- Or enter a custom landing URL below --</option>
                {productsData?.data.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} {p.sale_price !== null ? `(Active Deal: ₹${p.sale_price})` : `(Price: ₹${p.price})`}
                  </option>
                ))}
              </select>
            </div>

            {!bannerProductId && (
              <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
                <Label htmlFor="banner-url" className="font-bold text-slate-700">Or Custom Landing Page URL</Label>
                <Input
                  id="banner-url"
                  placeholder="e.g. /products?category=shrimps"
                  className="rounded-xl h-11"
                  value={bannerLinkUrl}
                  onChange={(e) => setBannerLinkUrl(e.target.value)}
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="banner-order" className="font-bold text-slate-700">Slide Order Index</Label>
                <Input
                  id="banner-order"
                  type="number"
                  placeholder="0"
                  className="rounded-xl h-11"
                  value={bannerOrderIndex}
                  onChange={(e) => setBannerOrderIndex(e.target.value)}
                />
              </div>

              <div className="flex flex-col justify-end pb-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="banner-active"
                    className="rounded border-slate-300 w-5 h-5 text-primary accent-primary"
                    checked={bannerIsActive}
                    onChange={(e) => setBannerIsActive(e.target.checked)}
                  />
                  <Label htmlFor="banner-active" className="font-bold text-slate-700 select-none cursor-pointer">
                    Publish Banner Active
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="font-bold text-slate-700">Slide Backdrop Image</Label>
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-2xl p-4 bg-slate-50 relative overflow-hidden aspect-[2/1] group/img">
                {bannerImagePreview ? (
                  <>
                    <img
                      src={bannerImagePreview || undefined}
                      alt="Banner Preview"
                      className="absolute inset-0 object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity duration-300">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="rounded-xl pointer-events-none"
                      >
                        Change Backdrop
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-slate-400 space-y-2 flex flex-col items-center">
                    <ImageIcon className="w-10 h-10 text-slate-300" />
                    <p className="text-xs font-semibold">Upload 1920x800 backdrop image</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleBannerImageChange}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button variant="outline" className="rounded-xl" onClick={() => setBannerModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-primary hover:bg-primary-600 text-white rounded-xl font-semibold gap-1.5"
              onClick={handleSaveBanner}
              disabled={createBanner.isPending || updateBanner.isPending}
            >
              {(createBanner.isPending || updateBanner.isPending) && <Loader2 className="w-4 h-4 animate-spin" />}
              {editingBanner ? 'Save Changes' : 'Create Banner'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
