const fs = require('fs');

const path = 'frontend/src/app/(consumer)/page.tsx';
let content = fs.readFileSync(path, 'utf8');

const startMarker = '{/* ═══════════════════════════════════════════════════\n          DYNAMIC PRODUCT SECTION';
const endMarker = '{/* ═══════════════════════════════════════════════════\n          CATEGORIES SECTION';

const startIndex1 = content.indexOf(startMarker);
const startIndex2 = content.indexOf('{/* ═══════════════════════════════════════════════════\r\n          DYNAMIC PRODUCT SECTION');

const startIndex = startIndex1 !== -1 ? startIndex1 : startIndex2;

const endIndex1 = content.indexOf(endMarker);
const endIndex2 = content.indexOf('{/* ═══════════════════════════════════════════════════\r\n          CATEGORIES SECTION');

const endIndex = endIndex1 !== -1 ? endIndex1 : endIndex2;

if (startIndex === -1 || endIndex === -1) {
  console.error('Could not find markers', { startIndex, endIndex });
  process.exit(1);
}

const newSections = `      {/* ═══════════════════════════════════════════════════
          SECTION 1: TOP SELLING SEAFOOD
          ═══════════════════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-b from-[#f0f8ff] via-[#f0f8ff] to-white overflow-hidden relative">
        {/* Ocean-inspired subtle background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,119,182,0.03)_0%,_transparent_70%)] pointer-events-none"></div>
        <div className="absolute top-10 left-10 w-96 h-96 bg-blue-100/30 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-sky-100/30 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="w-full max-w-[1800px] mx-auto mb-10 px-4 sm:px-6 lg:px-8 xl:px-12 text-center relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0077b6] bg-blue-50 px-4 py-1.5 rounded-full border border-blue-200/50 inline-block shadow-sm mb-3">Best Sellers</span>
          <h2 className="text-4xl md:text-5xl font-heading font-black text-slate-900 drop-shadow-sm">Top Selling Seafood</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mt-4 font-light">The absolute best-selling marine landings, selected daily by premium kitchens.</p>
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-80 relative z-10">
            <Loader2 className="w-12 h-12 animate-spin mb-4 text-[#0077b6]" />
            <p className="text-[#0077b6] font-medium animate-pulse">Reeling in top sellers...</p>
          </div>
        ) : (
          <div className="relative w-full overflow-hidden flex z-10 py-8 group/marquee">
            {/* Smooth infinite marquee loop */}
            <div className="animate-marquee group-hover/marquee:[animation-play-state:paused] flex gap-6 px-3">
              {/* Double the products array to create a seamless loop */}
              {[...(products || []), ...(products || [])].map((product, idx) => (
                <div key={\`top-selling-\${product.id}-\${idx}\`} className="w-[280px] sm:w-[300px] md:w-[320px] flex-shrink-0">
                  <ProductCard 
                    id={product.id.toString()} 
                    slug={product.slug}
                    name={product.name} 
                    price={product.sale_price || product.price} 
                    weight={product.weight_unit || "1kg"} 
                    category={product.category?.name || "Uncategorized"}
                    image={product.images?.[0]?.image_url}
                    isAvailable={product.available_quantity > 0}
                    className="shadow-lg hover:shadow-2xl border-white/40 bg-white/80 backdrop-blur-sm transition-all duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 2: TODAY'S PURCHASE
          ═══════════════════════════════════════════════════ */}
      <section className="py-20 bg-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.015] pointer-events-none mix-blend-overlay"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] bg-emerald-50/40 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="w-full max-w-[1800px] mx-auto mb-10 px-4 sm:px-6 lg:px-8 xl:px-12 text-center relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-200/50 inline-block shadow-sm mb-3">Live Feed</span>
          <h2 className="text-4xl md:text-5xl font-heading font-black text-slate-900 drop-shadow-sm">Today's Purchases</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mt-4 font-light">See what other premium kitchens are reeling in right now.</p>
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-80 relative z-10">
            <Loader2 className="w-12 h-12 animate-spin mb-4 text-emerald-500" />
            <p className="text-emerald-600 font-medium animate-pulse">Loading recent orders...</p>
          </div>
        ) : (
          <div className="relative w-full overflow-hidden flex z-10 py-8 group/marquee2">
            {/* Reverse marquee for contrast */}
            <div className="animate-marquee-reverse group-hover/marquee2:[animation-play-state:paused] flex gap-6 px-3">
              {/* Simulate "Today's Purchase" by taking a slice and duplicating it */}
              {[...([...(products || [])].reverse()), ...([...(products || [])].reverse())].map((product, idx) => (
                <div key={\`today-purchase-\${product.id}-\${idx}\`} className="w-[280px] sm:w-[300px] md:w-[320px] flex-shrink-0">
                  <div className="relative">
                    {/* Add Popularity Indicator */}
                    <div className="absolute -top-3 -right-3 z-30 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1 border border-white">
                      <Flame className="w-3 h-3" />
                      Just Bought
                    </div>
                    <ProductCard 
                      id={product.id.toString()} 
                      slug={product.slug}
                      name={product.name} 
                      price={product.sale_price || product.price} 
                      weight={product.weight_unit || "1kg"} 
                      category={product.category?.name || "Uncategorized"}
                      image={product.images?.[0]?.image_url}
                      isAvailable={product.available_quantity > 0}
                      className="shadow-md hover:shadow-xl border-slate-100 bg-white transition-all duration-300"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>\n\n      `;

const finalContent = content.substring(0, startIndex) + newSections + content.substring(endIndex);
fs.writeFileSync(path, finalContent);
console.log('Successfully updated the UI with two premium marquees.');
