'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/layout/shared/Container';
import { Grid } from '@/components/layout/shared/Grid';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/domain/product/ProductCard';
import { Ship, Clock, ShieldCheck, ArrowRight, Loader2, ChevronLeft, ChevronRight, Anchor, Heart, ShoppingCart, Star, Flame, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts } from '@/shared/api/hooks/useProducts';
import { useCategories } from '@/shared/api/hooks/useCategories';
import { useLocation } from '@/providers/LocationProvider';
import { useAddToCart } from '@/shared/api/hooks/useCart';
import { toast } from 'sonner';
import { assetUrl } from '@/lib/asset-url';
import { useBanners } from '@/shared/api/hooks/useBanners';

const slideshowImages = [
  '/hero-fishermen.png',
  '/hero1_hq.png',
  '/hero2_hq.png',
  '/hero3_hq.png',
];

export default function Homepage() {
  const [activeTab, setActiveTab] = useState('all');
  const [wishlistedIds, setWishlistedIds] = useState<string[]>([]);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const { data: banners = [] } = useBanners();
  const hasBanners = banners.length > 0;

  useEffect(() => {
    const list = hasBanners ? banners.map(b => assetUrl(b.image_url)) : slideshowImages;
    // Preload images dynamically to prevent browser decoding lag
    list.forEach((src) => {
      if (src) {
        const img = new window.Image();
        img.src = src;
      }
    });

    const timer = setInterval(() => {
      setCurrentImgIndex((prevIndex) => (prevIndex + 1) % (hasBanners ? banners.length : slideshowImages.length));
    }, 4500);

    return () => clearInterval(timer);
  }, [banners.length, hasBanners]);
  
  const toggleWishlist = (productId: string, name: string) => {
    if (wishlistedIds.includes(productId)) {
      setWishlistedIds(prev => prev.filter(id => id !== productId));
      toast.info(`${name} removed from wishlist`);
    } else {
      setWishlistedIds(prev => [...prev, productId]);
      toast.success(`${name} added to wishlist!`);
    }
  };
  
  const addToCartMutation = useAddToCart();
  const handleAddToCart = (productId: string, name: string) => {
    addToCartMutation.mutate({
      product_id: productId,
      quantity: 1,
    }, {
      onSuccess: () => {
        toast.success(`Added ${name} to cart!`);
      },
      onError: (err) => {
        toast.error(err?.message || `Failed to add ${name} to cart`);
      }
    });
  };
  
  const { data: categories } = useCategories();
  const { location } = useLocation();
  const queryCategory = activeTab === 'all' ? undefined : activeTab;
  
  const filters: Record<string, string> = {};
  if (queryCategory) filters.category = queryCategory;
  if (location.pincode) filters.pincode = location.pincode;

  const { data: productsData, isLoading } = useProducts(Object.keys(filters).length > 0 ? filters : undefined);
  const products = productsData?.data || [];
  const topSellingProducts = products.filter((p: any) => p.is_top_selling);
  const todaysPurchaseProducts = products.filter((p: any) => p.is_todays_purchase);

  const tabs = [
    { id: 'all', label: "Today's Local Catch" },
    ...(categories || []).map(cat => ({ id: cat.slug, label: cat.name }))
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background transition-colors duration-500">

      {/* ═══════════════════════════════════════════════════
          NEW HERO SECTION (Full-Screen Premium Slideshow)
          ═══════════════════════════════════════════════════ */}
      <section className="relative w-full h-[calc(100vh-104px)] overflow-hidden flex items-center justify-start bg-slate-950">
        
        {/* Slideshow background images with horizontal slide transition */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-slate-950">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={currentImgIndex}
              className="absolute inset-0 w-full h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              style={{ zIndex: 10 }}
            >
              <img
                src={hasBanners ? assetUrl(banners[currentImgIndex]?.image_url) || '' : slideshowImages[currentImgIndex]}
                alt={`Hero slide ${currentImgIndex + 1}`}
                loading="eager"
                className="w-full h-full object-cover object-center"
              />
            </motion.div>
          </AnimatePresence>
          {/* Subtle Dark Gradient Overlay (70% opacity on left fading to transparent on right) to guarantee text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/10 sm:to-transparent z-20 pointer-events-none" />
        </div>

        {/* Left-Aligned Hero Content */}
        <div className="relative z-30 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 flex flex-col items-start justify-center text-left">
          <div className="flex flex-col items-start justify-center min-h-[50vh] max-w-3xl py-6">
            
            {/* Text and CTA */}
            <motion.div 
              key={`content-${currentImgIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-white space-y-6 flex flex-col items-start justify-center text-left"
            >
              <h1 className="text-4xl md:text-5xl lg:text-[4rem] font-black leading-[1.1] tracking-tight uppercase text-white drop-shadow-md">
                {hasBanners ? (
                  banners[currentImgIndex]?.title
                ) : (
                  <>
                    From the ocean waves
                    <br />
                    <span className="text-sky-400">to the kitchen flames</span>
                  </>
                )}
              </h1>
              
              <p className="text-lg md:text-xl text-slate-200/90 font-light leading-relaxed max-w-2xl filter drop-shadow">
                {hasBanners ? (
                  banners[currentImgIndex]?.subtitle
                ) : (
                  "Kadal2Kadaai (K2K) bridges South India's local fishermen directly to your kitchen. Discover traceable, premium-grade marine catch, eliminating cold-storage middlemen for unparalleled taste and quality."
                )}
              </p>
              
              <div className="flex flex-wrap items-center justify-start gap-4 pt-2">
                <Link href={hasBanners ? banners[currentImgIndex]?.link_url || '/products' : '/products'}>
                  <Button size="lg" className="bg-[#2A75C3] hover:bg-[#1e5a99] text-white rounded-full px-8 h-14 text-lg font-medium transition-all duration-300 border-none shadow-lg hover:shadow-blue-900/50 hover:scale-105 active:scale-95">
                    {hasBanners ? 'Check Out Offer' : 'Explore All Catch'} <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                {!hasBanners && (
                  <Link href="/products?sort=newest">
                    <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-lg font-medium border-white text-white hover:bg-white/10 bg-transparent transition-all duration-300 hover:scale-105 active:scale-95">
                      Today's Fresh Arrivals
                    </Button>
                  </Link>
                )}
              </div>
              
              {/* Trust Indicators in Hero */}
              <div className="flex flex-wrap items-center justify-start gap-6 pt-4 text-sm font-medium text-blue-100/90">
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg border border-white/20 backdrop-blur-sm shadow-sm transition-all hover:bg-white/15">
                  <Anchor className="w-5 h-5 text-sky-400" />
                  Direct from Harbor
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg border border-white/20 backdrop-blur-sm shadow-sm transition-all hover:bg-white/15">
                  <Clock className="w-5 h-5 text-sky-400" />
                  Same-Day Delivery
                </div>
                <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg border border-white/20 backdrop-blur-sm shadow-sm transition-all hover:bg-white/15">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  Quality Verified
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          CATEGORIES SECTION
          ═══════════════════════════════════════════════════ */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900/50">
        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-black text-foreground mb-4">Shop by Category</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Browse our wide selection of fresh seafood sorted by category for your convenience.</p>
          </div>

          {!categories || categories.length === 0 ? (
            <div className="text-center text-muted-foreground py-12">No categories available.</div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {categories.map((category) => (
                <Link key={category.id} href={`/products?category=${category.slug}`} className="group block">
                  <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform group-hover:-translate-y-1">
                    <div className="aspect-square w-full relative bg-slate-100 dark:bg-slate-800">
                      {category.image_url || category.image ? (
                        <img 
                          src={category.image_url || category.image} 
                          alt={category.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-slate-100 dark:bg-slate-800">
                          <Anchor className="w-8 h-8 opacity-20" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <div className="p-3 text-center">
                      <h3 className="font-heading font-bold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors line-clamp-1">{category.name}</h3>
                      {category.products_count !== undefined && (
                        <p className="text-xs text-muted-foreground mt-0.5">{category.products_count} items</p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 1: TOP SELLING SEAFOOD
          ═══════════════════════════════════════════════════ */}
      <section className="py-16 bg-gradient-to-b from-[#f0f8ff] via-[#f0f8ff] to-white overflow-hidden relative">
        {/* Ocean-inspired subtle background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,119,182,0.03)_0%,_transparent_70%)] pointer-events-none"></div>
        <div className="absolute top-10 left-10 w-96 h-96 bg-blue-100/30 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-sky-100/30 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="w-full max-w-[1800px] mx-auto mb-10 px-4 sm:px-6 lg:px-8 xl:px-12 text-center relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0077b6] bg-blue-50 px-4 py-1.5 rounded-full border border-blue-200/50 inline-block shadow-sm mb-3">Best Sellers</span>
          <h2 className="text-4xl md:text-5xl font-heading font-black text-slate-900 drop-shadow-sm">Top Selling Seafood</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mt-4 font-light">The absolute best-selling marine landings, selected daily by premium kitchens.</p>
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-80 relative z-10">
            <Loader2 className="w-12 h-12 animate-spin mb-4 text-[#0077b6]" />
            <p className="text-[#0077b6] font-medium animate-pulse">Reeling in top sellers...</p>
          </div>
        ) : (
          <div className="relative w-full overflow-hidden flex z-10 py-4 group/marquee">
            {/* Smooth infinite marquee loop */}
            <div className="animate-marquee group-hover/marquee:[animation-play-state:paused] flex gap-6 px-3">
              {/* Double the products array to create a seamless loop */}
              {[...(topSellingProducts || []), ...(topSellingProducts || [])].map((product, idx) => (
                <div key={`top-selling-${product.id}-${idx}`} className="w-[280px] sm:w-[300px] md:w-[320px] flex-shrink-0">
                  <ProductCard 
                    id={product.id.toString()} 
                    slug={product.slug}
                    name={product.name} 
                    price={product.price} 
                    salePrice={product.sale_price}
                    weight={product.weight_unit || "1kg"} 
                    category={product.category?.name || "Uncategorized"}
                    image={product.images?.[0]?.image_url}
                    isAvailable={product.available_quantity > 0}
                    className="shadow-lg hover:shadow-2xl border-white/40 bg-white/80 backdrop-blur-sm transition-all duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 2: TODAY'S PURCHASE
          ═══════════════════════════════════════════════════ */}
      <section className="pb-20 pt-4 bg-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.015] pointer-events-none mix-blend-overlay"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-emerald-50/40 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="w-full max-w-[1800px] mx-auto mb-10 px-4 sm:px-6 lg:px-8 xl:px-12 text-center relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200/50 inline-block shadow-sm mb-3">Live Feed</span>
          <h2 className="text-4xl md:text-5xl font-heading font-black text-slate-900 drop-shadow-sm">Today's Purchases</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mt-4 font-light">See what other premium kitchens are reeling in right now.</p>
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-80 relative z-10">
            <Loader2 className="w-12 h-12 animate-spin mb-4 text-emerald-500" />
            <p className="text-emerald-600 font-medium animate-pulse">Loading recent orders...</p>
          </div>
        ) : (
          <div className="relative w-full overflow-hidden flex z-10 py-4 group/marquee2">
            {/* Left-to-right infinite marquee */}
            <div
              className="flex gap-6 px-3 group-hover/marquee2:[animation-play-state:paused]"
              style={{ display: 'flex', width: 'max-content', animation: 'marquee 35s linear infinite reverse' }}
            >
              {/* Simulate "Today's Purchase" by taking a slice and duplicating it */}
              {[...([...(todaysPurchaseProducts || [])].reverse()), ...([...(todaysPurchaseProducts || [])].reverse())].map((product, idx) => (
                <div key={`today-purchase-${product.id}-${idx}`} className="w-[280px] sm:w-[300px] md:w-[320px] flex-shrink-0">
                  <div className="relative">
                    {/* Add Popularity Indicator */}
                    <div className="absolute -top-3 -right-3 z-30 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1 border border-white">
                      <Flame className="w-3 h-3" />
                      Just Bought
                    </div>
                    <ProductCard 
                      id={product.id.toString()} 
                      slug={product.slug}
                      name={product.name} 
                      price={product.price} 
                      salePrice={product.sale_price}
                      weight={product.weight_unit || "1kg"} 
                      category={product.category?.name || "Uncategorized"}
                      image={product.images?.[0]?.image_url}
                      isAvailable={product.available_quantity > 0}
                      className="shadow-md hover:shadow-xl border-slate-100 bg-white transition-all duration-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
