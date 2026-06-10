import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, RefreshCw, X, ShoppingCart, HelpCircle, ShieldCheck, ChevronDown } from 'lucide-react';
import { SeafoodProduct, SeafoodCategory } from '../types';
import { SEAFOOD_PRODUCTS } from '../data';
import ProductCard from './ProductCard';
import CategoryCard from './CategoryCard';

interface MarketplaceViewProps {
  onAddToCart: (product: SeafoodProduct, weight: string, cut: string) => void;
  onAddToWishlist: (product: SeafoodProduct) => void;
  wishlistIds: string[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  products: SeafoodProduct[];
  onCardClick?: (product: SeafoodProduct) => void;
}

export default function MarketplaceView({
  onAddToCart,
  onAddToWishlist,
  wishlistIds,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  products,
  onCardClick,
}: MarketplaceViewProps) {
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
  const [sortOption, setSortOption] = useState<string>('featured');
  const [priceRange, setPriceRange] = useState<number>(2500);

  const derivedCategories = useMemo(() => {
    const cats = new Map<string, { id: string; label: string; image: string; count: number }>();
    
    products.forEach(p => {
      if (!cats.has(p.category)) {
        cats.set(p.category, {
          id: p.category,
          label: p.category,
          image: p.image,
          count: 0
        });
      }
      cats.get(p.category)!.count++;
    });

    return Array.from(cats.values());
  }, [products]);

  const sortedAndFilteredProducts = useMemo(() => {
    let list = [...products];

    // Filter by Main Category
    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    // Filter by search query
    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tamilName?.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Filter by Sub-Category
    if (selectedSubCategory !== 'all') {
       list = list.filter((p) => p.subCategory === selectedSubCategory);
    }
    // When 'all' is selected, show everything (no extra filter needed)

    // Filter by Price range
    list = list.filter((p) => p.price <= priceRange);

    // Apply Sorting
    if (sortOption === 'price-low') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-high') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortOption === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [searchQuery, selectedCategory, selectedSubCategory, sortOption, priceRange, products]);

  const handleClearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedSubCategory('all');
    setSortOption('featured');
    setPriceRange(2500);
  };

  const availableSubCategories = useMemo(() => {
    // Only show sub-category buttons for the Fish section
    if (selectedCategory !== 'Fish') return [];
    const subs = new Set<string>();
    products.forEach(p => {
      if (p.category === 'Fish' && p.subCategory) {
        subs.add(p.subCategory);
      }
    });
    return Array.from(subs);
  }, [products, selectedCategory]);

  const mainCategories = useMemo(() => [
    { id: 'all', label: 'All' },
    { id: 'Fish', label: 'Fish' },
    { id: 'Prawns', label: 'Prawns' },
    { id: 'Crab', label: 'Crab' },
    { id: 'Lobster', label: 'Lobster' },
  ], []);

  return (
    <div id="marketplace-grid-view" className="py-20 bg-white min-h-screen text-slate-900 text-left">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex items-center space-x-2.5 bg-emerald-50 text-emerald-600 px-3.5 py-1.5 rounded-xl w-fit mb-6 border border-emerald-100/50 shadow-sm">
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="text-[11px] font-black uppercase tracking-widest font-sans">Live: Sourced at Dawn Today</span>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <h1 className="font-serif text-5xl sm:text-6xl font-black text-[#0A192F] tracking-tighter leading-tight">
                Today's Fresh Catch
              </h1>
              <p className="font-sans text-lg text-slate-700 mt-5 font-semibold leading-relaxed">
                Locally sourced directly from ocean boats at 4:30 AM, thoroughly checked for chemical freshness, processed beautifully in sterile corridors.
              </p>
            </div>
            
            <div className="flex items-center space-x-3 bg-white border border-slate-100 rounded-2xl px-6 py-3.5 shadow-sm">
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest font-sans whitespace-nowrap">Sort By:</span>
              <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-transparent border-none text-[#0A192F] text-sm font-black focus:ring-0 cursor-pointer outline-none font-sans"
              >
                <option value="featured">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#0077B6]" />
            </div>
          </div>
        </div>

        {/* Global Navigation Pills */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          {mainCategories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setSearchQuery('');
                  setSelectedSubCategory('all');
                }}
                className={`px-8 py-4 rounded-[20px] text-base font-black transition-all duration-200 cursor-pointer border ${
                  isActive
                    ? 'bg-gradient-to-r from-[#0077B6] to-[#00B4D8] text-white border-transparent shadow-lg shadow-[#0077B6]/40 scale-105'
                    : 'bg-white text-[#0A192F] border-slate-200 hover:border-[#0077B6] hover:text-[#0077B6] hover:shadow-md hover:shadow-[#0077B6]/10 hover:scale-105'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Sub Category Buttons — shown directly when a category is selected */}
        {availableSubCategories.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <button
              onClick={() => setSelectedSubCategory('all')}
              className={`px-6 py-3 rounded-[16px] text-sm font-black transition-all cursor-pointer border shadow-sm ${
                selectedSubCategory === 'all'
                  ? 'bg-[#0A192F] text-white border-[#0A192F]'
                  : 'bg-[#F8FAFC] text-[#0A192F] border-slate-100 hover:bg-slate-100'
              }`}
            >
              All
            </button>
            {availableSubCategories.map((sub) => {
              const isActive = selectedSubCategory === sub;
              return (
                <button
                  key={sub}
                  onClick={() => setSelectedSubCategory(sub)}
                  className={`px-6 py-3 rounded-[16px] text-sm font-black transition-all cursor-pointer border shadow-sm ${
                    isActive
                      ? 'bg-[#0A192F] text-white border-[#0A192F]'
                      : 'bg-[#F8FAFC] text-[#0A192F] border-slate-100 hover:bg-slate-100'
                  }`}
                >
                  {sub}
                </button>
              );
            })}
          </div>
        )}

        {/* Stats line */}
        <div className="mb-12 border-b border-slate-50 pb-8">
          <div className="text-[13px] font-mono font-medium text-slate-400">
             Showing <span className="text-slate-600 font-bold">{sortedAndFilteredProducts.length}</span> of {products.length} seafood selections
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12">
          {/* Product Grid */}
          <div className="lg:col-span-1">
            {sortedAndFilteredProducts.length === 0 ? (
              <div className="bg-slate-50 rounded-[40px] py-32 px-10 border border-slate-100 text-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                  <Search className="w-8 h-8 text-slate-200" />
                </div>
                <h3 className="font-serif text-2xl font-black text-slate-800">No Matching Catch</h3>
                <p className="text-slate-500 mt-4 max-w-xs mx-auto font-medium">
                  Adjust your filters or search terms to browse other fresh selections.
                </p>
                <button
                  onClick={handleClearAllFilters}
                  className="mt-8 bg-[#0077B6] hover:bg-[#0096C7] text-white font-black text-sm py-4 px-10 rounded-2xl shadow-xl transition-all cursor-pointer active:scale-95"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {sortedAndFilteredProducts.map((p) => (
                  <div key={p.id} className="flex justify-center">
                    <ProductCard
                      product={p}
                      onAddToCart={onAddToCart}
                      onAddToWishlist={onAddToWishlist}
                      isWishlisted={wishlistIds.includes(p.id)}
                      theme="light"
                      onCardClick={onCardClick}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
