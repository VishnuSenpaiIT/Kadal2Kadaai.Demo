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

  const handleAddToCart = () => {
    addToCartMutation.mutate({
      product_id: id,
      quantity: 1,
    });
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card className={cn("overflow-hidden group h-full flex flex-col hover:shadow-lg transition-shadow", className)}>
        <Link href={`/products/${slug}`} className="flex-1 flex flex-col">
          <div className="aspect-square bg-muted/30 relative flex items-center justify-center p-6 overflow-hidden">
            {image ? (
              <img src={image} alt={name} className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-500" />
            ) : (
              <Anchor className="h-16 w-16 text-muted-foreground/50" />
            )}
            <div className="absolute top-3 left-3">
              <Badge variant="outline" className="bg-background/80 backdrop-blur-sm shadow-sm">
                {category}
              </Badge>
            </div>
            {!isAvailable && (
              <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center">
                <Badge variant="destructive" className="text-bodySmall px-3 py-1">Out of Stock</Badge>
              </div>
            )}
          </div>
          
          <CardContent className="p-4 flex-1 flex flex-col justify-between">
            <div>
              <h4 className="font-heading font-semibold text-foreground line-clamp-2" title={name}>{name}</h4>
            </div>
            <div className="mt-2 space-y-1">
              <p className="text-caption text-muted-foreground">Per {weight}</p>
              <p className="text-bodyLarge font-bold text-primary-600">
                {currency}{price}
              </p>
            </div>
          </CardContent>
        </Link>

        <CardFooter className="p-4 pt-0">
          <Button 
            className="w-full bg-accent-600 hover:bg-accent-700 text-white" 
            disabled={!isAvailable || addToCartMutation.isPending}
            onClick={handleAddToCart}
          >
            {addToCartMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ShoppingCart className="w-4 h-4 mr-2" />}
            {addToCartMutation.isPending ? 'Adding...' : 'Add to Cart'}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

