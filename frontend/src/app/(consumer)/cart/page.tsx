'use client';

import React from 'react';
import Link from 'next/link';
import { useCart, useUpdateCartItem, useRemoveCartItem, useClearCart } from '@/shared/api/hooks/useCart';
import { Container } from '@/components/layout/shared/Container';
import { Button } from '@/components/ui/button';
import { Trash2, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { data: cart, isLoading, error } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const clearCart = useClearCart();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading your cart...</p>
      </div>
    );
  }

  if (error || !cart || cart.items.length === 0) {
    return (
      <Container className="py-16">
        <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto min-h-[40vh]">
          <div className="h-24 w-24 bg-muted rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="text-3xl font-heading font-bold mb-3">Your cart is empty</h1>
          <p className="text-muted-foreground mb-8">
            Looks like you haven't added any fresh seafood to your cart yet.
          </p>
          <Link href="/products">
            <Button size="lg" className="w-full">
              Explore Fresh Catch
            </Button>
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <div className="py-12 bg-muted/30 min-h-screen">
      <Container>
        <h1 className="text-3xl font-heading font-bold mb-8">Shopping Cart</h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
              <div className="grid grid-cols-12 gap-4 p-4 border-b bg-muted/50 text-sm font-medium text-muted-foreground hidden sm:grid">
                <div className="col-span-6">Product</div>
                <div className="col-span-3 text-center">Quantity</div>
                <div className="col-span-2 text-right">Total</div>
                <div className="col-span-1"></div>
              </div>
              
              <div className="divide-y">
                {cart.items.map((item) => (
                  <div key={item.id} className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                    <div className="sm:col-span-6 flex items-center gap-4">
                      <div className="h-20 w-20 rounded-md bg-muted/30 border overflow-hidden shrink-0 flex-center">
                        {item.product.image ? (
                          <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                        ) : (
                          <ShoppingBag className="h-8 w-8 text-muted-foreground/30 mx-auto mt-6" />
                        )}
                      </div>
                      <div>
                        <Link href={`/products/${item.product.slug}`} className="font-semibold hover:text-primary transition-colors block mb-1">
                          {item.product.name}
                        </Link>
                        <div className="text-sm text-muted-foreground">
                          ₹{item.unit_price} / {item.product.weight_unit}
                        </div>
                      </div>
                    </div>
                    
                    <div className="sm:col-span-3 flex items-center justify-between sm:justify-center mt-4 sm:mt-0">
                      <span className="sm:hidden text-sm text-muted-foreground">Quantity:</span>
                      <div className="flex items-center border rounded-md max-w-[120px]">
                        <button 
                          onClick={() => updateItem.mutate({ id: item.id, quantity: Math.max(1, item.quantity - 1) })}
                          disabled={item.quantity <= 1 || updateItem.isPending}
                          className="px-3 py-1 hover:bg-muted disabled:opacity-50"
                        >
                          -
                        </button>
                        <span className="flex-1 text-center font-medium text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => updateItem.mutate({ id: item.id, quantity: item.quantity + 1 })}
                          disabled={updateItem.isPending}
                          className="px-3 py-1 hover:bg-muted disabled:opacity-50"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    <div className="sm:col-span-2 flex items-center justify-between sm:justify-end mt-2 sm:mt-0">
                      <span className="sm:hidden text-sm text-muted-foreground">Total:</span>
                      <span className="font-bold">₹{item.total_price}</span>
                    </div>
                    
                    <div className="sm:col-span-1 flex justify-end mt-4 sm:mt-0 border-t sm:border-0 pt-4 sm:pt-0">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => removeItem.mutate(item.id)}
                        disabled={removeItem.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between items-center px-2">
              <Link href="/products">
                <Button variant="link" className="text-primary p-0 h-auto">
                  ← Continue Shopping
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="text-destructive border-destructive/20 hover:bg-destructive/10"
                onClick={() => clearCart.mutate()}
                disabled={clearCart.isPending}
              >
                Clear Cart
              </Button>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-card border rounded-xl p-6 shadow-sm sticky top-28">
              <h2 className="text-xl font-heading font-bold mb-6 pb-4 border-b">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal ({cart.total_items} items)</span>
                  <span>₹{cart.subtotal}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery Estimate</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>
              
              <div className="border-t pt-4 mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-2xl text-primary">₹{cart.subtotal}</span>
                </div>
                <p className="text-xs text-muted-foreground">Taxes included. Delivery calculated next.</p>
              </div>
              
              <Button 
                className="w-full py-6 text-lg" 
                onClick={() => router.push('/checkout')}
              >
                Proceed to Checkout <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
