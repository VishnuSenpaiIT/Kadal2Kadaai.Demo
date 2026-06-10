import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, Info, ClipboardCheck, CreditCard, ShieldCheck, MapPin, Truck, CheckCircle, CalendarDays } from 'lucide-react';
import { CartItem, SeafoodProduct, UserSession } from '../types';

interface ActiveDrawersProps {
  isCartOpen: boolean;
  onCartClose: () => void;
  cartItems: CartItem[];
  onUpdateCartQty: (productId: string, weight: string, cut: string, newQty: number) => void;
  onRemoveCartItem: (productId: string, weight: string, cut: string) => void;
  
  isWishlistOpen: boolean;
  onWishlistClose: () => void;
  wishlistItems: SeafoodProduct[];
  onRemoveWishlistItem: (productId: string) => void;
  onMoveToCart: (product: SeafoodProduct) => void;

  userSession: UserSession;
  onTriggerAuth: () => void;
  onClearCart: () => void;
  onPlaceOrder?: (order: {
    customerName: string;
    customerPhone: string;
    shippingAddress: string;
    deliverySlot: string;
    notes: string;
    subtotal: number;
    discount: number;
    shippingFee: number;
    total: number;
  }) => void;
}

export default function ActiveDrawers({
  isCartOpen,
  onCartClose,
  cartItems,
  onUpdateCartQty,
  onRemoveCartItem,
  
  isWishlistOpen,
  onWishlistClose,
  wishlistItems,
  onRemoveWishlistItem,
  onMoveToCart,

  userSession,
  onTriggerAuth,
  onClearCart,
  onPlaceOrder,
}: ActiveDrawersProps) {
  // Checkout sequence state
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<1 | 2 | 3>(1);

  // Address and payment states
  const [shippingAddress, setShippingAddress] = useState('');
  const [deliverySlot, setDeliverySlot] = useState('6:30 AM - 8:30 AM (Prime Sourcing)');
  const [notes, setNotes] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [userPhone, setUserPhone] = useState(userSession.phoneNumber || '');
  const [userName, setUserName] = useState(userSession.username || '');

  // Calculate pricing
  const subtotal = cartItems.reduce((acc, curr) => acc + curr.product.price * curr.quantity, 0);
  const discount = couponApplied ? Math.round(subtotal * 0.1) : 0;
  const shippingFee = subtotal > 1000 ? 0 : 49;
  const grandTotal = subtotal - discount + shippingFee;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'FRESH10' || couponCode.toUpperCase() === 'FIRST10' || couponCode.toUpperCase() === 'KADAL10') {
      setCouponApplied(true);
    } else {
      alert("Invalid code. Try using: KADAL10");
    }
  };

  const handleNextStep = () => {
    if (checkoutStep === 1) {
      if (!userName || !userPhone) {
        alert("Please confirm your delivery name and phone coordinates before proceeding.");
        return;
      }
      setCheckoutStep(2);
    } else if (checkoutStep === 2) {
      if (!shippingAddress.trim()) {
        alert("Pristine morning delivery requires a verified physical street address.");
        return;
      }
      // Place order!
      if (onPlaceOrder) {
        onPlaceOrder({
          customerName: userName,
          customerPhone: userPhone,
          shippingAddress: shippingAddress,
          deliverySlot: deliverySlot,
          notes: notes,
          subtotal: subtotal,
          discount: discount,
          shippingFee: shippingFee,
          total: grandTotal
        });
      }
      setCheckoutStep(3);
    }
  };

  const handleCompleteOrder = () => {
    // Done!
    setCheckoutStep(1);
    setShowCheckout(false);
    onClearCart();
    onCartClose();
  };

  if (!isCartOpen && !isWishlistOpen && !showCheckout) return null;

  return (
    <>
      {/* 1. SHOPPING CART DRAWER */}
      {isCartOpen && (
        <div
          id="cart-drawer-overlay"
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex justify-end"
          onClick={onCartClose}
        >
          <div
            id="cart-drawer-container"
            className="w-full max-w-md bg-[#0A192F] border-l border-white/5 h-full shadow-2xl flex flex-col animate-slide-left text-left text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#112240] text-white">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00B4D8] animate-ping" />
                <h2 className="font-serif text-lg font-bold">Your Sea Basket</h2>
                <span className="font-mono text-xs text-[#00B4D8] bg-cyan-950/50 px-2 py-0.5 rounded ml-2">
                  {cartItems.length} items
                </span>
              </div>
              <button
                id="cart-close-btn-id"
                onClick={onCartClose}
                className="text-gray-400 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition focus:outline-none cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cartItems.length === 0 ? (
                <div className="py-20 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-[#112240] flex items-center justify-center text-slate-400 mx-auto text-2xl border border-white/5">
                    🐟
                  </div>
                  <h3 className="font-serif text-lg font-bold text-white">Your Basket is Empty</h3>
                  <p className="text-xs text-slate-455 text-slate-400 max-w-xs mx-auto leading-relaxed font-light">
                    You haven't selected any premium morning catches yet. Browse the marketplace and customize your cuts!
                  </p>
                  <button
                    onClick={onCartClose}
                    className="bg-[#00B4D8] hover:bg-[#48CAE4] text-white text-xs font-bold py-2.5 px-6 rounded-full shadow transition-all focus:outline-none cursor-pointer"
                  >
                    Start Shopping catch
                  </button>
                </div>
              ) : (
                cartItems.map((item, idx) => (
                  <div
                    key={`${item.product.id}-${item.selectedWeight}-${item.selectedCut}-${idx}`}
                    id={`cart-item-row-${item.product.id}`}
                    className="flex p-4 bg-[#112240] border border-white/5 rounded-2xl space-x-3 hover:border-[#00B4D8]/20 transition"
                  >
                    {/* Thumbnail */}
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 object-cover rounded-xl border border-white/10 shrink-0"
                    />

                    {/* Meta */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h4 className="font-serif text-sm font-bold text-white truncate leading-tight">
                          {item.product.name}
                        </h4>
                        <div className="flex flex-wrap gap-1 mt-1 text-[10px]">
                          <span className="bg-[#0A192F] text-[#D9E2EC] px-1.5 py-0.5 rounded font-bold font-mono">{item.selectedWeight}</span>
                          <span className="bg-[#1B4965]/40 text-[#00B4D8] px-1.5 py-0.5 rounded font-semibold">{item.selectedCut}</span>
                        </div>
                      </div>

                      {/* Quantity operations */}
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                        <div className="flex items-center space-x-2 bg-[#0A192F] rounded-md p-1 border border-white/10 scale-95 origin-left">
                          <button
                            id={`qty-dec-${item.product.id}`}
                            onClick={() => onUpdateCartQty(item.product.id, item.selectedWeight, item.selectedCut, item.quantity - 1)}
                            className="p-1 text-slate-400 hover:text-white rounded hover:bg-white/5 transition cursor-pointer focus:outline-none"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold font-mono text-white w-5 text-center px-1">
                            {item.quantity}
                          </span>
                          <button
                            id={`qty-inc-${item.product.id}`}
                            onClick={() => onUpdateCartQty(item.product.id, item.selectedWeight, item.selectedCut, item.quantity + 1)}
                            className="p-1 text-slate-400 hover:text-white rounded hover:bg-white/5 transition cursor-pointer focus:outline-none"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        
                        <span className="text-xs font-mono font-extrabold text-[#00B4D8]">
                          ₹{item.product.price * item.quantity}
                        </span>
                      </div>
                    </div>

                    {/* Trash remove icon */}
                    <button
                      id={`trash-row-${item.product.id}`}
                      onClick={() => onRemoveCartItem(item.product.id, item.selectedWeight, item.selectedCut)}
                      className="p-1 text-gray-400 hover:text-rose-500 rounded-full hover:bg-[#0A192F] self-start transition ml-1 cursor-pointer focus:outline-none"
                      title="Remove Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Sticky Foot checkout calculation details */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-white/5 bg-[#112240] space-y-4">
                
                {/* Coupon widget */}
                <form onSubmit={handleApplyCoupon} className="relative flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Enter Coupon (e.g. KADAL10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    disabled={couponApplied}
                    className="flex-1 text-xs px-3.5 py-2.5 rounded-xl bg-[#0A192F] border border-white/10 text-white placeholder-slate-500 uppercase font-mono font-bold tracking-wide focus:outline-none focus:border-[#00B4D8]"
                  />
                  <button
                    type="submit"
                    disabled={couponApplied || !couponCode}
                    className="bg-[#00B4D8] hover:bg-[#48CAE4] text-white text-xs font-bold px-4 py-2.5 rounded-xl disabled:opacity-55 transition-colors cursor-pointer"
                  >
                    {couponApplied ? 'Applied' : 'Apply'}
                  </button>
                </form>

                <div className="space-y-1.5 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono text-white">₹{subtotal}</span>
                  </div>
                  {couponApplied && (
                    <div className="flex justify-between text-[#00B4D8] font-semibold">
                      <span>10% Club Coupon Discount</span>
                      <span className="font-mono">-₹{discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Direct Harbor Shipping</span>
                    <span className="font-mono">{shippingFee === 0 ? <span className="text-[#00B4D8] font-bold">FREE</span> : `₹${shippingFee}`}</span>
                  </div>
                  
                  {shippingFee > 0 && (
                    <div className="text-[10px] text-slate-400 font-sans flex items-center space-x-1">
                      <Info className="w-3.5 h-3.5 text-[#00B4D8]" />
                      <span>Spend ₹{1000 - subtotal} more for free harbor delivery!</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm font-black text-white pt-3 border-t border-white/5 mt-2">
                    <span className="text-base font-serif">Grand Total</span>
                    <span className="font-mono text-base text-[#00B4D8]">₹{grandTotal}</span>
                  </div>
                </div>

                {/* Confirm Dispatch actions */}
                {userSession.isAuthenticated ? (
                  <button
                    id="checkout-trigger-secured-btn"
                    onClick={() => {
                      setShowCheckout(true);
                      onCartClose();
                      setCheckoutStep(1);
                    }}
                    className="w-full bg-white hover:bg-slate-100 text-[#0A192F] font-bold text-xs py-3.5 rounded-xl uppercase tracking-wider text-center flex items-center justify-center space-x-2 transition duration-200 cursor-pointer focus:outline-none"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Proceed To Safe Checkout</span>
                  </button>
                ) : (
                  <button
                    id="auth-cart-checkout-redirect"
                    onClick={() => {
                      onCartClose();
                      onTriggerAuth();
                    }}
                    className="w-full bg-gradient-to-r from-[#00B4D8] to-blue-600 text-white font-bold text-xs py-3.5 rounded-xl uppercase tracking-wider text-center flex items-center justify-center space-x-1 cursor-pointer focus:outline-none"
                  >
                    <span>Sign In To Settle Order</span>
                  </button>
                )}

                <div className="text-center">
                  <span className="text-[9px] text-[#00B4D8] font-mono tracking-wide uppercase">✔ Inspected Sanitised Packets • Chem SWAB Approved</span>
                </div>

              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. WISHLIST DRAWER */}
      {isWishlistOpen && (
        <div
          id="wishlist-drawer-overlay"
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex justify-end"
          onClick={onWishlistClose}
        >
          <div
            id="wishlist-drawer-container"
            className="w-full max-w-sm bg-[#0A192F] border-l border-white/5 h-full shadow-2xl flex flex-col animate-slide-left text-left text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#112240] text-white">
              <div className="flex items-center space-x-2">
                <span className="text-xl text-rose-500">♥</span>
                <h2 className="font-serif text-lg font-bold">Your Saved Species</h2>
                <span className="font-mono text-xs text-rose-300 bg-rose-955/55 px-2.5 py-0.5 rounded ml-2">
                  {wishlistItems.length} Saved
                </span>
              </div>
              <button
                id="wishlist-close-btn-id"
                onClick={onWishlistClose}
                className="text-gray-400 hover:text-white hover:bg-white/10 p-1.5 rounded-full transition focus:outline-none cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* List Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {wishlistItems.length === 0 ? (
                <div className="py-20 text-center space-y-4">
                  <div className="text-3xl text-slate-500">☺</div>
                  <h3 className="font-serif text-base font-bold text-white">No Catches Saved</h3>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed font-light">
                    Click the hollow heart button on any fish card to save it for rapid shopping later!
                  </p>
                </div>
              ) : (
                wishlistItems.map((product) => (
                  <div
                    key={product.id}
                    className="flex p-4 bg-[#112240] border border-white/5 rounded-2xl space-x-3 items-center hover:border-[#00B4D8]/20 transition"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 object-cover rounded-xl"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-sm font-bold text-white truncate">
                        {product.name}
                      </h4>
                      <p className="text-xs text-[#00B4D8] font-mono font-bold mt-0.5">₹{product.price}/kg</p>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => {
                          onMoveToCart(product);
                          onWishlistClose();
                        }}
                        className="text-[10px] font-bold uppercase tracking-wider bg-[#00B4D8] text-white py-1.5 px-3 rounded-md hover:bg-[#48CAE4] transition cursor-pointer focus:outline-none"
                      >
                        Quick Buy
                      </button>
                      <button
                        onClick={() => onRemoveWishlistItem(product.id)}
                        className="text-[10px] font-bold uppercase text-slate-400 hover:text-rose-455 transition cursor-pointer focus:outline-none text-center"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. MULTI-STEP CHECKOUT WIZARD MODAL */}
      {showCheckout && (
        <div
          id="checkout-wizard-overlay"
          className="fixed inset-0 z-50 bg-[#0A192F]/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto text-left"
        >
          <div
            id="checkout-wizard-container"
            className="w-full max-w-2xl bg-[#112240] text-white p-8 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden"
          >
            {/* Top decorative sea panel */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#00B4D8] via-[#48CAE4] to-white" />
            
            {/* Close */}
            {checkoutStep !== 3 && (
              <button
                id="checkout-close-btn"
                onClick={() => setShowCheckout(false)}
                className="absolute top-6 right-6 text-slate-455 hover:text-white p-1.5 rounded-full hover:bg-white/5 transition cursor-pointer focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {/* Header Steps */}
            <div className="flex justify-between items-center border-b border-white/5 pb-6 mb-6">
              <div>
                <span className="text-[10px] uppercase font-bold text-[#00B4D8] tracking-widest font-mono">Secure Settlement Portal</span>
                <h3 className="font-serif text-xl sm:text-2xl font-black uppercase text-white mt-1">
                  Harbor Dispatch Protocol
                </h3>
              </div>
              
              {/* Step badging */}
              <div className="flex items-center space-x-2 text-xs font-mono font-bold">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center ${checkoutStep >= 1 ? 'bg-[#00B4D8] text-white' : 'bg-[#0A192F] text-slate-400'}`}>1</span>
                <span className="text-slate-500">/</span>
                <span className={`w-7 h-7 rounded-full flex items-center justify-center ${checkoutStep >= 2 ? 'bg-[#00B4D8] text-white' : 'bg-[#0A192F] text-slate-400'}`}>2</span>
                <span className="text-slate-500">/</span>
                <span className={`w-7 h-7 rounded-full flex items-center justify-center ${checkoutStep === 3 ? 'bg-emerald-500 text-white' : 'bg-[#0A192F] text-slate-400'}`}>✔</span>
              </div>
            </div>

            {/* STEP 1: VERIFY CONTACT INFO */}
            {checkoutStep === 1 && (
              <div id="checkout-step-1-panel" className="space-y-4 animate-fade-in">
                <div className="bg-cyan-950/40 p-4 rounded-xl border border-cyan-800/40 flex items-start space-x-3 text-slate-205 text-slate-300 text-xs text-left">
                  <ShieldCheck className="w-5 h-5 text-[#00B4D8] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[#00B4D8] block">Secure encrypted session</span>
                    <p className="font-light mt-0.5">Please confirm or update your dispatch contact coordinates. Logistics agents require a verified phone route for early doorstep dispatching.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">Deliveree Full Name</label>
                    <input
                      type="text"
                      required
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Your Name"
                      className="w-full text-xs bg-[#0A192F] border border-white/10 px-3.5 py-3 rounded-xl focus:outline-none focus:border-[#00B4D8] text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">Logistics Phone Route</label>
                    <input
                      type="tel"
                      required
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full text-xs bg-[#0A192F] border border-white/10 px-3.5 py-3 rounded-xl focus:outline-none focus:border-[#00B4D8] text-white"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                  <div className="text-xs text-slate-300 font-light">
                    Settle total of <span className="font-bold text-[#00B4D8] font-mono">₹{grandTotal}</span>
                  </div>
                  <button
                    onClick={handleNextStep}
                    className="bg-white hover:bg-slate-100 text-[#0A192F] font-bold text-xs py-3 px-6 rounded-xl hover:scale-101 transition flex items-center space-x-1.5 focus:outline-none cursor-pointer"
                  >
                    <span>Proceed to Delivery & Slots</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: ADDRESS & DELIVERY TIME CAPSULES */}
            {checkoutStep === 2 && (
              <div id="checkout-step-2-panel" className="space-y-4 animate-fade-in">
                
                {/* Time slot capsules selector */}
                <div>
                  <label className="text-[10px] uppercase tracking-wider font-bold block mb-2 text-slate-400">
                    <CalendarDays className="w-3.5 h-3.5 inline mr-1 text-[#00B4D8]" /> Choose Morning Catch Arrival Slot
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {[
                      { s: '6:30 AM - 8:30 AM (Prime Sourcing)', d: 'Vessels dock at dawn. Cleaned & delivered immediately. Best for lunch preparations.' },
                      { s: '8:30 AM - 11:30 AM (Standard Household)', d: 'Packed in chilled tubs at Royapuram depot. Perfect for standard family meals.' }
                    ].map((slot) => {
                      const isSel = deliverySlot === slot.s;
                      return (
                        <button
                          key={slot.s}
                          type="button"
                          onClick={() => setDeliverySlot(slot.s)}
                          className={`p-4 rounded-2xl text-left border transition-all focus:outline-none cursor-pointer ${
                            isSel
                              ? 'bg-cyan-950/40 border-[#00B4D8]/60 text-white ring-1 ring-[#00B4D8]'
                              : 'bg-[#0A192F] border-white/5 hover:bg-white/[0.03] text-slate-300'
                          }`}
                        >
                          <span className="font-bold block text-white">{slot.s}</span>
                          <span className="text-[10px] text-slate-400 block mt-1 font-light leading-snug">{slot.d}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Street Address */}
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">Household Street Address / Flat Room</label>
                  <textarea
                    required
                    rows={3}
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    placeholder="e.g. Plot No 42, 3rd cross St, Anna Nagar West, near Metro station..."
                    className="w-full text-xs bg-[#0A192F] border border-white/10 px-3.5 py-3 rounded-xl focus:outline-none focus:border-[#00B4D8] text-white placeholder-slate-500"
                  ></textarea>
                </div>

                {/* Logistics Notes */}
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">Delicate Instructions for Cutter / Crew (Optional)</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Leave gills on, scale crabs thoroughly, pack ice cubes separately."
                    className="w-full text-xs bg-[#0A192F] border border-white/10 px-3.5 py-3 rounded-xl focus:outline-none focus:border-[#00B4D8] text-white placeholder-slate-500"
                  />
                </div>

                <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                  <button
                    onClick={() => setCheckoutStep(1)}
                    className="text-xs text-slate-400 hover:text-white font-bold uppercase tracking-wider focus:outline-none cursor-pointer"
                  >
                    Back to Contacts
                  </button>
                  <button
                    onClick={handleNextStep}
                    className="bg-white hover:bg-slate-100 text-[#0A192F] font-bold text-xs py-3.5 px-8 rounded-xl hover:scale-101 transition flex items-center space-x-1.5 focus:outline-none cursor-pointer"
                  >
                    <Truck className="w-3.5 h-3.5 text-sky-500" />
                    <span>Authorize Catch Order (₹{grandTotal})</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: ORDER SUCCESS & TRANSIT STEPS */}
            {checkoutStep === 3 && (
              <div id="checkout-step-3-panel" className="text-center py-6 space-y-6 animate-fade-in">
                
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-950/50 border border-emerald-800/40 flex items-center justify-center text-emerald-450 mb-4 animate-bounce">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest bg-emerald-950/40 border border-emerald-900/30 px-2.5 py-1 rounded-full">
                    ✔ ORDER SECURED & REGISTERED
                  </span>
                  
                  <h3 className="font-serif text-2xl sm:text-3xl font-black uppercase text-white mt-3">
                    Your Catch is Dispatched!
                  </h3>
                  
                  <p className="text-xs text-slate-350 max-w-md mx-auto mt-2 leading-relaxed font-light">
                    Thank you, <span className="font-bold text-white">{userName}</span>! Your order has been registered at harbor nodes. Slices are being cut from dawn landings and compiled on insulated flatbeds.
                  </p>
                </div>

                {/* Simulated live progress milestones */}
                <div className="bg-[#0A192F] p-6 rounded-2.5xl text-left border border-white/5 max-w-md mx-auto space-y-4">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider font-mono">Estimated Dispatch Progress (Sat Track)</span>
                  
                  <div className="space-y-4">
                    {[
                      { title: 'Vessel Docked & Weighed', desc: 'Sourced from active Tamil Nadu vessels.', status: 'completed' },
                      { title: 'Formalin SWAB Swipped', desc: 'Tested and certified 100% trace chemicals-free.', status: 'completed' },
                      { title: 'Cleaned, Cut & Temp Chilled', desc: 'Ensured safe cutting at Royapuram central dock.', status: 'active' },
                      { title: 'Courier Doorstep Transit', desc: 'Insulated box dispatching to your kitchen.', status: 'pending' }
                    ].map((step, sIdx) => {
                      return (
                        <div key={sIdx} className="flex relative items-start group">
                          {sIdx < 3 && (
                            <div className={`absolute top-5 left-2 w-[1px] h-9 -ml-[0.5px] ${step.status === 'completed' ? 'bg-[#00B4D8]' : 'bg-white/10'}`} />
                          )}
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold z-10 shrink-0 ${
                            step.status === 'completed'
                              ? 'bg-[#00B4D8] text-[#0A192F]'
                              : step.status === 'active'
                              ? 'bg-amber-400 text-slate-950 animate-pulse'
                              : 'bg-white/10 text-slate-400'
                          }`}>
                            {step.status === 'completed' ? '✓' : sIdx + 1}
                          </div>
                          
                          <div className="ml-3">
                            <span className={`block text-xs font-bold leading-tight ${step.status === 'pending' ? 'text-slate-500' : 'text-white'}`}>
                              {step.title}
                            </span>
                            <span className="block text-[10px] text-slate-400 mt-0.5 leading-none font-light">
                              {step.desc}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Action button to return */}
                <div className="pt-2">
                  <button
                    onClick={handleCompleteOrder}
                    className="bg-[#00B4D8] hover:bg-[#48CAE4] text-[#0A192F] font-extrabold text-xs py-3.5 px-8 rounded-full shadow transition-all focus:outline-none cursor-pointer"
                  >
                    Return to Marketplace
                  </button>
                </div>

              </div>
            )}

          </div>
        </div>
      )}
    </>
  );
}
