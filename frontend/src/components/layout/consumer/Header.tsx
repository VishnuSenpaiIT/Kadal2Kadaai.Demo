'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, ShoppingCart, Bell, User, Heart, LogOut } from 'lucide-react';
import { Container } from '../shared/Container';
import { useCart } from '@/shared/api/hooks/useCart';
import { useAuth } from '@/providers/AuthProvider';

export function ConsumerHeader() {
  const { data: cart } = useCart();
  const { isAuthenticated, logout, user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartCount = cart?.total_items || 0;

  return (
    <header className="sticky top-0 z-sticky w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border shadow-sm">
      <Container className="flex h-20 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-heading text-h4 font-bold text-primary-900 tracking-tight">Kadal2Kadaai</span>
          </Link>
          
          {/* Location Selector */}
          <button className="hidden md:flex items-center gap-2 text-bodySmall text-muted-foreground hover:text-primary transition-colors">
            <MapPin className="h-4 w-4" />
            <span>Select Location</span>
          </button>
        </div>

        {/* Search */}
        <div className="hidden lg:flex flex-1 max-w-xl px-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search fresh seafood, vendors..." 
              className="w-full h-11 pl-10 pr-4 rounded-full border border-input bg-muted/30 focus:bg-background focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all outline-none"
            />
          </div>
        </div>

        {/* Actions & Navigation */}
        <div className="flex items-center gap-6">
          <nav className="hidden md:flex items-center gap-6 text-bodyMedium font-medium">
            <Link href="/categories" className="text-foreground hover:text-primary transition-colors">Categories</Link>
            <Link href="/about" className="text-foreground hover:text-primary transition-colors">About Us</Link>
          </nav>

          <div className="flex items-center gap-4 border-l border-border pl-6">
            <button className="p-2 text-foreground hover:text-primary transition-colors relative">
              <Heart className="h-5 w-5" />
            </button>
            <Link href="/cart" className="p-2 text-foreground hover:text-primary transition-colors relative block">
              <ShoppingCart className="h-5 w-5" />
              {mounted && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-accent-500 text-[10px] font-bold text-white shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>
            <button className="p-2 text-foreground hover:text-primary transition-colors">
              <Bell className="h-5 w-5" />
            </button>
            
            {mounted && (
              isAuthenticated ? (
                <>
                  <Link href="/profile" className="flex items-center gap-2 p-2 text-foreground hover:text-primary transition-colors" title="My Profile">
                    <User className="h-5 w-5" />
                    <span className="hidden sm:inline-block text-sm font-medium">{user?.first_name}</span>
                  </Link>
                  <button onClick={() => { logout(); window.location.href = '/login'; }} className="flex items-center gap-2 p-2 text-foreground hover:text-destructive transition-colors" title="Log Out">
                    <LogOut className="h-5 w-5" />
                    <span className="hidden sm:inline-block text-sm font-medium">Log Out</span>
                  </button>
                </>
              ) : (
                <Link href="/login" className="flex items-center gap-2 p-2 text-foreground hover:text-primary transition-colors">
                  <User className="h-5 w-5" />
                  <span className="hidden sm:inline-block text-sm font-medium">Log In</span>
                </Link>
              )
            )}
          </div>
        </div>
      </Container>
    </header>
  );
}
