'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/axios';
import { assetUrl } from '@/lib/asset-url';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ShoppingCart, ShieldCheck, Anchor, Star, MapPin, Clock,
  ChevronRight, Minus, Plus, Loader2, Check, Tag, Package,
  Truck, Award, Fish, RefreshCw, ArrowLeft, Droplets, Info, ThermometerSnowflake
} from 'lucide-react';
import { useAddToCart } from '@/shared/api/hooks/useCart';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProductVariant {
  name: string;
  price_modifier: number;
  shipping_modifier: number;
  max_distance: number | null;
}

interface ProductAttributes {
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

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [isAdded, setIsAdded] = useState(false);

  const addToCartMutation = useAddToCart();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const res = await apiClient.get(`/v1/marketplace/products/${slug}`);
      return (res as any).data.data;
    },
    enabled: !!slug,
    retry: 1,
  });

  const handleAddToCart = () => {
    if (!product) return;
    addToCartMutation.mutate(
      { product_id: product.id, quantity, selected_variant: selectedVariant?.name },
      {
        onSuccess: () => {
          setIsAdded(true);
          setTimeout(() => setIsAdded(false), 2000);
          toast.success(`${product.name} added to cart!`);
        },
        onError: () => toast.error('Please log in to add items to cart'),
      }
    );
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 animate-pulse">
            <div className="aspect-square rounded-3xl bg-muted"></div>
            <div className="space-y-6 pt-4">
              <div className="h-4 w-24 bg-muted rounded-full"></div>
              <div className="h-12 w-3/4 bg-muted rounded-xl"></div>
              <div className="h-6 w-1/2 bg-muted rounded-full"></div>
              <div className="h-20 bg-muted rounded-2xl"></div>
              <div className="h-14 bg-muted rounded-2xl"></div>
              <div className="h-14 bg-muted rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error / Not Found
  if (error || !product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6 px-4">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Fish className="h-12 w-12 text-primary/40" />
          </div>
          <h1 className="text-3xl font-heading font-bold">Product Not Found</h1>
          <p className="text-muted-foreground max-w-sm mx-auto">
            This catch seems to have swum away. Try browsing our fresh catalog instead.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
            </Button>
            <Link href="/products"><Button>Browse Products</Button></Link>
          </div>
        </div>
      </div>
    );
  }

  const images = product.images || [];
  const currentImageUrl = assetUrl(images[selectedImage]?.image_url);
  const variants: ProductVariant[] = product.variants || [];
  const tags = product.tags || [];
  const attributes: ProductAttributes = product.attributes || {};
  
  // Stock Status logic
  const inStock = (product.available_quantity ?? 0) > 0;
  const isLowStock = inStock && product.available_quantity <= 5;
  const stockText = inStock ? (isLowStock ? `Only ${product.available_quantity} Left` : 'In Stock') : 'Out of Stock';
  
  // Base pricing
  const basePrice = Number(product.price || 0);
  const salePrice = product.sale_price ? Number(product.sale_price) : null;
  // Dynamic Pricing based on selected variant
  const variantPriceModifier = Number(selectedVariant?.price_modifier || 0);
  const displayBasePrice = basePrice + variantPriceModifier;
  const displaySalePrice = salePrice !== null ? salePrice + variantPriceModifier : null;
  
  const effectivePrice = displaySalePrice !== null ? displaySalePrice : displayBasePrice;

  return (
    <div className="min-h-screen bg-background pb-20">

      {/* Decorative blobs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 right-0 w-[700px] h-[700px] bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8 flex-wrap">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-50" />
          <Link href="/products" className="hover:text-primary transition-colors">Catalog</Link>
          <ChevronRight className="h-3.5 w-3.5 opacity-50" />
          {product.category && (
            <>
              <Link href={`/products?category=${product.category.slug}`} className="hover:text-primary transition-colors">
                {product.category.name}
              </Link>
              <ChevronRight className="h-3.5 w-3.5 opacity-50" />
            </>
          )}
          <span className="text-foreground font-medium truncate max-w-[180px]">{product.name}</span>
        </nav>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 mb-16">

          {/* ── LEFT: Image Gallery ── */}
          <div className="flex flex-col gap-4">
            {/* Main Image */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/10 border border-border/50 shadow-2xl aspect-square flex items-center justify-center group">
              {/* Badges */}
              {product.is_popular && (
                <Badge className="absolute top-5 left-5 z-20 bg-amber-500 text-white border-none shadow-lg text-xs px-3 py-1 font-bold">
                  🔥 Best Seller
                </Badge>
              )}

              {/* In/Out Stock indicator */}
              <div className={`absolute bottom-5 left-5 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm border ${inStock ? (isLowStock ? 'bg-orange-500/20 text-orange-700 border-orange-300/50' : 'bg-green-500/20 text-green-700 border-green-300/50') : 'bg-red-500/20 text-red-700 border-red-300/50'}`}>
                <span className={`w-2 h-2 rounded-full ${inStock ? (isLowStock ? 'bg-orange-500 animate-pulse' : 'bg-green-500 animate-pulse') : 'bg-red-500'}`}></span>
                {stockText}
              </div>

              {currentImageUrl ? (
                <img
                  src={currentImageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-primary/20">
                  <Fish className="w-28 h-28 mb-3" />
                  <span className="text-sm text-muted-foreground">No image available</span>
                </div>
              )}

              {/* Brand watermark - bottom right */}
              <div className="absolute bottom-5 right-5 z-20 w-12 h-12 rounded-full overflow-hidden border-2 border-white/70 shadow-lg bg-white">
                <img src="/logo.jpg" alt="Kadal 2 Kadaai" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {images.map((img: any, idx: number) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(idx)}
                    className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${selectedImage === idx ? 'border-primary shadow-md shadow-primary/20 scale-105' : 'border-border/50 hover:border-primary/50 opacity-70 hover:opacity-100'}`}
                  >
                    <img
                      src={assetUrl(img.image_url) || ''}
                      alt={`View ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Trust strip */}
            <div className="grid grid-cols-3 gap-3 mt-2">
              {[
                { icon: <Truck className="h-4 w-4" />, text: 'Fast Delivery', sub: attributes.packaging_type || 'Insulated Packaging' },
                { icon: <RefreshCw className="h-4 w-4" />, text: 'Fresh Guarantee', sub: attributes.freshness_type || '100% fresh' },
                { icon: <Award className="h-4 w-4" />, text: 'Quality Assured', sub: attributes.quality_grade || 'Verified' },
              ].map((item) => (
                <div key={item.text} className="flex flex-col items-center justify-center gap-1.5 text-center p-3 rounded-2xl bg-muted/40 border border-border/30">
                  <span className="text-primary">{item.icon}</span>
                  <span className="text-xs font-semibold text-foreground leading-tight">{item.text}</span>
                  <span className="text-[10px] text-muted-foreground">{item.sub}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Product Info ── */}
          <div className="flex flex-col">

            <div className="flex justify-between items-start mb-2">
              {/* Category Badge */}
              {product.category && (
                <Link href={`/products?category=${product.category.slug}`}>
                  <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full cursor-pointer transition-colors">
                    {product.category.name}
                  </Badge>
                </Link>
              )}
              {attributes.sku && (
                <span className="text-xs text-muted-foreground font-medium uppercase">SKU: {attributes.sku}</span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-heading font-black text-foreground leading-tight mb-2">
              {product.name}
            </h1>
            
            {attributes.scientific_name && (
              <p className="text-sm text-muted-foreground italic mb-3">({attributes.scientific_name})</p>
            )}

            {/* Short description */}
            {product.short_description && (
              <p className="text-muted-foreground text-base leading-relaxed mb-5">
                {product.short_description}
              </p>
            )}

            {/* Rating row */}
            <div className="flex flex-wrap items-center gap-5 mb-6">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} fill="currentColor" className={`w-4 h-4 ${i === 5 ? 'text-amber-200' : 'text-amber-400'}`} />
                ))}
                <span className="text-sm text-muted-foreground ml-2 font-medium">4.8 · 124 Reviews</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10 rounded-2xl p-5 mb-6">
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2">Price per {product.weight_unit}</p>
              {displaySalePrice !== null ? (
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-black text-emerald-600 dark:text-emerald-400">₹{displaySalePrice}</span>
                  <span className="text-lg text-muted-foreground line-through">₹{displayBasePrice}</span>
                  <Badge className="bg-rose-600 hover:bg-rose-700 text-white font-bold ml-2 border-none">
                    {Math.round(((displayBasePrice - displaySalePrice) / displayBasePrice) * 100)}% OFF
                  </Badge>
                </div>
              ) : (
                <span className="text-4xl font-black text-foreground">₹{displayBasePrice}</span>
              )}
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-muted-foreground">
                  (Includes all taxes)
                </p>
                {attributes.estimated_yield && (
                  <p className="text-xs font-semibold text-primary">
                    Est. Yield: {attributes.estimated_yield}
                  </p>
                )}
              </div>
            </div>

            {/* Variants */}
            {variants.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wide">Available As</p>
                <div className="flex flex-wrap gap-2">
                  {variants.map((v) => {
                    const isSelected = selectedVariant?.name === v.name;
                    return (
                      <button
                        key={v.name}
                        type="button"
                        onClick={() => setSelectedVariant(isSelected ? null : v)}
                        className={`flex flex-col items-start px-4 py-2 rounded-xl text-sm border transition-all duration-150 ${isSelected
                          ? 'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/20 scale-105'
                          : 'bg-background text-foreground border-border hover:border-primary hover:text-primary'
                          }`}
                      >
                        <div className="flex items-center gap-1.5 font-semibold">
                          {isSelected && <Check className="h-3.5 w-3.5" />}
                          {v.name}
                        </div>
                        {v.price_modifier > 0 && (
                          <span className={`text-xs mt-0.5 ${isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                            +₹{v.price_modifier}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              {/* Quantity Selector */}
              <div className="flex items-center border border-border rounded-xl overflow-hidden bg-background shadow-sm h-14">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  className="px-4 h-full text-lg font-bold hover:bg-muted transition-colors disabled:opacity-30 text-foreground"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-5 font-bold text-lg text-foreground min-w-[3ch] text-center select-none">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  disabled={quantity >= product.available_quantity}
                  className="px-4 h-full text-lg font-bold hover:bg-muted transition-colors disabled:opacity-30 text-foreground"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <Button
                size="lg"
                className={cn(
                  "flex-1 h-14 text-base font-bold shadow-lg rounded-xl transition-all duration-200 hover:scale-[1.02]",
                  isAdded 
                    ? "bg-green-600 hover:bg-green-700 text-white shadow-green-600/30" 
                    : "bg-primary hover:bg-primary/90 text-white shadow-primary/30"
                )}
                onClick={handleAddToCart}
                disabled={addToCartMutation.isPending || !inStock || isAdded}
              >
                <AnimatePresence mode="wait">
                  {isAdded ? (
                    <motion.div
                      key="added"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.15 }}
                      className="flex items-center gap-2"
                    >
                      <Check className="h-5 w-5" /> Added!
                    </motion.div>
                  ) : addToCartMutation.isPending ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="flex items-center gap-2"
                    >
                      <Loader2 className="h-5 w-5 animate-spin" /> Adding...
                    </motion.div>
                  ) : (
                    <motion.div
                      key="idle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="flex items-center gap-2"
                    >
                      <ShoppingCart className="h-5 w-5" /> {inStock ? 'Add to Cart' : 'Out of Stock'}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <Tag className="h-4 w-4 text-muted-foreground" />
                {tags.map((tag: any) => (
                  <span key={tag.id} className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground border border-border">
                    {tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* Seller Card */}
            {product.seller && (
              <div className="flex items-center gap-4 p-4 rounded-2xl border border-border/50 bg-card shadow-sm">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-black text-lg shadow-md shrink-0">
                  {product.seller?.first_name?.charAt(0) || 'K'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-0.5">Sourced By</p>
                  <p className="font-bold text-foreground">{product.seller?.first_name} {product.seller?.last_name}</p>
                  <p className="text-xs text-muted-foreground">Verified Kadal2Kadaai Seller ✓</p>
                </div>
                <Badge className="bg-green-100 text-green-700 border-green-200 text-xs font-semibold shrink-0">Quality Checked</Badge>
              </div>
            )}
          </div>
        </div>

        {/* ── DETAILS SECTIONS (SINGLE PAGE LAYOUT) ── */}
        <div className="border-t border-border/50 pt-16 mt-12 pb-20 flex flex-col gap-20">
          
          {/* SEAFOOD INFO & NUTRITION COMBINED */}
          <section>
            <div className="grid lg:grid-cols-2 gap-12">
              
              {/* LEFT COLUMN: Seafood Info & Processing */}
              <div>
                <h2 className="text-3xl font-bold font-heading mb-8">Seafood Info & Processing</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/30 border border-border/50 p-6 rounded-2xl flex flex-col gap-2">
                    <MapPin className="h-7 w-7 text-primary mb-2" />
                    <p className="text-xs font-semibold uppercase text-muted-foreground">Catch Location</p>
                    <p className="text-lg font-bold text-foreground">{attributes.catch_location || product.origin_location || 'Local Harbors'}</p>
                  </div>
                  <div className="bg-muted/30 border border-border/50 p-6 rounded-2xl flex flex-col gap-2">
                    <Anchor className="h-7 w-7 text-primary mb-2" />
                    <p className="text-xs font-semibold uppercase text-muted-foreground">Fishing Harbor</p>
                    <p className="text-lg font-bold text-foreground">{attributes.fishing_harbor || 'N/A'}</p>
                  </div>
                  <div className="bg-muted/30 border border-border/50 p-6 rounded-2xl flex flex-col gap-2">
                    <Clock className="h-7 w-7 text-primary mb-2" />
                    <p className="text-xs font-semibold uppercase text-muted-foreground">Catch Date</p>
                    <p className="text-lg font-bold text-foreground">{attributes.catch_date || 'Fresh Catch'}</p>
                  </div>
                  <div className="bg-muted/30 border border-border/50 p-6 rounded-2xl flex flex-col gap-2">
                    <Fish className="h-7 w-7 text-primary mb-2" />
                    <p className="text-xs font-semibold uppercase text-muted-foreground">Fishing Method</p>
                    <p className="text-lg font-bold text-foreground">{attributes.fishing_method || 'Line Caught'}</p>
                  </div>
                </div>
                
                <div className="mt-8">
                   <h3 className="text-xl font-bold mb-4">Processing Details</h3>
                   <div className="flex flex-wrap gap-4">
                      <div className="px-5 py-3 rounded-xl border border-border/50 bg-card">
                         <p className="text-xs text-muted-foreground uppercase font-semibold">Freshness Type</p>
                         <p className="font-bold text-lg">{attributes.freshness_type || 'Fresh'}</p>
                      </div>
                      <div className="px-5 py-3 rounded-xl border border-border/50 bg-card">
                         <p className="text-xs text-muted-foreground uppercase font-semibold">Processing Method</p>
                         <p className="font-bold text-lg">{attributes.processing_method || 'Whole Fish'}</p>
                      </div>
                      <div className="px-5 py-3 rounded-xl border border-border/50 bg-card">
                         <p className="text-xs text-muted-foreground uppercase font-semibold">Quality Grade</p>
                         <p className="font-bold text-lg">{attributes.quality_grade || 'Premium Grade'}</p>
                      </div>
                   </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Nutrition Facts */}
              <div>
                <h2 className="text-3xl font-bold font-heading mb-8">Nutrition Facts</h2>
                <div className="max-w-md">
                  <div className="border-4 border-foreground p-1 bg-white dark:bg-slate-900 rounded-xl">
                    <div className="border border-foreground p-4">
                      <h4 className="text-3xl font-black font-sans uppercase border-b-8 border-foreground pb-2 mb-2">Nutrition Facts</h4>
                      <p className="font-bold border-b border-foreground pb-1">Serving Size: 100g</p>
                      
                      <div className="flex justify-between items-end border-b-4 border-foreground py-2">
                        <div>
                          <p className="font-bold text-sm">Amount Per Serving</p>
                          <p className="font-black text-3xl">Calories</p>
                        </div>
                        <p className="font-black text-4xl">{attributes.calories || '105'}</p>
                      </div>

                      <div className="text-sm font-semibold divide-y divide-border">
                        <div className="flex justify-between py-1.5"><span className="font-bold">Total Fat</span><span>{attributes.fat || '2.5g'}</span></div>
                        <div className="flex justify-between py-1.5 pl-4 text-muted-foreground"><span>Cholesterol</span><span>{attributes.cholesterol || '50mg'}</span></div>
                        <div className="flex justify-between py-1.5 pl-4 text-muted-foreground"><span>Sodium</span><span>{attributes.sodium || '60mg'}</span></div>
                        <div className="flex justify-between py-1.5"><span className="font-bold">Total Carbohydrate</span><span>{attributes.carbohydrates || '0g'}</span></div>
                        <div className="flex justify-between py-1.5"><span className="font-bold">Protein</span><span>{attributes.protein || '19g'}</span></div>
                        <div className="flex justify-between py-1.5 border-b-4 border-foreground bg-secondary/10 px-2 rounded mt-1">
                          <span className="font-bold text-secondary">Omega-3 Content</span><span className="font-bold text-secondary">{attributes.omega_3 || '~400mg'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-start gap-2 text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg border border-border/50">
                    <Info className="h-4 w-4 shrink-0 mt-0.5" />
                    <p><strong>Note:</strong> These are general nutritional estimates typical for South Indian fresh catch. Actual values may vary based on the specific species, size, and season.</p>
                  </div>
                </div>
              </div>
              
            </div>
          </section>

          {/* STORAGE & HANDLING */}
          <section>
            <h2 className="text-3xl font-bold font-heading mb-8">Storage & Handling</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Storage */}
              <div className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6">
                  <ThermometerSnowflake className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold mb-6">Storage Instructions</h3>
                
                <div className="space-y-5">
                  <div>
                    <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Temperature Guidelines</p>
                    <p className="font-medium text-lg">{attributes.storage_instructions || 'Store below 4°C immediately upon receipt.'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Shelf Life</p>
                    <p className="font-medium text-lg">{attributes.shelf_life || '48 hours from delivery.'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Refrigeration</p>
                    <p className="font-medium text-lg">{attributes.refrigeration_guidelines || 'Keep refrigerated. Do not refreeze once thawed.'}</p>
                  </div>
                </div>
              </div>

              {/* Delivery */}
              <div className="bg-card border border-border/50 rounded-3xl p-8 shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center mb-6">
                  <Truck className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-6">Delivery Information</h3>
                
                <div className="space-y-5">
                  <div>
                    <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Packaging Type</p>
                    <p className="font-medium text-lg">{attributes.packaging_type || 'Insulated foam box with dry ice / gel packs.'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Cold Chain Info</p>
                    <p className="font-medium text-lg">{attributes.cold_chain_info || 'Maintained strictly under 4°C during entire transit.'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Delivery Availability</p>
                    <p className="font-medium text-green-600 font-bold text-lg">{attributes.delivery_availability || 'Available for next day delivery.'}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>

      </div>
    </div>
  );
}
