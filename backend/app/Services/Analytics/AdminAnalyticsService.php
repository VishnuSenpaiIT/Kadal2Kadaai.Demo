<?php

namespace App\Services\Analytics;

use App\Models\Order;
use App\Models\User;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Support\Facades\Cache;
use Carbon\Carbon;

class AdminAnalyticsService
{
    public function getDashboardMetrics(?string $startDate = null, ?string $endDate = null): array
    {
        $start = $startDate ? Carbon::parse($startDate)->startOfDay() : Carbon::now()->subDays(30)->startOfDay();
        $end = $endDate ? Carbon::parse($endDate)->endOfDay() : Carbon::now()->endOfDay();

        $todayStart = Carbon::today();
        $todayEnd = Carbon::today()->endOfDay();

        // 1. Today's metrics
        $todayOrdersAdded = Order::whereBetween('created_at', [$todayStart, $todayEnd])->count();
        
        $todayOrdersDelivered = Order::where('status', 'delivered')
            ->whereBetween('created_at', [$todayStart, $todayEnd])
            ->count();
            
        $todayOrdersReached = Order::whereIn('status', ['ready_for_delivery', 'out_for_delivery', 'delivered'])
            ->whereBetween('created_at', [$todayStart, $todayEnd])
            ->count();
            
        $todayConsumersCount = User::role('consumer')
            ->whereBetween('created_at', [$todayStart, $todayEnd])
            ->count();

        $todayProfit = Order::where('orders.status', 'delivered')
            ->whereBetween('orders.created_at', [$todayStart, $todayEnd])
            ->leftJoin('commissions', 'orders.id', '=', 'commissions.order_id')
            ->selectRaw('SUM(COALESCE(commissions.commission_amount, orders.subtotal * 0.10)) as profit')
            ->value('profit') ?? 0;

        // 2. Selected range metrics
            $selectedOrdersAdded = Order::whereBetween('created_at', [$start, $end])->count();
            
            $selectedOrdersDelivered = Order::where('status', 'delivered')
                ->whereBetween('created_at', [$start, $end])
                ->count();
                
            $selectedOrdersReached = Order::whereIn('status', ['ready_for_delivery', 'out_for_delivery', 'delivered'])
                ->whereBetween('created_at', [$start, $end])
                ->count();
                
            $selectedConsumersCount = User::role('consumer')
                ->whereBetween('created_at', [$start, $end])
                ->count();

            $selectedRevenue = Order::where('status', 'delivered')
                ->whereBetween('created_at', [$start, $end])
                ->sum('total');

            $selectedProfit = Order::where('orders.status', 'delivered')
                ->whereBetween('orders.created_at', [$start, $end])
                ->leftJoin('commissions', 'orders.id', '=', 'commissions.order_id')
                ->selectRaw('SUM(COALESCE(commissions.commission_amount, orders.subtotal * 0.10)) as profit')
                ->value('profit') ?? 0;

            $totalConsumers = User::role('consumer')->count();
            $totalSellers = User::role('seller')->count();

            $activeProducts = Product::where('product_status', 'PUBLISHED')->count();
            $lowStockProducts = Product::where('available_quantity', '<=', 5)->count();

            $topCategories = Category::withCount('products')->orderBy('products_count', 'desc')->take(5)->get();
            $topSellers = User::role('seller')->withCount('sellerOrders')->orderBy('seller_orders_count', 'desc')->take(5)->get();
            $topProducts = Product::orderBy('view_count', 'desc')->take(5)->get();

            $recentOrders = Order::with('consumer')
                ->whereBetween('created_at', [$start, $end])
                ->latest()
                ->take(50)
                ->get();

            // 3. Status breakdown
            $statusBreakdown = Order::whereBetween('created_at', [$start, $end])
                ->selectRaw('status, COUNT(*) as count')
                ->groupBy('status')
                ->get()
                ->map(function ($row) {
                    return [
                        'status' => $row->status->value,
                        'label' => $row->status->label(),
                        'count' => $row->count,
                    ];
                })->toArray();

            // 4. Trend timeseries
            $dailyOrdersData = Order::whereBetween('created_at', [$start, $end])
                ->selectRaw("DATE(created_at) as date,
                             COUNT(*) as count_added,
                             SUM(CASE WHEN status = 'delivered' THEN total ELSE 0 END) as revenue,
                             SUM(CASE WHEN status = 'delivered' THEN subtotal * 0.10 ELSE 0 END) as profit,
                             SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as count_delivered,
                             SUM(CASE WHEN status IN ('ready_for_delivery', 'out_for_delivery', 'delivered') THEN 1 ELSE 0 END) as count_reached")
                ->groupBy('date')
                ->orderBy('date', 'asc')
                ->get();

            $dailyConsumersData = User::role('consumer')
                ->whereBetween('created_at', [$start, $end])
                ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
                ->groupBy('date')
                ->orderBy('date', 'asc')
                ->get();

            $trend = [];
            $curr = $start->copy();
            $daysLimit = 366;
            while ($curr->lte($end) && $daysLimit-- > 0) {
                $dateStr = $curr->toDateString();
                $trend[$dateStr] = [
                    'date' => $dateStr,
                    'orders_added' => 0,
                    'revenue' => 0.0,
                    'profit' => 0.0,
                    'orders_delivered' => 0,
                    'orders_reached' => 0,
                    'consumers_registered' => 0,
                ];
                $curr->addDay();
            }

            foreach ($dailyOrdersData as $data) {
                if (isset($trend[$data->date])) {
                    $trend[$data->date]['orders_added'] = (int) $data->count_added;
                    $trend[$data->date]['revenue'] = round((float) $data->revenue, 2);
                    $trend[$data->date]['profit'] = round((float) $data->profit, 2);
                    $trend[$data->date]['orders_delivered'] = (int) $data->count_delivered;
                    $trend[$data->date]['orders_reached'] = (int) $data->count_reached;
                }
            }

            foreach ($dailyConsumersData as $data) {
                if (isset($trend[$data->date])) {
                    $trend[$data->date]['consumers_registered'] = (int) $data->count;
                }
            }

            $metrics = [
                'total_orders' => Order::count(),
                'today' => [
                    'profit' => round((float) $todayProfit, 2),
                    'orders_added' => $todayOrdersAdded,
                    'orders_delivered' => $todayOrdersDelivered,
                    'orders_reached' => $todayOrdersReached,
                    'consumers_count' => $todayConsumersCount,
                ],
                'selected' => [
                    'profit' => round((float) $selectedProfit, 2),
                    'revenue' => round((float) $selectedRevenue, 2),
                    'orders_added' => $selectedOrdersAdded,
                    'orders_delivered' => $selectedOrdersDelivered,
                    'orders_reached' => $selectedOrdersReached,
                    'consumers_count' => $selectedConsumersCount,
                ],
                'status_breakdown' => $statusBreakdown,
                'trend' => array_values($trend),
                'users' => [
                    'consumers' => $totalConsumers,
                    'sellers' => $totalSellers,
                ],
                'products' => [
                    'active' => $activeProducts,
                    'low_stock' => $lowStockProducts,
                ],
                'top' => [
                    'categories' => $topCategories,
                    'sellers' => $topSellers,
                    'products' => $topProducts,
                ],
                'recent_orders' => $recentOrders,
            ];

        // Add live activity log feed
        $metrics['recent_activity'] = \App\Models\AuditLog::with(['user.roles'])
            ->latest()
            ->take(10)
            ->get()
            ->map(function ($log) {
                $userName = $log->user ? (trim($log->user->first_name . ' ' . $log->user->last_name)) : 'Unknown User';
                $roleName = $log->user && $log->user->roles->first() ? $log->user->roles->first()->name : 'customer';
                
                if ($roleName === 'consumer') {
                    $roleName = 'customer';
                }

                $description = '';
                if ($log->action === 'login') {
                    $description = "{$userName} ({$roleName}) has logged in";
                } elseif ($log->action === 'registration') {
                    $description = "{$userName} has registered as a new {$roleName}";
                } elseif ($log->action === 'failed_login') {
                    $description = "Failed login attempt for {$userName}";
                } elseif ($log->action === 'logout') {
                    $description = "{$userName} ({$roleName}) has logged out";
                } else {
                    $description = "{$userName} performed: " . str_replace('_', ' ', $log->action);
                }

                return [
                    'id' => $log->id,
                    'user_name' => $userName,
                    'role' => $roleName,
                    'action' => $log->action,
                    'description' => $description,
                    'created_at' => $log->created_at ? $log->created_at->toIso8601String() : null,
                ];
            })
            ->toArray();

        return $metrics;
    }
}
