import { TrendingUp, Flame, ThumbsUp, ShoppingBag, ChevronDown, ShoppingCart, Info } from 'lucide-react';
import { TodayPurchaseItem, SeafoodProduct } from '../types';
import { TODAY_PURCHASES, SEAFOOD_PRODUCTS } from '../data';
// @ts-ignore
import logoImg from '../assets/images/image.png';

interface TodayPurchasesSectionProps {
  onQuickAdd: (product: SeafoodProduct, weight: string, cut: string) => void;
  onCardClick?: (product: SeafoodProduct) => void;
}

export default function TodayPurchasesSection({ onQuickAdd, onCardClick }: TodayPurchasesSectionProps) {
  const handleQuickAdd = (item: TodayPurchaseItem) => {
    // Find matching full product to add to cart
    const fullProduct = SEAFOOD_PRODUCTS.find(
      (p) => p.name.toLowerCase().includes(item.name.toLowerCase()) || item.name.toLowerCase().includes(p.name.toLowerCase())
    ) || SEAFOOD_PRODUCTS[0];
    onQuickAdd(fullProduct, item.weightSelected.replace(' ', ''), item.cutType);
  };

  return (
    <section id="todays-purchases-section" className="py-20 bg-gradient-to-b from-[#F0FDF4] via-white to-[#EBF8FF] border-b border-emerald-100 overflow-hidden relative">
      {/* Styled top header caption block exactly matching the screenshot */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10 relative z-10 text-center">
        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-black text-[#0A2540] tracking-tight leading-tight uppercase mt-2">
          Today's Purchases
        </h2>
        <div className="w-16 h-1.5 bg-gradient-to-r from-[#0077B6] to-[#0FA958] mx-auto mt-3 rounded-full" />
      </div>

      {/* Elegant scrollable auto-scrolling row/shelf of vertical purchase cards */}
      <div className="relative w-full overflow-hidden select-none mb-6 focus-within:outline-none z-10">
        {/* Soft edge-blurs for premium design look */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#F0FDF4] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#EBF8FF] to-transparent z-10 pointer-events-none" />

        <div className="flex w-max animate-marquee-right hover:[animation-play-state:paused] py-4">
          {[...TODAY_PURCHASES, ...TODAY_PURCHASES, ...TODAY_PURCHASES].map((item, idx) => {
            const isVeryHot = item.demandMeter >= 80;
            const uniqueKey = `${item.id}-marquee-${idx}`;
            return (
              <div
                key={uniqueKey}
                id={`recent-purchase-card-${uniqueKey}`}
                onClick={() => {
                  const fullProduct = SEAFOOD_PRODUCTS.find(
                    (p) => p.name.toLowerCase().includes(item.name.toLowerCase()) || item.name.toLowerCase().includes(p.name.toLowerCase())
                  ) || SEAFOOD_PRODUCTS[0];
                  onCardClick?.(fullProduct);
                }}
                className="group relative w-[295px] shrink-0 bg-white rounded-3xl border border-slate-100/90 shadow-md hover:shadow-xl hover:border-[#0077B6]/30 transition-all duration-300 flex flex-col justify-between overflow-hidden p-4 pb-5 active:scale-[0.99] mx-3 cursor-pointer"
              >
                {/* Image slot with badges */}
                <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-slate-50 border border-slate-50 shrink-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Top-Left Recently Bought tag (Blue pill) */}
                  <div className="absolute top-3 left-3 bg-[#0077B6] text-white text-[9px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-sm">
                    ⚡ Recently Bought
                  </div>

                  {/* Bottom-Left Green ribbon ("X households bought today") */}
                  <div className="absolute bottom-3 left-3 bg-[#0FA958] text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
                    <span>{item.householdsPurchasedCount} households bought today</span>
                  </div>

                  {/* Stamp Seal Logo at Bottom-Right */}
                  <div className="absolute bottom-2.5 right-2.5 w-9 h-9 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center p-0.5 z-10">
                    <img
                      src={logoImg}
                      alt="Kadal"
                      className="w-full h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>

                {/* Card Information Body */}
                <div className="flex-1 flex flex-col justify-between mt-3.5">
                  <div>
                    {/* Category label block (MILK SHARK, BLUE CRAB etc.) */}
                    <div className="flex items-center justify-between text-[10px] font-bold tracking-wider uppercase">
                      <span className="text-[#0FA958] font-black font-sans leading-none text-[11px]">{item.category || 'SEAFOOD'}</span>
                      {item.tag && (
                        <span className="text-slate-400 font-sans flex items-center gap-1 shrink-0 leading-none">
                          <span>{item.tag}</span>
                        </span>
                      )}
                    </div>

                    {/* Bold product name */}
                    <h3 className="font-serif text-[17px] font-extrabold text-[#0A2540] group-hover:text-[#0077B6] transition-colors mt-2 leading-tight">
                      {item.name}
                    </h3>

                    {/* Demand Level block */}
                    <div className="mt-3.5">
                      <div className="flex items-center justify-between text-[10px] font-extrabold text-[#0077B6] font-sans">
                        <span>Demand Level:</span>
                        <span className="text-[#0077B6] font-mono font-black">{item.demandMeter}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mt-1.5">
                        <div
                          className="h-full rounded-full bg-[#0FA958]"
                          style={{ width: `${item.demandMeter}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Double capsule selectors */}
                  <div>
                    <div className="grid grid-cols-2 gap-2.5 mt-4">
                      {/* Weight pill */}
                      <div onClick={(e) => e.stopPropagation()}>
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
                          Weight:
                        </span>
                        <div className="flex items-center justify-between bg-slate-50 border border-slate-100/80 rounded-xl text-[11px] font-bold text-slate-700 px-2.5 py-2 hover:bg-slate-100/60 transition-all cursor-pointer">
                          <span>{item.weightSelected}</span>
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                        </div>
                      </div>

                      {/* Cuts pill */}
                      <div onClick={(e) => e.stopPropagation()}>
                        <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
                          Cuts:
                        </span>
                        <div className="flex items-center justify-between bg-slate-50 border border-slate-100/80 rounded-xl text-[11px] font-bold text-slate-700 px-2.5 py-2 hover:bg-slate-100/60 transition-all cursor-pointer">
                          <span className="truncate">{item.cutType}</span>
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
                        </div>
                      </div>
                    </div>

                    {/* Bottom Divider / CTA details row */}
                    <div className="border-t border-slate-100/90 mt-5 pt-4 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="font-serif text-[19px] font-black text-slate-900 leading-none">
                          ₹{item.price}
                        </span>
                        <span className="text-[9px] text-slate-400 font-semibold tracking-wide uppercase mt-1 leading-none">
                          / {item.weightSelected}
                        </span>
                      </div>

                      <button
                        id={`purchased-add-btn-${item.id}`}
                        onClick={(e) => { e.stopPropagation(); handleQuickAdd(item); }}
                        className="flex items-center space-x-1.5 bg-[#FF7F50] hover:bg-[#ff936b] text-white font-sans text-xs font-black py-2.5 px-5 rounded-full shadow-md hover:shadow-[#FF7F50]/10 hover:-translate-y-0.5 transition-all cursor-pointer focus:outline-none"
                      >
                        <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 text-center mt-2 flex items-center justify-center space-x-2 text-xs text-slate-400">
        <Info className="w-3.5 h-3.5 text-cyan-500" />
        <span>Today's active purchases reflect real-time households shopping loops across Tamil Nadu today.</span>
      </div>
    </section>
  );
}
