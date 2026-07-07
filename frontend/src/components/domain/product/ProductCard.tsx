'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Anchor, ShoppingCart, Loader2, Check, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useAddToCart } from '@/shared/api/hooks/useCart';
import Link from 'next/link';
import { assetUrl } from '@/lib/asset-url';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  price: number;
  currency?: string;
  weight: string;
  image?: string | null;
  category: string;
  isAvailable?: boolean;
  className?: string;
  salePrice?: number | null;
}

export function ProductCard({
  id,
  slug,
  name,
  price,
  currency = '₹',
  weight,
  image,
  category,
  isAvailable = true,
  className,
  salePrice
}: ProductCardProps) {
  const addToCartMutation = useAddToCart();
  const resolvedImage = assetUrl(image);
  const [isAdded, setIsAdded] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCartMutation.mutate({
      product_id: id,
      quantity: 1,
    }, {
      onSuccess: () => {
        setIsAdded(true);
        setSuccessModalOpen(true);
        setTimeout(() => setIsAdded(false), 2000);
      }
    });
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="h-full"
    >
      <Card className={cn("overflow-hidden group h-full flex flex-col rounded-2xl border border-border/60 bg-card hover:shadow-xl transition-all duration-300 relative", className)}>
        {/* Decorative background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

        <Link href={`/products/${slug}`} className="flex-1 flex flex-col z-10">
          <div className="aspect-[4/3] bg-muted/20 relative flex items-center justify-center p-4 overflow-hidden border-b border-border/40">
            {/* Dark overlay on hover for better image contrast */}
            <div className="absolute inset-0 bg-primary-900/5 dark:bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>

            {resolvedImage ? (
              <img src={resolvedImage} alt={name} className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out z-10 relative" />
            ) : (
              <Anchor className="h-12 w-12 text-primary/20 dark:text-primary/40 group-hover:scale-110 transition-transform duration-700 z-10 relative" />
            )}
            
            <div className="absolute top-3 left-3 z-20">
              <Badge className="bg-white/90 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 backdrop-blur-md shadow-sm border border-border/50 font-semibold uppercase tracking-wider text-[9px] px-2 py-0.5">
                {category}
              </Badge>
            </div>

            {salePrice && salePrice < price && (
              <div className="absolute top-3 right-3 z-20">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 to-red-600 text-white flex flex-col items-center justify-center shadow-[0_4px_12px_rgba(225,29,72,0.4)] border border-rose-500/20 transform hover:scale-110 transition-transform duration-300">
                  <span className="text-[12px] font-black leading-none">{Math.round(((price - salePrice) / price) * 100)}%</span>
                  <span className="text-[8px] font-black leading-none tracking-wider uppercase mt-0.5">OFF</span>
                </div>
              </div>
            )}
            
            {!isAvailable && (
              <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center z-30">
                <Badge variant="destructive" className="text-xs px-3 py-1 shadow-lg shadow-red-500/20">Out of Stock</Badge>
              </div>
            )}

            {/* Brand watermark - bottom right */}
            <div className="absolute bottom-2 right-2 z-20 w-8 h-8 rounded-full overflow-hidden border border-white/60 shadow-md bg-white">
              <img
                src="/logo.jpg"
                alt="Kadal 2 Kadaai"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <CardContent className="p-4 flex-1 flex flex-col justify-between relative bg-card">
            <div>
              <h4 className="font-semibold text-sm md:text-base text-foreground line-clamp-2 group-hover:text-primary dark:group-hover:text-primary-400 transition-colors leading-snug" title={name}>{name}</h4>
            </div>
            <div className="mt-3 flex items-end justify-between">
              <div className="w-full">
                <p className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                  Price Per {weight}
                </p>
                {salePrice && salePrice < price ? (
                  <div className="space-y-1">
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
                        {currency}{salePrice}
                      </span>
                      <span className="text-xs sm:text-sm text-muted-foreground line-through">
                        {currency}{price}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-200/50 dark:border-emerald-500/20">
                        {Math.round(((price - salePrice) / price) * 100)}% OFF
                      </span>
                    </div>
                    <p className="text-[9px] text-muted-foreground/60 italic font-medium">
                      (Includes all taxes)
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="text-xl sm:text-2xl font-black text-primary dark:text-primary-400">
                      {currency}{price}
                    </p>
                    <p className="text-[9px] text-muted-foreground/60 italic font-medium">
                      (Includes all taxes)
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Link>

        <CardFooter className="p-4 pt-0 z-10 bg-card relative">
          <Button 
            className={cn(
              "w-full rounded-lg h-10 font-semibold text-sm shadow-md transition-colors",
              isAdded 
                ? "bg-green-600 hover:bg-green-700 text-white shadow-green-600/20" 
                : "bg-primary hover:bg-primary-600 text-white shadow-primary/10"
            )}
            disabled={!isAvailable || addToCartMutation.isPending || isAdded}
            onClick={handleAddToCart}
          >
            <AnimatePresence mode="wait">
              {isAdded ? (
                <motion.div
                  key="added"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Added!
                </motion.div>
              ) : addToCartMutation.isPending ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center"
                >
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={successModalOpen} onOpenChange={setSuccessModalOpen}>
        <DialogContent className="sm:max-w-sm p-6 rounded-3xl border border-slate-200/80 bg-white/95 backdrop-blur-md shadow-2xl">
          <DialogHeader className="text-center pb-2 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-2">
              <Check className="w-6 h-6" />
            </div>
            <DialogTitle className="text-xl font-heading font-black text-slate-900 leading-none">
              Added to Net! 🎣
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 p-4 rounded-2xl my-2">
            <div className="w-16 h-16 rounded-xl bg-white border overflow-hidden shrink-0 flex items-center justify-center shadow-sm">
              {resolvedImage ? (
                <img src={resolvedImage} alt={name} className="w-full h-full object-contain p-1" />
              ) : (
                <Anchor className="w-8 h-8 text-primary/30" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h5 className="font-heading font-bold text-sm text-slate-900 truncate leading-snug">{name}</h5>
              <p className="text-xs text-muted-foreground mt-0.5 font-semibold">Quantity: 1 item</p>
              <p className="text-sm font-black text-emerald-600 mt-1">₹{salePrice || price}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-2 pt-2">
            <Button
              className="w-full bg-gradient-to-r from-primary to-secondary text-white font-bold h-12 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-primary/20 hover:shadow-lg transition-all"
              onClick={() => {
                setSuccessModalOpen(false);
                window.location.href = '/checkout';
              }}
            >
              Checkout Now <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              className="w-full border-slate-200 hover:bg-slate-50 text-slate-700 font-bold h-12 rounded-xl"
              onClick={() => {
                setSuccessModalOpen(false);
                window.location.href = '/cart';
              }}
            >
              View Net (Cart)
            </Button>
            <Button
              variant="ghost"
              className="w-full text-slate-500 hover:text-slate-700 font-medium h-10 rounded-xl"
              onClick={() => setSuccessModalOpen(false)}
            >
              Continue Shopping
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

