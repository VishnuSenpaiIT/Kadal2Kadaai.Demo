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
    <div className="flex flex-col min-h-screen bg-background transition-colors duration-500">

      {/* ═══════════════════════════════════════════════════
          TRUST INDICATORS
          ═══════════════════════════════════════════════════ */}
      <section className="relative z-30 mb-20 px-4 mt-8">
        <Container>
          <div className="glass-panel rounded-3xl p-8 grid grid-cols-1 md:grid-cols-3 gap-8 shadow-xl">
            {[
              { icon: Ship, label: 'Direct From Harbor', desc: 'Sourced directly from verified local fishermen. No cold-storage middlemen.' },
              { icon: Clock, label: 'Same Day Delivery', desc: 'Catch of the day delivered to your doorstep within hours of landing.' },
              { icon: ShieldCheck, label: '100% Quality Guarantee', desc: "Rigorous quality checks. If it's not fresh, we'll replace it no questions asked." },
            ].map(({ icon: Icon, label, desc }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center space-y-4 p-4 rounded-2xl hover:bg-white/5 transition-colors group"
              >
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-inner">
                  <Icon className="h-10 w-10 text-primary" />
                </div>
                <h3 className="font-heading font-bold text-foreground text-xl">{label}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* ═══════════════════════════════════════════════════
          DYNAMIC PRODUCT SECTION
          ═══════════════════════════════════════════════════ */}
      <section className="py-16 pb-32">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6 text-center md:text-left">
            <div className="space-y-3">
              <h2 className="text-4xl md:text-5xl font-heading font-black text-foreground">Explore Our Catch</h2>
              <p className="text-muted-foreground text-lg">Premium seafood curated for the finest kitchens.</p>
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto pb-4 w-full md:w-auto scrollbar-hide snap-x">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-full text-sm font-bold transition-all whitespace-nowrap snap-center shadow-sm ${
                    activeTab === tab.id
                      ? 'bg-primary text-white scale-105'
                      : 'bg-card text-muted-foreground hover:bg-primary/5 hover:text-primary'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-96">
              <Loader2 className="w-12 h-12 animate-spin mb-4 text-primary" />
              <p className="text-muted-foreground font-medium animate-pulse">Reeling in the fresh catch...</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {products && products.length > 0 ? (
                  <Grid cols="responsive-products" gap="xl">
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
                  <div className="flex flex-col items-center justify-center h-80 glass-panel rounded-3xl text-center p-8">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                      <Anchor className="w-12 h-12 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">No Catch Today</h3>
                    <p className="text-muted-foreground max-w-md">Our fishermen haven't brought in anything for this category yet today. Check back soon!</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
          
          <div className="mt-20 text-center">
            <Link href="/products">
              <Button size="lg" className="bg-card text-foreground hover:bg-primary hover:text-white border border-border shadow-md rounded-full px-10 h-14 font-bold text-base transition-all group">
                View Entire Catalog 
                <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
