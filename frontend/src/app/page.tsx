import Link from 'next/link';
import { Search, ShoppingCart, User as UserIcon, Fish, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function MarketplaceHome() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Top Header / Nav */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Menu className="h-5 w-5 md:hidden" />
            <Link href="/" className="flex items-center gap-2">
              <Fish className="h-6 w-6 text-primary" />
              <span className="font-heading font-bold text-xl tracking-tight hidden sm:inline-block">
                Kadal2Kadaai
              </span>
            </Link>
          </div>

          <div className="flex-1 max-w-2xl mx-auto hidden md:flex items-center">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for fresh fish, crabs, prawns..."
                className="w-full pl-8 bg-muted/50 border-none focus-visible:ring-primary"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/seller" className="text-sm font-medium hover:text-primary hidden lg:inline-block">
              Become a Seller
            </Link>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
              </Button>
              <Button variant="ghost" size="icon">
                <UserIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Promotional Banner Area */}
        <section className="bg-primary/5 py-12 md:py-16 border-b">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl">
              <h1 className="font-heading text-4xl font-extrabold tracking-tight sm:text-5xl mb-4">
                Fresh Catch of the Day!
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Get up to 20% off on Seer Fish (Vanjiram) from verified local fishermen.
              </p>
              <Button size="lg" className="font-medium">
                Shop Now
              </Button>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-12 container mx-auto px-4">
          <h2 className="text-2xl font-bold font-heading mb-6">Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {/* Mocks */}
            {['Sea Fish', 'Freshwater', 'Prawns', 'Crabs', 'Squid', 'Dry Fish'].map((cat, i) => (
              <div key={i} className="flex flex-col items-center p-4 rounded-xl border bg-card hover:border-primary transition-colors cursor-pointer text-center">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-3">
                  <Fish className="h-8 w-8 text-muted-foreground" />
                </div>
                <span className="font-medium text-sm">{cat}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold font-heading mb-6">Featured Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Product Card Mocks */}
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="group rounded-xl border bg-card overflow-hidden hover:shadow-md transition-all">
                  <div className="aspect-square bg-muted relative">
                    {/* Placeholder Image */}
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                      Image
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold truncate">Premium Seer Fish</h3>
                    <p className="text-sm text-muted-foreground mb-2">Sold by: Ocean Catchers</p>
                    <div className="flex items-center justify-between mt-4">
                      <span className="font-bold text-lg">₹850 <span className="text-sm font-normal text-muted-foreground">/ kg</span></span>
                      <Button size="sm">Add</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Kadal2Kadaai. Direct from fishermen to you.
          </p>
        </div>
      </footer>
    </div>
  );
}
