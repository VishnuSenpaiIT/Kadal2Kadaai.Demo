import { productService } from '@/services/marketplace.service';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, ShieldCheck, Truck, Anchor } from 'lucide-react';
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
    const primaryImage = product.images?.find(i => i.is_primary)?.image_url || product.images?.[0]?.image_url || 'https://placehold.co/800x800/e2e8f0/1e293b?text=No+Image';

    return (
      <div className="container mx-auto px-4 py-12">
        
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground mb-8 flex items-center gap-2">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary">Products</Link>
          <span>/</span>
          <Link href={`/categories/${product.category.slug}`} className="hover:text-primary">{product.category.name}</Link>
          <span>/</span>
          <span className="text-foreground truncate">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div className="bg-card rounded-2xl border overflow-hidden relative">
             {product.is_popular && (
              <Badge className="absolute top-4 left-4 z-10 bg-orange-500 text-sm py-1 px-3">Popular Choice</Badge>
            )}
            <img 
              src={primaryImage} 
              alt={product.name} 
              className="w-full aspect-square object-cover" 
            />
            {/* Future Thumbnail Row placeholder */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto">
                {product.images.map(img => (
                  <img key={img.id} src={img.image_url} className="w-20 h-20 object-cover rounded-md border cursor-pointer opacity-70 hover:opacity-100 transition-opacity" alt="thumbnail" />
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-heading font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-4 mb-2">
              <span className="text-muted-foreground">Category: <Link href={`/categories/${product.category.slug}`} className="text-primary hover:underline">{product.category.name}</Link></span>
              <span className="text-muted-foreground border-l pl-4">Views: {product.view_count}</span>
            </div>
            {product.tags && product.tags.length > 0 ? (
              <div className="flex flex-wrap gap-2 mb-6 pb-6 border-b">
                {product.tags.map(tag => (
                  <Badge key={tag.id} variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200">
                    {tag.name}
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="mb-6 pb-6 border-b"></div>
            )}

            <div className="mb-8">
              {product.sale_price ? (
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-primary">₹{product.sale_price}</span>
                  <span className="text-xl text-muted-foreground line-through">₹{product.price}</span>
                  <span className="text-sm text-muted-foreground ml-1">per {product.weight_unit}</span>
                </div>
              ) : (
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-primary">₹{product.price}</span>
                  <span className="text-sm text-muted-foreground">per {product.weight_unit}</span>
                </div>
              )}
            </div>



            <AddToCartSection productId={product.id.toString()} initialQuantity={1} />

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 mb-8 bg-slate-50 p-4 rounded-xl border">
              <div className="flex items-center gap-3">
                <Anchor className="h-6 w-6 text-primary" />
                <div className="text-sm">
                  <p className="font-semibold">Direct Catch</p>
                  <p className="text-muted-foreground">Sourced from fishermen</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-primary" />
                <div className="text-sm">
                  <p className="font-semibold">Quality Verified</p>
                  <p className="text-muted-foreground">Checked for freshness</p>
                </div>
              </div>
            </div>

            {/* Seller Info */}
            <div className="border rounded-xl p-5 bg-card">
              <h3 className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-3">Seller Information</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-lg">{product.seller?.first_name} {product.seller?.last_name}</p>
                  {/* Rating placeholder */}
                  <p className="text-sm text-yellow-500">★★★★★ <span className="text-muted-foreground ml-1">(No reviews yet)</span></p>
                </div>
                <Button variant="outline" size="sm">View Store</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="grid md:grid-cols-3 gap-12 border-t pt-12">
          <div className="md:col-span-2">
            <h2 className="text-2xl font-heading font-bold mb-6">Product Description</h2>
            <div className="prose max-w-none text-slate-700 leading-relaxed">
              <p>{product.full_description || product.short_description}</p>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-heading font-bold mb-6">Specifications</h2>
            <div className="space-y-4">
              {product.origin_location && (
                <div className="flex flex-col pb-4 border-b">
                  <span className="text-sm text-muted-foreground">Origin / Catch Area</span>
                  <span className="font-medium">{product.origin_location}</span>
                </div>
              )}
              {product.freshness_hours && (
                <div className="flex flex-col pb-4 border-b">
                  <span className="text-sm text-muted-foreground">Freshness Guarantee</span>
                  <span className="font-medium">Up to {product.freshness_hours} hours</span>
                </div>
              )}
              {product.is_frozen_available && (
                <div className="flex flex-col pb-4 border-b">
                  <span className="text-sm text-muted-foreground">Packaging Options</span>
                  <span className="font-medium flex items-center gap-2">
                    <span className="text-sky-500">❄️</span> Available as Frozen
                  </span>
                </div>
              )}
              {product.custom_options && Object.entries(product.custom_options).map(([key, value], idx) => {
                if (value) {
                  return (
                    <div key={idx} className="flex flex-col pb-4 border-b">
                      <span className="text-sm text-muted-foreground">Additional Options</span>
                      <span className="font-medium flex items-center gap-2">
                        <span className="text-indigo-500">✨</span> {key}
                      </span>
                    </div>
                  );
                }
                return null;
              })}
              <div className="flex flex-col pb-4 border-b">
                <span className="text-sm text-muted-foreground">Minimum Order</span>
                <span className="font-medium">{product.minimum_order_quantity} {product.weight_unit}</span>
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
