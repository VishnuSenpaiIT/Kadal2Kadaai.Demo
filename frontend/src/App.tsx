import React, { useState, useEffect } from 'react';
import { Waves, Anchor, Mail, Phone, MapPin, Sparkles, Send, Facebook, Twitter, Instagram, ShieldCheck } from 'lucide-react';

import { CartItem, SeafoodProduct, UserSession, Order, Customer, PaymentTransaction } from './types';
import { SEAFOOD_PRODUCTS } from './data';
import AdminView from './components/AdminView';

// Component Imports
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TopSellingSection from './components/TopSellingSection';
import TodayPurchasesSection from './components/TodayPurchasesSection';
import TrustSection from './components/TrustSection';
import ReviewsSection from './components/ReviewsSection';
import MarketplaceView from './components/MarketplaceView';
import CategoriesView from './components/CategoriesView';
import AboutView from './components/AboutView';
import ContactView from './components/ContactView';
import AuthModal from './components/AuthModal';
import ActiveDrawers from './components/ActiveDrawers';
import Logo from './components/Logo';
import ProductDetailModal from './components/ProductDetailModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Interface states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<SeafoodProduct | null>(null);

  // Cart & Wishlist persistence states
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<SeafoodProduct[]>([]);

  // User Authentication sessions storage (stored locally in state + localStorage)
  const [userSession, setUserSession] = useState<UserSession>({
    isAuthenticated: false
  });

  // Dynamic datasets for Admin Operations
  const [products, setProducts] = useState<SeafoodProduct[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [payments, setPayments] = useState<PaymentTransaction[]>([]);

  // Load cart, wishlist, session, and administrative state from localStorage if present
  useEffect(() => {
    const cachedCart = localStorage.getItem('k2k_cart');
    if (cachedCart) {
      try { setCartItems(JSON.parse(cachedCart)); } catch (e) { console.error(e); }
    }

    const cachedWish = localStorage.getItem('k2k_wishlist');
    if (cachedWish) {
      try { setWishlistItems(JSON.parse(cachedWish)); } catch (e) { console.error(e); }
    }

    const cachedSession = localStorage.getItem('k2k_session');
    if (cachedSession) {
      try { setUserSession(JSON.parse(cachedSession)); } catch (e) { console.error(e); }
    }

    // 1. Products index
    const cachedProducts = localStorage.getItem('k2k_products_v9');
    if (cachedProducts) {
      try {
        setProducts(JSON.parse(cachedProducts));
      } catch (e) {
        console.error(e);
      }
    } else {
      const initialProducts: SeafoodProduct[] = SEAFOOD_PRODUCTS.map(p => ({ 
        ...p, 
        stock: p.stock || (Math.floor(Math.random() * 80) + 20) 
      }));
      setProducts(initialProducts);
      localStorage.setItem('k2k_products_v9', JSON.stringify(initialProducts));
    }


    // 2. Orders index
    const cachedOrders = localStorage.getItem('k2k_orders');
    if (cachedOrders) {
      try {
        setOrders(JSON.parse(cachedOrders));
      } catch (e) {
        console.error(e);
      }
    } else {
      const initialOrders: Order[] = [
        {
          id: 'K2K-ORD-5192',
          date: '06/08/2026 • 10:30 AM',
          customerName: 'Srinivasa Raghavan',
          customerPhone: '9444012345',
          customerEmail: 'srinivasa@gmail.com',
          address: 'Plot No 14, 2nd Main St, Ram Nagar, Madipakkam',
          district: 'Chennai',
          locality: 'Madipakkam',
          items: [
            { productId: 'prod-seer-fish', name: 'King Seer Fish (Vanjaram)', price: 1199, quantity: 2, weight: '1kg', cut: 'Steaks / Slices' }
          ],
          subtotal: 2398,
          discount: 0,
          shippingFee: 0,
          total: 2398,
          slot: '6:30 AM - 8:30 AM (Prime Sourcing)',
          paymentStatus: 'Paid',
          orderStatus: 'Delivered',
          transactionId: 'TXN-8394109312',
          paymentMethod: 'UPI Transfer',
          notes: 'Deliver early please.'
        },
        {
          id: 'K2K-ORD-8392',
          date: '06/09/2026 • 08:00 AM',
          customerName: 'Varshini Priya',
          customerPhone: '9840294812',
          customerEmail: 'varshini@gmail.com',
          address: 'Flat 3B, Ceebros Heights, Adyar',
          district: 'Chennai',
          locality: 'Adyar',
          items: [
            { productId: 'prod-tiger-prawns', name: 'Jumbo Tiger Prawns', price: 849, quantity: 1, weight: '500g', cut: 'Peeled & Deveined' },
            { productId: 'prod-mud-crab', name: 'Blue Mud Crab (Kasimedu)', price: 749, quantity: 1, weight: '1kg (Large 2-3 pcs)', cut: 'Cleaned & Halved' }
          ],
          subtotal: 1598,
          discount: 160,
          shippingFee: 0,
          total: 1438,
          slot: '8:30 AM - 10:30 AM (Late Catch)',
          paymentStatus: 'Pending',
          orderStatus: 'Processing',
          transactionId: 'TXN-pending-8391',
          paymentMethod: 'Cash on Delivery',
          notes: 'Scales should be clean.'
        }
      ];
      setOrders(initialOrders);
      localStorage.setItem('k2k_orders', JSON.stringify(initialOrders));
    }

    // 3. Customers database
    const cachedCust = localStorage.getItem('k2k_customers');
    if (cachedCust) {
      try {
        setCustomers(JSON.parse(cachedCust));
      } catch (e) {
        console.error(e);
      }
    } else {
      const initialCustomers: Customer[] = [
        {
          id: 'cust-1',
          firstName: 'Srinivasa',
          lastName: 'Raghavan',
          name: 'Srinivasa Raghavan',
          contactNumber: '9444012345',
          email: 'srinivasa@gmail.com',
          district: 'Chennai',
          locality: 'Madipakkam',
          address: 'Plot No 14, 2nd Main St, Ram Nagar, Madipakkam',
          orderHistory: ['K2K-ORD-5192'],
          createdAt: '2026-06-08'
        },
        {
          id: 'cust-2',
          firstName: 'Varshini',
          lastName: 'Priya',
          name: 'Varshini Priya',
          contactNumber: '9840294812',
          email: 'varshini@gmail.com',
          district: 'Chennai',
          locality: 'Adyar',
          address: 'Flat 3B, Ceebros Heights, Adyar',
          orderHistory: ['K2K-ORD-8392'],
          createdAt: '2026-06-09'
        }
      ];
      setCustomers(initialCustomers);
      localStorage.setItem('k2k_customers', JSON.stringify(initialCustomers));
    }

    // 4. Payments database
    const cachedPayments = localStorage.getItem('k2k_payments');
    if (cachedPayments) {
      try {
        setPayments(JSON.parse(cachedPayments));
      } catch (e) {
        console.error(e);
      }
    } else {
      const initialPayments: PaymentTransaction[] = [
        {
          transactionId: 'TXN-8394109312',
          orderId: 'K2K-ORD-5192',
          customerName: 'Srinivasa Raghavan',
          amount: 2398,
          status: 'Successful',
          date: '2026-06-08',
          paymentMethod: 'UPI Transfer'
        },
        {
          transactionId: 'TXN-pending-8391',
          orderId: 'K2K-ORD-8392',
          customerName: 'Varshini Priya',
          amount: 1438,
          status: 'Pending',
          date: '2026-06-09',
          paymentMethod: 'Cash on Delivery'
        }
      ];
      setPayments(initialPayments);
      localStorage.setItem('k2k_payments', JSON.stringify(initialPayments));
    }
  }, []);

  // Sync state helpers
  const saveCart = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem('k2k_cart', JSON.stringify(items));
  };

  const saveWishlist = (items: SeafoodProduct[]) => {
    setWishlistItems(items);
    localStorage.setItem('k2k_wishlist', JSON.stringify(items));
  };

  // Add to Cart
  const handleAddToCart = (product: SeafoodProduct, weight: string, cut: string) => {
    const existingIndex = cartItems.findIndex(
      (item) =>
        item.product.id === product.id &&
        item.selectedWeight === weight &&
        item.selectedCut === cut
    );

    if (existingIndex > -1) {
      const copy = [...cartItems];
      copy[existingIndex].quantity += 1;
      saveCart(copy);
    } else {
      saveCart([...cartItems, { product, selectedWeight: weight, selectedCut: cut, quantity: 1 }]);
    }
  };

  // Edit Qty
  const handleUpdateCartQty = (productId: string, weight: string, cut: string, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(productId, weight, cut);
      return;
    }
    const next = cartItems.map((item) => {
      if (
        item.product.id === productId &&
        item.selectedWeight === weight &&
        item.selectedCut === cut
      ) {
        return { ...item, quantity: newQty };
      }
      return item;
    });
    saveCart(next);
  };

  // Remove single
  const handleRemoveCartItem = (productId: string, weight: string, cut: string) => {
    const next = cartItems.filter(
      (item) =>
        !(
          item.product.id === productId &&
          item.selectedWeight === weight &&
          item.selectedCut === cut
        )
    );
    saveCart(next);
  };

  // Clear Cart after checkouts
  const handleClearCart = () => {
    saveCart([]);
  };

  // Wishlist toggle helper
  const handleToggleWishlist = (product: SeafoodProduct) => {
    const exists = wishlistItems.some((item) => item.id === product.id);
    if (exists) {
      const filtered = wishlistItems.filter((item) => item.id !== product.id);
      saveWishlist(filtered);
    } else {
      saveWishlist([...wishlistItems, product]);
    }
  };

  const handleRemoveWishlistItem = (productId: string) => {
    const filtered = wishlistItems.filter((item) => item.id !== productId);
    saveWishlist(filtered);
  };

  const handleMoveWishlistToCart = (product: SeafoodProduct) => {
    handleAddToCart(product, product.availableWeights[0], product.availableCuts[0]);
    handleRemoveWishlistItem(product.id);
    setIsCartOpen(true);
  };

  // Dynamic mutations for Admin console
  const handleAddProduct = (newProd: SeafoodProduct) => {
    const updated = [newProd, ...products];
    setProducts(updated);
    localStorage.setItem('k2k_products_v9', JSON.stringify(updated));
  };

  const handleUpdateProduct = (updatedProd: SeafoodProduct) => {
    const updated = products.map(p => p.id === updatedProd.id ? updatedProd : p);
    setProducts(updated);
    localStorage.setItem('k2k_products_v9', JSON.stringify(updated));
  };

  const handleDeleteProduct = (productId: string) => {
    const updated = products.filter(p => p.id !== productId);
    setProducts(updated);
    localStorage.setItem('k2k_products_v9', JSON.stringify(updated));
  };

  const handleUpdateOrderStatus = (id: string, status: Order['orderStatus']) => {
    const updated = orders.map(o => {
      if (o.id === id) {
        let payStatus = o.paymentStatus;
        if (status === 'Delivered') payStatus = 'Paid';
        return { ...o, orderStatus: status, paymentStatus: payStatus };
      }
      return o;
    });
    setOrders(updated);
    localStorage.setItem('k2k_orders', JSON.stringify(updated));

    // Sync payments
    const updatedPayments = payments.map(p => {
      if (p.orderId === id) {
        let pStatus: PaymentTransaction['status'] = p.status;
        if (status === 'Delivered') pStatus = 'Successful';
        if (status === 'Cancelled') pStatus = 'Failed';
        return { ...p, status: pStatus };
      }
      return p;
    });
    setPayments(updatedPayments);
    localStorage.setItem('k2k_payments', JSON.stringify(updatedPayments));
  };

  const handleResetDatabase = () => {
    if (window.confirm("Restore system databases to demo initial settings? This overrides currently added order tests.")) {
      localStorage.removeItem('k2k_products');
      localStorage.removeItem('k2k_orders');
      localStorage.removeItem('k2k_customers');
      localStorage.removeItem('k2k_payments');
      window.location.reload();
    }
  };

  const handlePlaceOrder = (orderData: {
    customerName: string;
    customerPhone: string;
    shippingAddress: string;
    deliverySlot: string;
    notes: string;
    subtotal: number;
    discount: number;
    shippingFee: number;
    total: number;
  }) => {
    const orderId = `K2K-ORD-${Math.floor(Math.random() * 9000) + 1000}`;
    const txnId = orderId.replace('ORD', 'TXN') + `-${Math.floor(Math.random() * 9000) + 1000}`;
    
    const formattedDate = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    }).replace(',', ' •');

    const newOrder: Order = {
      id: orderId,
      customerName: orderData.customerName,
      customerPhone: orderData.customerPhone,
      customerEmail: userSession.email || `${orderData.customerName.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      address: orderData.shippingAddress,
      district: userSession.district || 'Chennai',
      locality: userSession.locality || 'Adyar',
      items: cartItems.map(item => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        weight: item.selectedWeight,
        cut: item.selectedCut
      })),
      subtotal: orderData.subtotal,
      discount: orderData.discount,
      shippingFee: orderData.shippingFee,
      total: orderData.total,
      date: formattedDate,
      slot: orderData.deliverySlot,
      paymentStatus: 'Pending',
      orderStatus: 'Pending',
      transactionId: txnId,
      paymentMethod: 'Cash on Delivery',
      notes: orderData.notes
    };

    // 1. Append order state
    const nextOrders = [newOrder, ...orders];
    setOrders(nextOrders);
    localStorage.setItem('k2k_orders', JSON.stringify(nextOrders));

    // 2. Subtract stocks from catalog live
    const nextProducts = products.map(p => {
      const purchased = cartItems.find(item => item.product.id === p.id);
      if (purchased) {
        const oldStock = p.stock || 50;
        return { ...p, stock: Math.max(0, oldStock - purchased.quantity) };
      }
      return p;
    });
    setProducts(nextProducts);
    localStorage.setItem('k2k_products_v9', JSON.stringify(nextProducts));

    // 3. Register Customer profile
    const existingCust = customers.find(c => c.contactNumber === orderData.customerPhone);
    let nextCustomers: Customer[];
    
    if (existingCust) {
      nextCustomers = customers.map(c => 
        c.contactNumber === orderData.customerPhone 
          ? { ...c, orderHistory: [...c.orderHistory, orderId] }
          : c
      );
    } else {
      const emailLower = userSession.email || `${orderData.customerName.toLowerCase().replace(/\s+/g, '')}@gmail.com`;
      const nameParts = orderData.customerName.split(' ');
      const newCust: Customer = {
        id: `cust-${Date.now()}`,
        firstName: nameParts[0] || 'Customer',
        lastName: nameParts.slice(1).join(' ') || '',
        name: orderData.customerName,
        contactNumber: orderData.customerPhone,
        email: emailLower,
        district: userSession.district || 'Chennai',
        locality: userSession.locality || 'Adyar',
        address: orderData.shippingAddress,
        orderHistory: [orderId],
        createdAt: new Date().toISOString().slice(0, 10)
      };
      nextCustomers = [newCust, ...customers];
    }
    setCustomers(nextCustomers);
    localStorage.setItem('k2k_customers', JSON.stringify(nextCustomers));

    // 4. Log the transaction ledger entry
    const newTxn: PaymentTransaction = {
      transactionId: txnId,
      orderId: orderId,
      customerName: orderData.customerName,
      amount: orderData.total,
      status: 'Pending',
      date: new Date().toISOString().slice(0, 10),
      paymentMethod: 'Cash on Delivery'
    };
    const nextPayments = [newTxn, ...payments];
    setPayments(nextPayments);
    localStorage.setItem('k2k_payments', JSON.stringify(nextPayments));
  };

  // Sign In / Sign Up callback actions
  const handleAuthSuccess = (newSession: UserSession) => {
    setUserSession(newSession);
    localStorage.setItem('k2k_session', JSON.stringify(newSession));
    setIsAuthOpen(false);
  };

  const handleSignOut = () => {
    const emptySession = { isAuthenticated: false };
    setUserSession(emptySession);
    localStorage.removeItem('k2k_session');
  };

  // Handle newsletter subscription
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for subscribing! Morning Harbor dispatch tables will be mailed to you every morning at 5:00 AM.");
    (e.target as HTMLFormElement).reset();
  };

  const wishlistIds = wishlistItems.map((item) => item.id);

  return (
    <div
      id="full-application-viewport"
      className="flex flex-col min-h-screen"
    >
      
      {/* Dynamic Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          // Auto scroll to top on tab transitions
          window.scrollTo({ top: 0, behavior: 'instant' });
        }}
        cartCount={cartItems.reduce((acc, curr) => acc + curr.quantity, 0)}
        wishlistCount={wishlistItems.length}
        onCartClick={() => setIsCartOpen(true)}
        onWishlistClick={() => setIsWishlistOpen(true)}
        onAuthClick={() => setIsAuthOpen(true)}
        userSession={userSession}
        onSignOut={handleSignOut}
        onSearch={(query) => {
          setSearchQuery(query);
          if (query.trim().length > 0 && activeTab !== 'marketplace') {
            setActiveTab('marketplace');
          }
        }}
      />

      {/* Primary Route Rendering */}
      <main id="main-content" className="flex-grow pt-28">
        {activeTab === 'home' && (
          <div id="home-view-wrapper" className="animate-fade-in">
            {/* Dynamic Breathtaking Hero section */}
            <Hero onExploreClick={() => { setActiveTab('marketplace'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
            
            {/* Top popular seamless infinite carousel banner (Pause on Hover) */}
            <TopSellingSection
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleToggleWishlist}
              wishlistIds={wishlistIds}
              setActiveTab={setActiveTab}
              products={products}
              onCardClick={(product) => setSelectedDetailProduct(product)}
            />

            {/* Today's Purchases live trading ticker (Pause on Hover) */}
            <TodayPurchasesSection
              onQuickAdd={handleAddToCart}
              onCardClick={(product) => setSelectedDetailProduct(product)}
            />

            {/* Premium Ocean Deep Section (Gradient flows through Trust and Reviews) */}
            <div id="premium-ocean-journey" className="bg-gradient-to-b from-[#0A192F] via-[#112240] to-[#1B4965] relative">
              {/* Feature Illustration cards detailing Direct/Clean inspections */}
              <TrustSection />

              {/* Testimonials aggregate ratings layout */}
              <ReviewsSection />
            </div>
          </div>
        )}

        {activeTab === 'marketplace' && (
          <div id="marketplace-view-wrapper" className="animate-fade-in">
            <MarketplaceView
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleToggleWishlist}
              wishlistIds={wishlistIds}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              products={products}
              onCardClick={(product) => setSelectedDetailProduct(product)}
            />
          </div>
        )}

        {activeTab === 'categories' && (
          <div id="categories-view-wrapper" className="animate-fade-in">
            <CategoriesView
              onCategorySelect={(catId) => {
                setSelectedCategory(catId);
                setActiveTab('marketplace');
                window.scrollTo({ top: 0, behavior: 'instant' });
              }}
              onAddToWishlist={handleToggleWishlist}
              wishlistIds={wishlistIds}
            />
          </div>
        )}

        {activeTab === 'about' && (
          <div id="about-view-wrapper" className="animate-fade-in">
            <AboutView />
          </div>
        )}

        {activeTab === 'contact' && (
          <div id="contact-view-wrapper" className="animate-fade-in">
            <ContactView />
          </div>
        )}

        {activeTab === 'admin' && userSession.isAdmin && (
          <div id="admin-view-wrapper" className="animate-fade-in">
            <AdminView
              products={products}
              orders={orders}
              customers={customers}
              payments={payments}
              categories={[
                { id: 'fish', label: 'Fresh Fish' },
                { id: 'prawns', label: 'Jumbo Prawns' },
                { id: 'crabs', label: 'Crabs & Mudcrabs' },
                { id: 'shellfish', label: 'Lobsters / Shellfish' },
                { id: 'dry-fish', label: 'Dry Fish' },
                { id: 'pure-water-fish', label: 'Pure Water Fish' },
                { id: 'fresh-water-fish', label: 'Fresh Water Fish' },
                { id: 'lake-water-fish', label: 'Lake Water Fish' },
                { id: 'frozen-fish', label: 'Frozen Fish' },
              ]}
              onAddProduct={handleAddProduct}
              onUpdateProduct={handleUpdateProduct}
              onDeleteProduct={handleDeleteProduct}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onResetDatabase={handleResetDatabase}
            />
          </div>
        )}
      </main>

      {/* WORLD-CLASS LUXURY FOOTER (Deep Navy Blue Theme matching reference) */}
      <footer id="app-footer-bar" className="bg-[#020617] text-slate-400 font-sans border-t border-white/5 relative z-10 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-12">
            
            {/* Col 1: Logo / Brand Description / Social */}
            <div className="lg:col-span-4 space-y-8">
              <div
                className="flex items-center space-x-3 cursor-pointer group"
                onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              >
                <Logo iconSize="lg" showText={true} variant="light" />
              </div>
              
              <p className="text-[13px] text-slate-400 leading-relaxed max-w-sm font-light">
                South India's premier digital seafood dock. Sourcing early dawn catches directly from coastal catamarans, packing with absolute cold chain integration.
              </p>


            </div>

            {/* Col 2: MARKETPLACE */}
            <div className="lg:col-span-2">
              <h3 className="text-[#00E5FF] text-[11px] font-black uppercase tracking-[0.25em] mb-10 font-mono">Marketplace</h3>
              <div className="w-8 h-[2px] bg-[#00E5FF]/30 -mt-8 mb-8" />
              <ul className="space-y-4 text-[13px] text-slate-400">
                <li><a href="#map" className="hover:text-[#00E5FF] transition-colors">Dawn Sourcing Map</a></li>
                <li><a href="#auctions" className="hover:text-[#00E5FF] transition-colors">Daily Bid Auctions</a></li>
                <li><a href="#processing" className="hover:text-[#00E5FF] transition-colors">Pristine Processing</a></li>
                <li><a href="#laboratory" className="hover:text-[#00E5FF] transition-colors">Gate Laboratory</a></li>
                <li><a href="#grids" className="hover:text-[#00E5FF] transition-colors">Fresh Catch Grids</a></li>
                <li><a href="#categories" className="hover:text-[#00E5FF] transition-colors">Category Cabinets</a></li>
              </ul>
            </div>

            {/* Col 3: SUPPORT & HELP */}
            <div className="lg:col-span-3">
              <h3 className="text-[#00E5FF] text-[11px] font-black uppercase tracking-[0.25em] mb-10 font-mono">Support & Help</h3>
              <div className="w-8 h-[2px] bg-[#00E5FF]/30 -mt-8 mb-8" />
              <ul className="space-y-4 text-[13px] text-slate-400">
                <li><a href="#contact" className="hover:text-[#00E5FF] transition-colors">Contact Command Desk</a></li>
                <li><a href="#faqs" className="hover:text-[#00E5FF] transition-colors">Pin Coverage FAQs</a></li>
                <li><a href="#tracking" className="hover:text-[#00E5FF] transition-colors">Live Box Tracking</a></li>
                <li><a href="#policies" className="hover:text-[#00E5FF] transition-colors">Cold-Return Policies</a></li>
                <li><a href="#cutoff" className="hover:text-[#00E5FF] transition-colors">Same Day Cut Times</a></li>
              </ul>
            </div>

            {/* Col 4: DIRECT DAWN MEMO */}
            <div className="lg:col-span-3 space-y-6">
              <div>
                <h3 className="text-[#00E5FF] text-[11px] font-black uppercase tracking-[0.25em] mb-10 font-mono">Direct Dawn Memo</h3>
                <div className="w-8 h-[2px] bg-[#00E5FF]/30 -mt-8 mb-8" />
                <p className="text-[12px] text-slate-400 font-light leading-relaxed mb-6">
                  Sign up to receive early morning daily auction alerts and live catamaran catalog discounts.
                </p>
                
                <form onSubmit={handleNewsletterSubmit} className="relative group">
                  <div className="flex items-center bg-slate-900/50 border border-white/20 rounded-xl overflow-hidden focus-within:border-[#00E5FF]/50 transition-all">
                    <div className="pl-4 text-slate-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      placeholder="name@email.com"
                      className="w-full text-sm px-4 py-4 bg-transparent text-white placeholder-slate-600 focus:outline-none"
                    />
                    <div className="pr-2">
                      <button
                        type="submit"
                        className="p-2.5 bg-[#00B4D8] hover:bg-[#00E5FF] text-white rounded-lg transition-all shadow-lg shadow-cyan-500/20 active:scale-95 cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              <div className="flex flex-col space-y-3 pt-2">
                <span className="flex items-center gap-3 text-[12px] text-slate-500 group cursor-pointer hover:text-[#00E5FF] transition-colors font-mono">
                  <Phone className="w-4 h-4 text-[#00E5FF] group-hover:scale-110 transition-transform" /> 
                  <span>Support Core: <span className="font-bold">+91 90050 40030</span></span>
                </span>
              </div>
            </div>

          </div>

          {/* Bottom Bar: Copyrights and Terms */}
          <div className="border-t border-white/5 mt-20 pt-10 flex flex-col md:flex-row justify-between items-center text-[11px] text-slate-500 gap-6">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
              <span className="font-medium uppercase tracking-tight">© 2026 Kadal 2 Kadaai Foodworks Private Limited</span>
              <div className="flex space-x-6">
                <a href="#privacy" className="hover:text-slate-300 transition-colors">Privacy Policies</a>
                <span className="text-slate-800">•</span>
                <a href="#terms" className="hover:text-slate-300 transition-colors">Terms of Sourcing</a>
              </div>
            </div>

            {/* Verification Badge */}
            <div className="flex items-center space-x-2 bg-slate-900/60 border border-white/5 px-4 py-2 rounded-lg">
              <ShieldCheck className="w-4 h-4 text-[#00E5FF]" />
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-[#00E5FF]">Dual Gate Safe SSL Secured</span>
            </div>
          </div>
        </div>
      </footer>


      {/* Floating Dialog Modals and slide out panels */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      <ProductDetailModal
        product={selectedDetailProduct}
        isOpen={selectedDetailProduct !== null}
        onClose={() => setSelectedDetailProduct(null)}
        onAddToCart={handleAddToCart}
        onAddToWishlist={handleToggleWishlist}
        isWishlisted={selectedDetailProduct ? wishlistIds.includes(selectedDetailProduct.id) : false}
      />

      <ActiveDrawers
        isCartOpen={isCartOpen}
        onCartClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateCartQty={handleUpdateCartQty}
        onRemoveCartItem={handleRemoveCartItem}
        
        isWishlistOpen={isWishlistOpen}
        onWishlistClose={() => setIsWishlistOpen(false)}
        wishlistItems={wishlistItems}
        onRemoveWishlistItem={handleRemoveWishlistItem}
        onMoveToCart={handleMoveWishlistToCart}
        
        userSession={userSession}
        onTriggerAuth={() => setIsAuthOpen(true)}
        onClearCart={handleClearCart}
        onPlaceOrder={handlePlaceOrder}
      />

    </div>
  );
}
