'use client';

import React from 'react';
import { useOrders } from '@/shared/api/hooks/useOrders';
import { Container } from '@/components/layout/shared/Container';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Package, ChevronRight, Search } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

export default function OrdersPage() {
  const { data, isLoading } = useOrders(1);

  const router = useRouter();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading your orders...</p>
      </div>
    );
  }

  const orders = data?.data || [];

  return (
    <div className="py-12 bg-muted/30 min-h-screen">
      <Container>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-3xl font-heading font-bold">My Orders</h1>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search orders..." 
              className="w-full h-10 pl-9 pr-4 rounded-md border text-sm"
            />
          </div>
        </div>

        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map(order => (
              <div 
                key={order.id} 
                onClick={() => router.push(`/orders/${order.id}`)}
                className="bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-primary/50"
              >
                <div className="bg-muted/40 px-6 py-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8">
                    <div>
                      <p className="text-muted-foreground mb-1">Order Placed</p>
                      <p className="font-medium">{format(new Date(order.created_at), 'MMM dd, yyyy')}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Total</p>
                      <p className="font-medium">₹{order.total}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Ship To</p>
                      <p className="font-medium truncate max-w-[120px]" title={order.address?.city}>
                        {order.address ? order.address.city : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Order #</p>
                      <p className="font-medium">{order.order_number}</p>
                    </div>
                  </div>
                  <div>
                    <Link href={`/orders/${order.id}`}>
                      <Button variant="outline" size="sm" className="w-full sm:w-auto">View Details</Button>
                    </Link>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <div className="shrink-0 h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <Package className="h-8 w-8" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-lg">Status: <span className="capitalize">{order.status.replace(/_/g, ' ')}</span></h3>
                      {order.status === 'pending_seller_approval' && <Badge className="bg-yellow-500">Processing</Badge>}
                      {order.status === 'delivered' && <Badge className="bg-green-500">Completed</Badge>}
                      {['cancelled', 'rejected'].includes(order.status) && <Badge variant="destructive">Cancelled</Badge>}
                    </div>
                    <div className="text-muted-foreground">
                      <p className="mb-2">
                        {order.items.length} item(s) • Sold by {order.seller?.first_name || 'Marketplace Seller'}
                      </p>
                      {order.items && order.items.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-1">
                          {order.items.map((item: any) => (
                            <Badge key={item.id} variant="secondary" className="font-normal">
                              {Number(item.quantity)}x {item.product_snapshot?.name || 'Product'}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="hidden md:flex items-center text-muted-foreground">
                    <ChevronRight className="h-5 w-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-card border rounded-xl border-dashed">
            <Package className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="font-bold text-xl mb-2">No orders yet</h3>
            <p className="text-muted-foreground mb-6">When you place orders, they will appear here.</p>
            <Link href="/products">
              <Button>Start Shopping</Button>
            </Link>
          </div>
        )}
      </Container>
    </div>
  );
}
