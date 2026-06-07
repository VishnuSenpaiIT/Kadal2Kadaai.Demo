<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $products = Product::with(['seller', 'category'])
            ->latest()
            ->paginate($request->get('per_page', 20));

        return $this->success($products, 'Products retrieved successfully');
    }

    public function updateStatus(Request $request, string $id)
    {
        $request->validate([
            'product_status' => 'sometimes|string',
            'is_featured' => 'sometimes|boolean',
        ]);

        $product = Product::findOrFail($id);
        $product->update($request->only(['product_status', 'is_featured']));

        return $this->success($product, 'Product status updated successfully');
    }
}
