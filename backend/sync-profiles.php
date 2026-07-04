<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$profiles = App\Models\ConsumerProfile::all();
foreach ($profiles as $profile) {
    $orders = App\Models\Order::where('consumer_id', $profile->user_id)->get();
    $profile->lifetime_orders = $orders->count();
    $profile->lifetime_spending = $orders->sum('total');
    $profile->loyalty_points = floor($orders->sum('total') / 100);
    $profile->save();
    echo "Updated profile for user: " . $profile->user_id . "\n";
}
echo "Done.\n";
