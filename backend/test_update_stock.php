<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Product;
use App\Services\Seller\ProductService;

// Find a seller
$seller = User::whereHas('roles', fn($q) => $q->where('name', 'seller'))->first();
if (!$seller) {
    echo "No seller found.\n";
    exit;
}

$product = Product::where('seller_id', $seller->id)->first();
if (!$product) {
    echo "No product found for seller.\n";
    exit;
}

echo "Updating product: " . $product->id . "\n";
echo "Old quantity: " . $product->available_quantity . "\n";

$productService = app(ProductService::class);

try {
    $updatedProduct = $productService->updateProduct($seller, $product->id, [
        'available_quantity' => $product->available_quantity + 5
    ]);
    echo "New quantity: " . $updatedProduct->available_quantity . "\n";
    echo "Success!\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString() . "\n";
}
