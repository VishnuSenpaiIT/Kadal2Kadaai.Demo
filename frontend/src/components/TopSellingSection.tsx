import { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, Info } from 'lucide-react';
import { SeafoodProduct } from '../types';
import { SEAFOOD_PRODUCTS } from '../data';
import ProductCard from './ProductCard';
// @ts-ignore
import logoImg from '../assets/images/image.png';

interface TopSellingSectionProps {
  onAddToCart: (product: SeafoodProduct, weight: string, cut: string) => void;
  onAddToWishlist: (product: SeafoodProduct) => void;
  wishlistIds: string[];
  setActiveTab: (tab: string) => void;
  products?: SeafoodProduct[];
  onCardClick?: (product: SeafoodProduct) => void;
}

export default function TopSellingSection({
  onAddToCart,
  onAddToWishlist,
  wishlistIds,
  setActiveTab,
  products,
  onCardClick,
}: TopSellingSectionProps) {
  // Get popular items to display in the marquee
  const popularProducts = (products || SEAFOOD_PRODUCTS).filter((p) => p.isPopular);

  // Triple-duplicate array to form a continuous infinite cycle
  const carouselItems = [...popularProducts, ...popularProducts, ...popularProducts];

  return (
    <section id="top-selling-seafood-section" className="py-20 bg-gradient-to-b from-white via-[#EBF8FF] to-[#DBEAFE]/60 border-b border-blue-100 overflow-hidden relative">
      {/* Soft color decorative blur bubbles */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-50/40 rounded-full blur-3xl pointer-events-none" />

      {/* Giant high-fidelity corporate logo watermark on the left side */}
      <div className="absolute top-1/2 -left-20 md:-left-40 w-80 h-80 md:w-[600px] md:h-[600px] -translate-y-1/2 opacity-[0.06] pointer-events-none select-none z-0">
        <img
          src={logoImg}
          alt=""
          className="w-full h-full object-contain filter saturate-50"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Title block */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-white bg-[#0077B6] border border-[#005F99]/80 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
              <span>Sought After Crabs, Prawns & Fish</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-[#0A2540] tracking-tight leading-tight uppercase">
              Top Selling Seafood
            </h2>
            <p className="font-sans text-sm sm:text-base text-[#0077B6] mt-2 max-w-2xl font-semibold">
              Explore the morning catches that are in extremely high demand across Chennai, Coimbatore, and classic Tamil Nadu households today.
            </p>
          </div>
          <button
            id="all-products-carousel-redirect"
            onClick={() => setActiveTab('marketplace')}
            className="inline-flex items-center space-x-1 text-sm font-semibold text-[#0077B6] hover:text-[#0096C7] transition-colors py-1 hover:border-b border-[#0077B6] group shrink-0 focus:outline-none cursor-pointer"
          >
            <span>View Complete Marketplace</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* Marquee Infinite Carousel */}
      <div className="relative w-full overflow-hidden select-none mb-4 py-4 focus-within:outline-none z-10">
        
        {/* Soft edge-blurs for luxury design feel */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#EBF8FF] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#DBEAFE]/60 to-transparent z-10 pointer-events-none" />

        <div className="flex w-max animate-marquee-left hover:[animation-play-state:paused] py-4">
          {carouselItems.map((product, idx) => (
            <div key={`${product.id}-carousel-${idx}`} className="px-3 shrink-0">
              <ProductCard
                product={product}
                onAddToCart={onAddToCart}
                onAddToWishlist={onAddToWishlist}
                isWishlisted={wishlistIds.includes(product.id)}
                theme="light"
                onCardClick={onCardClick}
              />
            </div>
          ))}
        </div>
      </div>

    </section>
  );
}
