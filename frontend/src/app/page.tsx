import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/marketplace/SearchBar';
import { CategoryCard } from '@/components/marketplace/CategoryCard';
import { ProductGrid } from '@/components/marketplace/ProductGrid';
import { categoryService, productService } from '@/services/marketplace.service';

export default async function HomePage() {
  // Fetch data concurrently
  const [categories, featuredProducts, popularProducts] = await Promise.all([
    categoryService.getAll().catch(() => []),
    productService.getFeatured().catch(() => []),
    productService.getPopular().catch(() => [])
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. Hero Section */}
      <section className="relative bg-slate-900 text-white overflow-hidden py-24 lg:py-32">
        <div className="absolute inset-0 opacity-20">
          <img src="https://placehold.co/1920x1080/0f172a/334155?text=Ocean+Background" alt="Ocean" className="w-full h-full object-cover" />
        </div>
        <div className="container relative mx-auto px-4 text-center z-10">
          <h1 className="text-4xl md:text-6xl font-heading font-bold mb-6">Fresh Fish Direct To Consumers</h1>
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Experience the freshest catch from local fishermen, delivered straight to your kitchen. Skip the middleman.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/products">
              <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8">Browse Products</Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-14 px-8 bg-transparent text-white hover:bg-white hover:text-slate-900">Join Marketplace</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Search Section */}
      <section className="py-8 -mt-8 relative z-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white p-4 rounded-2xl shadow-xl">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* 3. Categories Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-heading font-bold mb-2">Shop by Category</h2>
              <p className="text-muted-foreground">Explore our wide variety of fresh seafood</p>
            </div>
            <Link href="/categories" className="hidden sm:block text-primary font-medium hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.slice(0, 8).map(category => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-heading font-bold mb-2">Featured Catch</h2>
              <p className="text-muted-foreground">Handpicked premium selections for you</p>
            </div>
            <Link href="/products?featured=true" className="hidden sm:block text-primary font-medium hover:underline">View All</Link>
          </div>
          <ProductGrid products={featuredProducts} emptyMessage="No featured products available today." />
        </div>
      </section>

      {/* 5. Popular Products */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-heading font-bold mb-2">Popular Right Now</h2>
              <p className="text-muted-foreground">What our customers are loving today</p>
            </div>
            <Link href="/products?popular=true" className="hidden sm:block text-primary font-medium hover:underline">View All</Link>
          </div>
          <ProductGrid products={popularProducts} emptyMessage="No popular products available right now." />
        </div>
      </section>

      {/* 6. Fresh Catch Section */}
      <section className="py-20 bg-primary text-primary-foreground text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">Today's Fresh Landing</h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto mb-10">
            Our fishermen have just returned with their latest haul. Browse the freshest catch before it's gone!
          </p>
          <Link href="/products?sort=newest">
            <Button size="lg" variant="secondary" className="h-14 px-8 text-lg rounded-full">
              View Fresh Landing
            </Button>
          </Link>
        </div>
      </section>

      {/* 7. Why Choose Us (Benefits) */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center mb-16">Why Choose Kadal2Kadaai</h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">⚓</div>
              <h3 className="text-xl font-bold mb-3">Direct from Fishermen</h3>
              <p className="text-muted-foreground">We connect you directly with local fishermen, ensuring fair prices and unmatched freshness.</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">🐟</div>
              <h3 className="text-xl font-bold mb-3">Guaranteed Freshness</h3>
              <p className="text-muted-foreground">From the sea to your kitchen in record time. No long storage, no chemical preservatives.</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">⚖️</div>
              <h3 className="text-xl font-bold mb-3">Fair Market Value</h3>
              <p className="text-muted-foreground">Transparent pricing that benefits both the consumer and the hardworking fishermen.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Call To Action */}
      <section className="py-24 bg-slate-900 text-white text-center relative overflow-hidden">
        <div className="container relative z-10 mx-auto px-4">
          <h2 className="text-4xl font-heading font-bold mb-6">Ready to Taste the Ocean?</h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have switched to Kadal2Kadaai for their seafood needs.
          </p>
          <Link href="/register">
            <Button size="lg" className="h-14 px-10 text-lg">Create Free Account</Button>
          </Link>
        </div>
      </section>

    </div>
  );
}
