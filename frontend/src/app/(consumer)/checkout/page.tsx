'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/shared/api/hooks/useCart';
import { useAddresses } from '@/shared/api/hooks/useAddresses';
import { useCheckout } from '@/shared/api/hooks/useOrders';
import { Container } from '@/components/layout/shared/Container';
import { Button } from '@/components/ui/button';
import { Loader2, MapPin, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { data: cart, isLoading: isCartLoading } = useCart();
  const { data: addresses, isLoading: isAddressesLoading } = useAddresses();
  const checkout = useCheckout();

  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  if (isCartLoading || isAddressesLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading checkout...</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    router.push('/cart');
    return null;
  }

  const handleCheckout = () => {
    if (!selectedAddressId) {
      setError('Please select a delivery address');
      return;
    }
    setError('');
    checkout.mutate({ address_id: selectedAddressId, notes }, {
      onSuccess: () => {
        router.push('/checkout/success');
      },
      onError: (err: any) => {
        setError(err.message || 'Checkout failed. Please try again.');
      }
    });
  };

  const deliveryFee = 50; // hardcoded logic in backend for now
  const total = Number(cart.subtotal) + deliveryFee;

  return (
    <div className="py-12 bg-muted/30 min-h-screen">
      <Container>
        <h1 className="text-3xl font-heading font-bold mb-8">Checkout</h1>
        
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            
            {/* Address Selection */}
            <div className="bg-card border rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" /> Delivery Address
                </h2>
                <Link href="/addresses">
                  <Button variant="outline" size="sm">Manage</Button>
                </Link>
              </div>

              {addresses && addresses.length > 0 ? (
                <div className="grid gap-4">
                  {addresses.map(address => (
                    <div 
                      key={address.id} 
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${selectedAddressId === address.id ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`}
                      onClick={() => setSelectedAddressId(address.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold">{address.label}</span>
                        {selectedAddressId === address.id && <span className="h-3 w-3 rounded-full bg-primary" />}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {address.street}, {address.city}, {address.state} - {address.pincode}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-muted/50 rounded-lg">
                  <p className="text-muted-foreground mb-4">No addresses found.</p>
                  <Link href="/addresses">
                    <Button>Add an Address</Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Order Notes */}
            <div className="bg-card border rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">Order Notes (Optional)</h2>
              <textarea 
                className="w-full h-24 border rounded-md p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                placeholder="Any special instructions for delivery or packaging?"
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive p-4 rounded-xl flex items-center gap-3">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-card border rounded-xl p-6 shadow-sm sticky top-28">
              <h2 className="text-xl font-heading font-bold mb-6 pb-4 border-b">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-muted-foreground text-sm">
                  <span>Subtotal ({cart.total_items} items)</span>
                  <span>₹{cart.subtotal}</span>
                </div>
                <div className="flex justify-between text-muted-foreground text-sm">
                  <span>Delivery Fee</span>
                  <span>₹{deliveryFee}</span>
                </div>
              </div>
              
              <div className="border-t pt-4 mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-2xl text-primary">₹{total}</span>
                </div>
                <p className="text-xs text-muted-foreground">Cash on Delivery selected.</p>
              </div>
              
              <Button 
                className="w-full py-6 text-lg" 
                onClick={handleCheckout}
                disabled={checkout.isPending || !selectedAddressId}
              >
                {checkout.isPending ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <ArrowRight className="h-5 w-5 mr-2" />}
                {checkout.isPending ? 'Processing...' : 'Place Order'}
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
