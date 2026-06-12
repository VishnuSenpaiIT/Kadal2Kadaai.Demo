'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Anchor, ShoppingCart, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useAddToCart } from '@/shared/api/hooks/useCart';
import Link from 'next/link';

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
  className
}: ProductCardProps) {
  const addToCartMutation = useAddToCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCartMutation.mutate({
      product_id: id,
      quantity: 1,
    });
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="h-full"
    >
      <Card className={cn("overflow-hidden group h-full flex flex-col rounded-3xl border border-border/50 bg-card hover:shadow-2xl transition-all duration-300 relative", className)}>
        {/* Decorative background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

        <Link href={`/products/${slug}`} className="flex-1 flex flex-col z-10">
          <div className="aspect-[4/3] bg-gradient-to-tr from-muted/50 to-muted relative flex items-center justify-center p-6 overflow-hidden">
            {/* Dark overlay on hover for better image contrast */}
            <div className="absolute inset-0 bg-primary-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>

            {image ? (
              <img src={image} alt={name} className="object-contain w-full h-full group-hover:scale-110 transition-transform duration-700 ease-out z-10 relative" />
            ) : (
              <Anchor className="h-16 w-16 text-primary/20 group-hover:scale-110 transition-transform duration-700 z-10 relative" />
            )}
            
            <div className="absolute top-4 left-4 z-20">
              <Badge className="bg-white/80 text-foreground backdrop-blur-md shadow-sm border-none font-semibold uppercase tracking-wider text-[10px] px-3 py-1">
                {category}
              </Badge>
            </div>
            
            {!isAvailable && (
              <div className="absolute inset-0 bg-background/60 backdrop-blur-[4px] flex items-center justify-center z-30">
                <Badge variant="destructive" className="text-bodySmall px-4 py-1.5 shadow-lg shadow-red-500/20">Out of Stock</Badge>
              </div>
            )}
          </div>
          
          <CardContent className="p-5 flex-1 flex flex-col justify-between relative bg-card">
            <div>
              <h4 className="font-heading font-bold text-lg text-foreground line-clamp-2 group-hover:text-primary transition-colors leading-tight" title={name}>{name}</h4>
            </div>
            <div className="mt-3 flex items-end justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground/80 uppercase tracking-wider mb-1">Per {weight}</p>
                <p className="text-2xl font-black text-primary drop-shadow-sm">
                  {currency}{price}
                </p>
              </div>
            </div>
          </CardContent>
        </Link>

        <CardFooter className="p-5 pt-0 z-10 bg-card relative">
          <Button 
            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary-600 hover:to-secondary-600 text-white rounded-xl py-6 font-bold text-base shadow-lg shadow-primary/20 transform hover:scale-[1.02] transition-all" 
            disabled={!isAvailable || addToCartMutation.isPending}
            onClick={handleAddToCart}
          >
            {addToCartMutation.isPending ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <ShoppingCart className="w-5 h-5 mr-2" />}
            {addToCartMutation.isPending ? 'Adding to Cart...' : 'Add to Cart'}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

