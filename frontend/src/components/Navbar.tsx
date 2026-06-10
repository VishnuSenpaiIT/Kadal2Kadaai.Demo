import React, { useState, useEffect } from 'react';
import { ShoppingBag, Heart, Search, User, LogOut, Menu, X } from 'lucide-react';
import { UserSession } from '../types';
import Logo from './Logo';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
  wishlistCount: number;
  onCartClick: () => void;
  onWishlistClick: () => void;
  onAuthClick: () => void;
  userSession: UserSession;
  onSignOut: () => void;
  onSearch: (query: string) => void;
}

export default function Navbar({
  activeTab,
  setActiveTab,
  cartCount,
  wishlistCount,
  onCartClick,
  onWishlistClick,
  onAuthClick,
  userSession,
  onSignOut,
  onSearch,
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
    if (activeTab !== 'marketplace') {
      setActiveTab('marketplace');
    }
  };

  const navItems = [
    { id: 'home', label: 'Homepage' },
    { id: 'marketplace', label: 'Marketplace' },
    ...(userSession.isAdmin ? [{ id: 'admin', label: 'Admin Deck' }] : [])
  ];

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-white/[0.08] bg-[#0A192F]/95 backdrop-blur-xl ${
        isScrolled ? 'h-20 shadow-lg' : 'h-24'
      }`}
    >
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-full">
          
          {/* LEFT: Branded Logo perfectly placed inside the logo brand place */}
          <div
            id="navbar-logo-section"
            className="flex items-center space-x-3 cursor-pointer group shrink-0"
            onClick={() => { setActiveTab('home'); setMobileMenuOpen(false); }}
          >
            <Logo iconSize={isScrolled ? 'sm' : 'md'} showText={true} />
          </div>

          {/* RIGHT SIDE: Navigation Links & Actions aligned together */}
          <div className="flex items-center space-x-3 lg:space-x-6">
            
            {/* Desktop and Mobile Actions */}
            <div id="navbar-actions-section" className="flex items-center space-x-2 sm:space-x-4">
              
              {/* Desktop Segmented Capsule Navigation Control */}
              <nav id="desktop-nav-menu" className="hidden lg:flex items-center bg-white/5 backdrop-blur-md border border-white/5 p-1 rounded-xl shadow-md">
                {navItems.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      id={`nav-link-${item.id}`}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`relative font-sans text-[11px] uppercase tracking-wider py-1.5 px-4 focus:outline-none transition-all duration-300 rounded-lg cursor-pointer ${
                        isActive 
                          ? 'bg-[#112240] text-[#00B4D8] border border-[#00B4D8]/20 font-extrabold shadow-sm' 
                          : 'text-slate-100 hover:text-white font-bold'
                      }`}
                    >
                      <span>{item.label === 'Homepage' ? 'HOME PAGE' : item.label.toUpperCase()}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Action Buttons Group (Search, Wishlist, Cart) */}
              <div className="flex items-center space-x-1 sm:space-x-2 pl-2">
                {/* Search Button (Triggers global search overlay) */}
                <button
                  id="search-trigger-btn"
                  onClick={() => setSearchOpen(!searchOpen)}
                  className={`p-1.5 rounded-lg transition-all focus:outline-none ${
                    searchOpen 
                      ? 'text-[#00B4D8] bg-white/10' 
                      : 'text-slate-100 hover:text-white hover:bg-white/5'
                  }`}
                  title="Search Catch"
                >
                  <Search className="w-5 h-5" />
                </button>

                {/* Wishlist Button */}
                <button
                  id="wishlist-trigger-btn"
                  onClick={onWishlistClick}
                  className="relative p-1.5 text-slate-100 hover:text-white rounded-lg hover:bg-white/5 transition-all focus:outline-none"
                  title="View Wishlist"
                >
                  <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'fill-rose-500 text-rose-500' : 'text-slate-100'}`} />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-mono text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                      {wishlistCount}
                    </span>
                  )}
                </button>

                {/* Cart Button */}
                <button
                  id="cart-trigger-btn"
                  onClick={onCartClick}
                  className="relative p-1.5 text-slate-100 hover:text-white rounded-lg hover:bg-white/5 transition-all focus:outline-none"
                  title="View Cart"
                >
                  <ShoppingBag className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#00B4D8] text-white font-mono text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>

              {/* Auth Action */}
              {userSession.isAuthenticated ? (
                <div id="logged-in-user-badge" className="flex items-center space-x-1.5 sm:space-x-2 bg-white/10 rounded-full py-1 pl-2.5 pr-1.5 border border-white/10">
                  <div className="w-6 h-6 rounded-full bg-[#00B4D8] flex items-center justify-center text-white font-bold text-xs uppercase">
                    {userSession.username?.slice(0, 2) || 'U'}
                  </div>
                  <span className="text-xs font-medium text-white hidden sm:block max-w-[80px] truncate">
                    {userSession.username}
                  </span>
                  <button
                    id="sign-out-btn"
                    onClick={onSignOut}
                    className="p-1 text-slate-300 hover:text-rose-400 rounded-full hover:bg-white/10 transition-colors focus:outline-none"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  id="sign-up-nav-trigger-btn"
                  onClick={onAuthClick}
                  className="bg-gradient-to-r from-[#00B4D8] to-blue-600 hover:from-[#48CAE4] hover:to-blue-500 text-white font-sans text-xs font-bold px-4 py-2 rounded-full shadow-lg transition-all hover:scale-103 focus:outline-none cursor-pointer"
                >
                  Sign In
                </button>
              )}

              {/* Hamburger Button (Mobile Menu) */}
              <button
                id="mobile-menu-hamburger-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-1.5 text-slate-100 hover:text-white focus:outline-none hover:bg-white/10 rounded-lg transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

            </div>
          </div>
        </div>
      </div>

      {/* Universal/Global Search Overlay Dropdown for All Screens */}
      {searchOpen && (
        <div id="global-search-bar" className="absolute top-full left-0 right-0 bg-[#0A192F]/98 border-b border-white/[0.08] px-4 py-3 sm:py-4 shadow-2xl animate-fade-in z-42">
          <div className="max-w-2xl mx-auto flex items-center gap-3">
            <form onSubmit={handleSearchSubmit} className="relative flex-1 flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-[#00B4D8]" />
              <input
                id="search-input-global"
                type="text"
                autoFocus
                placeholder="Search fresh catches (crabs, prawns, Seer fish)..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  onSearch(e.target.value);
                }}
                className="w-full bg-white/5 text-white placeholder-gray-400 text-xs sm:text-sm rounded-xl py-2 sm:py-2.5 pl-10 pr-10 border border-white/10 focus:outline-none focus:ring-1 focus:ring-[#00B4D8] focus:bg-white/10 transition-all font-sans"
              />
              {searchQuery && (
                <button 
                  type="button" 
                  onClick={() => { setSearchQuery(''); onSearch(''); }}
                  className="absolute right-3 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>
            <button
              type="button"
              onClick={() => { setSearchOpen(false); }}
              className="text-gray-400 hover:text-white text-xs font-semibold uppercase tracking-wider font-sans whitespace-nowrap bg-white/5 py-2 px-3 rounded-lg border border-white/5 hover:bg-white/10"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          className="lg:hidden bg-[#0A192F]/98 border-b border-white/10 absolute top-full left-0 right-0 py-6 px-6 space-y-4 shadow-2xl transition-all"
        >
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-link-${item.id}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left font-sans text-base font-semibold py-2.5 px-3 rounded-lg transition-all flex items-center justify-between ${
                    isActive
                      ? 'bg-[#112240] text-[#00B4D8] border-l-4 border-[#00B4D8] font-bold'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
          
          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-gray-400">Tamil Nadu Catch Dispatch</span>
            <span className="text-xs font-mono text-[#00B4D8] font-bold bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-900/40">★ 100% FRESH</span>
          </div>
        </div>
      )}
    </header>
  );
}
