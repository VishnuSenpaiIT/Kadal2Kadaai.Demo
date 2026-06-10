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
        $products = Product::with(['seller', 'category', 'tags', 'images'])
            ->latest()
            ->paginate($request->get('per_page', 20));

        return $this->success($products, 'Products retrieved successfully');
    }

    public function show(string $id)
    {
        $product = Product::with(['seller', 'category', 'tags', 'images'])->findOrFail($id);
        return $this->success($product, 'Product retrieved successfully');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'seller_id' => 'required|exists:users,id',
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:products,slug',
            'short_description' => 'nullable|string',
            'full_description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
            'weight_unit' => 'required|string',
            'minimum_order_quantity' => 'nullable|numeric|min:0',
            'maximum_order_quantity' => 'nullable|numeric|min:0',
            'available_quantity' => 'required|numeric|min:0',
            'stock_status' => 'required|string',
            'product_status' => 'required|string',
            'is_featured' => 'boolean',
            'is_popular' => 'boolean',
            'is_frozen_available' => 'boolean',
            'tags' => 'nullable|array',
            'tags.*' => 'string',
            'custom_options' => 'nullable|array',
        ]);

        $product = Product::create($validated);

        if ($request->has('tags')) {
            $tagIds = [];
            foreach ($request->input('tags') as $tagName) {
                $tag = \App\Models\Tag::firstOrCreate(
                    ['slug' => \Illuminate\Support\Str::slug($tagName)],
                    ['name' => $tagName]
                );
                $tagIds[] = $tag->id;
            }
            $product->tags()->sync($tagIds);
        }

        $product->load(['seller', 'category', 'tags', 'images']);

        return $this->success($product, 'Product created successfully', 201);
    }

    public function update(Request $request, string $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'seller_id' => 'sometimes|exists:users,id',
            'category_id' => 'sometimes|exists:categories,id',
            'name' => 'sometimes|string|max:255',
            'slug' => 'sometimes|string|max:255|unique:products,slug,' . $product->id,
            'short_description' => 'nullable|string',
            'full_description' => 'nullable|string',
            'price' => 'sometimes|numeric|min:0',
            'sale_price' => 'nullable|numeric|min:0',
            'weight_unit' => 'sometimes|string',
            'minimum_order_quantity' => 'nullable|numeric|min:0',
            'maximum_order_quantity' => 'nullable|numeric|min:0',
            'available_quantity' => 'sometimes|numeric|min:0',
            'stock_status' => 'sometimes|string',
            'product_status' => 'sometimes|string',
            'is_featured' => 'boolean',
            'is_popular' => 'boolean',
            'is_frozen_available' => 'boolean',
            'tags' => 'nullable|array',
            'tags.*' => 'string',
            'custom_options' => 'nullable|array',
        ]);

        $product->update($validated);

        if ($request->has('tags')) {
            $tagIds = [];
            foreach ($request->input('tags') as $tagName) {
                $tag = \App\Models\Tag::firstOrCreate(
                    ['slug' => \Illuminate\Support\Str::slug($tagName)],
                    ['name' => $tagName]
                );
                $tagIds[] = $tag->id;
            }
            $product->tags()->sync($tagIds);
        }

        $product->load(['seller', 'category', 'tags', 'images']);

        return $this->success($product, 'Product updated successfully');
    }

    public function destroy(string $id)
    {
        $product = Product::findOrFail($id);
        $product->delete(); // Soft delete

        return $this->success(null, 'Product deleted successfully');
    }

    public function updateStatus(Request $request, string $id)
    {
        $request->validate([
            'product_status' => 'sometimes|string',
            'is_featured' => 'sometimes|boolean',
            'is_popular' => 'sometimes|boolean',
        ]);

        $product = Product::findOrFail($id);
        $product->update($request->only(['product_status', 'is_featured', 'is_popular']));

        return $this->success($product, 'Product status updated successfully');
    }
}
