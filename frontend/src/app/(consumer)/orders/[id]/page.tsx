'use client';

import React, { use, useState } from 'react';
import { useOrder, useCancelOrder } from '@/shared/api/hooks/useOrders';
import { Container } from '@/components/layout/shared/Container';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Package, MapPin, AlertCircle, ChevronLeft, Download, FileText, XCircle } from 'lucide-react';
import Link from 'next/link';
import { format, addDays } from 'date-fns';

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { data: order, isLoading } = useOrder(resolvedParams.id);
  const cancelOrder = useCancelOrder();
  
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
        <p className="text-muted-foreground mb-6">The order you are looking for does not exist or you don't have access.</p>
        <Link href="/orders"><Button>Back to Orders</Button></Link>
      </div>
    );
  }

  const isCancellable = order.status === 'PENDING_SELLER_APPROVAL' || order.status === 'APPROVED';

  const handleCancel = () => {
    cancelOrder.mutate({ id: order.id, reason: cancelReason }, {
      onSuccess: () => setShowCancelDialog(false)
    });
  };

  const purchaseDate = new Date(order.created_at);
  const expectedDelivery = addDays(purchaseDate, 2); // Mock expected delivery

  return (
    <div className="py-8 bg-muted/20 min-h-screen text-slate-800">
      <Container>
        
        {/* Top Breadcrumb & Action Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b pb-4">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-2xl font-bold">Order Details</h1>
              <span className="text-muted-foreground text-sm border-l pl-4">
                Order ID: <span className="font-medium text-slate-900">#{order.order_number}</span>
              </span>
            </div>
            <Link href="/orders" className="text-sm font-medium hover:underline text-blue-600 flex items-center gap-1">
              <ChevronLeft className="h-4 w-4" /> Go back to order list
            </Link>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="bg-white" onClick={() => alert('Invoice feature coming soon!')}>
              <Download className="w-4 h-4 mr-2" /> Download Invoice
            </Button>
            {isCancellable && (
              <Button variant="outline" size="sm" className="bg-white text-destructive border-destructive/30 hover:bg-destructive/5" onClick={() => setShowCancelDialog(true)}>
                <XCircle className="w-4 h-4 mr-2" /> Request Cancellation
              </Button>
            )}
          </div>
        </div>

        {/* Cancellation Dialog Alert */}
        {showCancelDialog && (
          <div className="bg-destructive/5 border border-destructive/30 rounded-lg p-5 mb-6">
            <h3 className="font-bold text-destructive mb-2 text-lg">Cancel Order</h3>
            <p className="text-sm text-slate-700 mb-4">Are you sure you want to cancel this order? This action cannot be undone once confirmed.</p>
            <textarea 
              placeholder="Reason for cancellation (optional)" 
              className="w-full border border-slate-300 rounded-md p-3 text-sm mb-4 bg-white"
              rows={3}
              value={cancelReason}
              onChange={e => setCancelReason(e.target.value)}
            />
            <div className="flex gap-3">
              <Button variant="destructive" onClick={handleCancel} disabled={cancelOrder.isPending}>
                {cancelOrder.isPending ? 'Cancelling...' : 'Confirm Cancellation'}
              </Button>
              <Button variant="outline" className="bg-white" onClick={() => setShowCancelDialog(false)} disabled={cancelOrder.isPending}>
                Keep Order
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Main Content (Left 3 Columns) */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Split Info Boxes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Order Summary Box */}
              <div className="border border-slate-200 bg-white rounded-lg shadow-sm">
                <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 font-bold text-sm">
                  Order Summary
                </div>
                <div className="p-4 text-sm grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                  <div>
                    <p className="text-muted-foreground mb-1">Purchase Date:</p>
                    <p className="font-medium">{format(purchaseDate, 'E, MMM d, yyyy, h:mm a')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Fulfillment:</p>
                    <p className="font-medium">Kadal2Kadaai Seller</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Expected Delivery:</p>
                    <p className="font-medium text-green-700">{format(expectedDelivery, 'E, MMM d, yyyy')}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Shipping Service:</p>
                    <p className="font-medium">Standard Cold Chain Delivery</p>
                  </div>
                </div>
              </div>

              {/* Ship To Box */}
              <div className="border border-slate-200 bg-white rounded-lg shadow-sm">
                <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 font-bold text-sm">
                  Ship To
                </div>
                <div className="p-4 text-sm">
                  {order.address ? (
                    <>
                      <p className="font-bold mb-1">{order.consumer?.first_name} {order.consumer?.last_name}</p>
                      <p>{order.address.street}</p>
                      {order.address.landmark && <p>{order.address.landmark}</p>}
                      <p>{order.address.city}, {order.address.state} {order.address.pincode}</p>
                      <p className="mt-2 text-muted-foreground">Phone: {order.consumer?.contact_number || 'N/A'}</p>
                    </>
                  ) : (
                    <p className="text-muted-foreground italic">Address unavailable</p>
                  )}
                </div>
              </div>
            </div>

            {/* Order Contents Box */}
            <div className="border border-slate-200 bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 font-bold text-sm">
                Order Contents
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50/50 text-muted-foreground border-b border-slate-100">
                    <tr>
                      <th className="px-4 py-3 font-medium text-left w-24">Status</th>
                      <th className="px-4 py-3 font-medium text-left">Product Name</th>
                      <th className="px-4 py-3 font-medium text-center w-24">Quantity</th>
                      <th className="px-4 py-3 font-medium text-right w-28">Unit Price</th>
                      <th className="px-4 py-3 font-medium text-right w-32">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {order.items.map((item: any) => (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-4 align-top">
                          <Badge variant="outline" className={`whitespace-nowrap capitalize ${
                            order.status === 'DELIVERED' ? 'border-green-500 text-green-700 bg-green-50' : 
                            order.status === 'CANCELLED' ? 'border-red-500 text-red-700 bg-red-50' : 
                            'border-blue-500 text-blue-700 bg-blue-50'
                          }`}>
                            {order.status.replace(/_/g, ' ')}
                          </Badge>
                        </td>
                        <td className="px-4 py-4 align-top">
                          <div className="flex gap-4">
                            <div className="h-16 w-16 bg-slate-100 rounded border border-slate-200 shrink-0 flex items-center justify-center">
                              <Package className="w-6 h-6 text-slate-300" />
                            </div>
                            <div>
                              <p className="font-bold text-blue-700 hover:underline cursor-pointer">{item.product_snapshot.name}</p>
                              <p className="text-xs text-muted-foreground mt-1">Sold by: {order.seller?.first_name || 'Kadal Seller'}</p>
                              <p className="text-xs text-muted-foreground">Condition: Freshly Caught</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 align-top text-center font-medium">
                          {Number(item.quantity)}x
                        </td>
                        <td className="px-4 py-4 align-top text-right">
                          ₹{item.unit_price}
                        </td>
                        <td className="px-4 py-4 align-top text-right">
                          <div className="font-bold">₹{item.total_price}</div>
                          <div className="text-xs text-muted-foreground mt-1">excl. shipping</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Tracking / Timeline Box (Optional Extra for Amazon-style detail) */}
            <div className="border border-slate-200 bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-bold text-sm mb-4 border-b pb-2">Tracking & Shipping Details</h3>
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <FileText className="w-5 h-5 text-slate-400" />
                <p>Tracking information will be available here once the seller dispatches the order.</p>
              </div>
            </div>

          </div>

          {/* Right Sidebar (Payment Details) */}
          <div className="lg:col-span-1">
            <div className="border border-slate-200 bg-white rounded-lg shadow-sm sticky top-24">
              <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 font-bold text-sm">
                Payment Details
              </div>
              <div className="p-4 space-y-4 text-sm">
                <p className="text-muted-foreground mb-4">Payment Method: <span className="text-slate-900 font-medium">Cash on Delivery</span></p>
                
                <div className="space-y-2 border-b border-slate-100 pb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Items Total:</span>
                    <span>₹{order.subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Shipping & Handling:</span>
                    <span>₹{order.delivery_fee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Taxes:</span>
                    <span>₹{order.tax_amount}</span>
                  </div>
                </div>
                
                <div className="flex justify-between font-bold text-base pt-2">
                  <span>Grand Total:</span>
                  <span className="text-blue-700">₹{order.total}</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </Container>
    </div>
  );
}
