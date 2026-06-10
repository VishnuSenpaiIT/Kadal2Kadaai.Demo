import { useState } from 'react';
import { Star, ShoppingCart, Heart, ShieldCheck, MapPin, ChevronDown, Flame } from 'lucide-react';
import { SeafoodProduct } from '../types';
// @ts-ignore
import logoImg from '../assets/images/image.png';

interface ProductCardProps {
  product: SeafoodProduct;
  onAddToCart: (product: SeafoodProduct, weight: string, cut: string) => void;
  onAddToWishlist: (product: SeafoodProduct) => void;
  isWishlisted: boolean;
  theme?: 'light' | 'dark';
  onCardClick?: (product: SeafoodProduct) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
  onAddToWishlist,
  isWishlisted,
  theme = 'light', // Default to light as per reference
  onCardClick,
}: ProductCardProps) {
  const [selectedWeight, setSelectedWeight] = useState(product.availableWeights[0]);
  const [selectedCut, setSelectedCut] = useState(product.availableCuts[0]);
  const [isCutOpen, setIsCutOpen] = useState(false);
  const [isWeightOpen, setIsWeightOpen] = useState(false);
  const [addedTemp, setAddedTemp] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product, selectedWeight, selectedCut);
    setAddedTemp(true);
    setTimeout(() => setAddedTemp(false), 2000);
  };

  const isLight = theme === 'light';

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onCardClick?.(product)}
      className={`inline-block w-full max-w-[280px] shrink-0 rounded-[24px] transition-all duration-300 transform hover:-translate-y-1 group select-none text-left overflow-hidden cursor-pointer ${
        isLight
          ? 'bg-white border border-[#E0F2FE] shadow-md hover:shadow-2xl hover:border-[#0096C7]/40 hover:bg-gradient-to-b hover:from-white hover:to-sky-50/60'
          : 'bg-[#112240] border border-white/10 shadow-md hover:shadow-xl'
      }`}
    >
      {/* Product Image Area */}
      <div className={`relative h-48 overflow-hidden ${isLight ? 'bg-slate-50' : 'bg-[#0A192F]'}`}>
        <img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        
        {/* Top Badges (Left) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <div className="flex items-center space-x-1 bg-[#4CAF50] text-white px-2 py-0.5 rounded-md shadow-sm border border-white/20">
            <ShieldCheck className="w-2.5 h-2.5" />
            <span className="font-sans text-[8px] font-black uppercase tracking-wider">Fresh Today</span>
          </div>
          {product.isPopular && (
            <div className="flex items-center space-x-1 bg-[#FF8F00] text-white px-2 py-0.5 rounded-md shadow-sm border border-white/20">
              <span className="font-sans text-[8px] font-black uppercase tracking-wider">Best Seller</span>
            </div>
          )}
        </div>

        {/* Wishlist Button (Right) */}
        <div className="absolute top-3 right-3 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToWishlist(product);
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all bg-white/90 backdrop-blur-sm text-slate-400 hover:text-rose-500 shadow-sm border border-slate-100 focus:outline-none"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>
 
        {/* Harbor Location Badge - Bottom Left Overlay */}
        <div className="absolute bottom-3 left-3 z-10">
          <div className="flex items-center space-x-1.5 bg-slate-900/60 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-lg shadow-lg">
            <span className="text-[9px] font-sans font-bold text-white tracking-wide">
              {product.harborLocation || product.tag || 'Coastal Sourced Area'}
            </span>
          </div>
        </div>

        {/* Circular Logo - Bottom Right Overlay */}
        <div className="absolute bottom-3 right-3 z-10">
          <div className="w-9 h-9 rounded-full bg-white shadow-lg overflow-hidden flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-transform">
            <img 
               src={logoImg} 
               alt="logo" 
               className="w-full h-full object-cover scale-90"
               referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
  
      {/* Product Information Body */}
      <div className="px-4 py-4 flex flex-col">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-black uppercase tracking-[0.12em] text-[#0077B6] font-sans">
              {product.category}
            </span>
            <div className="flex items-center space-x-0.5">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="font-sans text-[12px] font-extrabold text-amber-600">
                {product.rating}
              </span>
            </div>
          </div>
 
          <h3 className={`font-serif text-[18px] font-black leading-tight text-[#0A2540] mb-1.5 group-hover:text-[#0077B6] transition-colors`}>
            {product.name}
          </h3>
          
          <p className="font-sans text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4 font-semibold">
            {product.description}
          </p>

          {/* Selectors Area */}
          <div className="space-y-3 mb-4">
            {/* Weight Select */}
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-sans font-extrabold text-[#0077B6]">Select Weight:</span>
              <div className="relative">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setIsWeightOpen(!isWeightOpen); setIsCutOpen(false); }}
                  className="min-w-[80px] flex items-center justify-between bg-white hover:bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[12px] font-bold text-slate-700 transition-all shadow-sm"
                >
                  {selectedWeight}
                  <ChevronDown className={`w-3 h-3 ml-1.5 text-blue-500 transition-transform ${isWeightOpen ? 'rotate-180' : ''}`} />
                </button>
                {isWeightOpen && (
                  <div className="absolute top-full mt-1 right-0 w-full min-w-[100px] z-30 bg-white border border-slate-100 shadow-2xl rounded-lg overflow-hidden p-1">
                    {product.availableWeights.map((wt) => (
                      <button
                        key={wt}
                        onClick={(e) => { e.stopPropagation(); setSelectedWeight(wt); setIsWeightOpen(false); }}
                        className="w-full text-left px-2 py-1.5 text-[11px] hover:bg-slate-50 rounded-md font-bold text-slate-600"
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
              <span className="text-[12px] font-sans font-extrabold text-[#0077B6]">Cuts:</span>
              <div className="relative">
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setIsCutOpen(!isCutOpen); setIsWeightOpen(false); }}
                  className="min-w-[110px] flex items-center justify-between bg-white hover:bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[12px] font-bold text-slate-700 transition-all shadow-sm"
                >
                  <span className="truncate mr-1">{selectedCut}</span>
                  <ChevronDown className={`w-3 h-3 text-blue-500 transition-transform ${isCutOpen ? 'rotate-180' : ''}`} />
                </button>
                {isCutOpen && (
                  <div className="absolute top-full mt-1 right-0 w-full min-w-[140px] z-30 bg-white border border-slate-100 shadow-2xl rounded-lg overflow-hidden p-1 max-h-48 overflow-y-auto">
                    {product.availableCuts.map((cut) => (
                      <button
                        key={cut}
                        onClick={(e) => { e.stopPropagation(); setSelectedCut(cut); setIsCutOpen(false); }}
                        className="w-full text-left px-2 py-1.5 text-[11px] hover:bg-slate-50 rounded-md font-bold text-slate-600"
                      >
                        {cut}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
 
        {/* Pricing & Add button */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#E0F2FE]">
          <div className="flex flex-col">
            <div className="flex items-baseline text-[#0077B6]">
              <span className="text-xs font-black mr-0.5">₹</span>
              <span className="text-[22px] font-black leading-none">{product.price}</span>
            </div>
            <span className="text-[10px] text-[#0096C7] font-bold mt-0.5">/500g pack</span>
          </div>
          <button
            onClick={handleAdd}
            disabled={addedTemp}
            className={`flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl font-sans text-xs font-black transition-all active:scale-95 cursor-pointer ${
              addedTemp
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                : 'bg-[#FF7A00] hover:bg-[#FF8A00] text-white shadow-lg shadow-orange-500/30'
            }`}
          >
            {!addedTemp && <ShoppingCart className="w-3.5 h-3.5 fill-current" />}
            <span>{addedTemp ? 'Added!' : 'Add'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
