'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, MapPin, ShoppingCart, Bell, User, Heart, LogOut, Menu, X } from 'lucide-react';
import { Container } from '../shared/Container';
import { useCart } from '@/shared/api/hooks/useCart';
import { useAuth } from '@/providers/AuthProvider';
import { useLocation } from '@/providers/LocationProvider';
import { LocationPicker } from './LocationPicker';

export function ConsumerHeader() {
  const pathname = usePathname();
  const { data: cart } = useCart();
  const { isAuthenticated, logout, user } = useAuth();
  const { location, setLocationModalOpen } = useLocation();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartCount = cart?.total_items || 0;

  const navItems = [
    { label: 'Home', href: '/', active: pathname === '/' },
    { label: 'Shop', href: '/products', active: pathname.startsWith('/products') || pathname.startsWith('/categories') },
    { label: 'About', href: '/about', active: pathname.startsWith('/about') },
    { label: 'Track Order', href: '/orders', active: pathname.startsWith('/orders') },
    { 
      label: 'Account', 
      href: isAuthenticated ? '/profile' : '/login', 
      active: pathname.startsWith('/profile') || pathname.startsWith('/login') || pathname.startsWith('/register') 
    },
  ];

  return (
    <header 
      className={`sticky top-0 z-50 w-full transition-all duration-300 bg-white/95 border-b border-slate-200/80 backdrop-blur-md shadow-sm ${
        isScrolled ? 'py-1' : 'py-2'
      }`}
    >
      <Container className="flex items-center justify-between">
        
        {/* Left: Logo & Brand */}
        <Link href="/" className="flex items-center gap-2 md:gap-3 group shrink-0">
          <div className={`rounded-full border border-slate-200 bg-white p-0.5 shadow-sm transform group-hover:scale-105 transition-all duration-300 overflow-hidden flex items-center justify-center ${
            isScrolled 
              ? 'w-11 h-11 md:w-12 md:h-12' 
              : 'w-14 h-14 md:w-16 md:h-16'
          }`}>
            <img 
              src="/logo_croped.jpeg" 
              alt="Kadal 2 Kadaai Logo" 
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="flex flex-col transition-all duration-300">
            <span className={`font-heading font-black text-slate-900 tracking-wider leading-none transition-all duration-300 ${
              isScrolled 
                ? 'text-xs md:text-sm' 
                : 'text-sm md:text-base'
            }`}>
              KADAL<span className="text-[1.2em] leading-none">2</span>KADAAI
            </span>
            <span className={`font-bold text-sky-600 tracking-widest leading-none transition-all duration-300 ${
              isScrolled 
                ? 'text-[7px] md:text-[8px] mt-0.5' 
                : 'text-[9px] md:text-[10px] mt-1'
            }`}>
              CHENNAI FISH MARKET · ALL INDIA
            </span>
          </div>
        </Link>
 
        {/* Middle: Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1.5">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                item.active
                  ? 'text-[#0077b6] bg-sky-50 border border-sky-100/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              {item.label}
              {item.active && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#0077b6]" />
              )}
            </Link>
          ))}
        </nav>
 
        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          {/* Location Badge (Desktop) */}
          <button 
            onClick={() => setLocationModalOpen(true)}
            className="hidden md:flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200 transition-all font-semibold"
          >
            <MapPin className="h-4 w-4 text-rose-500 fill-rose-500/10 shrink-0" />
            <span>{location.city ? location.city : location.pincode ? location.pincode : 'Select Location'}</span>
          </button>

          {/* Cart Button */}
          <Link 
            href="/cart" 
            className="h-10 w-10 text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all flex items-center justify-center relative group"
          >
            <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform" />
            {mounted && cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 h-5 w-5 flex items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-md animate-in zoom-in">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Logout Button (Desktop) */}
          {mounted && isAuthenticated && (
            <button 
              onClick={() => { logout(); window.location.href = '/login'; }} 
              className="hidden lg:flex h-10 w-10 text-slate-500 hover:text-rose-500 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-100 rounded-xl transition-all items-center justify-center" 
              title="Log Out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden h-10 w-10 text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all flex items-center justify-center"
            aria-label="Toggle Mobile Menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

      </Container>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-200/80 shadow-2xl py-4 px-6 flex flex-col gap-4 animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  item.active
                    ? 'text-[#0077b6] bg-sky-50 border border-sky-100/80'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <span>{item.label}</span>
                {item.active && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0077b6]" />
                )}
              </Link>
            ))}
          </nav>

          <hr className="border-slate-100" />

          {/* Mobile Location Badge (preserves location modal click) */}
          <button 
            onClick={() => {
              setIsMobileMenuOpen(false);
              setLocationModalOpen(true);
            }}
            className="flex items-center justify-between px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl w-full text-left"
          >
            <span className="text-sm font-semibold text-slate-600 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-rose-500 shrink-0" />
              <span>Location</span>
            </span>
            <span className="text-sm font-bold text-slate-800">
              {location.city ? location.city : location.pincode ? location.pincode : 'Select Location'}
            </span>
          </button>

          {/* Mobile Logout */}
          {mounted && isAuthenticated && (
            <button 
              onClick={() => { 
                setIsMobileMenuOpen(false); 
                logout(); 
                window.location.href = '/login'; 
              }} 
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-600 text-sm font-bold transition-all"
            >
              <LogOut className="h-4 w-4" />
              <span>Log Out</span>
            </button>
          )}
        </div>
      )}
      <LocationPicker />
    </header>
  );
}
