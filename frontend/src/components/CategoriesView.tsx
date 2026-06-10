import React from 'react';
import { ChevronRight, Percent, Award, Sparkles, HelpCircle, ShieldCheck, Heart } from 'lucide-react';
import { SeafoodProduct } from '../types';
import { SEAFOOD_PRODUCTS } from '../data';

interface CategoryItem {
  id: string;
  name: string;
  tamilName: string;
  image: string;
  description: string;
  benefits: string[];
  species: string[];
  badge: string;
  icon: string;
  chefTip: string;
}

interface CategoriesViewProps {
  onCategorySelect: (categoryId: string) => void;
  onAddToWishlist: (product: SeafoodProduct) => void;
  wishlistIds: string[];
}

export default function CategoriesView({
  onCategorySelect,
  onAddToWishlist,
  wishlistIds,
}: CategoriesViewProps) {

  const fishImages = [
    '/images/Vanjiram Seer Fish – 500g – Slice Cut Cubes – ₹1300.jpg',
    '/images/asal-koduva-sea-bass-500g-slice-cut-500rs.jpg',
    '/images/baby-shark-500g-cubes-cut-250rs.jpg',
    '/images/basa-fish-pangasius-500g-slice-cut-200rs.jpg',
    '/images/cutla-fish-500g-slice-cut-160rs.jpg',
    '/images/jilebi-tilapia-500g-slice-cut-175rs.jpg',
    '/images/kadal-viral-cobia-fish-500g-slice-cut-cubes-410rs.jpg',
    '/images/kalavan-grouper-fish-500g-slice-boneless-fillets-500rs.jpg',
    '/images/kannadi-parai-diamond-travely-500g-slice-cubes-with-head-515rs.jpg',
    '/images/karapodi-silver-belly-fish-500g-slice-cut-300rs.jpg',
    '/images/karimeen-pearl-spot-500g-whole-fish-head-on-slice-cut-350rs.jpg',
    '/images/manja-parai-yellow-trevally-500g-slice-cut-450rs.jpg',
    '/images/matthi-sardine-fish-500g-head-on-whole-fish-250rs.jpg',
    '/images/nakkumeen-halibut-fish-500g-slice-cut-400rs.jpg',
    '/images/nethili-anchovy-500g-headless-275rs.jpg',
    '/images/pal-sura-milk-shark-500g-cubes-cut-550rs.jpg',
    '/images/parai-trevally-fish-500g-slice-cut-450rs.jpg',
    '/images/parla-mahi-mahi-fish-500g-boneless-fillets-cubes-500rs.jpg',
    '/images/red-snapper-fish-500g-slice-cubes-cut-400rs.jpg',
    '/images/sankara-fish-1-2kg-head-on-slice-cut-300rs.jpg',
    '/images/seer-fish-vanjiram-head-only-450rs.jpg',
    '/images/sheela-barracuda-500g-slice-cut-400rs.jpg',
    '/images/soorai-tuna-fish-500g-cubes-cut-500rs.jpg',
    '/images/thengai-parai-trevally-fish-500g-slice-cut-450rs.jpg',
    '/images/vanjiram-seer-fish-500g-slice-cut-cubes-1300rs.jpg',
    '/images/vavval-black-pomfret-fish-500g-slice-cut-500rs.jpg',
    '/images/vellai-vavval-chinese-pomfret-500g-800rs.jpg',
    '/images/villai-meen-emperor-fish-500g-slice-cut-450rs.jpg',
    '/images/white-snapper-korrukkai-fish-500g-slice-cut-400rs.jpg',
    '/images/yeri-vavval-roopchand-500g-slice-cut-175rs.jpg',
  ];

  const prawnsImages = [
    '/images/fresh-water-prawns-500g-60-80-counts-350rs.jpg',
    '/images/sea-white-prawns-10-15-counts-500g-850rs.jpg',
    '/images/sea-white-prawns-500g-60-80-counts-300rs.jpg',
    '/images/tiger-prawns-10-15-counts-500g-850rs.jpg',
    '/images/tiger-prawns-500g-30-counts-600rs.jpg',
  ];

  const crabsImages = [
    '/images/blue-crab-big-500g-550rs.jpg',
    '/images/crab-three-spot-500g-300rs.jpg',
    '/images/mud-crab-green-live-crab-1kg-2000rs.jpg',
  ];

  const lobstersImages = [
    '/images/lobsters-1kg-2000rs.jpg',
  ];

  const squidImages = [
    '/images/kadama-squid-500g-ring-cut-350rs.jpg',
  ];

  const categoriesData: CategoryItem[] = [
    {
      id: 'fish',
      name: 'Fresh Fish',
      tamilName: 'ஆல்பா மீன் வகைகள்',
      image: '/images/Vanjiram Seer Fish – 500g – Slice Cut Cubes – ₹1300.jpg',
      description: 'The absolute pride of coastal fishing vessels. Firm, meaty, and descaled by local master cutters inside our Royapuram labs. Best for classical curries, charcoal roasting, and deep pan fry crisping.',
      benefits: ['High Omega-3 Fatty Acids', 'Direct Boat-to-Crate Sourcing', 'No Formalin or Chemical Treatments'],
      species: ['King Seer Fish (Vanjaram)', 'Silver Pomfret (Vaval)', 'Red Snapper (Sankara)', 'Pearl Spot (Karimeen)'],
      badge: 'Dawn Harbor Landings • 100% Fresh',
      icon: '🐟',
      chefTip: 'Place on direct heat steaks of Vanjaram; they hold juices best when sliced at exactly 1.5 cm width.'
    },
    {
      id: 'prawns',
      name: 'Jumbo Tiger Prawns',
      tamilName: 'மடவை இறால்கள்',
      image: '/images/tiger-prawns-10-15-counts-500g-850rs.jpg',
      description: 'Glistening tiger prawns sourced straight from brackish backwater inlets of coastal Tamil Nadu. Hand-sorted for thickness, sweetness, and tender tail meats.',
      benefits: ['Rich in Selenium & Zinc', 'Available peeled or shell-on', 'Devoid of any preservation sodiums'],
      species: ['Jumbo Tiger Prawns', 'White Sea Prawns', 'Karadi Iraal', 'Cocktail Peel-offs'],
      badge: 'Sweet & Plump Sizing',
      icon: '🦐',
      chefTip: 'Never overcook prawns; 3 to 4 minutes on medium flame is all that is required for maximum buttery tenderness.'
    },
    {
      id: 'crabs',
      name: 'Crabs & Mudcrabs',
      tamilName: 'பச்சை நண்டுகள்',
      image: '/images/mud-crab-green-live-crab-1kg-2000rs.jpg',
      description: 'Tender body and claw meats with exquisite natural sea sweetness. We prioritize live stock compilation until final shipping coordinates are authorized.',
      benefits: ['High Vitamin B12 content', 'Ethically trapped in coastal traps', 'Cleaned, deshelled, & halved easily'],
      species: ['Blue Mud Crab', 'Ocean Sea Crab', 'Soft Shell Specialties'],
      badge: 'Live Trapped Daily • Estuary Fresh',
      icon: '🦀',
      chefTip: 'Cook crabs whole with shells cracked slightly to allow Chettinad spices to fully saturate internal meat chambers.'
    },
    {
      id: 'shellfish',
      name: 'Lobsters / Shellfish',
      tamilName: 'சிப்பியினங்கள் & சிங்க இறால்',
      image: '/images/lobsters-1kg-2000rs.jpg',
      description: 'Luxury deep-sea delicacies for gourmet seafood kitchens. From tender squid rings to premium rock lobsters, perfect for pasta tossed in garlic and olive oil.',
      benefits: ['Premium Gourmet Quality', 'Low Calorie, High Mineral density', 'Sourced on deep-sea harbor nets'],
      species: ['Deep Sea Rock Lobster', 'Baby Squid Rings', 'White Cuttlefish'],
      badge: 'Gourmet Delicacies • Deep Net Sourced',
      icon: '🦞',
      chefTip: 'Toss baby squid in hot garlic oil for merely 2 minutes to keep flesh tender and perfectly elastic.'
    }
  ];

  return (
    <div id="categories-interactive-view" className="bg-[#0A192F] py-16 text-left min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Immersive Header section */}
        <div className="border-b border-white/5 pb-10 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#00B4D8] font-bold bg-cyan-950/40 border border-[#00B4D8]/20 px-3 py-1 rounded-full">
              Sourcing Categories
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-black text-white uppercase mt-4">
              Explore Our Species Divisions
            </h1>
            <p className="font-sans text-sm sm:text-base text-slate-300 mt-2 font-light leading-relaxed">
              Every specimen is guaranteed 100% chemical-free and swiped for formalin before dispatch. Select a division below to view corresponding catches today.
            </p>
          </div>
          
          <div className="flex items-center space-x-1.5 text-xs text-slate-350 font-medium">
            <Award className="w-5 h-5 text-amber-500 animate-bounce" />
            <span>Tested & Swab Verified at Dawn</span>
          </div>
        </div>

        {/* Bento Grid layout of premium categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {categoriesData.map((category) => {
            const count = SEAFOOD_PRODUCTS.filter(p => p.category === category.id).length;
            
            return (
              <div
                key={category.id}
                id={`featured-cat-card-${category.id}`}
                className="bg-[#112240] rounded-3xl overflow-hidden border border-white/5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row group"
              >
                
                {/* Image panel with badge overlay */}
                <div className="w-full sm:w-2/5 h-48 sm:h-auto relative overflow-hidden shrink-0">
                  <img
                    src={category.image}
                    alt={category.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Category icon overlay */}
                  <div className="absolute top-4 left-4 bg-[#0A192F]/90 backdrop-blur-sm shadow w-10 h-10 rounded-xl flex items-center justify-center text-xl border border-white/5">
                    {category.icon}
                  </div>

                  {/* Species items stats bubble */}
                  <div className="absolute bottom-4 left-4 bg-slate-950/80 backdrop-blur-sm text-[#00B4D8] font-mono text-[10px] font-bold px-2.5 py-1 rounded-lg">
                    {count} Live Varieties
                  </div>
                </div>

                {/* Information block */}
                <div className="flex-1 p-6 flex flex-col justify-between space-y-4">
                  
                  <div>
                    {/* Top sub-data */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#00B4D8] font-mono">
                        {category.badge}
                      </span>
                    </div>

                    {/* Main Name & Tamil Name representation */}
                    <h2 className="font-serif text-xl sm:text-2xl font-black text-white mt-1 flex items-baseline gap-2">
                      <span>{category.name}</span>
                      <span className="text-xs text-[#00B4D8] font-semibold font-sans">{category.tamilName}</span>
                    </h2>

                    <p className="text-xs text-slate-300 leading-relaxed font-light mt-2.5">
                      {category.description}
                    </p>
                  </div>

                  {/* Highlights Bullet section */}
                  <div className="space-y-2">
                    <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-bold font-mono">Certified Nutrition & sourcing</span>
                    <ul className="space-y-1.5 text-[11px] text-slate-300">
                      {category.benefits.map((benefit, bIdx) => (
                        <li key={bIdx} className="flex items-center space-x-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#00B4D8] shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Popular Types */}
                  <div className="bg-[#0A192F] p-3 rounded-2xl border border-white/5">
                    <span className="block text-[9px] uppercase tracking-wider text-slate-450 font-bold font-mono mb-1.5">Popular Varieties</span>
                    <div className="flex flex-wrap gap-1">
                      {category.species.map((sp, sIdx) => (
                        <span key={sIdx} className="text-[10px] bg-[#112240] border border-white/5 font-sans px-2 py-0.5 rounded-md text-slate-300">
                          {sp}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Chef Culinary Tips */}
                  <div className="text-[10px] leading-relaxed text-amber-300 bg-[#0A192F]/60 border border-amber-500/20 p-2.5 rounded-xl flex items-start space-x-1.5 font-light">
                    <span className="text-sm shrink-0">🍳</span>
                    <p>
                      <strong className="font-medium text-amber-200">Culinary Tip:</strong> {category.chefTip}
                    </p>
                  </div>

                  {/* Transition button */}
                  <button
                    id={`transition-cart-btn-${category.id}`}
                    onClick={() => onCategorySelect(category.id)}
                    className="w-full bg-gradient-to-r from-[#00B4D8] to-blue-600 hover:from-[#48CAE4] hover:to-blue-500 text-white font-bold text-xs py-2.5 rounded-xl uppercase tracking-wider text-center flex items-center justify-center space-x-1 hover:shadow-md transition-all cursor-pointer focus:outline-none"
                  >
                    <span>Browse {category.name} Catalog</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                </div>

              </div>
            );
          })}
        </div>

        {/* Fish Image Gallery Section */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#00B4D8] font-bold bg-cyan-950/40 border border-[#00B4D8]/20 px-3 py-1 rounded-full">
                Fresh Fish Gallery
              </span>
              <h2 className="font-serif text-2xl font-black text-white uppercase mt-4">
                Our Complete Fish Collection
              </h2>
              <p className="font-sans text-sm text-slate-300 mt-2 font-light">
                Browse through our entire range of fresh fish sourced daily from coastal waters
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {fishImages.map((image, index) => (
              <div
                key={index}
                className="relative group overflow-hidden rounded-xl border border-white/5 bg-[#112240] aspect-square"
              >
                <img
                  src={image}
                  alt={`Fish ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-[10px] text-white font-medium truncate">
                    {image.split('/').pop()?.replace('.jpg', '').replace(/-/g, ' ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prawns Image Gallery Section */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#00B4D8] font-bold bg-cyan-950/40 border border-[#00B4D8]/20 px-3 py-1 rounded-full">
                Prawns Gallery
              </span>
              <h2 className="font-serif text-2xl font-black text-white uppercase mt-4">
                Premium Prawns Collection
              </h2>
              <p className="font-sans text-sm text-slate-300 mt-2 font-light">
                Fresh and succulent prawns sourced from brackish backwaters
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {prawnsImages.map((image, index) => (
              <div
                key={index}
                className="relative group overflow-hidden rounded-xl border border-white/5 bg-[#112240] aspect-square"
              >
                <img
                  src={image}
                  alt={`Prawn ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-[10px] text-white font-medium truncate">
                    {image.split('/').pop()?.replace('.jpg', '').replace(/-/g, ' ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Crabs Image Gallery Section */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#00B4D8] font-bold bg-cyan-950/40 border border-[#00B4D8]/20 px-3 py-1 rounded-full">
                Crabs Gallery
              </span>
              <h2 className="font-serif text-2xl font-black text-white uppercase mt-4">
                Fresh Crabs Collection
              </h2>
              <p className="font-sans text-sm text-slate-300 mt-2 font-light">
                Live and fresh crabs trapped daily from coastal waters
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {crabsImages.map((image, index) => (
              <div
                key={index}
                className="relative group overflow-hidden rounded-xl border border-white/5 bg-[#112240] aspect-square"
              >
                <img
                  src={image}
                  alt={`Crab ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-[10px] text-white font-medium truncate">
                    {image.split('/').pop()?.replace('.jpg', '').replace(/-/g, ' ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lobsters Image Gallery Section */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#00B4D8] font-bold bg-cyan-950/40 border border-[#00B4D8]/20 px-3 py-1 rounded-full">
                Lobsters Gallery
              </span>
              <h2 className="font-serif text-2xl font-black text-white uppercase mt-4">
                Premium Lobsters Collection
              </h2>
              <p className="font-sans text-sm text-slate-300 mt-2 font-light">
                Deep-sea rock lobsters for gourmet seafood kitchens
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {lobstersImages.map((image, index) => (
              <div
                key={index}
                className="relative group overflow-hidden rounded-xl border border-white/5 bg-[#112240] aspect-square"
              >
                <img
                  src={image}
                  alt={`Lobster ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-[10px] text-white font-medium truncate">
                    {image.split('/').pop()?.replace('.jpg', '').replace(/-/g, ' ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Squid Image Gallery Section */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#00B4D8] font-bold bg-cyan-950/40 border border-[#00B4D8]/20 px-3 py-1 rounded-full">
                Squid Gallery
              </span>
              <h2 className="font-serif text-2xl font-black text-white uppercase mt-4">
                Fresh Squid Collection
              </h2>
              <p className="font-sans text-sm text-slate-300 mt-2 font-light">
                Tender squid rings and cuttlefish from deep-sea nets
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {squidImages.map((image, index) => (
              <div
                key={index}
                className="relative group overflow-hidden rounded-xl border border-white/5 bg-[#112240] aspect-square"
              >
                <img
                  src={image}
                  alt={`Squid ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-[10px] text-white font-medium truncate">
                    {image.split('/').pop()?.replace('.jpg', '').replace(/-/g, ' ')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quality swabbing summary block */}
        <div className="bg-gradient-to-r from-[#112240] to-[#1B4965] text-white rounded-3xl p-8 sm:p-12 border border-white/10 mt-16 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl shrink-0" />
          
          <div className="space-y-3 max-w-xl">
            <div className="flex justify-center sm:justify-start items-center space-x-2 text-[#00B4D8] font-mono text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-5 h-5" />
              <span>State Swabbing Protocol</span>
            </div>
            <h3 className="font-serif text-2xl font-bold uppercase text-white leading-tight">
              Looking for a specific maritime cut or heavy bulk chef order?
            </h3>
            <p className="text-xs text-slate-300 font-light leading-relaxed">
              We source custom weights, sizes, and specific rare varieties like Mud Crab claws, lobster chunks, or heavy 10kg King Seer fish with pre-booked timings. Contact our Kasimedu Head office directly.
            </p>
          </div>

          <div className="shrink-0 flex flex-col space-y-3 w-full sm:w-auto">
            <button
              onClick={() => onCategorySelect('all')}
              className="bg-white hover:bg-slate-100 text-[#0A192F] text-xs font-bold uppercase tracking-wider py-4 px-8 rounded-full shadow transition-all hover:scale-102 cursor-pointer focus:outline-none text-center"
            >
              Examine Full Stock (All Species)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
