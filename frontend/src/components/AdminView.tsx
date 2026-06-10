import React, { useState, useMemo } from 'react';
import { 
  BarChart3, Plus, Edit2, Trash2, ShoppingBag, Users, CreditCard, Tags, 
  Search, ShieldAlert, CheckCircle, Clock, X, SlidersHorizontal, ArrowUpRight,
  TrendingUp, Compass, Heart, Settings, AlertCircle, RefreshCw
} from 'lucide-react';
import { SeafoodProduct, Order, Customer, PaymentTransaction, SeafoodCategory } from '../types';

interface AdminViewProps {
  products: SeafoodProduct[];
  orders: Order[];
  customers: Customer[];
  payments: PaymentTransaction[];
  categories: { id: string; label: string }[];
  onAddProduct: (product: SeafoodProduct) => void;
  onUpdateProduct: (product: SeafoodProduct) => void;
  onDeleteProduct: (productId: string) => void;
  onUpdateOrderStatus: (id: string, status: Order['orderStatus']) => void;
  onResetDatabase: () => void;
}

export default function AdminView({
  products,
  orders,
  customers,
  payments,
  categories,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onResetDatabase,
}: AdminViewProps) {
  const [activeTab, setActiveTab] = useState<'kpi' | 'products' | 'orders' | 'customers' | 'payments' | 'categories'>('products');
  
  // Searching & Selection in Admin Panel
  const [productSearch, setProductSearch] = useState('');
  const [prawnCrabFilter, setPrawnCrabFilter] = useState<'all' | 'prawns' | 'crabs' | 'other'>('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [paymentSearch, setPaymentSearch] = useState('');

  // Selected details overlay modals
  const [viewedOrder, setViewedOrder] = useState<Order | null>(null);
  const [viewedCustomer, setViewedCustomer] = useState<Customer | null>(null);

  // Add / Edit Product modal state
  const [editingProduct, setEditingProduct] = useState<SeafoodProduct | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);

  // Form states for creating / editing product
  const [formName, setFormName] = useState('');
  const [formTamilName, setFormTamilName] = useState('');
  const [formCategory, setFormCategory] = useState<SeafoodCategory>('fish');
  const [formPrice, setFormPrice] = useState(499);
  const [formStock, setFormStock] = useState(50);
  const [formTag, setFormTag] = useState('Dawn Fresh');
  const [formBadge, setFormBadge] = useState('Caught 2 hours ago');
  const [formDescription, setFormDescription] = useState('');
  const [formImage, setFormImage] = useState('https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=300&q=80');

  // Initializing for Add
  const openAddProductModal = () => {
    setIsAddMode(true);
    setFormName('');
    setFormTamilName('');
    setFormCategory('fish');
    setFormPrice(499);
    setFormStock(50);
    setFormTag('Dawn Fresh');
    setFormBadge('Caught 2 hours ago');
    setFormDescription('World-class sustainable seafood catch.');
    setFormImage('https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=300&q=80');
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  // Initializing for Edit
  const openEditProductModal = (prod: SeafoodProduct) => {
    setIsAddMode(false);
    setEditingProduct(prod);
    setFormName(prod.name);
    setFormTamilName(prod.tamilName || '');
    setFormCategory(prod.category);
    setFormPrice(prod.price);
    setFormStock(prod.stock || 50);
    setFormTag(prod.tag || 'Dawn Fresh');
    setFormBadge(prod.freshnessBadge);
    setFormDescription(prod.description);
    setFormImage(prod.image);
    setIsProductModalOpen(true);
  };

  const handleProductFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName) {
      alert("Please specify a Catch Title.");
      return;
    }

    const uniqueId = isAddMode ? `prod-${Date.now()}` : (editingProduct?.id || '');

    const compiledProduct: SeafoodProduct = {
      id: uniqueId,
      name: formName,
      tamilName: formTamilName || undefined,
      category: formCategory,
      price: Number(formPrice),
      stock: Number(formStock),
      image: formImage || 'https://images.unsplash.com/photo-1534080391025-a87bdf19d5d8?auto=format&fit=crop&w=300&q=80',
      rating: isAddMode ? 4.8 : (editingProduct?.rating || 4.8),
      reviewsCount: isAddMode ? 5 : (editingProduct?.reviewsCount || 10),
      tag: formTag || undefined,
      freshnessBadge: formBadge || 'Verified Clean SWAB',
      description: formDescription,
      availableWeights: editingProduct?.availableWeights || ['500g', '1kg', '2kg'],
      availableCuts: editingProduct?.availableCuts || ['Cleaned & Gutted', 'Whole', 'Slices / Steaks'],
      isPopular: editingProduct?.isPopular || false
    };

    if (isAddMode) {
      onAddProduct(compiledProduct);
      alert("Catch item successfully introduced to storefront!");
    } else {
      onUpdateProduct(compiledProduct);
      alert("Catch item successfully calibrated!");
    }

    setIsProductModalOpen(false);
  };

  const handleDeleteClick = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}" from catalog?`)) {
      onDeleteProduct(id);
    }
  };

  // KPI Calculations
  const metrics = useMemo(() => {
    const totalRevenue = payments
      .filter(p => p.status === 'Successful')
      .reduce((sum, item) => sum + item.amount, 0);

    const activeOrdersCount = orders.filter(o => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled').length;

    // Filter prawns and crabs specific calculations for direct varieties metrics
    const prawns = products.filter(p => p.category === 'prawns');
    const crabs = products.filter(p => p.category === 'crabs');

    return {
      revenue: totalRevenue,
      customersLimit: customers.length,
      ordersLimit: orders.length,
      activeOrdersCount,
      prawnsCount: prawns.length,
      crabsCount: crabs.length,
      totalStockKg: products.reduce((acc, curr) => acc + (curr.stock || 50), 0)
    };
  }, [products, orders, customers, payments]);


  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
                            p.tamilName?.toLowerCase().includes(productSearch.toLowerCase()) ||
                            p.category.toLowerCase().includes(productSearch.toLowerCase());
      
      const categoryMatches = 
        prawnCrabFilter === 'all' ? true :
        prawnCrabFilter === 'prawns' ? p.category === 'prawns' :
        prawnCrabFilter === 'crabs' ? p.category === 'crabs' :
        p.category !== 'prawns' && p.category !== 'crabs';

      return matchesSearch && categoryMatches;
    });
  }, [products, productSearch, prawnCrabFilter]);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const q = orderSearch.toLowerCase();
      return (
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q) ||
        o.orderStatus.toLowerCase().includes(q)
      );
    });
  }, [orders, orderSearch]);

  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const q = customerSearch.toLowerCase();
      return (
        c.firstName.toLowerCase().includes(q) ||
        c.lastName.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.contactNumber.includes(q) ||
        c.district.toLowerCase().includes(q) ||
        c.locality.toLowerCase().includes(q)
      );
    });
  }, [customers, customerSearch]);

  const filteredPayments = useMemo(() => {
    return payments.filter(p => {
      const q = paymentSearch.toLowerCase();
      return (
        p.transactionId.toLowerCase().includes(q) ||
        p.customerName.toLowerCase().includes(q) ||
        p.orderId.toLowerCase().includes(q) ||
        p.paymentMethod.toLowerCase().includes(q) ||
        p.status.toLowerCase().includes(q)
      );
    });
  }, [payments, paymentSearch]);

  return (
    <div id="admin-module-root" className="bg-[#0A192F] min-h-screen py-8 text-left text-[#D9E2EC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block with Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-6 mb-8">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#00B4D8] font-extrabold bg-[#112240] border border-[#00B4D8]/20 px-3 py-1 rounded-full">
              System Admin Console
            </span>
            <h1 className="font-serif text-3xl md:text-4xl font-black text-white uppercase mt-3">
              Fleet Operations Deck
            </h1>
            <p className="font-sans text-xs sm:text-sm text-slate-400 mt-1">
              Configure Live Maritime Stocks, Track Dawn Harbor Ingresses, & Authorise Logistics.
            </p>
          </div>

          <div className="flex items-center space-x-3 self-start md:self-auto">
            <button
              onClick={onResetDatabase}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-300 text-xs font-bold rounded-xl flex items-center gap-2 hover:shadow-sm cursor-pointer transition focus:outline-none"
              title="Restores the initial demo dataset for review"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Restore Demo Data</span>
            </button>
            <button
              onClick={openAddProductModal}
              className="px-5 py-2.5 bg-white hover:bg-slate-100 text-[#0A192F] text-xs font-bold rounded-xl flex items-center gap-2 shadow cursor-pointer transition focus:outline-none"
            >
              <Plus className="w-4 h-4" />
              <span>Add Fresh Catch</span>
            </button>
          </div>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          
          <div className="bg-[#112240] p-5 rounded-2xl border border-white/5 shadow-sm flex items-start space-x-3.5 relative overflow-hidden">
            <div className="p-3 bg-cyan-950 text-[#00B4D8] rounded-xl border border-[#00B4D8]/20">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-405 text-slate-400 font-bold uppercase tracking-wider font-sans block">Total Revenue</span>
              <span className="text-xl sm:text-2xl font-serif font-black text-white mt-1 block">₹{metrics.revenue}</span>
              <span className="text-[10px] text-emerald-400 font-bold mt-1 block font-mono">⚡ 100% Secure Settled</span>
            </div>
            <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/5 rounded-full blur-xl" />
          </div>

          <div className="bg-[#112240] p-5 rounded-2xl border border-white/5 shadow-sm flex items-start space-x-3.5 relative overflow-hidden">
            <div className="p-3 bg-indigo-950 text-indigo-450 text-indigo-300 rounded-xl border border-indigo-500/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-sans block">Dynamic Orders</span>
              <span className="text-xl sm:text-2xl font-serif font-black text-white mt-1 block">{metrics.ordersLimit}</span>
              <span className="text-[10px] text-indigo-400 font-medium mt-1 block font-mono">({metrics.activeOrdersCount} Pending)</span>
            </div>
            <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/5 rounded-full blur-xl" />
          </div>

          <div className="bg-[#112240] p-5 rounded-2xl border border-white/5 shadow-sm flex items-start space-x-3.5 relative overflow-hidden">
            <div className="p-3 bg-amber-950 text-amber-505 text-amber-300 rounded-xl border border-amber-500/20">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-sans block">Total Customers</span>
              <span className="text-xl sm:text-2xl font-serif font-black text-white mt-1 block">{metrics.customersLimit}</span>
              <span className="text-[10px] text-amber-400 font-medium mt-1 block font-mono">Chennai Districts</span>
            </div>
            <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-full blur-xl" />
          </div>

          <div className="bg-[#112240] p-5 rounded-2xl border border-white/5 shadow-sm flex items-start space-x-3.5 relative overflow-hidden">
            <div className="p-3 bg-rose-950 text-rose-300 rounded-xl border border-rose-500/20">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-sans block">Shellfish Stock</span>
              <span className="text-xl sm:text-2xl font-serif font-black text-white mt-1 block">{metrics.totalStockKg} kg</span>
              <span className="text-[10px] text-rose-400 font-semibold mt-1 block font-mono">({metrics.prawnsCount} P & {metrics.crabsCount} C)</span>
            </div>
            <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/5 rounded-full blur-xl" />
          </div>

        </div>

        {/* WORKSPACE NAVIGATION DRAWER */}
        <div className="flex flex-wrap border-b border-white/5 gap-2 mb-6">
          {[
            { id: 'products', label: 'Products & Varieties', icon: ShoppingBag },
            { id: 'orders', label: 'Order Logistics', icon: ShoppingBag, count: metrics.activeOrdersCount },
            { id: 'customers', label: 'Customer Registrar', icon: Users },
            { id: 'payments', label: 'Financial Transactions', icon: CreditCard },
            { id: 'categories', label: 'Categories Matrix', icon: Tags },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-5 text-xs font-bold uppercase tracking-wider flex items-center space-x-2 border-b-2 transition focus:outline-none cursor-pointer ${
                  isActive
                    ? 'border-[#00B4D8] text-[#00B4D8] font-extrabold bg-[#112240] rounded-t-xl'
                    : 'border-transparent text-slate-400 hover:text-white hover:border-white/20'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="bg-[#00B4D8] text-[#0A192F] font-mono text-[9px] px-1.5 py-0.5 rounded-full animate-pulse">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* CONTAINER SHEETS BASED ON TABS */}
        <div className="bg-[#112240] text-white rounded-3xl border border-white/5 shadow-sm p-6 mb-16">
          
          {/* ===================== TAB 1: PRODUCT MANAGEMENT ===================== */}
          {activeTab === 'products' && (
            <div id="admin-sheet-products" className="space-y-6">
              
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="text-left">
                  <h2 className="font-serif text-lg font-black uppercase text-slate-900">Seafood Stock Registry</h2>
                  <p className="text-xs text-slate-500">List prawn varieties, crabs, and manage weight quantities or pricing.</p>
                </div>

                {/* Sub filter tabs specific to user request: Prawns & Crabs list, etc. */}
                <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 scale-95 origin-right">
                  {[
                    { id: 'all', label: 'All Catalog' },
                    { id: 'prawns', label: '🦐 Prawns Varieties' },
                    { id: 'crabs', label: '🦀 Crabs Varieties' },
                    { id: 'other', label: 'Others' }
                  ].map((subFilter) => (
                    <button
                      key={subFilter.id}
                      onClick={() => setPrawnCrabFilter(subFilter.id as any)}
                      className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all focus:outline-none cursor-pointer ${
                        prawnCrabFilter === subFilter.id
                          ? 'bg-white text-slate-900 shadow font-extrabold'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {subFilter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* SEARCH FILTERS */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products by Title, Tamil Name, Category..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full text-xs font-sans border border-slate-200 hover:border-slate-300 focus:border-cyan-500 px-4 py-3 pl-10 rounded-xl focus:outline-none"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>

              {/* TABLE LISTING */}
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-450 text-[10px] tracking-wider uppercase font-extrabold border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4">Catch Image & Info</th>
                      <th className="py-3.5 px-4">Tamil Name</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4 text-right">Price per kg</th>
                      <th className="py-3.5 px-4 text-center">Available Stock</th>
                      <th className="py-3.5 px-4 text-center">Rating & Reviews</th>
                      <th className="py-3.5 px-4 text-center">Action Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-400 font-light text-xs">
                          No matching catches. Introduce a brand new seafood landing!
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((p) => {
                        const isStockLow = (p.stock || 50) < 15;
                        return (
                          <tr key={p.id} className="hover:bg-slate-50/50 transition">
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-3">
                                <img
                                  src={p.image}
                                  alt={p.name}
                                  referrerPolicy="no-referrer"
                                  className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                                />
                                <div>
                                  <span className="font-bold block text-slate-900 text-sm leading-tight">{p.name}</span>
                                  <span className="text-[10px] text-slate-400 block font-mono mt-0.5">{p.id}</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 font-medium text-slate-600 font-sans italic">
                              {p.tamilName || 'N/A'}
                            </td>
                            <td className="py-3 px-4 capitalize font-mono text-[10px] text-cyan-600 font-bold">
                              {p.category.replace('-', ' ')}
                            </td>
                            <td className="py-3 px-4 text-right font-extrabold text-slate-900 font-mono text-sm">
                              ₹{p.price}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <div className="flex flex-col items-center">
                                <span className={`font-mono font-bold px-2 py-0.5 rounded-md text-[11px] ${
                                  isStockLow ? 'bg-rose-50 text-rose-600 font-black animate-pulse' : 'bg-slate-100 text-slate-800'
                                }`}>
                                  {p.stock !== undefined ? p.stock : 50} kg
                                </span>
                                {isStockLow && (
                                  <span className="text-[8px] text-rose-500 font-bold block uppercase mt-0.5 font-mono">Restock Required</span>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <div className="inline-flex items-center space-x-1 font-mono text-[10px]">
                                <span className="font-bold text-amber-600">★ {p.rating}</span>
                                <span className="text-slate-400">({p.reviewsCount} reviews)</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-center">
                              <div className="flex items-center justify-center space-x-1.5">
                                <button
                                  onClick={() => openEditProductModal(p)}
                                  className="p-1 px-2.5 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-bold text-slate-700 flex items-center gap-1 transition focus:outline-none cursor-pointer"
                                  title="Calibrate Pricing and stock quantity parameters"
                                >
                                  <Edit2 className="w-3 h-3 text-slate-500" />
                                  <span>Manage</span>
                                </button>
                                <button
                                  onClick={() => handleDeleteClick(p.id, p.name)}
                                  className="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded transition focus:outline-none cursor-pointer"
                                  title="De-register species from system"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* ===================== TAB 2: ORDER LOGISTICS HUB ===================== */}
          {activeTab === 'orders' && (
            <div id="admin-sheet-orders" className="space-y-6">
              
              <div className="text-left border-b border-slate-100 pb-4">
                <h2 className="font-serif text-lg font-black uppercase text-slate-900">Dawn Order Dispatch Console</h2>
                <p className="text-xs text-slate-500">Track and dispatch morning catches on ice-beds inside hours.</p>
              </div>

              {/* Advanced search Filter */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search orders by Order ID, deliveree name, status..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full text-xs font-sans border border-slate-200 hover:border-slate-300 focus:border-cyan-500 px-4 py-3 pl-10 rounded-xl focus:outline-none"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>

              {/* TABLE LISTING */}
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-450 text-[10px] tracking-wider uppercase font-extrabold border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4">Order ID & Date</th>
                      <th className="py-3.5 px-4">Customer Details</th>
                      <th className="py-3.5 px-4">Catches Selected</th>
                      <th className="py-3.5 px-4 text-right">Settlement Total</th>
                      <th className="py-3.5 px-4 text-center">Payment Status</th>
                      <th className="py-3.5 px-4 text-center">Logistics Status</th>
                      <th className="py-3.5 px-4 text-center">Operational Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-400 font-light text-xs">
                          No orders registered yet. Checkout an item first to record live logistics!
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((o) => {
                        return (
                          <tr key={o.id} className="hover:bg-slate-50/50 transition">
                            <td className="py-3.5 px-4">
                              <span className="font-mono font-black text-slate-900 text-xs block">{o.id}</span>
                              <span className="text-[10px] text-slate-400 font-sans block mt-0.5">{o.date} • {o.slot}</span>
                            </td>
                            <td className="py-3.5 px-4 text-left">
                              <span className="font-bold text-slate-900 block">{o.customerName}</span>
                              <span className="text-slate-500 block text-[11px] mt-0.5">{o.customerPhone}</span>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="max-w-xs truncate space-y-0.5" title={o.items.map(i => `${i.name} (${i.quantity}x)`).join(', ')}>
                                {o.items.map((it, itIdx) => (
                                  <span key={itIdx} className="bg-slate-105 bg-slate-100 text-slate-700 text-[10px] px-1.5 py-0.5 rounded font-medium inline-block mr-1">
                                    {it.name} ({it.quantity} x {it.weight})
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-right font-extrabold text-slate-900 font-mono text-sm">
                              ₹{o.total}
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <span className={`inline-block font-mono text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                o.paymentStatus === 'Paid'
                                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                  : 'bg-amber-50 text-amber-600 border border-amber-100'
                              }`}>
                                {o.paymentStatus}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <select
                                value={o.orderStatus}
                                onChange={(e) => onUpdateOrderStatus(o.id, e.target.value as any)}
                                className={`text-[10px] font-bold font-sans rounded-md px-2.5 py-1 border focus:outline-none cursor-pointer ${
                                  o.orderStatus === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                  o.orderStatus === 'Delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                  o.orderStatus === 'Cancelled' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                  'bg-cyan-50 text-cyan-700 border-cyan-200'
                                }`}
                              >
                                <option value="Pending">Pending</option>
                                <option value="SWAB Tested">✔ SWAB Approved</option>
                                <option value="Processing">Processing Cut</option>
                                <option value="In Transit">In Transit</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <button
                                onClick={() => setViewedOrder(o)}
                                className="p-1 px-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[10px] rounded-lg transition-all focus:outline-none cursor-pointer uppercase tracking-wider"
                              >
                                Examine Details
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* ===================== TAB 3: CUSTOMER REGISTRAR ===================== */}
          {activeTab === 'customers' && (
            <div id="admin-sheet-customers" className="space-y-6">
              
              <div className="text-left border-b border-slate-100 pb-4">
                <h2 className="font-serif text-lg font-black uppercase text-slate-900">Demographic Customer Ledger</h2>
                <p className="text-xs text-slate-500">Examine customer registration records, districts, and order histories.</p>
              </div>

              {/* Search widget */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search customer registrar by Customer Name, Email, Contact Number, Town Locality..."
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="w-full text-xs font-sans border border-slate-200 hover:border-slate-300 focus:border-cyan-500 px-4 py-3 pl-10 rounded-xl focus:outline-none"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>

              {/* TABLE LISTING */}
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-450 text-[10px] tracking-wider uppercase font-extrabold border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4 col-span-2">Customer Profile</th>
                      <th className="py-3.5 px-4 text-left">Contact Coordinates</th>
                      <th className="py-3.5 px-4 text-left">Geographic Location</th>
                      <th className="py-3.5 px-4 text-left">District & Locality</th>
                      <th className="py-3.5 px-4 text-center">Total Orders Placed</th>
                      <th className="py-3.5 px-4 text-center">Registered Date</th>
                      <th className="py-3.5 px-4 text-center">Sourcing Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {filteredCustomers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-400 font-light text-xs">
                          No customer profiles recorded in current session. Let customers sign up or demo checkouts!
                        </td>
                      </tr>
                    ) : (
                      filteredCustomers.map((c) => {
                        return (
                          <tr key={c.id} className="hover:bg-slate-50/50 transition text-sm">
                            <td className="py-3.5 px-4 font-bold text-slate-900 col-span-2">
                              <div className="flex items-center space-x-2.5">
                                <div className="w-8 h-8 rounded-full bg-slate-150 bg-slate-200 text-slate-700 font-extrabold flex items-center justify-center text-xs border border-slate-300">
                                  {c.firstName[0]}{c.lastName ? c.lastName[0] : ''}
                                </div>
                                <div className="text-left">
                                  <span className="text-sm font-bold block">{c.firstName} {c.lastName}</span>
                                  <span className="text-[10px] text-slate-450 text-slate-400 font-mono block mt-0.5">{c.email}</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4 text-slate-700 font-mono text-xs">
                              {c.contactNumber}
                            </td>
                            <td className="py-3.5 px-4 text-slate-600 text-xs max-w-xs truncate" title={c.address}>
                              {c.address}
                            </td>
                            <td className="py-3.5 px-4 text-slate-700 font-medium">
                              <span className="block">{c.locality}</span>
                              <span className="text-[9.5px] uppercase font-bold tracking-wider text-cyan-600 block mt-0.5 font-mono">{c.district}</span>
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <span className="bg-slate-150 bg-slate-100 text-slate-900 font-mono font-bold px-2 py-0.5 rounded-lg border border-slate-200">
                                {c.orderHistory.length} orders
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-center text-xs text-slate-500">
                              {c.createdAt}
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <button
                                onClick={() => setViewedCustomer(c)}
                                className="p-1 px-3 bg-slate-100 hover:bg-slate-200 font-bold text-[10px] text-slate-800 rounded-lg transition-all focus:outline-none cursor-pointer uppercase tracking-wider"
                              >
                                View History
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* ===================== TAB 4: FINANCIAL TRANSACTIONS ===================== */}
          {activeTab === 'payments' && (
            <div id="admin-sheet-payments" className="space-y-6">
              
              <div className="text-left border-b border-slate-100 pb-4">
                <h2 className="font-serif text-lg font-black uppercase text-slate-900">Secure Settlement Registry</h2>
                <p className="text-xs text-slate-500">Review complete payment logs, transaction hashes, and bank clearings.</p>
              </div>

              {/* Search input tool */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Query bank clearing logs by Transaction ID, Customer Name, target Order ID, payment method..."
                  value={paymentSearch}
                  onChange={(e) => setPaymentSearch(e.target.value)}
                  className="w-full text-xs font-sans border border-slate-200 hover:border-slate-300 focus:border-cyan-500 px-4 py-3 pl-10 rounded-xl focus:outline-none"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>

              {/* TABLE LISTING */}
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-450 text-[10px] tracking-wider uppercase font-extrabold border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-4">Transaction ID Token</th>
                      <th className="py-3.5 px-4">Target Order ID</th>
                      <th className="py-3.5 px-4">Customer Depositor</th>
                      <th className="py-3.5 px-4 text-right">Settled Amount</th>
                      <th className="py-3.5 px-4 text-left">Depositor Method</th>
                      <th className="py-3.5 px-4 text-center">Transaction Status</th>
                      <th className="py-3.5 px-4 text-center">Clearing Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {filteredPayments.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-400 font-light text-xs">
                          No dynamic banking clearings recorded. Settle live checkout to generate hash strings!
                        </td>
                      </tr>
                    ) : (
                      filteredPayments.map((p) => {
                        return (
                          <tr key={p.transactionId} className="hover:bg-slate-50/50 transition">
                            <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                              <span className="text-slate-900 block font-semibold hover:text-cyan-600 transition">{p.transactionId}</span>
                            </td>
                            <td className="py-3.5 px-4 font-mono text-cyan-600 font-bold">
                              {p.orderId}
                            </td>
                            <td className="py-3.5 px-4 font-bold text-slate-800">
                              {p.customerName}
                            </td>
                            <td className="py-3.5 px-4 text-right font-black font-mono text-sm text-blue-750 text-blue-700">
                              ₹{p.amount}
                            </td>
                            <td className="py-3.5 px-4 capitalize text-slate-600 font-medium">
                              {p.paymentMethod}
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <span className={`inline-block font-mono text-[9px] font-extrabold px-3 py-1 rounded-full uppercase ${
                                p.status === 'Successful'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                  : p.status === 'Pending'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-100'
                                  : 'bg-rose-50 text-rose-700 border border-rose-100'
                              }`}>
                                {p.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-center text-xs font-mono text-slate-500">
                              {p.date}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* ===================== TAB 5: CATEGORIES MATRIX ===================== */}
          {activeTab === 'categories' && (
            <div id="admin-sheet-categories" className="space-y-6">
              
              <div className="text-left border-b border-slate-100 pb-4">
                <h2 className="font-serif text-lg font-black uppercase text-slate-900">Configured Seafood Categories</h2>
                <p className="text-xs text-slate-500">Ensure the 5 major divisions requested by system guidelines exist.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Visual state map */}
                <div className="bg-slate-50 p-6 rounded-2.5xl border border-slate-205 border-slate-200">
                  <h3 className="font-serif font-bold text-slate-800 text-sm uppercase tracking-wider mb-4">Required Seafood Divisions</h3>
                  
                  <div className="space-y-4">
                    {[
                      { id: 'dry-fish', label: '1. Dry Fish Division', count: products.filter(p => p.category === 'dry-fish').length, desc: 'Premium dry and salted fish varieties sourced locally.' },
                      { id: 'pure-water-fish', label: '2. Pure Water Fish Division', count: products.filter(p => p.category === 'pure-water-fish').length, desc: 'Fresh marine species with clean seawater profiles.' },
                      { id: 'fresh-water-fish', label: '3. Fresh Water Fish Division', count: products.filter(p => p.category === 'fresh-water-fish').length, desc: 'Inland river and stream catches (e.g. Rohu, Catla).' },
                      { id: 'lake-water-fish', label: '4. Lake Water Fish Division', count: products.filter(p => p.category === 'lake-water-fish').length, desc: 'Natural coastal and brackish lake selections.' },
                      { id: 'frozen-fish', label: '5. Frozen Fish Division', count: products.filter(p => p.category === 'frozen-fish').length, desc: 'Cryo-locked flash frozen fillets and cubes.' }
                    ].map((division) => (
                      <div key={division.id} className="p-4 bg-white border border-slate-200 rounded-2xl flex items-start justify-between">
                        <div>
                          <span className="font-bold text-slate-900 block text-xs sm:text-sm">{division.label}</span>
                          <span className="text-[10.5px] text-slate-500 block font-light leading-snug mt-1">{division.desc}</span>
                        </div>
                        <span className="bg-cyan-50 border border-cyan-100 text-cyan-700 text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg block">
                          {division.count} species
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Categories rules summary */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-950 text-white p-6 sm:p-8 rounded-2.5xl relative overflow-hidden flex flex-col justify-between">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="space-y-3">
                    <span className="text-[10px] text-cyan-400 font-bold font-mono uppercase tracking-widest block">Operational Rule</span>
                    <h4 className="font-serif text-lg font-black uppercase text-white leading-tight">Strict Structural Partitioning</h4>
                    <p className="text-xs text-slate-400 font-light leading-relaxed">
                      Every newly added species card inside Kadal 2 Kadai must correspond to one of these certified divisions representation to maintain correct categorization indexes. The admin catalog supports immediate recalibration on categories.
                    </p>
                  </div>

                  <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center text-xs max-w-sm mt-6">
                    <span className="text-gray-300 block">Active categories index:</span>
                    <strong className="font-serif text-sm font-bold text-white tracking-widest block uppercase mt-1">
                      {categories.length} total divisions
                    </strong>
                  </div>
                </div>

              </div>

            </div>
          )}

        </div>

        {/* MODAL 1: ADD / EDIT PRODUCT PANEL */}
        {isProductModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-xl bg-white text-slate-950 rounded-3xl shadow-2xl p-6 text-left border border-slate-250 border-slate-200">
              
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 p-1 rounded-full hover:bg-slate-100 transition focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="border-b border-slate-100 pb-4 mb-5">
                <span className="text-[10px] uppercase font-mono tracking-widest text-cyan-600 font-bold block">FLEX STOCK CALIBRATION</span>
                <h3 className="font-serif text-xl sm:text-2xl font-black uppercase text-slate-900">
                  {isAddMode ? 'Add Marine Catch Product' : 'Calibrate Pricing & Stock'}
                </h3>
              </div>

              <form onSubmit={handleProductFormSubmit} className="space-y-4">
                
                {/* Title and Tamil translation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">Seafood Catch Title *</label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Kasimedu King Lobster"
                      className="w-full text-xs border border-slate-200 px-3 py-2.5 rounded-lg focus:outline-none focus:border-cyan-500 font-sans font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">Tamil Translation (Optional)</label>
                    <input
                      type="text"
                      value={formTamilName}
                      onChange={(e) => setFormTamilName(e.target.value)}
                      placeholder="e.g. இராள் / வஞ்சரம்"
                      className="w-full text-xs border border-slate-200 px-3 py-2.5 rounded-lg focus:outline-none focus:border-cyan-500 font-sans font-medium"
                    />
                  </div>
                </div>

                {/* Category selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">Select Division Category</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as any)}
                      className="w-full text-xs border border-slate-200 px-3 py-2.5 rounded-lg focus:outline-none focus:border-cyan-500 appearance-none bg-white cursor-pointer font-sans font-semibold"
                    >
                      <option value="fish">Fresh Fish</option>
                      <option value="prawns">Jumbo Prawns</option>
                      <option value="crabs">Crabs & Mudcrabs</option>
                      <option value="shellfish">Lobsters / Shellfish</option>
                      <option value="dry-fish">Dry Fish Division</option>
                      <option value="pure-water-fish">Pure Water Fish Division</option>
                      <option value="fresh-water-fish">Fresh Water Fish Division</option>
                      <option value="lake-water-fish">Lake Water Fish Division</option>
                      <option value="frozen-fish">Frozen Fish Division</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">Stock Level (Available kilograms) *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={999}
                      value={formStock}
                      onChange={(e) => setFormStock(Number(e.target.value))}
                      placeholder="e.g. 50"
                      className="w-full text-xs border border-slate-200 px-3 py-2.5 rounded-lg focus:outline-none focus:border-cyan-500 font-mono font-bold"
                    />
                  </div>
                </div>

                {/* Pricing and image link */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">Pricing per kg (₹) *</label>
                    <input
                      type="number"
                      required
                      min={100}
                      max={9999}
                      value={formPrice}
                      onChange={(e) => setFormPrice(Number(e.target.value))}
                      placeholder="₹ per kg"
                      className="w-full text-xs border border-slate-200 px-3 py-2.5 rounded-lg focus:outline-none focus:border-cyan-500 font-mono font-bold text-blue-600"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">Image URL Address</label>
                    <input
                      type="text"
                      value={formImage}
                      onChange={(e) => setFormImage(e.target.value)}
                      placeholder="Unsplash / local image path"
                      className="w-full text-xs border border-slate-200 px-3 py-2.5 rounded-lg focus:outline-none focus:border-cyan-500 font-sans font-medium"
                    />
                  </div>
                </div>

                {/* Description textbox */}
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">Species Sourcing Description</label>
                  <textarea
                    rows={2}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Sourced from Kasimedu, descaled thoroughly in morning grids..."
                    className="w-full text-xs border border-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-cyan-500 font-sans"
                  />
                </div>

                {/* Badging variables */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">Tag Overlay</label>
                    <input
                      type="text"
                      value={formTag}
                      onChange={(e) => setFormTag(e.target.value)}
                      placeholder="e.g. Signature Catch, Premium, Live Catch"
                      className="w-full text-xs border border-slate-200 px-3 py-2.5 rounded-lg focus:outline-none focus:border-cyan-500 font-sans"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">Freshness Index Statement</label>
                    <input
                      type="text"
                      value={formBadge}
                      onChange={(e) => setFormBadge(e.target.value)}
                      placeholder="e.g. Caught 3h Ago • Kasimedu Landings"
                      className="w-full text-xs border border-slate-200 px-3 py-2.5 rounded-lg focus:outline-none focus:border-cyan-500 font-sans"
                    />
                  </div>
                </div>

                {/* Submits */}
                <div className="pt-4 border-t border-slate-100 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg focus:outline-none cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold rounded-lg focus:outline-none cursor-pointer hover:shadow-md"
                  >
                    {isAddMode ? 'Upload Catch' : 'Calibrate stock'}
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

        {/* MODAL 2: VIEW ORDER DETAIL SHEET */}
        {viewedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-xl bg-white text-slate-950 rounded-3xl shadow-2xl p-6 text-left border border-slate-200">
              
              <button
                onClick={() => setViewedOrder(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 p-1 rounded-full hover:bg-slate-100 transition focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="border-b border-slate-105 border-slate-200 pb-4 mb-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-600 bg-cyan-50 px-2.5 py-0.5 rounded">
                  Secure Order Receipt #{viewedOrder.id}
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-bold uppercase text-slate-900 mt-2">
                  Detailed Logistics Registry
                </h3>
              </div>

              <div className="space-y-4 text-xs font-sans">
                
                {/* Customer Meta */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <span className="block text-[9px] font-bold uppercase tracking-wider text-slate-450 text-slate-400 font-mono">Deliveree Coordinates</span>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Recipient:</span>
                      <strong className="text-slate-950 text-sm">{viewedOrder.customerName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Contact Phone Route:</span>
                      <strong className="text-slate-950 text-sm font-mono">{viewedOrder.customerPhone}</strong>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-200/40">
                    <span className="text-slate-400 block text-[10px]">Delivery Street Address:</span>
                    <p className="text-slate-900 font-medium leading-relaxed font-sans">{viewedOrder.address}</p>
                  </div>
                </div>

                {/* Items box */}
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                    Catches List Summary
                  </div>
                  <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto pr-1">
                    {viewedOrder.items.map((it, idx) => (
                      <div key={idx} className="p-3 flex justify-between items-center bg-white">
                        <div>
                          <strong className="text-slate-900 text-xs block font-serif leading-none">{it.name}</strong>
                          <span className="text-[10px] text-slate-500 block mt-1 font-semibold">{it.weight} • {it.cut}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-400 text-[10px] block leading-none">{it.quantity} x ₹{it.price}</span>
                          <strong className="text-slate-900 font-mono text-xs block mt-1">₹{it.quantity * it.price}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Financial overview */}
                <div className="flex bg-slate-50 p-4 rounded-xl border border-slate-200 justify-between items-center leading-normal">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Clearance Bank Hash:</span>
                    <span className="text-slate-900 font-mono font-bold text-xs">{viewedOrder.transactionId || 'CASH ON DELIVERY'}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[10px]">Grand Total Sourced:</span>
                    <strong className="text-slate-900 font-mono text-sm leading-none">₹{viewedOrder.total}</strong>
                  </div>
                </div>

                {/* Order logs progress inside order view */}
                <div className="pt-3 flex justify-between border-t border-slate-100 items-center">
                  <div className="text-xs text-slate-500">
                    Registered at: <span className="font-mono">{viewedOrder.date}</span>
                  </div>
                  <button
                    onClick={() => setViewedOrder(null)}
                    className="bg-slate-900 text-white hover:bg-slate-800 px-5 py-2 rounded-xl text-xs font-bold focus:outline-none cursor-pointer"
                  >
                    Done
                  </button>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* MODAL 3: VIEW CUSTOMER RECOGNITION POPUP */}
        {viewedCustomer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <div className="relative w-full max-w-xl bg-white text-slate-950 rounded-3xl shadow-2xl p-6 text-left border border-slate-200">
              
              <button
                onClick={() => setViewedCustomer(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 p-1 rounded-full hover:bg-slate-100 transition focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="border-b border-slate-100 pb-4 mb-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-600 bg-cyan-50 px-2.5 py-0.5 rounded">
                  Customer Master profile
                </span>
                <h3 className="font-serif text-lg sm:text-xl font-bold uppercase text-slate-900 mt-2">
                  {viewedCustomer.firstName} {viewedCustomer.lastName}
                </h3>
              </div>

              <div className="space-y-4 text-xs font-sans">
                
                <div className="grid grid-cols-2 gap-4 text-xs leading-relaxed">
                  <div>
                    <span className="text-slate-400 block">Email address:</span>
                    <strong className="text-slate-950 text-sm font-semibold">{viewedCustomer.email}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Contact Phone:</span>
                    <strong className="text-slate-950 text-sm font-semibold font-mono">{viewedCustomer.contactNumber}</strong>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider mb-1">Standard drop address</span>
                  <p className="text-slate-900 leading-relaxed font-semibold">{viewedCustomer.address}, {viewedCustomer.locality}, {viewedCustomer.district}</p>
                </div>

                {/* Historics */}
                <div>
                  <span className="block text-slate-455 text-slate-400 uppercase tracking-widest font-mono text-[9px] mb-2 font-bold">HISTORIC LANDING DISPATCHES ({viewedCustomer.orderHistory.length})</span>
                  {viewedCustomer.orderHistory.length === 0 ? (
                    <p className="text-slate-400 italic py-2 text-center text-xs">No orders recorded under this profile session yet.</p>
                  ) : (
                    <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                      {viewedCustomer.orderHistory.map((ordId) => {
                        const targetOrd = orders.find(ord => ord.id === ordId);
                        return (
                          <div key={ordId} className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex justify-between items-center transition">
                            <div>
                              <strong className="font-mono text-slate-900 block">{ordId}</strong>
                              <span className="text-slate-450 text-[10px] text-slate-400 block mt-0.5 font-light">{targetOrd ? `${targetOrd.date} • ${targetOrd.slot}` : 'Demonstration Order'}</span>
                            </div>
                            <strong className="text-slate-950 font-mono">₹{targetOrd ? targetOrd.total : '999'}</strong>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => setViewedCustomer(null)}
                    className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 py-2 rounded-xl focus:outline-none"
                  >
                    Done
                  </button>
                </div>

              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
