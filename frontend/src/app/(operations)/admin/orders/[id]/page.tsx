'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAdminOrder, useUpdateAdminOrderStatus } from '@/shared/api/hooks/useAdminOrders';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Loader2, Package, MapPin, CreditCard, User, Store, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  
  const { data: order, isLoading } = useAdminOrder(id);
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateAdminOrderStatus();
  
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    if (order?.status) setSelectedStatus(order.status);
  }, [order?.status]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-slate-800">Order not found</h2>
        <Button variant="outline" className="mt-4" onClick={() => router.push('/admin/orders')}>
          Return to Orders
        </Button>
      </div>
    );
  }

  const handleStatusUpdate = () => {
    if (selectedStatus === order.status) return;
    
    updateStatus(
      { id: order.id, status: selectedStatus },
      {
        onSuccess: () => {
          toast.success('Order status updated successfully');
        },
        onError: () => {
          toast.error('Failed to update order status');
        }
      }
    );
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/orders">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-heading font-bold">Order #{order.order_number}</h1>
            <Badge variant="secondary" className="text-sm px-3 py-1 capitalize">
              {order.status.replace(/_/g, ' ')}
            </Badge>
          </div>
          <p className="text-muted-foreground flex items-center gap-2 mt-1">
            <Clock className="w-4 h-4" /> 
            Placed on {new Date(order.created_at).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column - Details */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Items */}
          <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b bg-muted/30 font-medium flex items-center gap-2">
              <Package className="w-4 h-4" /> Order Items
            </div>
            <div className="p-0">
              <table className="w-full text-sm">
                <thead className="bg-muted/10 border-b text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Product</th>
                    <th className="px-4 py-3 text-center font-medium">Quantity</th>
                    <th className="px-4 py-3 text-right font-medium">Price</th>
                    <th className="px-4 py-3 text-right font-medium">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {order.items?.map((item: any) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900">{item.product?.name || 'Unknown Product'}</div>
                      </td>
                      <td className="px-4 py-3 text-center">{Number(item.quantity)}</td>
                      <td className="px-4 py-3 text-right">₹{item.price}</td>
                      <td className="px-4 py-3 text-right font-medium">₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-muted/10 flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{order.total}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span className="text-primary">₹{order.total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Update Panel */}
          <div className="bg-card border rounded-xl shadow-sm p-6">
            <h3 className="font-medium mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4" /> Update Progress
            </h3>
            <div className="flex gap-3">
              <select 
                className="flex-1 h-10 px-3 py-2 border rounded-md text-sm bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="pending_seller_approval">Pending Seller Approval</option>
                <option value="approved">Approved</option>
                <option value="preparing">Preparing</option>
                <option value="packed">Packed</option>
                <option value="ready_for_dispatch">Ready for Dispatch</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
                <option value="rejected">Rejected</option>
              </select>
              <Button 
                onClick={handleStatusUpdate} 
                disabled={selectedStatus === order.status || isUpdating}
              >
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Update Status
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Updating this status will immediately reflect on the consumer's tracking page.
            </p>
          </div>
        </div>

        {/* Right Column - Customer & Seller */}
        <div className="space-y-6">
          
          <div className="bg-card border rounded-xl shadow-sm p-5 space-y-4">
            <h3 className="font-medium flex items-center gap-2 border-b pb-2">
              <User className="w-4 h-4" /> Customer Details
            </h3>
            {order.consumer ? (
              <div className="text-sm space-y-2">
                <p className="font-medium text-base">{order.consumer.first_name} {order.consumer.last_name}</p>
                {order.consumer.email && <p className="text-muted-foreground">{order.consumer.email}</p>}
                {order.consumer.contact_number && <p className="text-muted-foreground">{order.consumer.contact_number}</p>}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Customer details not available</p>
            )}
          </div>

          <div className="bg-card border rounded-xl shadow-sm p-5 space-y-4">
            <h3 className="font-medium flex items-center gap-2 border-b pb-2">
              <Store className="w-4 h-4" /> Seller Details
            </h3>
            {order.seller ? (
              <div className="text-sm space-y-2">
                <p className="font-medium text-base">{order.seller.first_name} {order.seller.last_name}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Seller details not available</p>
            )}
          </div>

          <div className="bg-card border rounded-xl shadow-sm p-5 space-y-4">
            <h3 className="font-medium flex items-center gap-2 border-b pb-2">
              <MapPin className="w-4 h-4" /> Shipping Address
            </h3>
            {order.address ? (
              <div className="text-sm space-y-1">
                <p className="font-medium">{order.address.address_line_1}</p>
                {order.address.address_line_2 && <p>{order.address.address_line_2}</p>}
                <p>{order.address.city}, {order.address.state} {order.address.postal_code}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No shipping address recorded</p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
