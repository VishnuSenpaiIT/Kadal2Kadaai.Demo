import React, { useState } from 'react';
import { X, Heart, ShieldCheck, MapPin, CalendarDays, Truck, ShoppingCart, Star, ChevronDown } from 'lucide-react';
import { SeafoodProduct } from '../types';
// @ts-ignore
import logoImg from '../assets/images/image.png';

interface ProductDetailModalProps {
  product: SeafoodProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: SeafoodProduct, weight: string, cut: string) => void;
  onAddToWishlist: (product: SeafoodProduct) => void;
  isWishlisted: boolean;
}

export default function ProductDetailModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onAddToWishlist,
  isWishlisted,
}: ProductDetailModalProps) {
  if (!isOpen || !product) return null;

  const [selectedWeight, setSelectedWeight] = useState(product.availableWeights[0]);
  const [selectedCut, setSelectedCut] = useState(product.availableCuts[0]);
  const [isWeightOpen, setIsWeightOpen] = useState(false);
  const [isCutOpen, setIsCutOpen] = useState(false);
  const [addedTemp, setAddedTemp] = useState(false);

  const handleAdd = () => {
    onAddToCart(product, selectedWeight, selectedCut);
    setAddedTemp(true);
    setTimeout(() => setAddedTemp(false), 2000);
  };

  return (
    <div
      id="product-detail-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 text-left select-none"
      onClick={onClose}
    >
      <div
        id="product-detail-modal-container"
        className="w-full max-w-[580px] bg-white text-slate-900 rounded-[32px] shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh] animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Section */}
        <div className="px-6 pt-6 pb-4 flex justify-between items-start">
          <div>
            <span className="inline-block bg-[#E8F5E9] text-[#2E7D32] text-[10px] font-black tracking-wider px-2.5 py-1 rounded-md mb-2">
              {product.freshnessBadge || 'CHEMICAL-FREE'}
            </span>
            <h2 className="font-serif text-[28px] font-black text-[#0A192F] leading-tight">
              {product.name}
            </h2>
            <span className="text-[11px] font-black tracking-widest text-cyan-600 uppercase">
              {product.category}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onAddToWishlist(product)}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all bg-slate-50 text-slate-400 hover:text-rose-500 border border-slate-100 focus:outline-none"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all bg-slate-50 text-slate-500 hover:text-slate-900 border border-slate-100 focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-5">
          {/* Main Product Image Container */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-64 object-cover"
            />
            {/* Overlaid Badges */}
            <div className="absolute bottom-4 left-4 flex flex-wrap gap-2 z-10">
              <span className="bg-[#00B4D8] text-white text-[10px] font-black tracking-wider px-3 py-1.5 rounded-lg shadow-md uppercase">
                {product.harborLocation || 'RAMESWARAM COASTAL AREA'}
              </span>
              <span className="flex items-center space-x-1 bg-[#2E7D32] text-white text-[10px] font-black tracking-wider px-3 py-1.5 rounded-lg shadow-md uppercase">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>DAWN SOURCED</span>
              </span>
            </div>
            {/* Circular Logo overlay */}
            <div className="absolute bottom-4 right-4 z-10">
              <div className="w-12 h-12 rounded-full bg-white shadow-lg overflow-hidden flex items-center justify-center border border-slate-100">
                <img
                  src={logoImg}
                  alt="logo"
                  className="w-full h-full object-cover scale-90"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>

          {/* Catch details & metadata */}
          <div className="bg-[#F8FAFC] border border-slate-100 rounded-2xl p-4 grid grid-cols-2 gap-4">
            <div className="flex items-start space-x-2.5">
              <CalendarDays className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">CATCH TIMELINE:</span>
                <span className="text-xs font-bold text-slate-700">Today early dawn</span>
              </div>
            </div>
            <div className="flex items-start space-x-2.5">
              <MapPin className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">CATCH LOCATION:</span>
                <span className="text-xs font-bold text-slate-700 truncate block max-w-[150px]">
                  {product.harborLocation || 'Coastal sourced area'}
                </span>
              </div>
            </div>
          </div>

          {/* Selector Fields */}
          <div className="bg-[#F8FAFC] border border-slate-100 rounded-2xl p-4 space-y-4">
            {/* Weight Select */}
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-sans font-bold text-slate-500">Select Weight:</span>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => { setIsWeightOpen(!isWeightOpen); setIsCutOpen(false); }}
                  className="min-w-[120px] flex items-center justify-between bg-white hover:bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] font-bold text-slate-700 transition-all shadow-sm"
                >
                  {selectedWeight}
                  <ChevronDown className={`w-4 h-4 ml-2 text-blue-500 transition-transform ${isWeightOpen ? 'rotate-180' : ''}`} />
                </button>
                {isWeightOpen && (
                  <div className="absolute top-full mt-1 right-0 w-full min-w-[140px] z-30 bg-white border border-slate-100 shadow-2xl rounded-xl overflow-hidden p-1">
                    {product.availableWeights.map((wt) => (
                      <button
                        key={wt}
                        onClick={() => { setSelectedWeight(wt); setIsWeightOpen(false); }}
                        className="w-full text-left px-3 py-2 text-[12px] hover:bg-slate-50 rounded-lg font-bold text-slate-600"
                      >
                        {wt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Cuts Select */}
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-sans font-bold text-slate-500">Customize Cuts:</span>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => { setIsCutOpen(!isCutOpen); setIsWeightOpen(false); }}
                  className="min-w-[180px] flex items-center justify-between bg-white hover:bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-[13px] font-bold text-slate-700 transition-all shadow-sm"
                >
                  <span className="truncate mr-2">{selectedCut}</span>
                  <ChevronDown className={`w-4 h-4 text-blue-500 transition-transform ${isCutOpen ? 'rotate-180' : ''}`} />
                </button>
                {isCutOpen && (
                  <div className="absolute top-full mt-1 right-0 w-full min-w-[200px] z-30 bg-white border border-slate-100 shadow-2xl rounded-xl overflow-hidden p-1 max-h-40 overflow-y-auto">
                    {product.availableCuts.map((cut) => (
                      <button
                        key={cut}
                        onClick={() => { setSelectedCut(cut); setIsCutOpen(false); }}
                        className="w-full text-left px-3 py-2 text-[12px] hover:bg-slate-50 rounded-lg font-bold text-slate-600"
                      >
                        {cut}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pricing Info */}
          <div className="bg-[#F8FAFC] border border-slate-100 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">SOURCING PRICE:</span>
              <div className="flex items-baseline text-slate-900 mt-1">
                <span className="text-sm font-bold mr-1">₹</span>
                <span className="text-3xl font-black leading-none">{product.price}</span>
                <span className="text-xs text-slate-400 font-bold ml-1.5">/500g Box</span>
              </div>
            </div>
            <span className="bg-sky-50 text-[#0077B6] border border-sky-100 text-[10px] font-black px-3 py-1.5 rounded-lg tracking-wider">
              PRICE LOCKED
            </span>
          </div>

          {/* Delivery Note */}
          <div className="flex items-center space-x-2 text-xs text-slate-600 font-medium px-1">
            <Truck className="w-4 h-4 text-sky-500" />
            <span>Guaranteed catch home delivery by <strong className="text-slate-800">Tomorrow 7:30 AM</strong></span>
          </div>
        </div>

        {/* Action Button Section */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100">
          <button
            onClick={handleAdd}
            disabled={addedTemp}
            className={`w-full flex items-center justify-center space-x-3 py-4 rounded-2xl font-sans text-sm font-black transition-all active:scale-98 cursor-pointer ${
              addedTemp
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                : 'bg-[#FF7A00] hover:bg-[#FF8A00] text-white shadow-lg shadow-orange-500/30'
            }`}
          >
            {!addedTemp && <ShoppingCart className="w-5 h-5 fill-current" />}
            <span>{addedTemp ? 'Added to Basket!' : 'Add Sourced Pack to Cart'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
