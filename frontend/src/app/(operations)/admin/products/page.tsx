'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Loader2, Trash2 } from 'lucide-react';
import { useAdminProducts, useDeleteProduct } from '@/shared/api/hooks/useAdminProducts';
import { AddProductDialog } from './components/AddProductDialog';
import { EditProductDialog } from './components/EditProductDialog';

import { assetUrl } from '@/lib/asset-url';

const ProductImage = ({ src, alt }: { src: string | null, alt: string }) => {
  const [error, setError] = React.useState(false);
  
  // Reset error state if src changes
  React.useEffect(() => {
    setError(false);
  }, [src]);

  if (!src || error) {
    return (
      <div className="h-10 w-10 rounded-md bg-muted border border-border flex items-center justify-center shrink-0 text-muted-foreground text-xs text-center leading-tight p-1">
        No img
      </div>
    );
  }
  
  return (
    <img
      src={src}
      alt={alt}
      className="h-10 w-10 rounded-md object-cover border border-border shrink-0 transition-transform duration-300 ease-in-out hover:scale-125 hover:z-50 relative cursor-pointer"
      onError={() => setError(true)}
    />
  );
};

export default function AdminProductsPage() {
  const [search, setSearch] = React.useState('');
  const [debouncedSearch, setDebouncedSearch] = React.useState('');

  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const { data, isLoading } = useAdminProducts(1, 20, debouncedSearch);
  const products = data?.data || [];
  const deleteProduct = useDeleteProduct();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-h3 font-heading font-bold text-foreground">Inventory Management</h1>
          <p className="text-bodyMedium text-muted-foreground mt-1">Manage global product catalog and stock levels.</p>
        </div>
        <AddProductDialog />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="p-4 border-b border-border flex items-center justify-between gap-4 bg-muted/20">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search inventory by name or SKU..." 
                className="pl-9 h-9 bg-background" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" className="h-9">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-muted/10">
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                    No products found. Click "Add Product" to create one.
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product: any) => {
                  const imgSrc = assetUrl(product.images?.[0]?.image_url);

                  return (
                  <TableRow key={product.id}>
                    <TableCell><input type="checkbox" className="rounded border-input" /></TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <ProductImage src={imgSrc} alt={product.name} />
                        <div>
                          <p className="font-medium text-foreground leading-tight">{product.name}</p>
                          {product.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {product.tags.slice(0, 3).map((tag: any) => (
                                <span key={tag.id} className="text-xs px-1.5 py-0.5 rounded-sm bg-primary/10 text-primary">
                                  {tag.name}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{product.category?.name}</TableCell>
                    <TableCell>₹{product.price}</TableCell>
                    <TableCell className={product.available_quantity === 0 ? "text-error-600 font-medium" : ""}>
                      {product.available_quantity} {product.weight_unit}
                    </TableCell>
                    <TableCell>
                      {product.available_quantity > 0 ? (
                        <Badge variant="outline" className="border-success-500 text-success-700 bg-success-50">In Stock</Badge>
                      ) : (
                        <Badge variant="outline" className="border-error-500 text-error-700 bg-error-50">Out of Stock</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <EditProductDialog product={product} />
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          disabled={deleteProduct.isPending}
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this product?')) {
                              deleteProduct.mutate(product.id);
                            }
                          }}
                          title="Delete"
                        >
                          {deleteProduct.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
          
          <div className="p-4 border-t border-border flex items-center justify-between text-bodySmall text-muted-foreground bg-muted/10">
            <p>Showing {products.length} items</p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" disabled>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
