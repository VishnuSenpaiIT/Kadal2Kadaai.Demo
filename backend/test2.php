<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Product;
use App\Services\Seller\InventoryManagerService;
use App\Models\InventoryTransaction;

$product = Product::first();
if (!$product) {
    echo "No product found.\n";
    exit;
}

echo "Found product: " . $product->id . "\n";
$manager = app(InventoryManagerService::class);

try {
    $manager->addStock($product, 5, 'Test addition');
    echo "Stock added successfully.\n";
    
    $tx = InventoryTransaction::latest()->first();
    echo "Transaction recorded: " . json_encode($tx) . "\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString() . "\n";
}
