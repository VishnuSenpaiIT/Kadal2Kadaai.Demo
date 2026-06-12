'use client';

import React, { useState } from 'react';
import { Container } from '@/components/layout/shared/Container';
import { Grid } from '@/components/layout/shared/Grid';
import { ProductCard } from '@/components/domain/product/ProductCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Loader2, Anchor } from 'lucide-react';
import { useProducts } from '@/shared/api/hooks/useProducts';
import { useCategories } from '@/shared/api/hooks/useCategories';

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | undefined>();
  const [sort, setSort] = useState<'popular' | 'newest' | 'price_asc' | 'price_desc'>('popular');

  const { data: categories } = useCategories();
  const { data: productsData, isLoading } = useProducts({
    search: searchTerm,
    category: activeCategory,
    sort,
    per_page: 24,
  });

  const products = productsData?.data || [];

  return (
    <div className="py-8 bg-background min-h-[calc(100vh-80px)]">
      <Container>
        {/* Page Header & Filtering */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-h2 font-heading font-bold text-foreground">Fresh Catch Catalog</h1>
            <p className="text-bodyMedium text-muted-foreground mt-1">Showing all available landings from our harbor network.</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search catalog..." 
                className="pl-9" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Select value={sort} onValueChange={(val: any) => setSort(val)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="newest">Freshly Landed</SelectItem>
                  <SelectItem value="price_asc">Price: Low to High</SelectItem>
                  <SelectItem value="price_desc">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="hidden lg:block w-64 shrink-0 space-y-8">
            <div>
              <h3 className="font-heading font-semibold text-h6 mb-4 pb-2 border-b">Categories</h3>
              <ul className="space-y-3 text-bodyMedium">
                <li className="flex items-center justify-between font-medium">
                  <span 
                    className={`cursor-pointer hover:underline ${!activeCategory ? 'text-accent-600' : 'text-muted-foreground hover:text-foreground'}`}
                    onClick={() => setActiveCategory(undefined)}
                  >
                    All Catch
                  </span>
                </li>
                {categories?.map((cat) => (
                  <li key={cat.id} className="flex items-center justify-between">
                    <span 
                      className={`cursor-pointer hover:underline ${activeCategory === cat.slug ? 'text-accent-600' : 'text-muted-foreground hover:text-foreground'}`}
                      onClick={() => setActiveCategory(cat.slug)}
                    >
                      {cat.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-teal-400" />
                <p>Fetching fresh catch...</p>
              </div>
            ) : products.length > 0 ? (
              <Grid cols="responsive-products" gap="lg">
                {products.map((product: any) => (
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
                <p className="text-gray-400">No catch available matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
