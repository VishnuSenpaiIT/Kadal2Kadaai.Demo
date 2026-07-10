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
            ->when($request->filled('search'), function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('slug', 'like', '%' . $request->search . '%');
            })
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
            'seller_id'              => 'required|exists:users,id',
            'category_id'            => 'required|exists:categories,id',
            'name'                   => 'required|string|max:255',
            'slug'                   => 'required|string|max:255|unique:products,slug',
            'short_description'      => 'nullable|string|max:500',
            'full_description'       => 'nullable|string',
            'price'                  => 'required|numeric|min:0',
            'sale_price'             => 'nullable|numeric|min:0',
            'discount_type'          => 'nullable|string|in:percentage,flat',
            'discount_value'         => 'nullable|numeric|min:0',
            'discount_start_date'    => 'nullable|date',
            'discount_end_date'      => 'nullable|date',
            'weight_unit'            => 'required|string',
            'minimum_order_quantity' => 'nullable|numeric|min:0',
            'maximum_order_quantity' => 'nullable|numeric|min:0',
            'available_quantity'     => 'required|numeric|min:0',
            'stock_status'           => 'required|string',
            'product_status'         => 'required|string',
            'is_featured'            => 'boolean',
            'is_popular'             => 'boolean',
            'is_top_selling'         => 'boolean',
            'is_todays_purchase'     => 'boolean',
            'variants'               => 'nullable|array',
            'variants.*.name'        => 'required|string|max:100',
            'variants.*.price_modifier' => 'nullable|numeric',
            'variants.*.shipping_modifier' => 'nullable|numeric',
            'variants.*.max_distance' => 'nullable|numeric',
            'tags'                   => 'nullable|array',
            'tags.*'                 => 'string',
            'image'                  => 'nullable|file|max:5120',
            'attributes'             => 'nullable|array',
            'origin_harbor_id'       => 'nullable|integer',
            'max_transit_hours'      => 'nullable|integer|min:0',
        ]);

        $product = Product::create(\Arr::except($validated, ['tags', 'image']));

        // Handle tags — create if not exist, then sync
        if ($request->has('tags') && !empty($validated['tags'])) {
            $tagIds = [];
            foreach ($validated['tags'] as $tagName) {
                $tag = \App\Models\Tag::firstOrCreate(
                    ['name' => $tagName],
                    ['slug' => \Illuminate\Support\Str::slug($tagName)]
                );
                $tagIds[] = $tag->id;
            }
            $product->tags()->sync($tagIds);
        }

        // Handle image upload
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('products', 'public');
            $product->images()->create([
                'image_url'  => '/storage/' . $path,
                'is_primary' => true,
            ]);
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
            'discount_type' => 'nullable|string|in:percentage,flat',
            'discount_value' => ['nullable', 'numeric', 'min:0', function ($attribute, $value, $fail) use ($request) {
                if ($request->input('discount_type') === 'percentage' && $value > 100) {
                    $fail('Percentage discount cannot exceed 100%.');
                }
            }],
            'discount_start_date' => 'nullable|date',
            'discount_end_date' => 'nullable|date',
            'weight_unit' => 'sometimes|string',
            'minimum_order_quantity' => 'nullable|numeric|min:0',
            'maximum_order_quantity' => 'nullable|numeric|min:0',
            'available_quantity' => 'sometimes|numeric|min:0',
            'stock_status' => 'sometimes|string',
            'product_status' => 'sometimes|string',
            'is_featured' => 'boolean',
            'is_popular' => 'boolean',
            'is_top_selling' => 'boolean',
            'is_todays_purchase' => 'boolean',
            'variants' => 'nullable|array',
            'variants.*.name' => 'required|string|max:100',
            'variants.*.price_modifier' => 'nullable|numeric',
            'variants.*.shipping_modifier' => 'nullable|numeric',
            'variants.*.max_distance' => 'nullable|numeric',
            'tags' => 'nullable|array',
            'tags.*' => 'string',
            'attributes' => 'nullable|array',
            'origin_harbor_id' => 'nullable|integer',
            'max_transit_hours' => 'nullable|integer|min:0',
        ]);

        $product->update(\Arr::except($validated, ['tags']));

        if ($request->has('tags')) {
            $tagIds = [];
            foreach ((array) $request->input('tags') as $tagName) {
                $tag = \App\Models\Tag::firstOrCreate(
                    ['name' => $tagName],
                    ['slug' => \Illuminate\Support\Str::slug($tagName)]
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
            'is_top_selling' => 'sometimes|boolean',
            'is_todays_purchase' => 'sometimes|boolean',
        ]);

        $product = Product::findOrFail($id);
        $product->update($request->only(['product_status', 'is_featured', 'is_popular', 'is_top_selling', 'is_todays_purchase']));

        return $this->success($product, 'Product status updated successfully');
    }
}
