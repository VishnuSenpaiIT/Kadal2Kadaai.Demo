import { productService } from '@/services/marketplace.service';
import { ProductGrid } from '@/components/marketplace/ProductGrid';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'All Products | Kadal2Kadaai',
  description: 'Browse all fresh seafood products available on Kadal2Kadaai.',
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = typeof searchParams.page === 'string' ? searchParams.page : '1';
  const sort = typeof searchParams.sort === 'string' ? searchParams.sort : 'newest';
  
  // Fetch products
  const productsData = await productService.getAll({
    page,
    sort,
    per_page: 16,
    ...searchParams
  }).catch(() => null);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">All Products</h1>
          <p className="text-muted-foreground">Browse our entire collection of fresh catch</p>
        </div>
        
        {/* Simple Sort Dropdown Placeholder - functionality can be enhanced client-side later */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Sort by:</span>
          <select className="border rounded-md px-3 py-1.5 text-sm bg-background">
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters - Static for now */}
        <aside className="w-full md:w-64 shrink-0 space-y-6">
          <div className="border rounded-xl p-5 bg-card">
            <h3 className="font-bold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/categories/fresh-fish" className="hover:text-primary hover:underline">Fresh Fish</Link></li>
              <li><Link href="/categories/sea-fish" className="hover:text-primary hover:underline">Sea Fish</Link></li>
              <li><Link href="/categories/river-fish" className="hover:text-primary hover:underline">River Fish</Link></li>
              <li><Link href="/categories/prawns" className="hover:text-primary hover:underline">Prawns</Link></li>
              <li><Link href="/categories/crabs" className="hover:text-primary hover:underline">Crabs</Link></li>
              <li><Link href="/categories/dry-fish" className="hover:text-primary hover:underline">Dry Fish</Link></li>
            </ul>
          </div>
          
          <div className="border rounded-xl p-5 bg-card">
            <h3 className="font-bold mb-4">Filters</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><input type="checkbox" className="rounded" /> <span>Featured Only</span></li>
              <li className="flex items-center gap-2"><input type="checkbox" className="rounded" /> <span>On Sale</span></li>
            </ul>
          </div>
        </aside>

        {/* Main Product Grid */}
        <div className="flex-1">
          {productsData ? (
            <>
              <div className="mb-6 text-sm text-muted-foreground">
                Showing {productsData.data.length} of {productsData.total} products
              </div>
              <ProductGrid products={productsData.data} />
              
              {/* Simple Pagination Placeholder */}
              {productsData.last_page > 1 && (
                <div className="mt-12 flex justify-center gap-2">
                  <button disabled className="px-4 py-2 border rounded-md disabled:opacity-50">Previous</button>
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md">1</button>
                  <button className="px-4 py-2 border rounded-md">Next</button>
                </div>
              )}
            </>
          ) : (
            <ProductGrid products={[]} emptyMessage="Failed to load products. Please try again later." />
          )}
        </div>
      </div>
    </div>
  );
}
