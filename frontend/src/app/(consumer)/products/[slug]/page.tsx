import { productService } from '@/services/marketplace.service';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, ShieldCheck, Anchor, Star, MapPin, Clock } from 'lucide-react';
import { AddToCartSection } from './AddToCartSection';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const product = await productService.getBySlug(params.slug);
    return {
      title: `${product.name} | Kadal2Kadaai`,
      description: product.meta_description || product.short_description || '',
    };
  } catch (e) {
    return { title: 'Product Not Found' };
  }
}

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  try {
    const product = await productService.getBySlug(params.slug);
    const primaryImage = product.images?.find(i => i.is_primary)?.image_url || product.images?.[0]?.image_url;

    return (
      <div className="bg-background min-h-screen pt-8 pb-24 relative overflow-hidden">
        {/* Decorative Background */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10 -translate-y-1/2 translate-x-1/4"></div>

        <div className="container mx-auto px-4">
          
          {/* Breadcrumb */}
          <div className="glass-panel px-6 py-3 rounded-full inline-flex text-sm text-muted-foreground mb-8 items-center gap-2 border border-white/10 shadow-sm">
            <Link href="/" className="hover:text-primary transition-colors font-medium">Home</Link>
            <span className="opacity-50">/</span>
            <Link href="/products" className="hover:text-primary transition-colors font-medium">Catalog</Link>
            <span className="opacity-50">/</span>
            <Link href={`/categories/${product.category.slug}`} className="hover:text-primary transition-colors font-medium">{product.category.name}</Link>
            <span className="opacity-50">/</span>
            <span className="text-foreground font-semibold truncate max-w-[200px] sm:max-w-none">{product.name}</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 mb-20">
            {/* Image Gallery */}
            <div className="flex flex-col gap-4">
              <div className="glass-panel rounded-[2.5rem] border border-white/20 p-8 relative flex items-center justify-center aspect-square shadow-xl group overflow-hidden">
                {/* Image background glow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-secondary/10 z-0 opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {product.is_popular && (
                  <Badge className="absolute top-6 left-6 z-20 bg-accent text-white text-sm py-1.5 px-4 shadow-lg shadow-accent/20 border-none">Popular Choice</Badge>
                )}
                
                {primaryImage ? (
                  <img 
                    src={primaryImage} 
                    alt={product.name} 
                    className="w-full h-full object-contain z-10 drop-shadow-2xl group-hover:scale-105 transition-transform duration-700 ease-out" 
                  />
                ) : (
                  <Anchor className="w-32 h-32 text-primary/20 z-10 group-hover:scale-110 transition-transform duration-700" />
                )}
              </div>
              
              {/* Future Thumbnail Row placeholder */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide px-2">
                  {product.images.map(img => (
                    <div key={img.id} className="w-24 h-24 shrink-0 rounded-2xl glass-panel p-2 cursor-pointer border-white/20 hover:border-primary/50 transition-colors opacity-70 hover:opacity-100 shadow-sm flex items-center justify-center bg-white/40">
                      <img src={img.image_url} className="w-full h-full object-contain drop-shadow-md" alt="thumbnail" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-center">
              <div className="inline-block mb-3">
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full transition-colors">
                  {product.category.name}
                </Badge>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-foreground mb-4 leading-tight drop-shadow-sm">{product.name}</h1>
              
              <div className="flex flex-wrap items-center gap-6 mb-8 text-sm">
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star fill="currentColor" className="w-4 h-4" />
                  <Star fill="currentColor" className="w-4 h-4" />
                  <Star fill="currentColor" className="w-4 h-4" />
                  <Star fill="currentColor" className="w-4 h-4" />
                  <Star fill="currentColor" className="w-4 h-4 opacity-30" />
                  <span className="text-muted-foreground ml-2 font-medium">(4.0)</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block"></span>
                  {product.view_count} people looking
                </div>
              </div>

              <div className="glass-panel p-6 rounded-3xl mb-8 border border-white/20 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="text-sm text-muted-foreground font-semibold uppercase tracking-wider mb-1">Fresh Catch Price</div>
                  {product.sale_price ? (
                    <div className="flex items-baseline gap-4">
                      <span className="text-5xl font-black text-primary drop-shadow-sm">₹{product.sale_price}</span>
                      <span className="text-2xl text-muted-foreground font-medium line-through">₹{product.price}</span>
                      <span className="text-lg text-muted-foreground font-medium ml-1">/ {product.weight_unit}</span>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-black text-primary drop-shadow-sm">₹{product.price}</span>
                      <span className="text-lg text-muted-foreground font-medium">/ {product.weight_unit}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-10">
                <AddToCartSection productId={product.id.toString()} initialQuantity={1} />
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-xl text-primary">
                    <Anchor className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Direct Catch</p>
                    <p className="text-sm text-muted-foreground mt-1 leading-snug">Sourced straight from local fishermen</p>
                  </div>
                </div>
                <div className="glass-panel p-5 rounded-2xl border border-white/10 flex items-start gap-4">
                  <div className="bg-secondary/10 p-3 rounded-xl text-secondary">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Verified Fresh</p>
                    <p className="text-sm text-muted-foreground mt-1 leading-snug">Checked for absolute quality</p>
                  </div>
                </div>
              </div>

              {/* Seller Info */}
              <div className="border border-border/50 rounded-3xl p-6 bg-card shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold text-xl shadow-md">
                    {product.seller?.first_name?.charAt(0) || 'K'}
                  </div>
                  <div>
                    <h3 className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-0.5">Sourced By</h3>
                    <p className="font-bold text-lg text-foreground leading-none">{product.seller?.first_name} {product.seller?.last_name}</p>
                  </div>
                </div>
                <Button variant="outline" className="rounded-full px-6 font-semibold border-border hover:bg-muted">View Boat</Button>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="grid lg:grid-cols-3 gap-12 lg:gap-16 pt-16 mt-16 border-t border-border/50 relative">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-heading font-bold mb-8 text-foreground">About This Catch</h2>
              <div className="glass-panel p-8 md:p-10 rounded-3xl border border-white/10 prose prose-lg prose-slate max-w-none text-muted-foreground leading-relaxed shadow-sm">
                <p>{product.full_description || product.short_description || "Premium quality fresh seafood sourced directly from the coasts. Enjoy the rich taste and nutrients of the ocean in your everyday meals."}</p>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-heading font-bold mb-8 text-foreground">Specifications</h2>
              <div className="glass-panel rounded-3xl border border-white/10 p-8 shadow-sm flex flex-col gap-6">
                <div className="flex items-start gap-4 pb-6 border-b border-border/50">
                  <div className="bg-primary/10 p-3 rounded-xl text-primary mt-1">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Origin / Catch Area</span>
                    <span className="block font-bold text-lg text-foreground">{product.origin_location || "Local Harbors"}</span>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 pb-6 border-b border-border/50">
                  <div className="bg-accent/10 p-3 rounded-xl text-accent mt-1">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Freshness Guarantee</span>
                    <span className="block font-bold text-lg text-foreground">Up to {product.freshness_hours || "24"} hours</span>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-secondary/10 p-3 rounded-xl text-secondary mt-1">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Minimum Order</span>
                    <span className="block font-bold text-lg text-foreground">{product.minimum_order_quantity} {product.weight_unit}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  } catch (e) {
    notFound();
  }
}
