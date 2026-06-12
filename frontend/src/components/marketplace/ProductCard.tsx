import Link from 'next/link';
import { Product } from '@/types/marketplace.types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images?.find(i => i.is_primary)?.image_url || product.images?.[0]?.image_url || 'https://placehold.co/600x400/e2e8f0/1e293b?text=No+Image';

  return (
    <div className="group flex flex-col bg-card rounded-xl border overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
      
      {/* Image Area */}
      <Link href={`/products/${product.slug}`} className="relative aspect-square overflow-hidden bg-muted">
        {product.is_popular && (
          <Badge className="absolute top-2 left-2 z-10 bg-orange-500 hover:bg-orange-600">Popular</Badge>
        )}
        {product.sale_price && (
          <Badge className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600">Sale</Badge>
        )}
        <img 
          src={primaryImage} 
          alt={product.name} 
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </Link>

      {/* Content Area */}
      <div className="flex flex-col flex-1 p-4">
        <Link href={`/categories/${product.category.slug}`} className="text-xs text-muted-foreground hover:text-primary mb-1 inline-block">
          {product.category.name}
        </Link>
        
        <Link href={`/products/${product.slug}`} className="font-medium text-foreground hover:text-primary line-clamp-2 mb-2 flex-1">
          {product.name}
        </Link>
        
        <div className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
          <span>By {product.seller?.first_name} {product.seller?.last_name}</span>
        </div>

        <div className="flex items-center justify-between mt-auto pt-2 border-t">
          <div>
            {product.sale_price ? (
              <div className="flex flex-col">
                <span className="text-sm text-muted-foreground line-through">₹{product.price}/{product.weight_unit}</span>
                <span className="text-lg font-bold text-primary">₹{product.sale_price}/{product.weight_unit}</span>
              </div>
            ) : (
              <span className="text-lg font-bold text-primary">₹{product.price}/{product.weight_unit}</span>
            )}
          </div>
          
          {/* Future Cart Action Placeholder */}
          <Button size="icon" variant="secondary" className="rounded-full" aria-label="Add to cart">
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
