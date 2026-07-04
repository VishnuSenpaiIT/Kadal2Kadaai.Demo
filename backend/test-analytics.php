<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$service = app(App\Services\Analytics\AdminAnalyticsService::class);
$metrics = $service->getDashboardMetrics();
echo json_encode(['today_orders_added' => $metrics['today']['orders_added'], 'selected_orders_added' => $metrics['selected']['orders_added']], JSON_PRETTY_PRINT);
