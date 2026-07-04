const fs = require('fs');
let content = fs.readFileSync('frontend/src/app/(consumer)/page.tsx', 'utf8');
const topSection = `'use client';

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

const slideshowImages = [
  '/fishingimg1.jpg',
  '/heroimg2.jpg',
  '/heroimg3.webp',
  '/heroimg4.jpg',
];

export default function Homepage() {
  const [activeTab, setActiveTab] = useState('all');
  const [wishlistedIds, setWishlistedIds] = useState<string[]>([]);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  useEffect(() => {
    // Preload images dynamically to prevent browser decoding lag
    slideshowImages.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });

    const timer = setInterval(() => {
      setCurrentImgIndex((prevIndex) => (prevIndex + 1) % slideshowImages.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);
  
  const toggleWishlist = (productId: string, name: string) => {
    if (wishlistedIds.includes(productId)) {
      setWishlistedIds(prev => prev.filter(id => id !== productId));
      toast.info(\`\${name} removed from wishlist\`);
    } else {
      setWishlistedIds(prev => [...prev, productId]);
      toast.success(\`\${name} added to wishlist!\`);
    }
  };
  
  const addToCartMutation = useAddToCart();
  const handleAddToCart = (productId: string, name: string) => {
    addToCartMutation.mutate({
      product_id: productId,
      quantity: 1,
    }, {
      onSuccess: () => {
        toast.success(\`Added \${name} to cart!\`);
      },
      onError: (err) => {
        toast.error(err?.message || \`Failed to add \${name} to cart\`);
      }
    });
  };
  
  const { data: categories } = useCategories();
  const { location } = useLocation();
  const queryCategory = activeTab === 'all' ? undefined : activeTab;
  
  const filters = {};
  if (queryCategory) filters.category = queryCategory;
  if (location.pincode) filters.pincode = location.pincode;

  const { data: productsData, isLoading } = useProducts(Object.keys(filters).length > 0 ? filters : undefined);
  const products = productsData?.data || [];

  const tabs = [
    { id: 'all', label: "Today's Local Catch" },
    ...(categories || []).map(cat => ({ id: cat.slug, label: cat.name }))
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background transition-colors duration-500">

      {/* ═══════════════════════════════════════════════════
          NEW HERO SECTION (Full-Screen Premium Slideshow)
          ═══════════════════════════════════════════════════ */}
      <section className="relative w-full h-[calc(100vh-104px)] overflow-hidden flex items-center justify-center bg-slate-950">
        
        {/* Slideshow background images with horizontal slide transition */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-slate-950">
          <AnimatePresence initial={false}>
            <motion.div
              key={currentImgIndex}
              className="absolute inset-0 w-full h-full"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              style={{ zIndex: 10, pointerEvents: "none" }}
            >
              <img
                src={slideshowImages[currentImgIndex]}
                alt={\`Hero image \${currentImgIndex + 1}\`}
                loading="eager"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </AnimatePresence>
          {/* Subtle Dark Overlay (45% opacity) to guarantee text readability */}
          <div className="absolute inset-0 bg-black/45 z-20 pointer-events-none" />
        </div>

        {/* Centered Hero Content */}
        <div className="relative z-30 w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 flex flex-col items-center justify-center text-center">
          <div className="flex flex-col items-center justify-center min-h-[50vh] max-w-4xl py-6">
            
            {/* Text and CTA */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, ease: "easeOut" }}
              className="text-white space-y-6 flex flex-col items-center justify-center text-center"
            >
              <h1 className="text-4xl md:text-5xl lg:text-[3.5rem] font-black leading-[1.15] tracking-tight uppercase bg-gradient-to-r from-white via-sky-200 to-sky-400 bg-clip-text text-transparent filter drop-shadow-sm">
                From the ocean waves
                <br />
                to the kitchen flames
              </h1>
              
              <p className="text-lg md:text-xl text-blue-100/90 font-light leading-relaxed max-w-3xl filter drop-shadow">
                Kadal2Kadaai (K2K) bridges South India's local fishermen directly to your kitchen. Discover traceable, premium-grade marine catch, eliminating cold-storage middlemen for unparalleled taste and quality.
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <Link href="/products">
                  <Button size="lg" className="bg-[#2A75C3] hover:bg-[#1e5a99] text-white rounded-full px-8 h-14 text-lg font-medium transition-all duration-300 border-none shadow-lg hover:shadow-blue-900/50 hover:scale-105 active:scale-95">
                    Explore All Catch <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/products?sort=newest">
                  <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-lg font-medium border-white text-white hover:bg-white/10 bg-transparent transition-all duration-300 hover:scale-105 active:scale-95">
                    Today's Fresh Arrivals
                  </Button>
                </Link>
              </div>
              
              {/* Trust Indicators in Hero */}
              <div className="flex flex-wrap items-center justify-center gap-6 pt-4 text-sm font-medium text-blue-100/90">
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
      </section>`;
const dynamicProductIndex = content.indexOf('{/* ═══════════════════════════════════════════════════\r\n          DYNAMIC PRODUCT SECTION');
if (dynamicProductIndex !== -1) {
  content = topSection + '\n\n      ' + content.slice(dynamicProductIndex);
  fs.writeFileSync('frontend/src/app/(consumer)/page.tsx', content);
  console.log('Successfully restored UI!');
} else {
  const dynamicProductIndex2 = content.indexOf('{/* ═══════════════════════════════════════════════════\n          DYNAMIC PRODUCT SECTION');
  if (dynamicProductIndex2 !== -1) {
    content = topSection + '\n\n      ' + content.slice(dynamicProductIndex2);
    fs.writeFileSync('frontend/src/app/(consumer)/page.tsx', content);
    console.log('Successfully restored UI!');
  } else {
    console.log('Could not find DYNAMIC PRODUCT SECTION marker.');
  }
}
