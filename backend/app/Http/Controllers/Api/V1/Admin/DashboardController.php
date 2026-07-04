<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\Analytics\AdminAnalyticsService;

class DashboardController extends Controller
{
    protected AdminAnalyticsService $analyticsService;

    public function __construct(AdminAnalyticsService $analyticsService)
    {
        $this->analyticsService = $analyticsService;
    }

    public function index(Request $request)
    {
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');

        $metrics = $this->analyticsService->getDashboardMetrics($startDate, $endDate);

        return response()->json([
            'success' => true,
            'message' => 'Admin dashboard metrics retrieved',
            'data'    => $metrics,
        ]);
    }
}
