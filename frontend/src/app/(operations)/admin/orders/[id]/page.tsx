'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAdminOrder, useUpdateAdminOrderStatus } from '@/shared/api/hooks/useAdminOrders';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft, Loader2, Package, MapPin, User, Store, Clock,
  CheckCircle2, Truck, PackageCheck,
  XCircle, AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

// ─── Status pipeline definition ───────────────────────────────────────────────
const STATUS_PIPELINE = [
  {
    value: 'processing',
    label: 'Packed / Preparing',
    sublabel: 'Order is packed & ready',
    icon: <Package className="w-7 h-7" />,
    color: 'purple',
  },
  {
    value: 'out_for_delivery',
    label: 'Out for Delivery',
    sublabel: 'On the way to customer',
    icon: <Truck className="w-7 h-7" />,
    color: 'sky',
  },
  {
    value: 'delivered',
    label: 'Delivered',
    sublabel: 'Arrived at customer',
    icon: <PackageCheck className="w-7 h-7" />,
    color: 'emerald',
  },
];

const CANCEL_STATUSES = [
  { value: 'cancelled', label: 'Cancel Order', icon: <XCircle className="w-4 h-4" />, color: 'rose' },
  { value: 'rejected',  label: 'Reject Order', icon: <AlertTriangle className="w-4 h-4" />, color: 'orange' },
];

const COLOR_MAP: Record<string, { bg: string; text: string; border: string; activeBg: string; activeBorder: string; ring: string; dot: string }> = {
  amber:   { bg: 'bg-amber-50',   text: 'text-amber-700',   border: 'border-amber-200',  activeBg: 'bg-amber-100',  activeBorder: 'border-amber-400',  ring: 'ring-amber-300',  dot: 'bg-amber-400' },
  blue:    { bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200',   activeBg: 'bg-blue-100',   activeBorder: 'border-blue-500',   ring: 'ring-blue-300',   dot: 'bg-blue-500' },
  indigo:  { bg: 'bg-indigo-50',  text: 'text-indigo-700',  border: 'border-indigo-200', activeBg: 'bg-indigo-100', activeBorder: 'border-indigo-500', ring: 'ring-indigo-300', dot: 'bg-indigo-500' },
  purple:  { bg: 'bg-purple-50',  text: 'text-purple-700',  border: 'border-purple-200', activeBg: 'bg-purple-100', activeBorder: 'border-purple-500', ring: 'ring-purple-300', dot: 'bg-purple-500' },
  sky:     { bg: 'bg-sky-50',     text: 'text-sky-700',     border: 'border-sky-200',    activeBg: 'bg-sky-100',    activeBorder: 'border-sky-500',    ring: 'ring-sky-300',    dot: 'bg-sky-500' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200',activeBg: 'bg-emerald-100',activeBorder: 'border-emerald-500',ring: 'ring-emerald-300',dot: 'bg-emerald-500' },
  rose:    { bg: 'bg-rose-50',    text: 'text-rose-700',    border: 'border-rose-200',   activeBg: 'bg-rose-100',   activeBorder: 'border-rose-500',   ring: 'ring-rose-300',   dot: 'bg-rose-500' },
  orange:  { bg: 'bg-orange-50',  text: 'text-orange-700',  border: 'border-orange-200', activeBg: 'bg-orange-100', activeBorder: 'border-orange-500', ring: 'ring-orange-300', dot: 'bg-orange-500' },
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const { data: order, isLoading } = useAdminOrder(id);
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateAdminOrderStatus();

  const [selectedStatus, setSelectedStatus] = useState('');
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null);

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

  const doUpdate = (status: string) => {
    if (status === order.status) return;
    updateStatus(
      { id: order.id, status },
      {
        onSuccess: () => {
          toast.success(`Status updated to "${status.replace(/_/g, ' ')}"`);
          setConfirmCancel(null);
        },
        onError: () => {
          toast.error('Failed to update order status');
        },
      }
    );
  };

  const currentPipelineIdx = STATUS_PIPELINE.findIndex(s => s.value === order.status);
  const isCancelledOrRejected = ['cancelled', 'rejected'].includes(order.status);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
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

      {/* ── Visual Status Pipeline ── */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-slate-700 flex items-center gap-2">
            <Truck className="w-4 h-4 text-slate-500" /> Update Order Status
          </h3>
          <span className="text-xs text-slate-400">Click a stage to update immediately</span>
        </div>

        {isCancelledOrRejected ? (
          <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700">
            <XCircle className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-semibold capitalize">{order.status.replace(/_/g, ' ')}</p>
              <p className="text-xs text-rose-500 mt-0.5">This order has been cancelled/rejected and cannot be progressed further.</p>
            </div>
          </div>
        ) : (
          <>
            {/* 3-card pipeline */}
            <div className="grid grid-cols-3 gap-4 mb-5">
              {STATUS_PIPELINE.map((step, idx) => {
                const c = COLOR_MAP[step.color];
                const isCurrent = order.status === step.value;
                const isPast = STATUS_PIPELINE.findIndex(s => s.value === order.status) > idx;

                return (
                  <button
                    key={step.value}
                    onClick={() => doUpdate(step.value)}
                    disabled={isUpdating || isCurrent}
                    className={`
                      relative flex flex-col items-center text-center gap-3 p-5 rounded-2xl border-2 transition-all duration-200
                      ${isCurrent
                        ? `${c.activeBg} ${c.activeBorder} ${c.text} shadow-lg scale-105 ring-2 ${c.ring} ring-offset-2`
                        : isPast
                        ? `${c.bg} ${c.border} ${c.text} opacity-60 hover:opacity-90 hover:scale-105 cursor-pointer`
                        : `bg-slate-50 border-slate-200 text-slate-400 hover:bg-slate-100 hover:scale-105 cursor-pointer`
                      }
                      disabled:cursor-default
                    `}
                  >
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all
                      ${isCurrent ? `${c.dot} text-white shadow-md` :
                        isPast   ? `${c.dot} text-white opacity-70` :
                        'bg-slate-200 text-slate-400'
                      }`}>
                      {isPast ? <CheckCircle2 className="w-7 h-7" /> : step.icon}
                    </div>
                    <div>
                      <p className="font-bold text-base">{step.label}</p>
                      <p className="text-xs mt-0.5 opacity-80">{step.sublabel}</p>
                      {isCurrent && (
                        <span className="inline-block mt-2 text-[11px] font-semibold bg-white/70 rounded-full px-2.5 py-0.5 border border-current/20">
                          ● Current
                        </span>
                      )}
                    </div>
                    {isUpdating && selectedStatus === step.value && (
                      <Loader2 className="absolute top-2 right-2 w-4 h-4 animate-spin" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Progress bar */}
            <div className="flex gap-1 mt-1">
              {STATUS_PIPELINE.map((step, idx) => {
                const c = COLOR_MAP[step.color];
                return (
                  <div
                    key={step.value}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${idx <= currentPipelineIdx ? c.dot : 'bg-slate-200'}`}
                  />
                );
              })}
            </div>

            {/* Cancel / Reject buttons */}
            <div className="flex gap-2 mt-5 pt-4 border-t border-slate-100">
              <span className="text-xs text-slate-400 self-center mr-auto">Negative actions:</span>
              {CANCEL_STATUSES.map(cs => {
                const c = COLOR_MAP[cs.color];
                return confirmCancel === cs.value ? (
                  <div key={cs.value} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${c.border} ${c.bg}`}>
                    <span className={`text-xs font-medium ${c.text}`}>Confirm?</span>
                    <button
                      onClick={() => doUpdate(cs.value)}
                      disabled={isUpdating}
                      className={`text-xs font-bold px-2 py-0.5 rounded ${c.dot} text-white`}
                    >
                      {isUpdating ? '...' : 'Yes'}
                    </button>
                    <button
                      onClick={() => setConfirmCancel(null)}
                      className="text-xs text-slate-500 hover:text-slate-800"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    key={cs.value}
                    onClick={() => setConfirmCancel(cs.value)}
                    disabled={isUpdating || isCancelledOrRejected}
                    className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border ${c.border} ${c.text} ${c.bg} hover:${c.activeBg} transition-colors disabled:opacity-40 disabled:cursor-not-allowed`}
                  >
                    {cs.icon} {cs.label}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Order Items */}
        <div className="md:col-span-2 space-y-6">
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
                  {order.items?.map((item: any) => {
                    const variant = item.product_snapshot?.selected_variant;
                    return (
                      <tr key={item.id}>
                        <td className="px-4 py-3">
                          <div className="font-medium text-slate-900">{item.product?.name || item.product_snapshot?.name || 'Unknown Product'}</div>
                          {variant && (
                            <div className="text-xs text-muted-foreground mt-0.5">
                              Variant: <span className="font-medium text-slate-700">{variant.name}</span> (+₹{variant.price_modifier})
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">{Number(item.quantity)}</td>
                        <td className="px-4 py-3 text-right">₹{item.unit_price}</td>
                        <td className="px-4 py-3 text-right font-medium">₹{item.total_price}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-muted/10 flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{(order as any).subtotal || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span>₹{(order as any).delivery_fee || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>₹{(order as any).tax_amount || 0}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span className="text-primary">₹{(order as any).total_amount || (order as any).total || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
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
                <p className="font-medium">{order.address.house_flat_number}, {order.address.street_name}</p>
                <p>{order.address.area_locality}</p>
                {order.address.landmark && <p className="text-muted-foreground text-xs">Landmark: {order.address.landmark}</p>}
                <p>{order.address.city}, {order.address.district ? `${order.address.district}, ` : ''}{order.address.state} {order.address.pincode}</p>
                {order.address.mobile_number && <p className="text-muted-foreground text-xs mt-1">Phone: {order.address.mobile_number}</p>}
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
