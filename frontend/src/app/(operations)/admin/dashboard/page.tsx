'use client';

import React, { useState, useMemo } from 'react';
import { useAdminAnalytics } from '@/shared/api/hooks/useAdminAnalytics';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  Package, 
  Users, 
  ShoppingCart, 
  Loader2, 
  Calendar, 
  IndianRupee, 
  CheckCircle2, 
  Truck, 
  ArrowRight,
  Filter,
  RefreshCw,
  Search,
  Percent,
  PlusCircle,
  FileSpreadsheet
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [preset, setPreset] = useState<string>('30days');
  const [customStart, setCustomStart] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  });
  const [customEnd, setCustomEnd] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });

  // Calculate start/end dates based on preset
  const { startDate, endDate } = useMemo(() => {
    const today = new Date();
    const format = (d: Date) => d.toISOString().split('T')[0];

    switch (preset) {
      case 'today':
        return { startDate: format(today), endDate: format(today) };
      case 'yesterday': {
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        return { startDate: format(yesterday), endDate: format(yesterday) };
      }
      case '7days': {
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        return { startDate: format(sevenDaysAgo), endDate: format(today) };
      }
      case '30days': {
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);
        return { startDate: format(thirtyDaysAgo), endDate: format(today) };
      }
      case 'thisMonth': {
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        return { startDate: format(firstDay), endDate: format(today) };
      }
      case 'custom':
        return { startDate: customStart, endDate: customEnd };
      default: {
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);
        return { startDate: thirtyDaysAgo.toISOString().split('T')[0], endDate: format(today) };
      }
    }
  }, [preset, customStart, customEnd]);

  const { data, isLoading, refetch } = useAdminAnalytics(startDate, endDate);

  // Search filter for historical orders table
  const [orderSearch, setOrderSearch] = useState('');
  
  const filteredOrders = useMemo(() => {
    if (!data?.recent_orders) return [];
    if (!orderSearch) return data.recent_orders;
    const q = orderSearch.toLowerCase();
    return data.recent_orders.filter((o: any) => 
      o.order_number.toLowerCase().includes(q) ||
      (o.consumer?.first_name && o.consumer.first_name.toLowerCase().includes(q)) ||
      (o.consumer?.last_name && o.consumer.last_name.toLowerCase().includes(q)) ||
      o.status.toLowerCase().includes(q)
    );
  }, [data?.recent_orders, orderSearch]);

  // Maximum value for Line Chart scaling
  const maxTrendVal = useMemo(() => {
    if (!data?.trend || data.trend.length === 0) return 100;
    const maxRev = Math.max(...data.trend.map(t => t.revenue));
    const maxProf = Math.max(...data.trend.map(t => t.profit));
    const maxVal = Math.max(maxRev, maxProf);
    return maxVal > 0 ? maxVal * 1.15 : 100; // 15% buffer
  }, [data?.trend]);

  // Maximum value for Bar Chart scaling
  const maxBarVal = useMemo(() => {
    if (!data?.trend || data.trend.length === 0) return 10;
    const maxOrd = Math.max(...data.trend.map(t => t.orders_added));
    const maxCons = Math.max(...data.trend.map(t => t.consumers_registered));
    const maxVal = Math.max(maxOrd, maxCons);
    return maxVal > 0 ? maxVal * 1.15 : 10;
  }, [data?.trend]);

  const [hoveredTrendIdx, setHoveredTrendIdx] = useState<number | null>(null);
  const [hoveredBarIdx, setHoveredBarIdx] = useState<number | null>(null);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm font-medium animate-pulse">Loading command center analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header and Live Overview */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Command Center</h1>
          <p className="text-muted-foreground mt-1">Real-time marketplace transactions, profits, and fulfillment status.</p>
        </div>
        <Button onClick={() => refetch()} variant="outline" size="sm" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* TODAY'S PERFORMANCE KPI GRID */}
      <div>
        <h2 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
          Today&apos;s Live Performance
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Today Profit */}
          <Card className="relative overflow-hidden border-l-4 border-l-emerald-500 bg-card hover:shadow-md transition-shadow">
            <CardContent className="p-5 flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">Today&apos;s Profit</p>
                <p className="text-2xl font-bold text-foreground">₹{data?.today?.profit?.toFixed(2) || '0.00'}</p>
                <p className="text-[10px] text-muted-foreground">10% Platform Commission</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl dark:bg-emerald-950/30 text-emerald-500">
                <IndianRupee className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          {/* Today Orders Added */}
          <Card className="relative overflow-hidden border-l-4 border-l-indigo-500 bg-card hover:shadow-md transition-shadow">
            <CardContent className="p-5 flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Orders Added</p>
                <p className="text-2xl font-bold text-foreground">{data?.today?.orders_added || 0}</p>
                <p className="text-[10px] text-muted-foreground">New placed orders</p>
              </div>
              <div className="p-3 bg-indigo-50 rounded-xl dark:bg-indigo-950/30 text-indigo-500">
                <PlusCircle className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          {/* Today Orders Delivered */}
          <Card className="relative overflow-hidden border-l-4 border-l-sky-500 bg-card hover:shadow-md transition-shadow">
            <CardContent className="p-5 flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-sky-600 uppercase tracking-wider">Delivered Orders</p>
                <p className="text-2xl font-bold text-foreground">{data?.today?.orders_delivered || 0}</p>
                <p className="text-[10px] text-muted-foreground">Fulfilled successfully</p>
              </div>
              <div className="p-3 bg-sky-50 rounded-xl dark:bg-sky-950/30 text-sky-500">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          {/* Today Orders Reached */}
          <Card className="relative overflow-hidden border-l-4 border-l-amber-500 bg-card hover:shadow-md transition-shadow">
            <CardContent className="p-5 flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Reached Logistics</p>
                <p className="text-2xl font-bold text-foreground">{data?.today?.orders_reached || 0}</p>
                <p className="text-[10px] text-muted-foreground">In transit / Ready / Delivered</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl dark:bg-amber-950/30 text-amber-500">
                <Truck className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          {/* Today Consumer Count */}
          <Card className="relative overflow-hidden border-l-4 border-l-purple-500 bg-card hover:shadow-md transition-shadow">
            <CardContent className="p-5 flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider">New Consumers</p>
                <p className="text-2xl font-bold text-foreground">{data?.today?.consumers_count || 0}</p>
                <p className="text-[10px] text-muted-foreground">Registered today</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-xl dark:bg-purple-950/30 text-purple-500">
                <Users className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* HISTORICAL RECORDS & ANALYTICS SECTION */}
      <div className="border-t border-muted pt-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-foreground">Historical Records &amp; Trends</h2>
            <p className="text-muted-foreground text-sm">Analyze trends and filter records for past dates.</p>
          </div>
          
          {/* Filtering Controls */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <Select value={preset} onValueChange={(val) => val && setPreset(val)}>
              <SelectTrigger className="w-[160px] bg-background">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Select Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="7days">Last 7 Days</SelectItem>
                <SelectItem value="30days">Last 30 Days</SelectItem>
                <SelectItem value="thisMonth">This Month</SelectItem>
                <SelectItem value="custom">Custom Date Range</SelectItem>
              </SelectContent>
            </Select>

            {preset === 'custom' && (
              <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                <Input 
                  type="date" 
                  value={customStart} 
                  onChange={(e) => setCustomStart(e.target.value)} 
                  className="w-full sm:w-[140px] bg-background"
                />
                <span className="text-muted-foreground text-xs font-semibold">to</span>
                <Input 
                  type="date" 
                  value={customEnd} 
                  onChange={(e) => setCustomEnd(e.target.value)} 
                  className="w-full sm:w-[140px] bg-background"
                />
              </div>
            )}
          </div>
        </div>

        {/* Selected Period Metrics Sub-row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 bg-muted/40 rounded-xl border border-muted flex flex-col justify-center">
            <span className="text-xs text-muted-foreground font-medium">Selected Profit</span>
            <span className="text-xl font-bold text-foreground mt-1">₹{data?.selected?.profit?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="p-4 bg-muted/40 rounded-xl border border-muted flex flex-col justify-center">
            <span className="text-xs text-muted-foreground font-medium">Selected Revenue</span>
            <span className="text-xl font-bold text-foreground mt-1">₹{data?.selected?.revenue?.toFixed(2) || '0.00'}</span>
          </div>
          <div className="p-4 bg-muted/40 rounded-xl border border-muted flex flex-col justify-center">
            <span className="text-xs text-muted-foreground font-medium">Selected Orders Added</span>
            <span className="text-xl font-bold text-foreground mt-1">{data?.selected?.orders_added || 0}</span>
          </div>
          <div className="p-4 bg-muted/40 rounded-xl border border-muted flex flex-col justify-center">
            <span className="text-xs text-muted-foreground font-medium">New Consumers Onboarded</span>
            <span className="text-xl font-bold text-foreground mt-1">{data?.selected?.consumers_count || 0}</span>
          </div>
        </div>

        {/* CHARTS CONTAINER GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Trend Line Chart (Revenue & Profit) */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row justify-between items-center pb-2">
              <div>
                <CardTitle className="text-base font-semibold">Sales &amp; Profit Trends</CardTitle>
                <CardDescription>Daily revenue vs platform commission</CardDescription>
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-500"></span>Revenue</span>
                <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500"></span>Profit</span>
              </div>
            </CardHeader>
            <CardContent>
              {data?.trend && data.trend.length > 0 ? (
                <div className="relative pt-4">
                  {/* SVG line chart */}
                  <svg viewBox="0 0 500 200" className="w-full overflow-visible">
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2"/>
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0"/>
                      </linearGradient>
                      <linearGradient id="profGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.2"/>
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.0"/>
                      </linearGradient>
                    </defs>

                    {/* Y Axis Gridlines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((val, idx) => {
                      const y = 20 + val * 150;
                      return (
                        <g key={idx}>
                          <line x1="40" y1={y} x2="480" y2={y} stroke="var(--muted)" strokeWidth="0.5" strokeDasharray="3,3" />
                          <text x="35" y={y + 3} textAnchor="end" fontSize="8" className="fill-muted-foreground">
                            ₹{((1 - val) * maxTrendVal).toFixed(0)}
                          </text>
                        </g>
                      );
                    })}

                    {/* SVG Lines & Areas */}
                    {(() => {
                      const width = 500;
                      const height = 200;
                      const paddingX = 40;
                      const paddingY = 20;
                      const points = data.trend.map((d, i) => {
                        const x = paddingX + (i / (data.trend.length - 1 || 1)) * (width - paddingX * 2);
                        const yRev = height - paddingY - (d.revenue / maxTrendVal) * (height - paddingY * 2);
                        const yProf = height - paddingY - (d.profit / maxTrendVal) * (height - paddingY * 2);
                        return { x, yRev, yProf };
                      });

                      const revPath = points.map(p => `${p.x},${p.yRev}`).join(' L ');
                      const profPath = points.map(p => `${p.x},${p.yProf}`).join(' L ');

                      const revArea = `M ${points[0].x} ${height - paddingY} L ${revPath} L ${points[points.length - 1].x} ${height - paddingY} Z`;
                      const profArea = `M ${points[0].x} ${height - paddingY} L ${profPath} L ${points[points.length - 1].x} ${height - paddingY} Z`;

                      return (
                        <>
                          {/* Areas */}
                          <path d={revArea} fill="url(#revGrad)" />
                          <path d={profArea} fill="url(#profGrad)" />

                          {/* Lines */}
                          <path d={`M ${revPath}`} fill="none" stroke="#3b82f6" strokeWidth="2" />
                          <path d={`M ${profPath}`} fill="none" stroke="#10b981" strokeWidth="2" />

                          {/* Interactive Overlay Rects for Hover state */}
                          {points.map((p, idx) => {
                            const stepX = (width - paddingX * 2) / (data.trend.length - 1 || 1);
                            return (
                              <rect
                                key={idx}
                                x={p.x - stepX / 2}
                                y={0}
                                width={stepX}
                                height={height}
                                fill="transparent"
                                className="cursor-pointer"
                                onMouseEnter={() => setHoveredTrendIdx(idx)}
                                onMouseLeave={() => setHoveredTrendIdx(null)}
                              />
                            );
                          })}
                        </>
                      );
                    })()}
                  </svg>

                  {/* HTML Tooltip relative to hovered elements */}
                  {hoveredTrendIdx !== null && data.trend[hoveredTrendIdx] && (
                    <div 
                      className="absolute bg-popover text-popover-foreground border border-border p-3 rounded-lg shadow-lg text-xs space-y-1.5 z-10 pointer-events-none transition-all duration-150"
                      style={{ 
                        left: `${(hoveredTrendIdx / (data.trend.length - 1 || 1)) * 75 + 12}%`,
                        top: '10%'
                      }}
                    >
                      <p className="font-semibold border-b pb-1 text-muted-foreground">{data.trend[hoveredTrendIdx].date}</p>
                      <div className="flex justify-between gap-6">
                        <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>Revenue</span>
                        <span className="font-bold">₹{data.trend[hoveredTrendIdx].revenue.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between gap-6">
                        <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>Profit</span>
                        <span className="font-bold">₹{data.trend[hoveredTrendIdx].profit.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between gap-6">
                        <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-purple-500"></span>Orders Added</span>
                        <span className="font-bold">{data.trend[hoveredTrendIdx].orders_added}</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex justify-center items-center h-[160px] text-muted-foreground text-sm">
                  No data available for this range.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Donut Chart: Order Status Breakdown */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Order Status</CardTitle>
              <CardDescription>Breakdown of orders in period</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              {(() => {
                const totalOrders = data?.status_breakdown?.reduce((sum, item) => sum + item.count, 0) || 0;
                
                if (totalOrders === 0) {
                  return (
                    <div className="flex flex-col justify-center items-center h-[200px] text-muted-foreground text-sm">
                      No orders to display.
                    </div>
                  );
                }

                // Color mappings
                const getStatusColor = (status: string) => {
                  switch (status) {
                    case 'delivered': return '#10b981'; // emerald
                    case 'pending_seller_approval': return '#f59e0b'; // amber
                    case 'ready_for_delivery':
                    case 'out_for_delivery': return '#0ea5e9'; // sky
                    case 'processing':
                    case 'approved': return '#6366f1'; // indigo
                    case 'cancelled':
                    case 'rejected':
                    case 'refunded': return '#f43f5e'; // rose
                    default: return '#94a3b8'; // slate
                  }
                };

                let accumulatedPercent = 0;
                const segments = data?.status_breakdown?.map((item) => {
                  const percent = (item.count / totalOrders) * 100;
                  const strokeDashoffset = 376.99 - (376.99 * percent) / 100;
                  const rotation = (accumulatedPercent / 100) * 360;
                  accumulatedPercent += percent;
                  return {
                    ...item,
                    percent,
                    strokeDashoffset,
                    rotation,
                    color: getStatusColor(item.status)
                  };
                }) || [];

                return (
                  <div className="w-full flex flex-col items-center gap-4 mt-2">
                    <div className="relative w-36 h-36">
                      <svg viewBox="0 0 160 160" className="w-full h-full transform -rotate-90">
                        {segments.map((seg, idx) => (
                          <circle
                            key={idx}
                            cx={80}
                            cy={80}
                            r={60}
                            fill="transparent"
                            stroke={seg.color}
                            strokeWidth={16}
                            strokeDasharray={376.99}
                            strokeDashoffset={seg.strokeDashoffset}
                            transform={`rotate(${seg.rotation} 80 80)`}
                            className="transition-all duration-300 hover:stroke-[18px]"
                          />
                        ))}
                      </svg>
                      {/* Inner circle text */}
                      <div className="absolute inset-0 flex flex-col justify-center items-center text-center">
                        <span className="text-2xl font-bold text-foreground">{totalOrders}</span>
                        <span className="text-[10px] uppercase font-semibold text-muted-foreground">Orders</span>
                      </div>
                    </div>
                    
                    {/* Legend */}
                    <div className="w-full grid grid-cols-2 gap-2 text-xs">
                      {segments.map((seg, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: seg.color }}></span>
                          <span className="truncate text-muted-foreground font-medium capitalize">{seg.label}:</span>
                          <span className="font-bold text-foreground">{seg.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        </div>

        {/* REGISTRATIONS & VOLUMES BAR CHART */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row justify-between items-center pb-2">
            <div>
              <CardTitle className="text-base font-semibold">User Onboarding vs Order Volumes</CardTitle>
              <CardDescription>Daily comparison of new consumers vs orders placed</CardDescription>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-violet-500"></span>Orders Placed</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-500"></span>New Consumers</span>
            </div>
          </CardHeader>
          <CardContent>
            {data?.trend && data.trend.length > 0 ? (
              <div className="relative pt-4">
                <svg viewBox="0 0 500 150" className="w-full overflow-visible">
                  {/* Grid Lines */}
                  {[0, 0.5, 1].map((val, idx) => {
                    const y = 15 + val * 105;
                    return (
                      <g key={idx}>
                        <line x1="30" y1={y} x2="490" y2={y} stroke="var(--muted)" strokeWidth="0.5" strokeDasharray="3,3" />
                        <text x="25" y={y + 3} textAnchor="end" fontSize="8" className="fill-muted-foreground">
                          {((1 - val) * maxBarVal).toFixed(0)}
                        </text>
                      </g>
                    );
                  })}

                  {/* Render Bars */}
                  {(() => {
                    const width = 500;
                    const height = 150;
                    const paddingX = 30;
                    const paddingY = 15;
                    
                    const groupWidth = (width - paddingX * 2) / (data.trend.length || 1);
                    const barWidth = Math.max(2, groupWidth * 0.35);

                    return data.trend.map((d, i) => {
                      const groupX = paddingX + i * groupWidth;
                      
                      // Order volume bar
                      const barHeightOrd = (d.orders_added / maxBarVal) * (height - paddingY * 2);
                      const barYOrd = height - paddingY - barHeightOrd;

                      // Consumer registration bar
                      const barHeightCons = (d.consumers_registered / maxBarVal) * (height - paddingY * 2);
                      const barYCons = height - paddingY - barHeightCons;

                      return (
                        <g key={i}>
                          {/* Orders bar */}
                          <rect
                            x={groupX + groupWidth * 0.1}
                            y={barYOrd}
                            width={barWidth}
                            height={barHeightOrd}
                            fill="#8b5cf6"
                            rx="1"
                            className="transition-all duration-200 hover:opacity-80"
                          />
                          {/* Consumers bar */}
                          <rect
                            x={groupX + groupWidth * 0.1 + barWidth + 1}
                            y={barYCons}
                            width={barWidth}
                            height={barHeightCons}
                            fill="#f59e0b"
                            rx="1"
                            className="transition-all duration-200 hover:opacity-80"
                          />

                          {/* Hover Trigger Box */}
                          <rect
                            x={groupX}
                            y={0}
                            width={groupWidth}
                            height={height}
                            fill="transparent"
                            className="cursor-pointer"
                            onMouseEnter={() => setHoveredBarIdx(i)}
                            onMouseLeave={() => setHoveredBarIdx(null)}
                          />
                        </g>
                      );
                    });
                  })()}
                </svg>

                {/* HTML Tooltip for Bar Chart */}
                {hoveredBarIdx !== null && data.trend[hoveredBarIdx] && (
                  <div 
                    className="absolute bg-popover text-popover-foreground border border-border p-3 rounded-lg shadow-lg text-xs space-y-1 z-10 pointer-events-none transition-all duration-150"
                    style={{ 
                      left: `${(hoveredBarIdx / (data.trend.length || 1)) * 75 + 10}%`,
                      top: '10%'
                    }}
                  >
                    <p className="font-semibold border-b pb-1 text-muted-foreground">{data.trend[hoveredBarIdx].date}</p>
                    <div className="flex justify-between gap-6">
                      <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-violet-500"></span>Orders Placed</span>
                      <span className="font-bold">{data.trend[hoveredBarIdx].orders_added}</span>
                    </div>
                    <div className="flex justify-between gap-6">
                      <span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>New Consumers</span>
                      <span className="font-bold">{data.trend[hoveredBarIdx].consumers_registered}</span>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex justify-center items-center h-[120px] text-muted-foreground text-sm">
                No data available for this range.
              </div>
            )}
          </CardContent>
        </Card>

        {/* ORDER QUEUE AND SYSTEM ACTIVITIES */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Detailed Order logs filtered by selected date range */}
          <Card className="xl:col-span-2">
            <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-base font-semibold">Filtered Order Records</CardTitle>
                <CardDescription>Orders completed or pending in this range</CardDescription>
              </div>
              <div className="relative w-full sm:w-[220px]">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search ID, customer..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="pl-8 h-9"
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order: any) => (
                      <TableRow key={order.id} className="hover:bg-muted/30">
                        <TableCell className="font-semibold">#{order.order_number}</TableCell>
                        <TableCell className="font-medium">
                          {order.consumer ? `${order.consumer.first_name} ${order.consumer.last_name}` : 'Guest'}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {order.created_at ? new Date(order.created_at).toLocaleDateString() : ''}
                        </TableCell>
                        <TableCell className="font-bold text-foreground">₹{parseFloat(order.total).toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`capitalize border ${
                            order.status === 'delivered' ? 'border-emerald-500/30 text-emerald-600 bg-emerald-50/20' : 
                            order.status === 'cancelled' || order.status === 'rejected' ? 'border-rose-500/30 text-rose-600 bg-rose-50/20' :
                            'border-indigo-500/30 text-indigo-600 bg-indigo-50/20'
                          }`}>
                            {order.status.replace(/_/g, ' ')}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground text-sm">
                        No matching orders found in this period.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* SYSTEM ACTIVITIES LIST */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">System Activity Log</CardTitle>
              <CardDescription>Live platform updates and logs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1">
                {data?.recent_activity && data.recent_activity.length > 0 ? (
                  data.recent_activity.map((activity: any) => (
                    <div key={activity.id} className="flex flex-col pb-3 border-b border-muted last:border-0 last:pb-0 gap-1 hover:bg-muted/10 p-1.5 rounded transition-colors">
                      <p className="text-xs font-semibold text-foreground leading-relaxed">{activity.description}</p>
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                        <span className="capitalize font-medium text-primary bg-primary/5 px-1.5 py-0.5 rounded">
                          {activity.role}
                        </span>
                        <span>
                          {activity.created_at ? new Date(activity.created_at).toLocaleTimeString() : ''}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-muted-foreground">
                    <p className="text-sm">No recent activity logs found.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
