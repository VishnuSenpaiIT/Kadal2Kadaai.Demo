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
    public function getDashboardMetrics(): array
    {
        return Cache::remember('admin.analytics.dashboard', 300, function () {
            $now = Carbon::now();

            $totalRevenue = Order::where('status', 'delivered')->sum('total_amount');
            $todayRevenue = Order::where('status', 'delivered')->whereDate('created_at', $now->toDateString())->sum('total_amount');
            $weeklyRevenue = Order::where('status', 'delivered')->whereBetween('created_at', [$now->copy()->startOfWeek(), $now->copy()->endOfWeek()])->sum('total_amount');
            $monthlyRevenue = Order::where('status', 'delivered')->whereBetween('created_at', [$now->copy()->startOfMonth(), $now->copy()->endOfMonth()])->sum('total_amount');

            $ordersToday = Order::whereDate('created_at', $now->toDateString())->count();
            $ordersThisWeek = Order::whereBetween('created_at', [$now->copy()->startOfWeek(), $now->copy()->endOfWeek()])->count();
            $ordersThisMonth = Order::whereBetween('created_at', [$now->copy()->startOfMonth(), $now->copy()->endOfMonth()])->count();

            $totalConsumers = User::role('consumer')->count();
            $totalSellers = User::role('seller')->count();

            $activeProducts = Product::where('product_status', 'PUBLISHED')->count();
            $lowStockProducts = Product::where('available_quantity', '<=', 5)->count();

            $topCategories = Category::withCount('products')->orderBy('products_count', 'desc')->take(5)->get();
            $topSellers = User::role('seller')->withCount('sellerOrders')->orderBy('seller_orders_count', 'desc')->take(5)->get();
            $topProducts = Product::orderBy('view_count', 'desc')->take(5)->get();

            return [
                'revenue' => [
                    'total' => $totalRevenue,
                    'today' => $todayRevenue,
                    'weekly' => $weeklyRevenue,
                    'monthly' => $monthlyRevenue,
                ],
                'orders' => [
                    'today' => $ordersToday,
                    'weekly' => $ordersThisWeek,
                    'monthly' => $ordersThisMonth,
                ],
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
                ]
            ];
        });
    }
}
