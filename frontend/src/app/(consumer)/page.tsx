'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/layout/shared/Container';
import { Grid } from '@/components/layout/shared/Grid';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/domain/product/ProductCard';
import { Ship, Clock, ShieldCheck, ArrowRight, Loader2, ChevronLeft, ChevronRight, Anchor } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts } from '@/shared/api/hooks/useProducts';
import { useCategories } from '@/shared/api/hooks/useCategories';

export default function Homepage() {
  const [activeTab, setActiveTab] = useState('all');
  
  const { data: categories } = useCategories();
  const queryCategory = activeTab === 'all' ? undefined : activeTab;
  const { data: productsData, isLoading } = useProducts(queryCategory ? { category: queryCategory } : undefined);
  const products = productsData?.data || [];

  const tabs = [
    { id: 'all', label: "Today's Local Catch" },
    ...(categories || []).map(cat => ({ id: cat.slug, label: cat.name }))
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* ═══════════════════════════════════════════════════
          HERO SECTION — Kadal2Kadaai Reference Design
          ═══════════════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden" style={{ height: '580px' }}>

        {/* ── Background: Ocean / Fishermen Photo ── */}
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.06, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.6, ease: 'easeOut' }}
        >
          <Image
            src="/hero-fishermen.png"
            alt="South Indian fishermen at sunrise"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          {/* Gradient overlay — left lighter, right darker for text readability */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to right, rgba(10,30,50,0.18) 0%, rgba(10,30,50,0.10) 40%, rgba(8,25,42,0.72) 65%, rgba(5,18,32,0.88) 100%)',
            }}
          />
          {/* Bottom dark fade */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, rgba(5,15,30,0.55) 0%, transparent 50%)',
            }}
          />
        </motion.div>

        {/* ── Foreground: Copper Kadai with Fish ── */}
        <motion.div
          className="absolute bottom-0 left-0 z-10"
          style={{ width: '480px', height: '420px' }}
          initial={{ x: -60, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}
        >
          <Image
            src="/hero-kadai.png"
            alt="Fresh seafood in copper kadai"
            fill
            priority
            className="object-contain object-bottom-left"
            sizes="480px"
          />
        </motion.div>

        {/* ── Top-Left: Logo ── */}
        <div className="absolute top-5 left-6 z-20 flex items-center gap-2">
          <div className="flex items-center gap-2 bg-black/25 backdrop-blur-sm rounded-lg px-3 py-1.5">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C8 2 5 5 5 9c0 5 7 13 7 13s7-8 7-13c0-4-3-7-7-7z" fill="#4fd1c5" opacity="0.9"/>
              <path d="M12 6 L12 18 M8 10 L16 10" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="font-bold text-white text-sm tracking-wide">
              Kadal<span className="text-[#4fd1c5]">2</span>Kadaai
            </span>
          </div>
        </div>

        {/* ── Right Side: Main Text Content ── */}
        <div className="absolute inset-y-0 right-0 z-20 flex flex-col justify-center pr-10 pl-6"
          style={{ width: '50%', maxWidth: '520px' }}>

          {/* Gold Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className="font-heading font-black leading-tight mb-4"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              color: '#D4AF37',
              textShadow: '0 2px 20px rgba(0,0,0,0.4)',
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
            }}
          >
            Welcome to<br />Kadal2Kadaai
          </motion.h1>

          {/* White Subtitle */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.7 }}
            className="font-sans font-normal text-white mb-3"
            style={{
              fontSize: 'clamp(1.1rem, 2.2vw, 1.55rem)',
              lineHeight: 1.35,
              textShadow: '0 1px 8px rgba(0,0,0,0.5)',
            }}
          >
            Straight from the Sea.<br />Made in your Kitchen.
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.9 }}
            className="text-white/80 mb-7 leading-relaxed"
            style={{ fontSize: 'clamp(0.8rem, 1.4vw, 0.95rem)', maxWidth: '400px' }}
          >
            Traceable, premium-grade marine catch from local fishermen,
            delivered to your doorstep. Experience the real taste of the coast.
          </motion.p>

          {/* CTA Button — Teal Outline Style */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.1 }}
            className="flex items-center gap-4"
          >
            <Link href="/products">
              <motion.button
                whileHover={{ backgroundColor: '#319795', scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2 font-bold tracking-widest uppercase"
                style={{
                  border: '2px solid #4fd1c5',
                  color: '#4fd1c5',
                  background: 'transparent',
                  padding: '0.6rem 1.6rem',
                  fontSize: '0.78rem',
                  letterSpacing: '0.12em',
                  borderRadius: '2px',
                  cursor: 'pointer',
                }}
              >
                Explore Our Story
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* ── Slider Nav Arrows (bottom-right) ── */}
        <div className="absolute bottom-6 right-5 z-30 flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-9 h-9 rounded-full flex items-center justify-center border border-white/40 bg-black/35 backdrop-blur-sm text-white hover:bg-black/55 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-9 h-9 rounded-full flex items-center justify-center border border-white/40 bg-black/35 backdrop-blur-sm text-white hover:bg-black/55 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>

        {/* ── Sparkle Decoration (top-right corner, like ref) ── */}
        <motion.div
          className="absolute bottom-8 right-24 z-20 text-white/70"
          animate={{ rotate: [0, 20, 0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l2.4 7.2H22l-6.2 4.5 2.4 7.2L12 16.4l-6.2 4.5 2.4-7.2L2 9.2h7.6z"/>
          </svg>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════
          TRUST INDICATORS
          ═══════════════════════════════════════════════════ */}
      <section className="bg-[#f7f9fb] py-12 border-b border-gray-100">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Ship, label: 'Direct From Harbor', desc: 'Sourced directly from verified local fishermen. No cold-storage middlemen.', color: 'bg-teal-50 text-teal-700' },
              { icon: Clock, label: 'Same Day Delivery', desc: 'Catch of the day delivered to your doorstep within hours of landing.', color: 'bg-emerald-50 text-emerald-700' },
              { icon: ShieldCheck, label: '100% Quality Guarantee', desc: "Rigorous quality checks. If it's not fresh, we'll replace it no questions asked.", color: 'bg-blue-50 text-blue-700' },
            ].map(({ icon: Icon, label, desc, color }) => (
              <motion.div
                key={label}
                whileHover={{ y: -4 }}
                className="flex flex-col items-center text-center space-y-3 p-6"
              >
                <div className={`h-16 w-16 rounded-full ${color} flex items-center justify-center mb-2`}>
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="font-heading font-bold text-gray-900">{label}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ═══════════════════════════════════════════════════
          DYNAMIC PRODUCT SECTION
          ═══════════════════════════════════════════════════ */}
      <section className="py-24 bg-white">
        <Container>
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-heading font-bold text-gray-900">Explore Our Catch</h2>
              <p className="text-gray-500">Premium seafood categorized for your convenience.</p>
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full md:w-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-[#102a43] text-white border-[#102a43]'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <Loader2 className="w-10 h-10 animate-spin mb-4 text-teal-400" />
              <p>Fetching fresh catch...</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {products && products.length > 0 ? (
                  <Grid cols="responsive-products" gap="lg">
                    {products.map((product) => (
                      <ProductCard 
                        key={product.id}
                        id={product.id.toString()} 
                        slug={product.slug}
                        name={product.name} 
                        price={product.sale_price || product.price} 
                        weight={product.weight_unit || "1kg"} 
                        category={product.category?.name || "Uncategorized"}
                        image={product.images?.[0]?.image_url}
                        isAvailable={product.available_quantity > 0}
                      />
                    ))}
                  </Grid>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-200 rounded-2xl">
                    <Anchor className="w-12 h-12 text-gray-300 mb-4" />
                    <p className="text-gray-400">No catch available for this category today.</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
          
          <div className="mt-12 text-center">
            <Link href="/products">
              <Button variant="outline" className="min-w-[200px] border-gray-300 hover:border-gray-500">
                View Entire Catalog <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
