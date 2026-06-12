import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/shared/Container';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

export default function CheckoutSuccessPage() {
  return (
    <div className="py-24 bg-muted/30 min-h-screen">
      <Container>
        <div className="max-w-md mx-auto text-center bg-card border rounded-2xl p-8 shadow-sm">
          <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-heading font-bold mb-4">Order Placed!</h1>
          <p className="text-muted-foreground mb-8">
            Thank you for shopping with Kadal2Kadaai. Your fresh catch order has been received and is being processed by our network of local fishermen.
          </p>
          <div className="space-y-4">
            <Link href="/orders">
              <Button className="w-full" size="lg">Track My Order</Button>
            </Link>
            <Link href="/products">
              <Button variant="outline" className="w-full" size="lg">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
