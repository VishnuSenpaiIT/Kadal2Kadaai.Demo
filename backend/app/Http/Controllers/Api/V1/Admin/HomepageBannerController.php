<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\HomepageBanner;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class HomepageBannerController extends Controller
{
    use ApiResponse;

    // Public method to retrieve active banners
    public function publicIndex()
    {
        $banners = HomepageBanner::with('product')
            ->where('is_active', true)
            ->orderBy('order_index', 'asc')
            ->get();

        return $this->success($banners, 'Active banners retrieved successfully');
    }

    // Admin method to list all banners
    public function index()
    {
        $banners = HomepageBanner::with('product')
            ->orderBy('order_index', 'asc')
            ->get();

        return $this->success($banners, 'All banners retrieved successfully');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'link_url' => 'nullable|string|max:255',
            'product_id' => 'nullable|exists:products,id',
            'is_active' => 'boolean',
            'order_index' => 'integer',
            'image' => 'required|image|max:5120', // Max 5MB
        ]);

        $bannerData = \Arr::except($validated, ['image']);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('banners', 'public');
            $bannerData['image_url'] = '/storage/' . $path;
        }

        $banner = HomepageBanner::create($bannerData);
        $banner->load('product');

        return $this->success($banner, 'Banner created successfully', 201);
    }

    public function update(Request $request, string $id)
    {
        $banner = HomepageBanner::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'subtitle' => 'nullable|string|max:255',
            'link_url' => 'nullable|string|max:255',
            'product_id' => 'nullable|exists:products,id',
            'is_active' => 'boolean',
            'order_index' => 'integer',
            'image' => 'nullable|image|max:5120',
        ]);

        $bannerData = \Arr::except($validated, ['image']);

        if ($request->hasFile('image')) {
            // Delete old image if it exists
            if ($banner->image_url) {
                $oldPath = str_replace('/storage/', '', $banner->image_url);
                Storage::disk('public')->delete($oldPath);
            }

            $path = $request->file('image')->store('banners', 'public');
            $bannerData['image_url'] = '/storage/' . $path;
        }

        $banner->update($bannerData);
        $banner->load('product');

        return $this->success($banner, 'Banner updated successfully');
    }

    public function destroy(string $id)
    {
        $banner = HomepageBanner::findOrFail($id);

        // Delete associated image file
        if ($banner->image_url) {
            $oldPath = str_replace('/storage/', '', $banner->image_url);
            Storage::disk('public')->delete($oldPath);
        }

        $banner->delete();

        return $this->success(null, 'Banner deleted successfully');
    }
}
